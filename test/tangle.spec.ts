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
  let bundle: any

  beforeEach(() => {
    storage = {
      getBundle:         spy(async () => bundle),
      getTransaction:    spy(async () => transaction),
      getApprovers:      spy(async () => [transaction]),
      appendTransaction: spy(async () => true),
      updateTransaction: spy(async () => false),
    }

    data = generateTransactionData()
    tangle = new Tangle({ storage })
    transaction = Transaction.createFromData(data)
    bundle = {}
  })

  describe("getBundle(bundleHash)", () => {
    it("should delegate fetching to the storage", async () => {
      expect(storage.getBundle).to.not.have.been.called
      await expect(tangle.getBundle(transaction.bundle)).to.eventually.equals(bundle)
      expect(storage.getBundle).to.have.been.calledWith(transaction.bundle)
    })
  })

  describe("getTransaction(transactionHash)", () => {
    it("should delegate fetching to the storage", async () => {
      expect(storage.getTransaction).to.not.have.been.called
      await expect(tangle.getTransaction(transaction.hash)).to.eventually.equals(transaction)
      expect(storage.getTransaction).to.have.been.calledWith(transaction.hash)
    })
  })

  describe("getApprovers(transactionHash)", () => {
    it("should delegate fetching to the storage", async () => {
      expect(storage.getApprovers).to.not.have.been.called
      await expect(tangle.getApprovers(transaction.hash)).to.eventually.deep.equals([transaction])
      expect(storage.getApprovers).to.have.been.calledWith(transaction.hash)
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

  describe("checkTransactionSolidity(transaction)", () => {
    it("should delegate the task to the storage " +
      "if the storage has checkTransactionSolidity() method", async () => {

      storage.checkTransactionSolidity = spy(async () => true)

      const isSolid = await tangle.checkTransactionSolidity(transaction)

      expect(storage.checkTransactionSolidity).to.have.been.calledWith(transaction)
      expect(isSolid).to.deep.equals(true)
    })

    it("should return true if transaction's 'is_solid' attribute is 'true'", async () => {
      transaction.set("is_solid", true)
      await expect(tangle.checkTransactionSolidity(transaction)).to.eventually.equals(true)
    })

    it("should fetch a transaction from database " +
       "if 'is_solid' attribute is 'false' or doesn't exist", async () => {

      const storedTransaction = Transaction.createFromData(data, { "is_solid": true })
      storage.getTransaction = spy(async () => storedTransaction)

      expect(storage.getTransaction).to.not.have.been.called
      expect(transaction.get("is_solid")).to.be.undefined

      await expect(tangle.checkTransactionSolidity(transaction)).to.eventually.equals(true)

      expect(storage.getTransaction).to.have.been.calledWith(transaction.hash)
      expect(transaction.get("is_solid")).to.be.true
    })

    it("should update the 'is_solid' attribute of the transaction " +
       "if transaction exists in the storage", async () => {

      const storedTransaction = Transaction.createFromData(data, { "is_solid": false })
      storage.getTransaction = spy(async () => storedTransaction)

      expect(storage.getTransaction).to.not.have.been.called
      expect(transaction.get("is_solid")).to.be.undefined

      await expect(tangle.checkTransactionSolidity(transaction)).to.eventually.equals(false)

      expect(storage.getTransaction).to.have.been.calledWith(transaction.hash)
      expect(transaction.get("is_solid")).to.be.false
    })

    it("should not update the 'is_solid' attribute of the transaction " +
        "if the transaction doesn't exist in the storage", async () => {
      storage.getTransaction = spy(async () => null)

      expect(storage.getTransaction).to.not.have.been.called
      expect(transaction.get("is_solid")).to.be.undefined

      await expect(tangle.checkTransactionSolidity(transaction)).to.eventually.equals(false)

      expect(storage.getTransaction).to.have.been.calledWith(transaction.hash)
      expect(transaction.get("is_solid")).to.be.undefined
    })
  })

  describe("updateTransactionSolidity(transaction)", () => {
    let transactions: { [hash: string]: Transaction }

    // +--------------------+
    // |                    +
    // |          v-------+ C <------+
    // |          B <------+         |
    // v          |        |         D <-------+
    // A <--------+        +         |         |
    // ^ ^---------+       E <-------+         |
    // |           |       + ^------+          J
    // |           +  <----+        |          |
    // |           F  <----+        |          |
    // |                   |        G <--------+
    // |                   +        |
    // +------+ I <------+ H <------+


    beforeEach(() => {
      transactions = {
        A: Transaction.createFromData(Object.assign({}, data, {
          hash:   "A".repeat(81),
          trunk:  null,
          branch: null,
        })),
        B: Transaction.createFromData(Object.assign({}, data, {
          hash:   "B".repeat(81),
          trunk:  "A".repeat(81),
          branch: null,
        })),
        C: Transaction.createFromData(Object.assign({}, data, {
          hash:   "C".repeat(81),
          trunk:  "B".repeat(81),
          branch: "A".repeat(81),
        })),
        D: Transaction.createFromData(Object.assign({}, data, {
          hash:   "D".repeat(81),
          trunk:  "C".repeat(81),
          branch: "E".repeat(81),
        })),
        E: Transaction.createFromData(Object.assign({}, data, {
          hash:   "E".repeat(81),
          trunk:  "B".repeat(81),
          branch: "F".repeat(81),
        })),
        F: Transaction.createFromData(Object.assign({}, data, {
          hash:   "F".repeat(81),
          trunk:  "A".repeat(81),
          branch: null
        })),
        G: Transaction.createFromData(Object.assign({}, data, {
          hash:   "G".repeat(81),
          trunk:  "E".repeat(81),
          branch: "H".repeat(81),
        })),
        H: Transaction.createFromData(Object.assign({}, data, {
          hash:   "H".repeat(81),
          trunk:  "F".repeat(81),
          branch: "I".repeat(81),
        })),
        I: Transaction.createFromData(Object.assign({}, data, {
          hash:   "I".repeat(81),
          trunk:  "A".repeat(81),
          branch: null,
        })),
        J: Transaction.createFromData(Object.assign({}, data, {
          hash:   "J".repeat(81),
          trunk:  "D".repeat(81),
          branch: "G".repeat(81),
        }))
      }

      storage.getTransaction = spy(async (hash) => transactions[hash[0]] || null)
    })

    it("should delegate the task to the storage " +
       "if the storage has updateTransactionSolidity() method", async () => {

      storage.updateTransactionSolidity = spy(async () => [transactions.F])

      const absentTransactions = await tangle.updateTransactionSolidity(transactions.J)

      expect(storage.updateTransactionSolidity).to.have.been.calledWith(transactions.J)
      expect(absentTransactions).to.deep.equals([transactions.F])
    })

    it("should return an empty array if there is no absent transaction", async () => {
      const absentTransactions = await tangle.updateTransactionSolidity(transactions.J)

      expect(absentTransactions).to.be.empty
    })

    it("should return a list of empty transactions", async () => {
      const { B, F, I } = transactions

      delete transactions.B
      delete transactions.F
      delete transactions.I

      const absentTransactions = await tangle.updateTransactionSolidity(transactions.J)

      expect(absentTransactions.length).to.equal(3)
      expect(absentTransactions).to.contain(B.hash)
      expect(absentTransactions).to.contain(F.hash)
      expect(absentTransactions).to.contain(I.hash)
    })

    it("should set 'is_solid' attribute and call updateTransaction() method " +
       "for all found solid transactions", async () => {
      const { B } = transactions

      delete transactions.B

      for (let name in transactions) {
        expect(transactions[name].get("is_solid")).to.be.undefined
      }

      await tangle.updateTransactionSolidity(transactions.J)

      for (let name in transactions) {
        const transaction = transactions[name]

        if (["A", "I", "F", "H"].indexOf(name) !== -1) {
          expect(transaction.get("is_solid")).to.be.true
          expect(storage.updateTransaction).to.have.been.calledWith(transaction)
        } else {
          expect(transactions[name].get("is_solid")).to.be.undefined
          expect(storage.updateTransaction).to.not.have.been.calledWith(transaction)
        }
      }
    })


    it("should not process child transactions of the transaction " +
       "which has 'is_solid' = true", async () => {

      const { D, E } = transactions

      D.set("is_solid", true)
      E.set("is_solid", true)

      for (let name in transactions) {
        const transaction = transactions[name]

        if (["D", "E"].indexOf(name) !== -1) {
          expect(transaction.get("is_solid")).to.be.true
        } else {
          expect(transaction.get("is_solid")).to.be.undefined
        }

        expect(storage.updateTransaction).to.not.have.been.calledWith(transaction)
      }

      await tangle.updateTransactionSolidity(transactions.J)

      for (let name in transactions) {
        const transaction = transactions[name]

        if (["C", "B"].indexOf(name) !== -1) {
          expect(transaction.get("is_solid")).to.be.undefined
          expect(storage.updateTransaction).to.not.have.been.calledWith(transaction)
        } else if (["D", "E"].indexOf(name) !== -1) {
          expect(transaction.get("is_solid")).to.be.true
          expect(storage.updateTransaction).to.not.have.been.calledWith(transaction)
        } else {
          expect(transaction.get("is_solid")).to.be.true
          expect(storage.updateTransaction).to.have.been.calledWith(transaction)
        }
      }
    })
  })
})
