import { expect, use }from 'chai'

use(require('chai-as-promised'))

import { Transaction, TransactionData } from "../src/transaction"
import { Validator, ValidationErrorType } from '../src/validator'

import { generateTransactionData, generateTrits } from "./utils"

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

    it("should return null if the transaction is valid", async () => {
      const transaction = Transaction.createFromData(data)

      await expect(validator.validateTransaction(transaction)).to.be.eventually.null
    })

    it("should return INVALID_TIMESTAMP error " +
       "if the transaction timestamp is less than 1508760000", async () => {
      data.timestamp = 1508760000 - 1
      const transaction = Transaction.createFromData(data)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.not.be.null
      expect(error.type).to.equal(ValidationErrorType.INVALID_TIMESTAMP)
    })

    it("should return INVALID_WEIGHT_MAGNITUDE error " +
       "if the transaction weight magnitude is smaller than necessary", async () => {

      const validator = new Validator({ minWeightMagnitude: 13 })
      const transaction = Transaction.createFromData(data)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.not.be.null
      expect(error.type).to.equal(ValidationErrorType.INVALID_WEIGHT_MAGNITUDE)
    })

    it("should return INVALID_ADDRESS error " +
       "if the transaction value is non-zero and address is ending with 0 trit", async () => {
      data.address = data.address.slice(0, -1) + "9"
      data.value   = 112341234

      const transaction = Transaction.createFromData(data)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.not.be.null
      expect(error.type).to.equal(ValidationErrorType.INVALID_ADDRESS)
    })

    it("should return INVALID_VALUE error " +
       "if the transaction value is not zero and address is ending with 0 trit", async () => {
      let transaction = Transaction.createFromData(data)
      let trits = transaction.trits()

      trits[Transaction.VALUE_OFFSET + Transaction.VALUE_USABLE_SIZE + 1] = 1

      transaction = Transaction.createFromTrits(trits)

      const error = await validator.validateTransaction(transaction)

      expect(error).to.not.be.null
      expect(error.type).to.equal(ValidationErrorType.INVALID_VALUE)
    })
  })

})
