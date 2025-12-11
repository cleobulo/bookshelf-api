const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookshelf API',
      version: '1.0.0',
      description: 'Uma API GraphQL + REST para gerenciar livros, autores e usuários. Construída com Node.js, Express, Apollo Server e SQLite.',
      contact: {
        name: 'Cleóbulo B. Oliveira',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token para autenticação. Obtenha um token via /login ou /register',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
          },
          required: ['id', 'email'],
        },
        Book: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do livro',
            },
            title: {
              type: 'string',
              maxLength: 255,
              description: 'Título do livro',
            },
            authorId: {
              type: 'integer',
              description: 'ID do autor',
            },
            userId: {
              type: 'integer',
              description: 'ID do usuário proprietário',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
          },
          required: ['id', 'title', 'authorId', 'userId'],
        },
        Author: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do autor',
            },
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Nome do autor',
            },
            bio: {
              type: 'string',
              maxLength: 1000,
              nullable: true,
              description: 'Biografia do autor',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
          },
          required: ['id', 'name'],
        },
        Note: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da nota',
            },
            bookId: {
              type: 'integer',
              description: 'ID do livro',
            },
            userId: {
              type: 'integer',
              description: 'ID do usuário proprietário',
            },
            content: {
              type: 'string',
              maxLength: 5000,
              description: 'Conteúdo da nota',
            },
            pageNumber: {
              type: 'integer',
              nullable: true,
              description: 'Número da página',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de última atualização',
            },
          },
          required: ['id', 'bookId', 'userId', 'content'],
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            field: {
              type: 'string',
              nullable: true,
              description: 'Campo que causou o erro (se aplicável)',
            },
          },
          required: ['error'],
        },
      },
    },
  },
  apis: ['./src/swagger-routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
