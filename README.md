# Bookshelf API

Uma API GraphQL + REST para gerenciar livros, autores e usuários, construída com **Node.js**, **Express**, **Apollo Server** e **SQLite**.

## Stack Tecnológico

- **Node.js** — runtime JavaScript
- **Express** — framework web
- **Apollo Server** — servidor GraphQL
- **SQLite** (better-sqlite3) — banco de dados
- **JWT** — autenticação com tokens
- **bcryptjs** — hash seguro de senhas
- **Docker** — containerização e deployment

## Instalação

### Opção 1: Local (Node.js)

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

### Opção 2: Docker

#### Desenvolvimento (com hot-reload)

```bash
docker-compose -f docker-compose.dev.yml up
```

O servidor estará disponível em http://localhost:4000 com recarga automática ao alterar arquivos.

#### Produção

```bash
docker-compose up -d
```

A API ficará disponível em http://localhost:4000 com otimizações e verificações de saúde.

**Para mais detalhes sobre Docker, veja [DOCKER.md](./DOCKER.md)**

---

## Validação de Entrada

A API implementa **validação completa de entrada** em JavaScript puro, sem dependências externas. Todas as requisições são validadas antes de serem processadas.

### Regras de Validação

#### Usuários
- **Email**: Obrigatório, formato válido, máx. 255 caracteres
- **Senha**: Obrigatório, mínimo 6 caracteres, máx. 255 caracteres
- **Confirmação**: Senhas devem corresponder (no registro)

#### Livros
- **Título**: Obrigatório, string não-vazia, máx. 255 caracteres
- **ID do Autor**: Obrigatório, número inteiro positivo

#### Autores
- **Nome**: Obrigatório, string não-vazia, máx. 255 caracteres
- **Bio**: Opcional, máx. 1000 caracteres

#### Notas
- **Conteúdo**: Obrigatório, string não-vazia, máx. 5000 caracteres
- **ID do Livro**: Obrigatório, número inteiro positivo
- **Número da Página**: Opcional, número inteiro positivo

### Resposta de Erro de Validação

Quando a validação falha, a API retorna **400 Bad Request** com detalhes:

```json
{
  "error": "Email é obrigatório",
  "field": "email"
}
```

---

## Arquitetura e Padrões

### Padrão MVC (Model-View-Controller)

A API segue o padrão **MVC** com separação de responsabilidades:

- **Models** — `src/db.js` (operações no banco de dados)
- **Views** — GraphQL schema + REST endpoints
- **Controllers** — `src/controllers/` (lógica de negócio)

### Organização de Controllers

Cada controller é responsável por uma entidade específica:

```
src/controllers/
├── userController.js      → Autenticação e usuário
├── bookController.js      → Gerenciamento de livros
├── authorController.js    → Gerenciamento de autores
├── noteController.js      → Notas privadas do usuário
└── index.js               → Re-exporta todos
```

Cada controller:
- ✅ Valida entrada via `src/validation.js`
- ✅ Trata erros e retorna status HTTP apropriado
- ✅ Registra errors em console para debugging
- ✅ Usa middleware de autenticação quando necessário

### Organização de GraphQL Resolvers

Cada resolver é responsável por uma entidade específica:

```
src/resolvers/
├── userResolvers.js       → Queries (me) e Mutations (login, register)
├── bookResolvers.js       → Queries (books, book) e Mutations (add/update/delete)
├── authorResolvers.js     → Queries (authors, author) e Mutations (add/update/delete)
├── noteResolvers.js       → Queries (notes) e Mutations (add/update/delete)
└── index.js               → Merge de todos os resolvers
```

Cada resolver:
- ✅ Implementa Query e/ou Mutation para uma entidade
- ✅ Usa `authenticate()` quando necessário
- ✅ Chama funções do data layer (`src/data.js`)
- ✅ Retorna dados tipados conforme schema GraphQL

### Fluxo de Requisição

```
Request HTTP
    ↓
Express Route + expressAuth middleware (se autenticado)
    ↓
Controller (userController, bookController, etc)
    ↓
Validation (validateUserRegistration, validateBook, etc)
    ↓
Data Layer (src/data.js → src/db.js)
    ↓
SQLite Database
    ↓
Response JSON
```

### Sistema de Validações

A API implementa um sistema robusto de validações **organizado por entidade**:

```
src/validations/
├── commonValidations.js     → Utilitários compartilhados
├── userValidations.js       → Valida email, senha
├── bookValidations.js       → Valida título, authorId
├── authorValidations.js     → Valida nome, bio
├── noteValidations.js       → Valida conteúdo, bookId
└── errors/
    └── ValidationError.js   → Classe de erro personalizada
```

**Características:**
- ✅ Validações em **JavaScript puro** (sem dependências externas)
- ✅ Mensagens de erro em **português**
- ✅ Informação de qual **campo falhou**
- ✅ Reutilização de validações comuns (EMAIL_REGEX, validateId)
- ✅ Tratamento centralizado de erros

**Exemplo de resposta com erro:**
```json
{
  "error": "Senha deve ter no mínimo 6 caracteres",
  "field": "password"
}
```

---

## Autenticação

A API usa **JWT (JSON Web Tokens)** para proteger endpoints autenticados.

### 1. Registrar novo usuário

```bash
curl -s -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@teste.com","password":"senha123","passwordConfirm":"senha123"}' | jq
```

**Resposta (201):**
```json
{
  "id": 1,
  "email": "usuario@teste.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erro - Validação falhou (400):**
```json
{
  "error": "Formato de email inválido",
  "field": "email"
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

#### Listar notas de um livro (autenticado)
```graphql
query {
  notes(bookId: 1) {
    id
    book_id
    content
    page_number
    created_at
  }
}
```

#### Criar nota (autenticado)
```graphql
mutation {
  addNote(bookId: 1, content: "Personagem principal muito interessante", pageNumber: 45) {
    id
    book_id
    content
    page_number
  }
}
```

#### Atualizar nota (autenticado)
```graphql
mutation {
  updateNote(id: 1, content: "Personagem principal muito interessante - desenvolvimento épico", pageNumber: 45) {
    id
    content
    updated_at
  }
}
```

#### Deletar nota (autenticado)
```graphql
mutation {
  deleteNote(id: 1)
}
```

---

## Endpoints REST para Notes

### Listar notas de um livro (autenticado)
```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/books/1/notes | jq
```

### Obter uma nota específica (autenticado)
```bash
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:4000/notes/1 | jq
```

### Criar nova nota (autenticado)
```bash
curl -s -X POST http://localhost:4000/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId":1,"content":"Passagem marcante na página 42","pageNumber":42}' | jq
```

**Resposta (201):**
```json
{
  "id": 1,
  "book_id": 1,
  "user_id": 1,
  "content": "Passagem marcante na página 42",
  "page_number": 42,
  "created_at": "2025-11-17T10:30:00.000Z"
}
```

### Atualizar nota (autenticado)
```bash
curl -s -X PUT http://localhost:4000/notes/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Passagem muito marcante - refletir depois","pageNumber":42}' | jq
```

### Deletar nota (autenticado)
```bash
curl -s -X DELETE http://localhost:4000/notes/1 \
  -H "Authorization: Bearer $TOKEN"
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

### Tabela: notes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER (PK) | ID único da nota |
| book_id | INTEGER (FK) | ID do livro |
| user_id | INTEGER (FK) | ID do usuário (privado) |
| content | TEXT | Conteúdo da anotação |
| page_number | INTEGER | Página (opcional) |
| created_at | DATETIME | Data de criação |
| updated_at | DATETIME | Última atualização |

---

## Estrutura do Projeto

```
bookshelf-api/
├── src/
│   ├── controllers/                    # Controllers organizados por entidade
│   │   ├── index.js                   # Re-exporta todos os controllers
│   │   ├── userController.js          # Register, login, me
│   │   ├── bookController.js          # CRUD de livros
│   │   ├── authorController.js        # CRUD de autores
│   │   └── noteController.js          # CRUD de notas
│   ├── resolvers/                     # GraphQL resolvers organizados por entidade
│   │   ├── index.js                   # Merge de todos os resolvers
│   │   ├── userResolvers.js           # Login, register, me
│   │   ├── bookResolvers.js           # Queries e mutations de livros
│   │   ├── authorResolvers.js         # Queries e mutations de autores
│   │   └── noteResolvers.js           # Queries e mutations de notas
│   ├── validations/                   # Validações organizadas por entidade
│   │   ├── index.js                   # Re-exporta todos os validadores
│   │   ├── errors/
│   │   │   ├── ValidationError.js     # Classe de erro personalizada
│   │   │   └── index.js               # Re-exporta ValidationError
│   │   ├── commonValidations.js       # Email regex, validateId
│   │   ├── userValidations.js         # Validações de user
│   │   ├── bookValidations.js         # Validações de book
│   │   ├── authorValidations.js       # Validações de author
│   │   └── noteValidations.js         # Validações de note
│   ├── index.js                       # Entry point, Express + Apollo
│   ├── schema.js                      # GraphQL schema (typeDefs)
│   ├── auth.js                        # JWT + middleware de autenticação
│   ├── data.js                        # Re-exporta funções do banco
│   └── db.js                          # SQLite database e operações CRUD
├── test/                              # Testes automatizados (futuro)
├── bookshelf.db                       # Arquivo SQLite (criado automaticamente)
├── package.json
├── README.md
└── LICENSE
```

### Detalhes dos Componentes

**Controllers** (`src/controllers/`)
- **userController.js** — Autenticação (register, login) e dados do usuário
- **bookController.js** — Gerenciamento completo de livros (CREATE, READ, UPDATE, DELETE)
- **authorController.js** — Gerenciamento completo de autores (CREATE, READ, UPDATE, DELETE)
- **noteController.js** — Gerenciamento de notas privadas do usuário (CREATE, READ, UPDATE, DELETE)

**Resolvers** (`src/resolvers/`)
- **userResolvers.js** — GraphQL queries (me) e mutations (login, register)
- **bookResolvers.js** — GraphQL queries (books, book) e mutations (add/update/delete)
- **authorResolvers.js** — GraphQL queries (authors, author) e mutations (add/update/delete)
- **noteResolvers.js** — GraphQL queries (notes) e mutations (add/update/delete)

**Validações** (`src/validations/`)
- **commonValidations.js** — Utilitários compartilhados (EMAIL_REGEX, validateId)
- **userValidations.js** — Valida registro e login de usuários
- **bookValidations.js** — Valida criação/atualização de livros
- **authorValidations.js** — Valida criação/atualização de autores
- **noteValidations.js** — Valida criação/atualização de notas
- **errors/ValidationError.js** — Classe personalizada para erros de validação

---- **bookResolvers.js** — GraphQL queries (books, book) e mutations (addBook, updateBook, deleteBook)
- **authorResolvers.js** — GraphQL queries (authors, author) e mutations (addAuthor, updateAuthor, deleteAuthor)
- **noteResolvers.js** — GraphQL queries (notes) e mutations (addNote, updateNote, deleteNote)

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
- ✅ **Validação**: Implementada em todos os endpoints (email, senha, tamanho de strings, tipos)
- 🔒 **HTTPS**: Use em produção
- 👤 **Notas Privadas**: Usuários só acessam suas próprias notas

---

## Melhorias Futuras

- [x] Validação de entrada (implementada)
- [x] Desmembração de controllers em arquivos individuais (implementada)
- [x] Desmembração de resolvers em arquivos individuais (implementada)
- [x] Desmembração de validações em arquivos individuais (implementada)
- [x] Docker + docker-compose (implementado)
- [ ] Testes automatizados (Jest + Supertest)
- [ ] Paginação em listas
- [ ] Filtros avançados
- [ ] Relacionamentos completos GraphQL
- [ ] Logging estruturado (Winston/Pino)
- [ ] Rate limiting (express-rate-limit)
- [ ] Swagger/OpenAPI docs

---

## Licença

ISC

---

## Autor

Cleóbulo B. Oliveira

