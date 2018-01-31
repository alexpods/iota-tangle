import { tritsToTrytes, trit } from "iota-ternary"
import { Transaction } from "./transaction"
import { Bundle } from "./bundle"

const normalizeBundle = require("iota.lib.js/lib/crypto/bundle/bundle").prototype.normalizedBundle
const digest = require("iota.lib.js/lib/crypto/signing/signing").digest
const Kerl = require("iota.lib.js/lib/crypto/kerl/kerl")

export enum TransactionValidationResult {
  VALID = 0,
  INVALID_TIMESTAMP,
  INVALID_VALUE,
  INVALID_WEIGHT_MAGNITUDE,
  INVALID_ADDRESS
}

export enum BundleValidationResult {
  VALID = 0,
  INVALID_TRANSACTION_INDEX,
  INVALID_TRANSACTION_VALUE,
  INVALID_TRANSACTION_ADDRESS,
  INVALID_TRANSACTION_BUNDLE_HASH,
  INVALID_TRANSACTION_SIGNATURE,
  INVALID_VALUE,
  INVALID_HASH,
}

export class Validator {
  private _minWeightMagnitude: number

  constructor(params: {
    minWeightMagnitude: number
  }) {
    this._minWeightMagnitude = Number(params.minWeightMagnitude)
  }

  async validateTransaction(transaction: Transaction): Promise<TransactionValidationResult> {
    if (transaction.timestamp < 1508760000) {
      return TransactionValidationResult.INVALID_TIMESTAMP
    }

    if (transaction.value < -Transaction.SUPPLY || transaction.value > Transaction.SUPPLY) {
      return TransactionValidationResult.INVALID_VALUE
    }

    if (transaction.weightMagnitude < this._minWeightMagnitude) {
      return TransactionValidationResult.INVALID_WEIGHT_MAGNITUDE
    }

    const addressTrits = transaction.trits("address")

    if (transaction.value !== 0 && addressTrits[addressTrits.length - 1] === 0) {
      return TransactionValidationResult.INVALID_ADDRESS
    }

    return TransactionValidationResult.VALID
  }

  async validateBundle(bundle: Bundle): Promise<BundleValidationResult|null> {
    const transactions: Transaction[] = bundle.transactions
    const lastIndex = transactions.length - 1

    const bundleHash = transactions[0].bundle

    let bundleValue = 0

    for (let i = 0; i <= lastIndex; i++) {
      const transaction = transactions[i]

      if (transaction.currentIndex !== i || transaction.lastIndex !== lastIndex) {
        return BundleValidationResult.INVALID_TRANSACTION_INDEX
      }

      bundleValue += transaction.value

      if (bundleValue < -Transaction.SUPPLY || bundleValue > Transaction.SUPPLY) {
        return BundleValidationResult.INVALID_TRANSACTION_VALUE
      }

      if (transaction.value && transaction.trits("address")[Transaction.ADDRESS_SIZE - 1] !== 0) {
        return BundleValidationResult.INVALID_TRANSACTION_ADDRESS
      }

      if (bundleHash !== transaction.bundle) {
        return BundleValidationResult.INVALID_TRANSACTION_BUNDLE_HASH
      }
    }


    if (bundleValue !== 0) {
      return BundleValidationResult.INVALID_VALUE
    }

    const bundleHashTrits = bundle.calculateHash()

    if (bundleHash !== tritsToTrytes(bundleHashTrits)) {
      return BundleValidationResult.INVALID_HASH
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
          return BundleValidationResult.INVALID_TRANSACTION_SIGNATURE
        }

        i += offset - 1
      }
    }

    return BundleValidationResult.VALID
  }
}
