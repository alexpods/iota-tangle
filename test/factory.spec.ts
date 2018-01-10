import { expect } from 'chai'

import { Serializer } from '../src/serializer'
import { Factory } from '../src/factory'
import { Transaction } from '../src/transaction'
import { Hash } from '../src/hash'

describe('Factory', () => {
  let serializer: Serializer
  let factory: Factory

  beforeEach(() => {
    serializer = new Serializer()
    factory = new Factory({ serializer })
  })

  describe('createTransactionFromBytes(bytes)', () => {
    let transactionBytes: Buffer

    beforeEach(() => {
      transactionBytes = Buffer.alloc(Transaction.BYTES_SIZE)
    })

    it('should create a transaction object', () => {
      const transaction = factory.createTransactionFromBytes(transactionBytes)

      expect(transaction).to.be.an.instanceOf(Transaction)
      expect(transaction.bytes).to.be.equal(transactionBytes)
    })

    it('should throw an error if bytes size is too small or too big', () => {
      expect(() => {
        factory.createTransactionFromBytes(transactionBytes.slice(0, Transaction.BYTES_SIZE - 10))
      }).to.throw()

      expect(() => {
        factory.createTransactionFromBytes(Buffer.concat([transactionBytes, new Buffer('12341234', 'utf8')]))
      }).to.throw()
    })
  })

  describe('createHashFromBytes(bytes)', () => {
    let hashBytes: Buffer

    beforeEach(() => {
      hashBytes = Buffer.alloc(49)
    })

    it('should create a hash object', () => {
      const hash = factory.createHashFromBytes(hashBytes)

      expect(hash).to.be.an.instanceOf(Hash)
      expect(hash.bytes).to.be.equal(hashBytes)
    })

    it('should throw and error if bytes size is too big', () => {
      expect(() => {
        factory.createHashFromBytes(Buffer.concat([hashBytes, new Buffer('12341234', 'utf8')]))
      }).to.throw()
    })

    it(`should not throw an error if bytes size is smaller then ${Hash.BYTES_SIZE}`, () => {
      expect(() => {
        factory.createHashFromBytes(hashBytes.slice(0, Hash.BYTES_SIZE - 10))
      }).to.not.throw()
    })
  })

})
