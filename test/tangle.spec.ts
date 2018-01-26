import { expect, use } from "chai"
import { spy } from "sinon"

use(require("sinon-chai"))
use(require("chai-as-promised"))

import { Tangle } from "../src/tangle"
import { Storage } from "../src/storage"
import { Transaction, TransactionData } from "../src/transaction"

import { generateTransactionData } from "./utils"

describe("Tangle", () => {
  let data: TransactionData
  let storage: Storage
  let tangle: Tangle
  let transaction: Transaction

  beforeEach(() => {
    storage = {
      appendTransaction: spy(async () => true),
      updateTransaction: spy(async () => false),
      getTransaction:    spy(async () => transaction),
    }

    data = generateTransactionData()
    tangle = new Tangle({ storage })
    transaction = Transaction.createFromData(data)
  })

  describe("getTransaction(transactionHash)", () => {
    it("should delegate fetching to the storage", async () => {
      expect(storage.getTransaction).to.not.have.been.called
      await expect(tangle.getTransaction(transaction.hash())).to.eventually.equals(transaction)
      expect(storage.getTransaction).to.have.been.calledWith(transaction.hash())
    })
  })

  describe("appendTransaction(transaction)", () => {
    it("should delegate appending to the storage", async () => {
      expect(storage.appendTransaction).to.not.have.been.called
      await expect(tangle.appendTransaction(transaction)).to.eventually.equals(true)
      expect(storage.appendTransaction).to.have.been.calledWith(transaction)
    })
  })

  describe("updateTransaction(transaction)", () => {
    it("should delegate updating to the storage", async () => {
      expect(storage.updateTransaction).to.not.have.been.called
      await expect(tangle.updateTransaction(transaction)).to.eventually.equals(false)
      expect(storage.updateTransaction).to.have.been.calledWith(transaction)
    })
  })
})
