import { expect } from 'chai'

import { Serializer } from '../src/serializer'
import { Factory } from '../src/factory'
import { Transaction } from '../src/transaction'

describe('Factory', () => {
  let serializer: Serializer
  let factory: Factory

  beforeEach(() => {
    serializer = new Serializer()
    factory = new Factory({ serializer })
  })

  describe('::createFromBytes(buffer)', () => {
    let transactionBytes: Buffer

    beforeEach(() => {
      transactionBytes = Buffer.alloc(Transaction.BYTES_SIZE)
    })

    it('should create a transaction object', () => {
      const transaction = factory.createTransactionFromBytes(transactionBytes)

      expect(transaction).to.be.an.instanceOf(Transaction)
      expect(transaction.bytes.equals(transactionBytes)).to.be.true
    })

    it('should throw an error if bytes size is too low or too big', () => {
      expect(() => {
        factory.createTransactionFromBytes(transactionBytes.slice(0, Transaction.BYTES_SIZE - 10))
      }).to.throw()

      expect(() => {
        factory.createTransactionFromBytes(Buffer.concat([transactionBytes, new Buffer('12341234', 'utf8')]))
      }).to.throw()
    })
  })
})
