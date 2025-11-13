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

## How to use

1. `npm install`
2. `export SECRET_KEY="sua-chave-secreta" && npm run dev`
3. 

curl -s -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"senha123"}' | jq

4. 

curl -s -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"senha123"}' | jq -r '.token'

### Listar (GET)
curl -s -H "Authorization: Bearer TOKEN" http://localhost:4000/books | jq

### Criar (POST)
curl -s -X POST http://localhost:4000/books \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","authorId":1}' | jq

### Atualizar (PUT)
curl -s -X PUT http://localhost:4000/books/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984 (Orwell)","authorId":2}' | jq

### Deletar (DELETE)
curl -s -X DELETE http://localhost:4000/books/1 \
  -H "Authorization: Bearer TOKEN"

### Ver dados do usuário (GET /me)
curl -s -H "Authorization: Bearer TOKEN" http://localhost:4000/me | jq
