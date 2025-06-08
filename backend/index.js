import cors from 'cors'
import express from 'express'
import http from 'http'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import connectMongo from 'connect-mongodb-session'
import { configDotenv } from 'dotenv'
import session from 'express-session'
import passport from 'passport'

import connectDB from './db/connectDB.js'
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './resolvers/typeDefs/index.js'
import { buildContext } from 'graphql-passport'

configDotenv()
const app = express()
const httpServer = http.createServer(app)

// session store
const MongoDBStore = connectMongo(session)
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
})

// debug session store
store.on('error', function (error) {
  console.log(error)
})

app.use(
  session({
    secret: process.env.SESSIONS_SECRET,
    cookie: {
      // this option prevents cross-site scripting (xss) attacks
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    // this option specifies whether to save the session to the store on every request
    resave: false,
    //this option specifies whether to save uninitialized sessions
    saveUninitialized: false,
    store,
  })
)

app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.use(
  '/',
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
)

connectDB()
  .then(() =>
    new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve)).then(
      () => console.log('---- SERVER RUNNING ----')
    )
  )
  .catch((error) => console.log(error))
