import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// graphql schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`

// map of functions which return data for the schema
const resolvers = {
  Query: {
    hello: () => 'world',
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server)

console.log(`Server ready at ${url}`)
