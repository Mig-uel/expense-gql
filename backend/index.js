import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './resolvers/typeDefs/index.js'

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
})

const { url } = await startStandaloneServer(server)

console.log(`SERVER READY @ ${url}`)
