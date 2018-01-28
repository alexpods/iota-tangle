import { expect } from "chai"

import { Transaction } from "../src/transaction"
import { Bundle } from "../src/bundle"
import { BUNDLE_TRANSACTIONS } from "./utils"

describe("Bundle", () => {

  describe("::createFromTransactions(transactions)", () => {
    let transactions: Transaction[]

    beforeEach(() => {
      transactions = Object.keys(BUNDLE_TRANSACTIONS).map((transactionHash: string) => {
        return Transaction.createFromData(BUNDLE_TRANSACTIONS[transactionHash])
      })
    })

    it("should create a bundle from the specified transactiosn", () => {
      const bundle = Bundle.createFromTransactions(transactions)

      expect(bundle).to.be.an.instanceOf(Bundle)
      expect(bundle.transactions).to.deep.equal(transactions)
    })
  })
})

