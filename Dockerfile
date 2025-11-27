# Multi-stage build para otimizar imagem
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm ci --only=production

# Stage final - imagem de produção
FROM node:18-alpine

# Define informações da imagem
LABEL maintainer="Cleóbulo B. Oliveira"
LABEL description="Bookshelf API - Node.js + GraphQL + SQLite"

WORKDIR /app

# Instala dumb-init para gerenciar processos
RUN apk add --no-cache dumb-init

# Copia node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia código da aplicação
COPY . .

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expõe porta
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usa dumb-init para iniciar processo
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão
CMD ["npm", "start"]
