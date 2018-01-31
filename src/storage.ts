import { Transaction } from "./transaction"
import { Bundle } from "./bundle"

export interface Storage {
  getBundle(bundleHash: string): Promise<Bundle|null>
  getTransaction(transactionHash: string): Promise<Transaction|null>
  getApprovers(transactionHash: string): Promise<Transaction[]>
  appendTransaction(transaction: Transaction): Promise<boolean>
  updateTransaction(transaction: Transaction): Promise<boolean>
  checkTransactionSolidity?(transaction: Transaction): Promise<boolean>
  updateTransactionSolidity?(transaction: Transaction): Promise<string[]>
}
