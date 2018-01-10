import { expect } from 'chai'
import { Serializer } from '../src/serializer'
import { Factory } from '../src/factory'
import { Transaction } from '../src/transaction'

describe('Serializer', () => {
  let serializer: Serializer
  let factory: Factory
  let transaction: Transaction

  beforeEach(() => {
    serializer  = new Serializer()
    factory = new Factory({ serializer })
  })

  describe('serializeTransaction(transaction)', () => {

    it('should work', () => {
      expect(true).to.be.true
    })
  })
})
