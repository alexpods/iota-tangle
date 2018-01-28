import { tritsToTrytes, trit } from "iota-ternary"
import { Transaction } from "./transaction"
import { Bundle } from "./bundle"

export enum ValidationErrorType {
  INVALID_TIMESTAMP,
  INVALID_VALUE,
  INVALID_WEIGHT_MAGNITUDE,
  INVALID_ADDRESS,

  INVALID_BUNDLE_TRANSACTION_INDEX,
  INVALID_BUNDLE_TRANSACTION_VALUE,
  INVALID_BUNDLE_TRANSACTION_ADDRESS,
  INVALID_BUNDLE_TRANSACTION_BUNDLE_HASH,
  INVALID_BUNDLE_TRANSACTION_SIGNATURE,
  INVALID_BUNDLE_VALUE,
  INVALID_BUNDLE_HASH,
}

export interface ValidationError {
  type: ValidationErrorType
  data?: any
}

const MIN_TIMESTAMP = 1508760000

const normalizeBundle = require("iota.lib.js/lib/crypto/bundle/bundle").prototype.normalizedBundle
const digest = require("iota.lib.js/lib/crypto/signing/signing").digest
const Kerl = require("iota.lib.js/lib/crypto/kerl/kerl")

export class Validator {

  private _minWeightMagnitude: number

  constructor(params: {
    minWeightMagnitude: number
  }) {
    this._minWeightMagnitude = Number(params.minWeightMagnitude)
  }

  async validateTransaction(transaction: Transaction): Promise<ValidationError|null> {
    if (transaction.timestamp < MIN_TIMESTAMP) {
      return { type: ValidationErrorType.INVALID_TIMESTAMP }
    }

    if (transaction.value < -Transaction.SUPPLY || transaction.value > Transaction.SUPPLY) {
      return { type: ValidationErrorType.INVALID_VALUE }
    }

    if (transaction.weightMagnitude < this._minWeightMagnitude) {
      return { type: ValidationErrorType.INVALID_WEIGHT_MAGNITUDE }
    }

    const addressTrits = transaction.trits("address")

    if (transaction.value !== 0 && addressTrits[addressTrits.length - 1] === 0) {
      return { type: ValidationErrorType.INVALID_ADDRESS }
    }

    return null
  }

  async validateBundle(bundle: Bundle): Promise<ValidationError|null> {
    const transactions: Transaction[] = bundle.transactions
    const lastIndex = transactions.length - 1

    const bundleHash = transactions[0].bundle

    let bundleValue = 0

    for (let i = 0; i <= lastIndex; i++) {
      const transaction = transactions[i]

      if (transaction.currentIndex !== i || transaction.lastIndex !== lastIndex) {
        return { type: ValidationErrorType.INVALID_BUNDLE_TRANSACTION_INDEX, data: { transaction } }
      }

      bundleValue += transaction.value

      if (bundleValue < -Transaction.SUPPLY || bundleValue > Transaction.SUPPLY) {
        return { type: ValidationErrorType.INVALID_BUNDLE_TRANSACTION_VALUE, data: { transaction } }
      }

      if (transaction.value && transaction.trits("address")[Transaction.ADDRESS_SIZE - 1] !== 0) {
        return { type: ValidationErrorType.INVALID_BUNDLE_TRANSACTION_ADDRESS, data: { transaction } }
      }

      if (bundleHash !== transaction.bundle) {
        return { type: ValidationErrorType.INVALID_BUNDLE_TRANSACTION_BUNDLE_HASH, data: { transaction } }
      }
    }


    if (bundleValue !== 0) {
      return { type: ValidationErrorType.INVALID_BUNDLE_VALUE }
    }

    const bundleHashTrits = bundle.calculateHash()

    if (bundleHash !== tritsToTrytes(bundleHashTrits)) {
      return { type: ValidationErrorType.INVALID_BUNDLE_HASH }
    }

    const normalizedBundle = normalizeBundle(bundleHash)

    // TODO: Optimize this loop
    for (let i = 0; i <= lastIndex; ++i) {
      let transaction = transactions[i]

      if (transaction.value < 0) {
        const addressTrits = new Array<trit>(Transaction.ADDRESS_SIZE)
        const address = transaction.address
        const kerl = new Kerl()

        kerl.initialize()

        let offset = 0

        do {
          const digestTrits = digest(normalizedBundle.slice(offset*27, (offset + 1)*27), transaction.trits("message"))

          kerl.absorb(digestTrits, 0, 243)

          transaction = transactions[i + ++offset]
        } while (transaction && transaction.value === 0 && transaction.address === address)

        kerl.squeeze(addressTrits, 0, Transaction.ADDRESS_SIZE)

        if (address !== tritsToTrytes(addressTrits)) {
          return { type: ValidationErrorType.INVALID_BUNDLE_TRANSACTION_SIGNATURE }
        }

        i += offset - 1
      }
    }

    return null
  }
}
