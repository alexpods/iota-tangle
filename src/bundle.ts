import { trit } from "iota-ternary"
import { Transaction } from "./transaction"

const Kerl = require("iota.lib.js/lib/crypto/kerl/kerl")

export class Bundle {

  static createFromTransactions(transactions: Transaction[]): Bundle {
    const bundle = new Bundle()

    bundle._transactions = transactions

    return bundle
  }

  private _transactions: Transaction[]

  get transactions(): Transaction[] {
    return this._transactions
  }

  calculateHash(): trit[] {
    const hash = new Array<trit>(Transaction.BUNDLE_SIZE)
    const kerl = new Kerl()

    kerl.initialize()

    for (let transaction of this.transactions) {
      kerl.absorb(transaction.trits("essence"), 0, Transaction.ESSENCE_SIZE)
    }

    kerl.squeeze(hash, 0, Transaction.BUNDLE_SIZE)

    return hash
  }
}
