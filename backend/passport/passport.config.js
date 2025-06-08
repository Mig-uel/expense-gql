import passport from 'passport'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { GraphQLLocalStrategy } from 'graphql-passport'

export default async function () {
  passport.serializeUser((user, done) => {
    console.log('Serializing user...')
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user...')

    try {
      const user = await User.findById(id)

      done(null, user)
    } catch (error) {
      done(error)
    }
  })

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username })

        if (!user) throw new Error('Invalid username or password.')

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) throw new Error('Invalid username or password')

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    })
  )
}
