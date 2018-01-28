import { Transaction } from "./transaction"
import { Bundle } from "./bundle"

export interface Storage {
  getBundle(bundleHash: string): Promise<Bundle>
  getTransaction(transactionHash: string): Promise<Transaction>
  appendTransaction(transaction: Transaction): Promise<boolean>
  updateTransaction(transaction: Transaction): Promise<boolean>
}
