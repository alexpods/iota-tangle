import { expect, use }from 'chai'

use(require('chai-as-promised'))

import { Transaction, TransactionData } from "../src/transaction"
import { Bundle } from "../src/bundle"
import { Validator, TransactionValidationResult, BundleValidationResult } from '../src/validator'

import { generateTransactionData, generateTrits, BUNDLE_TRANSACTIONS } from "./utils"

describe("Validator", () => {
  let validator: Validator

  beforeEach(() => {
    validator = new Validator({ minWeightMagnitude: 0 })
  })

  describe("validateTransaction(transaction)", () => {
    let data: TransactionData

    beforeEach(() => {
      data = generateTransactionData({
        timestamp: Date.now(),
        address: "PGG9IRWGRHFQLFIUGLVXDQSZMWKHQOGNICEGYSMXJA9BPOLMGLWFGVNWQIDEWLVBCWKYHMTZSOMRO9YMK",
      })
    })

    it("should return 0 if the transaction is valid", async () => {
      const transaction = Transaction.createFromData(data)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.equal(0)
      expect(error).to.equal(TransactionValidationResult.VALID)
    })

    it("should return INVALID_TIMESTAMP error " +
       "if the transaction timestamp is less than 1508760000", async () => {
      data.timestamp = 1508760000 - 1
      const transaction = Transaction.createFromData(data)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.equal(TransactionValidationResult.INVALID_TIMESTAMP)
    })

    it("should return INVALID_WEIGHT_MAGNITUDE error " +
       "if the transaction weight magnitude is smaller than necessary", async () => {

      const validator = new Validator({ minWeightMagnitude: 13 })
      const transaction = Transaction.createFromData(data)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.equal(TransactionValidationResult.INVALID_WEIGHT_MAGNITUDE)
    })

    it("should return INVALID_ADDRESS error " +
       "if the transaction value is non-zero and address is ending with 0 trit", async () => {
      data.address = data.address.slice(0, -1) + "9"
      data.value   = 112341234

      const transaction = Transaction.createFromData(data)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.equal(TransactionValidationResult.INVALID_ADDRESS)
    })

    it("should return INVALID_VALUE error " +
       "if the transaction value is not zero and address is ending with 0 trit", async () => {
      let transaction = Transaction.createFromData(data)
      let trits = transaction.trits()

      trits[Transaction.VALUE_OFFSET + Transaction.VALUE_USABLE_SIZE + 1] = 1

      transaction = Transaction.createFromTrits(trits)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.equal(TransactionValidationResult.INVALID_VALUE)
    })
  })

  describe("validateBundle(bundle)", () => {
    let transactions: Transaction[]
    let bundle: Bundle

    beforeEach(() => {
      transactions = Object.keys(BUNDLE_TRANSACTIONS).map((transactionHash: string) => {
        return Transaction.createFromData(BUNDLE_TRANSACTIONS[transactionHash])
      })

      bundle = Bundle.createFromTransactions(transactions)
    })

    it("should return null if the bundle is valid", async () => {
      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(0)
      expect(error).to.equal(BundleValidationResult.VALID)
    })

    it("should return INVALID_BUNDLE_TRANSACTION_INDEX error " +
       "if some of the transactions in the bundle have incorrect index", async () => {

      transactions[2]['_currentIndex'] = 1

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.INVALID_TRANSACTION_INDEX)
    })

    it("should return INVALID_BUNDLE_TRANSACTION_VALUE error " +
       "if some of the transaction has value greater or smallert " +
       "than the maximum supply", async () => {

      transactions[0]['_value'] = +Transaction.SUPPLY + 10
      transactions[1]['_value'] = -Transaction.SUPPLY - 10

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.INVALID_TRANSACTION_VALUE)
    })

    it("should return INVALID_BUNDLE_TRANSACTION_ADDRESS error " +
       "if some of the non-zero value transactions has address that ends with non-zero trit", async () => {

      const trits = transactions[1].trits()

      trits[Transaction.ADDRESS_OFFSET + Transaction.ADDRESS_SIZE - 1] = 1

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.INVALID_TRANSACTION_ADDRESS )
    })

    it("should not return INVALID_BUNDLE_TRANSACTION_ADDRESS error " +
       "if some of the zero-value transactions has address that ends with non-zero trit", async () => {

      const trits = transactions[2].trits()

      trits[Transaction.ADDRESS_OFFSET + Transaction.ADDRESS_SIZE - 1] = 1

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.VALID)
    })

    it("should return INVALID_BUNDLE_TRANSACTION_BUNDLE_HASH error " +
       "if some the transactions has incorrect bundle hash", async () => {

      transactions[1]["_bundle"] = transactions[1]["_bundle"].slice(0, 80) + "A"

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.INVALID_TRANSACTION_BUNDLE_HASH )
    })

    it("should return INVALID_BUNDLE_VALUE error if the total value of the bundle is non-zero", async () => {

      transactions[1]["_value"] = -10

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.INVALID_VALUE)
    })

    it("should return INVALID_BUNDLE_HASH error if transactions have incorrect bundle hash", async () => {
      const trits = transactions[2].trits()

      trits.splice(Transaction.OBSOLETE_TAG_OFFSET, 5, 0, 0, 0, 0, 0)

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.INVALID_HASH)
    })

    it("should return INVALID_BUNDLE_TRANSACTION_SIGNATURE error " +
       "if some of the input transaction has incorrect signature", async () => {

      const trits = transactions[2].trits()

      trits.splice(Transaction.MESSAGE_OFFSET, 5, 0, 0, 0, 0, 0)

      const error = await validator.validateBundle(bundle)

      expect(error).to.equal(BundleValidationResult.INVALID_TRANSACTION_SIGNATURE)
    })
  })
})

