import { mergeResolvers } from '@graphql-tools/merge'
import TransactionResolver from './transaction.resolver.js'
import UserResolver from './user.resolver.js'

// merge resolvers for clean approach
export default mergeResolvers([UserResolver, TransactionResolver])
