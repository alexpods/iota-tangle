import { Storage } from "./storage"
import { Transaction } from "./transaction"
import { Bundle } from "./bundle"

export class Tangle {
  private _storage: Storage

  constructor(params: {
    storage: Storage
  }) {
    this._storage = params.storage
  }

  async getBundle(bundleHash: string): Promise<Bundle|null> {
    return this._storage.getBundle(bundleHash)
  }

  async getTransaction(transactionHash: string): Promise<Transaction|null> {
    return this._storage.getTransaction(transactionHash)
  }

  async appendTransaction(transaction: Transaction): Promise<boolean> {
    return this._storage.appendTransaction(transaction)
  }

  async updateTransaction(transaction: Transaction): Promise<boolean> {
    return this._storage.updateTransaction(transaction)
  }
}