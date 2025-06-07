import { users } from '../data/data.js'

const UserResolver = {
  Query: {
    // users resolver
    users() {
      return users
    },

    // user(userId: ID!) resolver
    user(_, { userId }) {
      return users.find((u) => u._id === userId)
    },
  },
  Mutation: {},
}

export default UserResolver
