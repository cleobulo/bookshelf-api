# bookshelf-api
Small API to manage books, authors, &amp; user reviews - all in GraphQL, using Node.js

## Goals

- Defining a GraphQL schema
- Writing resolvers
- Connecting to a database
- using DataLoader for batching
- Testing queries with Apollo or GraphQL Playground

## Architecture

bookshelf-api/
├── src/
│   ├── index.js           # Entry point
│   ├── schema.js          # typeDefs
│   ├── resolvers.js       # resolver functions
│   ├── context.js         # DB + loaders
│   └── db/                # Prisma models or raw SQL
├── package.json
└── prisma/
    └── schema.prisma      # DB schema
