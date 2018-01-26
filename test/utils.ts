import { TRITS, TRYTES, trit } from "iota-ternary"
import { TransactionData, Transaction } from "../src/transaction"

const randomstring = require("randomstring")
const Curl = require("iota.lib.js/lib/crypto/curl/curl")

export function calculateHash(trits: trit[]): trit[] {
  const hash = new Array<trit>(243)
  const curl = new Curl()

  curl.initialize()
  curl.absorb(trits, 0, trits.length)
  curl.squeeze(hash, 0, hash.length)

  return hash
}

export function generateBytes(count = 1604): Buffer {
  const bytes = Buffer.alloc(count)

  for (let i = 0; i < count; ++i) {
    bytes.writeInt8(-121 + Math.floor(243*Math.random()), i)
  }

  return bytes
}

export function generateTrytes(count = 2673): string {
  const trytesArray = new Array(count)

  for (let i = 0; i < count; ++i) {
    trytesArray[i] = TRYTES[Math.floor(Math.random()*27)]
  }

  return trytesArray.join('')
}

export function generateTrits(count = 8019): trit[] {
  const trits = new Array(count)

  for (let i = 0; i < count; ++i) {
    trits[i] = TRITS[Math.floor(Math.random()*3)]
  }

  return trits
}

export function generateTransactionData(params = {}): TransactionData {
  return Object.assign({
    message:      randomstring.generate({ length: 100, charset: TRYTES }),
    address:      randomstring.generate({ length: 81, charset: TRYTES }),
    value:        Math.floor(Math.random()*(Transaction.SUPPLY + 1)),
    obsoleteTag:  randomstring.generate({ length: 27, charset: TRYTES }),
    timestamp:    Date.now(),
    currentIndex: Math.floor(Math.random()*10),
    lastIndex:    10 + Math.floor(Math.random()*10),
    bundle:       randomstring.generate({ length: 81, charset: TRYTES }),
    trunk:        randomstring.generate({ length: 81, charset: TRYTES }),
    branch:       randomstring.generate({ length: 81, charset: TRYTES }),
    tag:          randomstring.generate({ length: 27, charset: TRYTES }),
    attachmentTimestamp:           Date.now(),
    attachmentTimestampLowerBound: Date.now(),
    attachmentTimestampUpperBound: Date.now(),
    nonce: randomstring.generate({ length: 27, charset: TRYTES })
  }, params)
}
