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

  get hash() {
    return this._transactions[0].hash
  }

  get size(): number {
    return this._transactions.length
  }

  get trunk(): string|null {
    return this._transactions[this._transactions.length - 1].trunk
  }

  get branch(): string|null {
    return this._transactions[this._transactions.length - 1].branch
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
