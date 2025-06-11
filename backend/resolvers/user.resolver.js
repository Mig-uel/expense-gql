import { users } from '../data/data.js'
import User from '../models/user.model.js'

export default {
  Query: {
    // user(userId: ID!) resolver
    user(_, { userId }) {
      return users.find((u) => u._id === userId)
    },

    async authUser(_, __, ctx) {
      try {
      } catch (error) {}
    },
  },

  Mutation: {
    async signUp(_, { input }, ctx) {
      try {
        const { username, name, password, gender } = input

        if (
          !username.trim() ||
          !name.trim() ||
          !password.trim() ||
          !gender.trim()
        )
          throw new Error('All fields are required')

        const existingUser = await User.findOne({ username })

        if (existingUser) throw new Error('User already exists.')

        // hash password
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const profilePicture = `https://avatar.iran.liara.run/username?username=${name}`

        const user = new User({
          gender,
          name,
          password: hashedPassword,
          profilePicture,
          username,
        })

        await user.save()

        await ctx.login(user)

        return user
      } catch (error) {
        console.error('Error while signing up: ', error)
        throw new Error(error.message || 'Internal server error.')
      }
    },

    async login(_, { input }, ctx) {
      try {
        const { username, password } = input

        const { user } = await ctx.authenticate('graphql-local', {
          username,
          password,
        })

        await ctx.login(user)

        return user
      } catch (error) {
        console.error('Error while login in: ', error)
        throw new Error(error.message || 'Internal server error.')
      }
    },

    async logout(_, __, ctx) {
      try {
        await ctx.logout()

        ctx.req.session.destroy((err) => {
          if (err) throw err
        })

        ctx.res.clearCookie('connect.sid')

        return {
          message: 'Logged out successfully.',
        }
      } catch (error) {
        console.error('Error while login out: ', error)
        throw new Error(error.message || 'Internal server error.')
      }
    },
  },
}
