import { mergeTypeDefs } from '@graphql-tools/merge'
import transactionTypeDef from './transaction.typeDef.js'
import userTypeDef from './user.typeDef.js'

export default mergeTypeDefs([transactionTypeDef, userTypeDef])
