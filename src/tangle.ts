import { Storage } from "./storage"
import { Transaction } from "./transaction"
import { Bundle } from "./bundle"

export class Tangle {
  private _storage: Storage

  constructor(params: {
    storage: Storage,
  }) {
    this._storage = params.storage
  }

  async getBundle(bundleHash: string): Promise<Bundle|null> {
    return this._storage.getBundle(bundleHash)
  }

  async getTransaction(transactionHash: string): Promise<Transaction|null> {
    return this._storage.getTransaction(transactionHash)
  }

  async getApprovers(transactionHash: string): Promise<Transaction[]> {
    return this._storage.getApprovers(transactionHash)
  }

  async appendTransaction(transaction: Transaction): Promise<boolean> {
    return this._storage.appendTransaction(transaction)
  }

  async updateTransaction(transaction: Transaction): Promise<boolean> {
    return this._storage.updateTransaction(transaction)
  }


  async checkTransactionSolidity(transaction: Transaction): Promise<boolean> {
    if (this._storage.checkTransactionSolidity) {
      return this._storage.checkTransactionSolidity(transaction)
    }

    if (transaction.get("is_solid")) {
      return true
    }

    const storedTransaction = await this.getTransaction(transaction.hash)

    if (storedTransaction) {
      if (storedTransaction.get("is_solid")) {
        transaction.set("is_solid", true)
        return true
      } else {
        transaction.set("is_solid", false)
        return false
      }
    }

    return false
  }

  async updateTransactionSolidity(transaction: Transaction): Promise<string[]> {
    if (this._storage.updateTransactionSolidity) {
      return this._storage.updateTransactionSolidity(transaction)
    }

    const absendTransactions = new Array<string>()

    const processedTransactions: { [transactionHash: string]: true } = {}
    const solidTransactions:     { [transactionHash: string]: true } = {}

    const processingTransactions: Array<Transaction> = Array.of(transaction)


    function processChildTransaction(childTransaction: Transaction|null, childHash: string) {
      if (!childTransaction) {
        absendTransactions.push(childHash)
      } else {
        if (childTransaction.get("is_solid")) {
          solidTransactions[childHash] = true
        } else {
          processingTransactions.push(childTransaction)
        }
      }
    }

    let index = -1

    let trunkHash: string|null
    let branchHash: string|null

    let trunkPromise: Promise<void>
    let branchPromise: Promise<void>

    while (transaction = processingTransactions[++index]) {
      trunkHash  = transaction.trunk
      branchHash = transaction.branch

      if (trunkHash && !processedTransactions[trunkHash]) {
        trunkPromise = this.getTransaction(trunkHash).then((t) => processChildTransaction(t, trunkHash))
        processedTransactions[trunkHash] = true
      }

      if (branchHash && !processedTransactions[branchHash]) {
        branchPromise = this.getTransaction(branchHash).then((t) => processChildTransaction(t, branchHash))
        processedTransactions[branchHash] = true
      }

      await Promise.all([trunkPromise, branchPromise])
    }

    const updatePromises = []

    processingTransactions.sort((t1: Transaction, t2: Transaction) => {
      return (t1.hash === t2.trunk || t1.hash === t2.branch) ? +1 : -1
    })

    while (transaction = processingTransactions[--index]) {
      if (
        (!transaction.trunk || solidTransactions[transaction.trunk])
        &&
        (!transaction.branch || solidTransactions[transaction.branch])
      ) {
        solidTransactions[transaction.hash] = true
        transaction.set("is_solid", true)

        updatePromises.push(this.updateTransaction(transaction))
      }
    }

    await Promise.all(updatePromises)

    return absendTransactions
  }
}