import { expect } from "chai"
import { trit, bytesToTrits, tritsToBytes, tritsToTrytes, trytesToTrits, numberToTrytes } from "iota-ternary"
import { Transaction, TransactionData } from "../src/transaction"
import {
  generateBytes,
  generateTrytes,
  generateTrits,
  generateTransactionData,
  calculateHash,
  BUNDLE_TRANSACTIONS
} from "./utils"

describe("Transaction", () => {

  describe("::createFromBytes(bytes)", () => {
    let bytes: Buffer

    beforeEach(() => {
      bytes = generateBytes()
    })

    it("should create a new transaction", () => {
      const transaction = Transaction.createFromBytes(bytes)

      expect(transaction).to.be.an.instanceOf(Transaction)
      expect(transaction.bytes()).to.equal(bytes)
      expect(transaction.trits()).to.deep.equal(bytesToTrits(bytes).slice(0, 8019))
      expect(transaction.trytes()).to.deep.equal(tritsToTrytes(bytesToTrits(bytes).slice(0, 8019)))
    })

    it("should initialize all transaction fields", () => {
      const transaction = Transaction.createFromBytes(bytes)

      expect(transaction.address).to.not.be.undefined
      expect(transaction.address).to.be.a('string')
      expect(transaction.address).to.have.length(81)
      expect(transaction.address).to.equal(transaction.trytes("address"))

      expect(transaction.value).to.not.be.undefined
      expect(transaction.value).to.be.a('number')

      expect(transaction.obsoleteTag).to.not.be.undefined
      expect(transaction.obsoleteTag).to.be.a('string')
      expect(transaction.obsoleteTag).to.have.length(27)
      expect(transaction.obsoleteTag).to.equal(transaction.trytes("obsoleteTag"))

      expect(transaction.timestamp).to.not.be.undefined
      expect(transaction.timestamp).to.be.a('number')

      expect(transaction.currentIndex).to.not.be.undefined
      expect(transaction.currentIndex).to.be.a('number')

      expect(transaction.lastIndex).to.not.be.undefined
      expect(transaction.lastIndex).to.be.a('number')

      expect(transaction.bundle).to.not.be.undefined
      expect(transaction.bundle).to.be.a('string')
      expect(transaction.bundle).to.have.length(81)
      expect(transaction.bundle).to.equal(transaction.trytes("bundle"))

      expect(transaction.trunk).to.not.be.undefined
      expect(transaction.trunk).to.be.a('string')
      expect(transaction.trunk).to.have.length(81)
      expect(transaction.trunk).to.equal(transaction.trytes("trunk"))

      expect(transaction.branch).to.not.be.undefined
      expect(transaction.branch).to.be.a('string')
      expect(transaction.branch).to.have.length(81)
      expect(transaction.branch).to.equal(transaction.trytes("branch"))

      expect(transaction.tag).to.not.be.undefined
      expect(transaction.tag).to.be.a('string')
      expect(transaction.tag).to.have.length(27)
      expect(transaction.tag).to.equal(transaction.trytes("tag"))

      expect(transaction.attachmentTimestamp).to.not.be.undefined
      expect(transaction.attachmentTimestamp).to.be.a("number")

      expect(transaction.attachmentTimestampLowerBound).to.not.be.undefined
      expect(transaction.attachmentTimestampLowerBound).to.be.a("number")

      expect(transaction.attachmentTimestampUpperBound).to.not.be.undefined
      expect(transaction.attachmentTimestampUpperBound).to.be.a("number")

      expect(transaction.nonce).to.not.be.undefined
      expect(transaction.nonce).to.be.a('string')
      expect(transaction.nonce).to.have.length(27)
      expect(transaction.nonce).to.equal(transaction.trytes("nonce"))
    })

    it("should be able to provide transaction attributes", () => {
      const transaction = Transaction.createFromBytes(bytes, { isValid: true, sender: "127.0.0.1" })

      expect(transaction.get("isValid")).to.be.true
      expect(transaction.get("sender")).to.equal("127.0.0.1")
    })

    it("should correctly calculate the hash after the transaction createion", () => {
      const transaction = Transaction.createFromBytes(bytes)
      const hash = calculateHash(bytesToTrits(bytes).slice(0, 8019))

      expect(transaction.calculateHash()).to.deep.equal(hash)
    })
  })

  describe("::createFromTryte(trytes)", () => {
    let trytes: string

    beforeEach(() => {
      trytes = generateTrytes()
    })

    it("should create a new transaction", () => {
      const transaction = Transaction.createFromTrytes(trytes)

      expect(transaction).to.be.an.instanceOf(Transaction)
      expect(transaction.trytes()).to.deep.equal(trytes)
      expect(transaction.trits()).to.deep.equal(trytesToTrits(trytes))
      expect(transaction.bytes().equals(tritsToBytes(trytesToTrits(trytes)))).to.be.true
    })

    it("should initialize all transaction fields", () => {
      const transaction = Transaction.createFromTrytes(trytes)

      expect(transaction.address).to.not.be.undefined
      expect(transaction.address).to.be.a('string')
      expect(transaction.address).to.have.length(81)
      expect(transaction.address).to.equal(transaction.trytes("address"))

      expect(transaction.value).to.not.be.undefined
      expect(transaction.value).to.be.a('number')

      expect(transaction.obsoleteTag).to.not.be.undefined
      expect(transaction.obsoleteTag).to.be.a('string')
      expect(transaction.obsoleteTag).to.have.length(27)
      expect(transaction.obsoleteTag).to.equal(transaction.trytes("obsoleteTag"))

      expect(transaction.timestamp).to.not.be.undefined
      expect(transaction.timestamp).to.be.a('number')

      expect(transaction.currentIndex).to.not.be.undefined
      expect(transaction.currentIndex).to.be.a('number')

      expect(transaction.lastIndex).to.not.be.undefined
      expect(transaction.lastIndex).to.be.a('number')

      expect(transaction.bundle).to.not.be.undefined
      expect(transaction.bundle).to.be.a('string')
      expect(transaction.bundle).to.have.length(81)
      expect(transaction.bundle).to.equal(transaction.trytes("bundle"))

      expect(transaction.trunk).to.not.be.undefined
      expect(transaction.trunk).to.be.a('string')
      expect(transaction.trunk).to.have.length(81)
      expect(transaction.trunk).to.equal(transaction.trytes("trunk"))

      expect(transaction.branch).to.not.be.undefined
      expect(transaction.branch).to.be.a('string')
      expect(transaction.branch).to.have.length(81)
      expect(transaction.branch).to.equal(transaction.trytes("branch"))

      expect(transaction.tag).to.not.be.undefined
      expect(transaction.tag).to.be.a('string')
      expect(transaction.tag).to.have.length(27)
      expect(transaction.tag).to.equal(transaction.trytes("tag"))

      expect(transaction.attachmentTimestamp).to.not.be.undefined
      expect(transaction.attachmentTimestamp).to.be.a("number")

      expect(transaction.attachmentTimestampLowerBound).to.not.be.undefined
      expect(transaction.attachmentTimestampLowerBound).to.be.a("number")

      expect(transaction.attachmentTimestampUpperBound).to.not.be.undefined
      expect(transaction.attachmentTimestampUpperBound).to.be.a("number")

      expect(transaction.nonce).to.not.be.undefined
      expect(transaction.nonce).to.be.a('string')
      expect(transaction.nonce).to.have.length(27)
      expect(transaction.nonce).to.equal(transaction.trytes("nonce"))

      expect(transaction.message).to.not.be.undefined
      expect(transaction.message).to.be.a('string')
      expect(transaction.message).to.have.length(2187)
      expect(transaction.message).to.equal(transaction.trytes("message"))
    })

    it("should be able to provide transaction attributes", () => {
      const transaction = Transaction.createFromTrytes(trytes, { isValid: true, sender: "127.0.0.1" })

      expect(transaction.get("isValid")).to.be.true
      expect(transaction.get("sender")).to.equal("127.0.0.1")
    })

    it("should correctly calculate the hash after the transaction createion", () => {
      const transaction = Transaction.createFromTrytes(trytes)
      const hash = calculateHash(trytesToTrits(trytes))

      expect(transaction.calculateHash()).to.deep.equal(hash)
    })
  })

  describe("::createFromTrits(trits)", () => {
    let trits: trit[]

    beforeEach(() => {
      trits = generateTrits()
    })

    it("should create a new transaction", () => {
      const transaction = Transaction.createFromTrits(trits)

      expect(transaction).to.be.an.instanceOf(Transaction)
      expect(transaction.trits()).to.deep.equal(trits)
      expect(transaction.trytes()).to.equal(tritsToTrytes(trits))
      expect(transaction.bytes().equals(tritsToBytes(trits))).to.be.true
    })


    it("should initialize all transaction fields", () => {
      const transaction = Transaction.createFromTrits(trits)

      expect(transaction.address).to.not.be.undefined
      expect(transaction.address).to.be.a('string')
      expect(transaction.address).to.have.length(81)
      expect(transaction.address).to.equal(transaction.trytes("address"))

      expect(transaction.value).to.not.be.undefined
      expect(transaction.value).to.be.a('number')

      expect(transaction.obsoleteTag).to.not.be.undefined
      expect(transaction.obsoleteTag).to.be.a('string')
      expect(transaction.obsoleteTag).to.have.length(27)
      expect(transaction.obsoleteTag).to.equal(transaction.trytes("obsoleteTag"))

      expect(transaction.timestamp).to.not.be.undefined
      expect(transaction.timestamp).to.be.a('number')

      expect(transaction.currentIndex).to.not.be.undefined
      expect(transaction.currentIndex).to.be.a('number')

      expect(transaction.lastIndex).to.not.be.undefined
      expect(transaction.lastIndex).to.be.a('number')

      expect(transaction.bundle).to.not.be.undefined
      expect(transaction.bundle).to.be.a('string')
      expect(transaction.bundle).to.have.length(81)
      expect(transaction.bundle).to.equal(transaction.trytes("bundle"))

      expect(transaction.trunk).to.not.be.undefined
      expect(transaction.trunk).to.be.a('string')
      expect(transaction.trunk).to.have.length(81)
      expect(transaction.trunk).to.equal(transaction.trytes("trunk"))

      expect(transaction.branch).to.not.be.undefined
      expect(transaction.branch).to.be.a('string')
      expect(transaction.branch).to.have.length(81)
      expect(transaction.branch).to.equal(transaction.trytes("branch"))

      expect(transaction.tag).to.not.be.undefined
      expect(transaction.tag).to.be.a('string')
      expect(transaction.tag).to.have.length(27)
      expect(transaction.tag).to.equal(transaction.trytes("tag"))

      expect(transaction.attachmentTimestamp).to.not.be.undefined
      expect(transaction.attachmentTimestamp).to.be.a("number")

      expect(transaction.attachmentTimestampLowerBound).to.not.be.undefined
      expect(transaction.attachmentTimestampLowerBound).to.be.a("number")

      expect(transaction.attachmentTimestampUpperBound).to.not.be.undefined
      expect(transaction.attachmentTimestampUpperBound).to.be.a("number")

      expect(transaction.nonce).to.not.be.undefined
      expect(transaction.nonce).to.be.a('string')
      expect(transaction.nonce).to.have.length(27)
      expect(transaction.nonce).to.equal(transaction.trytes("nonce"))

      expect(transaction.message).to.not.be.undefined
      expect(transaction.message).to.be.a('string')
      expect(transaction.message).to.have.length(2187)
      expect(transaction.message).to.equal(transaction.trytes("message"))
    })

    it("should be able to provide transaction attributes", () => {
      const transaction = Transaction.createFromTrits(trits, { isValid: true, sender: "127.0.0.1" })

      expect(transaction.get("isValid")).to.be.true
      expect(transaction.get("sender")).to.equal("127.0.0.1")
    })

    it("should correctly the calculate hash after the transaction createion", () => {
      const transaction = Transaction.createFromTrits(trits)
      const hash = calculateHash(trits)

      expect(transaction.calculateHash()).to.deep.equal(hash)
    })

  })

  describe("::createFromData(data)", () => {
    let data: TransactionData

    beforeEach(() => {
      data = generateTransactionData()
    })

    it("should create a new transaction", () => {
      const transaction = Transaction.createFromData(data)

      expect(transaction).to.be.an.instanceOf(Transaction)

      let trits = [].concat(
        trytesToTrits(data.message["padEnd"](2187, "9")),
        trytesToTrits(data.address["padEnd"](81, "9")),
        trytesToTrits(numberToTrytes(data.value)["padEnd"](27, "9")),
        trytesToTrits(data.obsoleteTag["padEnd"](27, "9")),
        trytesToTrits(numberToTrytes(data.timestamp)["padEnd"](9, "9")),
        trytesToTrits(numberToTrytes(data.currentIndex)["padEnd"](9, "9")),
        trytesToTrits(numberToTrytes(data.lastIndex)["padEnd"](9, "9")),
        trytesToTrits(data.bundle["padEnd"](81, "9")),
        trytesToTrits(data.trunk["padEnd"](81, "9")),
        trytesToTrits(data.branch["padEnd"](81, "9")),
        trytesToTrits(data.tag["padEnd"](27, "9")),
        trytesToTrits(numberToTrytes(data.attachmentTimestamp)["padEnd"](9, "9")),
        trytesToTrits(numberToTrytes(data.attachmentTimestampLowerBound)["padEnd"](9, "9")),
        trytesToTrits(numberToTrytes(data.attachmentTimestampUpperBound)["padEnd"](9, "9")),
        trytesToTrits(data.nonce["padEnd"](27, "9")),
      )

      expect(transaction.trits()).to.deep.equal(trits)
      expect(transaction.trytes()).to.equal(tritsToTrytes(trits))
      expect(transaction.bytes().equals(tritsToBytes(trits))).to.be.true
    })

    it("should initialize all transaction fields", () => {
      const transaction = Transaction.createFromData(data)

      expect(transaction.address).to.not.be.undefined
      expect(transaction.address).to.be.a('string')
      expect(transaction.address).to.have.length(81)
      expect(transaction.address).to.equal(data.address)

      expect(transaction.value).to.not.be.undefined
      expect(transaction.value).to.be.a('number')
      expect(transaction.value).to.equal(data.value)

      expect(transaction.obsoleteTag).to.not.be.undefined
      expect(transaction.obsoleteTag).to.be.a('string')
      expect(transaction.obsoleteTag).to.have.length(27)
      expect(transaction.obsoleteTag).to.equal(data.obsoleteTag)

      expect(transaction.timestamp).to.not.be.undefined
      expect(transaction.timestamp).to.be.a('number')
      expect(transaction.timestamp).to.equal(data.timestamp)

      expect(transaction.currentIndex).to.not.be.undefined
      expect(transaction.currentIndex).to.be.a('number')
      expect(transaction.currentIndex).to.equal(data.currentIndex)

      expect(transaction.lastIndex).to.be.a('number')
      expect(transaction.lastIndex).to.equal(data.lastIndex)

      expect(transaction.bundle).to.not.be.undefined
      expect(transaction.bundle).to.be.a('string')
      expect(transaction.bundle).to.have.length(81)
      expect(transaction.bundle).to.equal(data.bundle)

      expect(transaction.trunk).to.not.be.undefined
      expect(transaction.trunk).to.be.a('string')
      expect(transaction.trunk).to.have.length(81)
      expect(transaction.trunk).to.equal(data.trunk)

      expect(transaction.branch).to.not.be.undefined
      expect(transaction.branch).to.be.a('string')
      expect(transaction.branch).to.have.length(81)
      expect(transaction.branch).to.equal(data.branch)

      expect(transaction.tag).to.not.be.undefined
      expect(transaction.tag).to.be.a('string')
      expect(transaction.tag).to.have.length(27)
      expect(transaction.tag).to.equal(data.tag)

      expect(transaction.attachmentTimestamp).to.not.be.undefined
      expect(transaction.attachmentTimestamp).to.be.a("number")
      expect(transaction.attachmentTimestamp).to.equal(data.attachmentTimestamp)

      expect(transaction.attachmentTimestampLowerBound).to.not.be.undefined
      expect(transaction.attachmentTimestampLowerBound).to.be.a("number")
      expect(transaction.attachmentTimestampLowerBound).to.equal(data.attachmentTimestampLowerBound)

      expect(transaction.attachmentTimestampUpperBound).to.not.be.undefined
      expect(transaction.attachmentTimestampUpperBound).to.be.a("number")
      expect(transaction.attachmentTimestampUpperBound).to.equal(data.attachmentTimestampUpperBound)

      expect(transaction.nonce).to.not.be.undefined
      expect(transaction.nonce).to.be.a('string')
      expect(transaction.nonce).to.have.length(27)
      expect(transaction.nonce).to.equal(data.nonce)

      expect(transaction.message).to.not.be.undefined
      expect(transaction.message).to.be.a('string')
      expect(transaction.message).to.have.length(2187)
      expect(transaction.message).to.equal(data.message["padEnd"](2187, "9"))
    })

    it("should be able to provide transaction attributes", () => {
      const transaction = Transaction.createFromData(data, { isValid: true, sender: "127.0.0.1" })

      expect(transaction.get("isValid")).to.be.true
      expect(transaction.get("sender")).to.equal("127.0.0.1")
    })

    it("should correctly calculate the hash after the transaction createion", () => {
      const transaction = Transaction.createFromData(data)
      const hash = calculateHash(transaction.trits())

      expect(transaction.calculateHash()).to.deep.equal(hash)
    })
  })

  describe("weightMagnitude", () => {
    let trits: trit[]
    let transaction: Transaction


    it("should return the weight magnitude of the transaction", () => {
      trits = generateTrits()

      transaction = Transaction.createFromTrits(trits)
      transaction['_hash'] = transaction.hash().slice(0, -78) + '999'

      expect(transaction.weightMagnitude).to.gte(9)
    })
  })

  describe("bytes()", () => {
    let bytes: Buffer
    let transaction: Transaction

    beforeEach(() => {
      bytes = generateBytes()
      transaction = Transaction.createFromBytes(bytes)
    })

    it("should return bytes of the transaction", () => {
      expect(transaction.bytes()).to.equal(bytes)
    })
  })

  describe("trits(field)", () => {
    let trits: trit[]
    let transaction: Transaction

    beforeEach(() => {
      trits = generateTrits()
      transaction = Transaction.createFromTrits(trits)
    })

    it("should return trits if field is not specified", () => {
      expect(transaction.trits()).to.equal(trits)
    })

    it("should return address trits if the field ='address'", () => {
      expect(transaction.trits("address")).to.deep.equal(trits.slice(6561, 6804))
    })

    it("should return value trits if the field ='value'", () => {
      expect(transaction.trits("value")).to.deep.equal(trits.slice(6804, 6885))
    })

    it("should return obsolete tag trits if the field ='obsoleteTag'", () => {
      expect(transaction.trits("obsoleteTag")).to.deep.equal(trits.slice(6885, 6966))
    })

    it("should return timestamp trits if the field ='timestamp'", () => {
      expect(transaction.trits("timestamp")).to.deep.equal(trits.slice(6966, 6993))
    })

    it("should return current index trits if the field ='currentIndex'", () => {
      expect(transaction.trits("currentIndex")).to.deep.equal(trits.slice(6993, 7020))
    })

    it("should return last index trits if the field ='lastIndex'", () => {
      expect(transaction.trits("lastIndex")).to.deep.equal(trits.slice(7020, 7047))
    })

    it("should return bundle hash trits if the field ='bundle'", () => {
      expect(transaction.trits("bundle")).to.deep.equal(trits.slice(7047, 7290))
    })

    it("should return trunk transaction hash trits if the field ='trunk'", () => {
      expect(transaction.trits("trunk")).to.deep.equal(trits.slice(7290, 7533))
    })

    it("should return branch transaction hash trits if the field ='branch'", () => {
      expect(transaction.trits("branch")).to.deep.equal(trits.slice(7533, 7776))
    })

    it("should return tag hash trits if the field ='tag'", () => {
      expect(transaction.trits("tag")).to.deep.equal(trits.slice(7776, 7857))
    })

    it("should return attachment timestamp hash trits if the field ='attachmentTimestamp'", () => {
      expect(transaction.trits("attachmentTimestamp")).to.deep.equal(trits.slice(7857, 7884))
    })

    it("should return attachment timestamp lower bound hash trits if the field ='attachmentTimestampLowerBound'", () => {
      expect(transaction.trits("attachmentTimestampLowerBound")).to.deep.equal(trits.slice(7884, 7911))
    })

    it("should return attachment timestamp upper bound hash trits if the field ='attachmentTimestampUpperBound'", () => {
      expect(transaction.trits("attachmentTimestampUpperBound")).to.deep.equal(trits.slice(7911, 7938))
    })

    it("should return nonce trits if the field ='nonce'", () => {
      expect(transaction.trits("nonce")).to.deep.equal(trits.slice(7938, 8019))
    })

    it("should return essence trits if the field = 'essence'", () => {
      expect(transaction.trits("essence")).to.deep.equal(trits.slice(6561, 7047))
    })

    it("should throw an error if there were specified incorrect fiedl name", () => {
      expect(() => transaction.trits(<any> "incorrectField")).to.throw()
    })
  })

  describe("trytes(field)", () => {
    let trytes: string
    let transaction: Transaction

    beforeEach(() => {
      trytes = generateTrytes()
      transaction = Transaction.createFromTrytes(trytes)
    })

    it("should return trytes if field is not specified", () => {
      expect(transaction.trytes()).to.equal(trytes)
    })

    it("should return address trytes if the field ='address'", () => {
      expect(transaction.trytes("address")).to.deep.equal(trytes.slice(2187, 2268))
    })

    it("should return value trytes if the field ='value'", () => {
      expect(transaction.trytes("value")).to.deep.equal(trytes.slice(2268, 2295))
    })

    it("should return obsolete tag trytes if the field ='obsoleteTag'", () => {
      expect(transaction.trytes("obsoleteTag")).to.deep.equal(trytes.slice(2295, 2322))
    })

    it("should return timestamp trytes if the field ='timestamp'", () => {
      expect(transaction.trytes("timestamp")).to.deep.equal(trytes.slice(2322, 2331))
    })

    it("should return current index trytes if the field ='currentIndex'", () => {
      expect(transaction.trytes("currentIndex")).to.deep.equal(trytes.slice(2331, 2340))
    })

    it("should return last index trytes if the field ='lastIndex'", () => {
      expect(transaction.trytes("lastIndex")).to.deep.equal(trytes.slice(2340, 2349))
    })

    it("should return bundle hash trytes if the field ='bundle'", () => {
      expect(transaction.trytes("bundle")).to.deep.equal(trytes.slice(2349, 2430))
    })

    it("should return trunk transaction hash trytes if the field ='trunk'", () => {
      expect(transaction.trytes("trunk")).to.deep.equal(trytes.slice(2430, 2511))
    })

    it("should return branch transaction hash trytes if the field ='branch'", () => {
      expect(transaction.trytes("branch")).to.deep.equal(trytes.slice(2511, 2592))
    })

    it("should return tag hash trytes if the field ='tag'", () => {
      expect(transaction.trytes("tag")).to.deep.equal(trytes.slice(2592, 2619))
    })

    it("should return attachment timestamp hash trytes if the field ='attachmentTimestamp'", () => {
      expect(transaction.trytes("attachmentTimestamp")).to.deep.equal(trytes.slice(2619, 2628))
    })

    it("should return attachment timestamp lower bound hash trytes if the field ='attachmentTimestampLowerBound'", () => {
      expect(transaction.trytes("attachmentTimestampLowerBound")).to.deep.equal(trytes.slice(2628, 2637))
    })

    it("should return attachment timestamp upper bound hash trytes if the field ='attachmentTimestampUpperBound'", () => {
      expect(transaction.trytes("attachmentTimestampUpperBound")).to.deep.equal(trytes.slice(2637, 2646))
    })

    it("should return nonce trytes if the field ='nonce'", () => {
      expect(transaction.trytes("nonce")).to.deep.equal(trytes.slice(2646, 2673))
    })

    it("should return essence trytes if the field = 'essence'", () => {
      expect(transaction.trytes("essence")).to.deep.equal(trytes.slice(2187, 2349))
    })

    it("should throw an error if there were specified incorrect fiedl name", () => {
      expect(() => transaction.trytes(<any> "incorrectField")).to.throw()
    })
  })

  describe("get(attribute)", () => {
    let transaction: Transaction

    beforeEach(() => {
      transaction = Transaction.createFromBytes(generateBytes(), { someAttr: "someValue" })
    })

    it("should return value of the attribute", () => {
      expect(transaction.get("someAttr")).to.equal("someValue")
    })

    it("should return undefined of the attribute that does not exist", () => {
      expect(transaction.get("missedAttr")).to.be.undefined
    })
  })

  describe("set(attribute)", () => {
    let transaction: Transaction

    beforeEach(() => {
      transaction = Transaction.createFromBytes(generateBytes(), { someAttr: "someValue" })
    })

    it("should set a new attribute", () => {
      expect(transaction.set("newAttr", "newValue")).to.equal(transaction)
      expect(transaction.get("newAttr")).to.equal("newValue")
    })

    it("should change an existing attribute", () => {
      expect(transaction.get("someAttr")).to.equal("someValue")
      expect(transaction.set("someAttr", "newValue")).to.equal(transaction)
      expect(transaction.get("someAttr")).to.equal("newValue")
    })
  })

  describe("has(attribute)", () => {
    let transaction: Transaction

    beforeEach(() => {
      transaction = Transaction.createFromBytes(generateBytes(), { someAttr: "someValue" })
    })

    it("should return true for existing attribute", () => {
      expect(transaction.has("someAttr")).to.be.true
    })

    it("should return false for absent attribute", () => {
      expect(transaction.has("absentAttr")).to.be.false
    })
  })

  describe("calculateHash()", () => {
    let hashes: string[]
    let transactions: Transaction[]

    beforeEach(() => {
      hashes = []
      transactions = []

      for (let hash in BUNDLE_TRANSACTIONS) {
        hashes.push(hash)
        transactions.push(Transaction.createFromData(BUNDLE_TRANSACTIONS[hash]))
      }
    })
    it("should correctly calculate the hash of the transaction", () => {
      for (let i = 0; i < transactions.length; ++i) {
        expect(tritsToTrytes(transactions[i].calculateHash())).to.equal(hashes[i])
      }
    })
  })
})
