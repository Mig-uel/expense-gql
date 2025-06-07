import { users } from '../data/data.js'

const UserResolver = {
  Query: {
    users() {
      return users
    },
  },
  Mutation: {},
}

export default UserResolver
