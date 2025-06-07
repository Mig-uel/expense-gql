import { users } from '../data/data.js'

const UserResolver = {
  Query: {
    users() {
      return this.users()
    },
  },
  Mutation: {},
}

export default UserResolver
