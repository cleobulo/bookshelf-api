const userResolvers = require('./userResolvers');
const bookResolvers = require('./bookResolvers');
const authorResolvers = require('./authorResolvers');
const noteResolvers = require('./noteResolvers');

/**
 * Merge all resolvers into a single object
 * GraphQL resolvers are organized by entity:
 * - User (login, register, me)
 * - Book (CRUD operations)
 * - Author (CRUD operations)
 * - Note (CRUD operations, private to user)
 */
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...bookResolvers.Query,
    ...authorResolvers.Query,
    ...noteResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...bookResolvers.Mutation,
    ...authorResolvers.Mutation,
    ...noteResolvers.Mutation,
  },
};

module.exports = resolvers;
