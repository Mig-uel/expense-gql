import Transaction from '../models/transaction.model.js'

const TransactionResolver = {
  Query: {
    async transactions(_, __, ctx) {
      try {
        if (!ctx.getUser()) throw new Error('Unauthorized')
        const userId = await ctx.getUser()._id

        const transactions = await Transaction.find({ userId })

        return transactions
      } catch (error) {
        console.error('Error getting user transactions', error)
        throw new Error(error.message || 'Internal server error.')
      }
    },

    async transaction(_, { transactionId }) {
      try {
        const transaction = await Transaction.findById(transactionId)

        return transaction
      } catch (error) {
        console.error('Error getting transaction', error)
        throw new Error(error.message || 'Internal server error.')
      }
    },

    // TODO => add category statistics query
  },
  Mutation: {
    async createTransaction(_, { input }, ctx) {
      try {
        const userId = ctx.getUser()._id

        if (!userId) throw new Error('Invalid user id.')

        const transaction = new Transaction({
          ...input,
          userId,
        })

        await transaction.save()
        return transaction
      } catch (error) {
        console.error('Error creating transaction', error)
        throw new Error(error.message || 'Internal Server Error')
      }
    },

    async updateTransaction(_, { input }, ctx) {
      try {
        const userId = ctx.getUser()._id

        const transaction = await Transaction.findByIdAndUpdate(
          { _id: input.transactionId, userId },
          input,
          { new: true }
        )

        if (!transaction) throw new Error('Transaction not found')

        return transaction
      } catch (error) {
        console.error('Error updating transaction', error)
        throw new Error(error.message || 'Internal Server Error')
      }
    },
    async deleteTransaction(_, { transactionId }, ctx) {
      try {
        const userId = ctx.getUser()._id

        if (!userId) throw new Error('Invalid user ID')

        const transaction = await Transaction.findByIdAndDelete({
          _id: transactionId,
          userId,
        })

        if (!transaction) throw new Error('Transaction not found')

        return transaction
      } catch (error) {
        console.error('Error deleting transaction', error)
        throw new Error(error.message || 'Internal Server Error')
      }
    },
  },

  // TODO => add transaction/user relation
}

export default TransactionResolver
