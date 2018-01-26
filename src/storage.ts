import { Transaction } from "./transaction"

export interface Storage {
  getTransaction(transactionHash: string): Promise<Transaction>
  appendTransaction(transaction: Transaction): Promise<boolean>
  updateTransaction(transaction: Transaction): Promise<boolean>
}
