# Bookshelf API

Uma API GraphQL + REST para gerenciar livros, autores e usuários, construída com **Node.js**, **Express**, **Apollo Server** e **SQLite**.

## Stack Tecnológico

- **Node.js** — runtime JavaScript
- **Express** — framework web
- **Apollo Server** — servidor GraphQL
- **SQLite** (better-sqlite3) — banco de dados
- **JWT** — autenticação com tokens
- **bcryptjs** — hash seguro de senhas

## Instalação

1. Clone ou acesse o repositório:
```bash
cd bookshelf-api
```

2. Instale as dependências:
```bash
npm install
```

3. Defina a chave secreta (ou use a padrão):
```bash
export SECRET_KEY="sua-chave-secreta-aqui"
```

4. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em:
- **REST**: http://localhost:4000
- **GraphQL**: http://localhost:4000/graphql

## Autenticação

A API usa **JWT (JSON Web Tokens)** para proteger endpoints autenticados.

### 1. Registrar novo usuário

```bash
curl -s -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"senha123"}' | jq
```

**Resposta (201):**
```json
{
  "id": 1,
  "email": "usuario@teste.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Fazer login

```bash
curl -s -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"senha123"}' | jq
```

Salve o token para usar nos próximos requests:
```bash
export TOKEN=$(curl -s -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"senha123"}' | jq -r '.token')
```

### 3. Obter dados do usuário autenticado

```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/me | jq
```

---

## Endpoints REST

### Books (Livros)

#### Listar todos os livros (autenticado)
```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/books | jq
```

#### Criar novo livro (autenticado)
```bash
curl -s -X POST http://localhost:4000/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","authorId":1}' | jq
```

#### Atualizar livro (autenticado)
```bash
curl -s -X PUT http://localhost:4000/books/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984 (Orwell)","authorId":2}' | jq
```

#### Deletar livro (autenticado)
```bash
curl -s -X DELETE http://localhost:4000/books/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### Authors (Autores)

#### Listar todos os autores (público)
```bash
curl -s http://localhost:4000/authors | jq
```

#### Obter autor específico (público)
```bash
curl -s http://localhost:4000/authors/1 | jq
```

#### Criar novo autor (autenticado)
```bash
curl -s -X POST http://localhost:4000/authors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"J.R.R. Tolkien","bio":"Escritor britânico de fantasia"}' | jq
```

**Resposta (201):**
```json
{
  "id": 1,
  "name": "J.R.R. Tolkien",
  "bio": "Escritor britânico de fantasia",
  "created_at": "2025-11-13T10:30:00.000Z"
}
```

#### Atualizar autor (autenticado)
```bash
curl -s -X PUT http://localhost:4000/authors/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"J.R.R. Tolkien","bio":"Autor de O Senhor dos Anéis"}' | jq
```

#### Deletar autor (autenticado)
```bash
curl -s -X DELETE http://localhost:4000/authors/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## GraphQL

Acesse http://localhost:4000/graphql no navegador para usar o Apollo Sandbox.

### Queries

#### Listar livros
```graphql
query {
  books {
    id
    title
    author_id
    user_id
  }
}
```

#### Listar autores
```graphql
query {
  authors {
    id
    name
    bio
  }
}
```

#### Obter dados do usuário autenticado
```graphql
query {
  me {
    id
    email
  }
}
```

### Mutations

#### Criar livro (autenticado)
```graphql
mutation {
  addBook(title: "The Hobbit", authorId: 1) {
    id
    title
    author_id
  }
}
```

#### Criar autor (autenticado)
```graphql
mutation {
  addAuthor(name: "George Orwell", bio: "Autor de 1984") {
    id
    name
    bio
  }
}
```

#### Atualizar autor (autenticado)
```graphql
mutation {
  updateAuthor(id: 1, name: "George Orwell", bio: "Autor britânico") {
    id
    name
  }
}
```

#### Deletar autor (autenticado)
```graphql
mutation {
  deleteAuthor(id: 1)
}
```

#### Registrar novo usuário
```graphql
mutation {
  register(email: "novo@exemplo.com", password: "senha123") {
    id
    email
    token
  }
}
```

#### Fazer login
```graphql
mutation {
  login(email: "usuario@teste.com", password: "senha123") {
    id
    email
    token
  }
}
```

---

## Estrutura do Banco de Dados

### Tabela: users
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | ID único do usuário |
| email | TEXT UNIQUE | Email do usuário |
| password | TEXT | Senha com hash bcryptjs |
| created_at | DATETIME | Data de criação |

### Tabela: authors
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | ID único do autor |
| name | TEXT UNIQUE | Nome do autor |
| bio | TEXT | Biografia (opcional) |
| created_at | DATETIME | Data de criação |

### Tabela: books
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | ID único do livro |
| title | TEXT | Título do livro |
| author_id | INTEGER (FK) | ID do autor |
| user_id | INTEGER (FK) | ID do usuário que criou |
| created_at | DATETIME | Data de criação |

---

## Estrutura do Projeto

```
bookshelf-api/
├── src/
│   ├── index.js           # Entry point, Express + Apollo
│   ├── schema.js          # GraphQL schema (typeDefs)
│   ├── resolvers.js       # GraphQL resolvers
│   ├── auth.js            # JWT + middleware de autenticação
│   ├── data.js            # Re-exporta funções do banco
│   └── db.js              # SQLite database e operações CRUD
├── bookshelf.db           # Arquivo SQLite (criado automaticamente)
├── package.json
├── README.md
└── LICENSE
```

---

## Scripts disponíveis

```bash
# Iniciar em modo desenvolvimento (com nodemon)
npm run dev

# Iniciar modo produção
npm start
```

---

## Notas de Segurança

- 🔐 **Senhas**: Sempre com hash bcryptjs (salt 8)
- 🎫 **Tokens JWT**: Expiram em 7 dias
- 🔑 **SECRET_KEY**: Mude em produção!
- 📍 **Validação**: Implementar mais robustez com Joi/Zod
- 🔒 **HTTPS**: Use em produção

---

## Melhorias Futuras

- [ ] Paginação em listas
- [ ] Filtros avançados
- [ ] Relacionamentos completos GraphQL
- [ ] Testes automatizados (Jest)
- [ ] Rate limiting
- [ ] Logging estruturado
- [ ] Swagger/OpenAPI docs

---

## Licença

ISC

---

## Autor

Cleóbulo B. Oliveira

