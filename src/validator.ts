import { Transaction } from './transaction'

export enum ValidationErrorType {
  INVALID_TIMESTAMP,
  INVALID_VALUE,
  INVALID_WEIGHT_MAGNITUDE,
  INVALID_ADDRESS,
}

export interface ValidationError {
  type: ValidationErrorType
  data?: any
}

const MIN_TIMESTAMP = 1508760000

export class Validator {

  private _minWeightMagnitude: number

  constructor(params: {
    minWeightMagnitude: number
  }) {
    this._minWeightMagnitude = Number(params.minWeightMagnitude)
  }

  async validateTransaction(transaction: Transaction): Promise<ValidationError|null> {
    if (transaction.timestamp < MIN_TIMESTAMP) {
      return { type: ValidationErrorType.INVALID_TIMESTAMP }
    }

    if (transaction.value < 0 || transaction.value > Transaction.SUPPLY) {
      return { type: ValidationErrorType.INVALID_VALUE }
    }

    if (transaction.weightMagnitude < this._minWeightMagnitude) {
      return { type: ValidationErrorType.INVALID_WEIGHT_MAGNITUDE }
    }

    const addressTrits = transaction.trits("address")

    if (transaction.value !== 0 && addressTrits[addressTrits.length - 1] === 0) {
      return { type: ValidationErrorType.INVALID_ADDRESS }
    }

    return null
  }
}
