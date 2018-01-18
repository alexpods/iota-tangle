import { Factory } from './factory'
import { Serializer } from './serializer'

export const serializer = new Serializer()
export const factory = new Factory({ serializer })

export { Factory } from './factory'
export { Serializer } from './serializer'

export { Hash } from './hash'
export { Transaction } from './transaction'
