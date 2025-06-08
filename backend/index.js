import cors from 'cors'
import express from 'express'
import http from 'http'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { configDotenv } from 'dotenv'

import connectDB from './db/connectDB.js'
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './resolvers/typeDefs/index.js'

configDotenv()
const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.use(
  '/',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  })
)

connectDB()
  .then(() =>
    new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve)).then(
      () => console.log('---- SERVER RUNNING ----')
    )
  )
  .catch((error) => console.log(error))
