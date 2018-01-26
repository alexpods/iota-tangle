import { Storage } from "./storage"
import { Transaction } from "./transaction"

export class Tangle {
  private _storage: Storage

  constructor(params: {
    storage: Storage
  }) {
    this._storage = params.storage
  }

  async getTransaction(transactionHash: string): Promise<Transaction> {
    return this._storage.getTransaction(transactionHash)
  }

  async appendTransaction(transaction: Transaction): Promise<boolean> {
    return this._storage.appendTransaction(transaction)
  }

  async updateTransaction(transaction: Transaction): Promise<boolean> {
    return this._storage.updateTransaction(transaction)
  }
}