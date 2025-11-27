# Docker - Guia de Uso

Este projeto está preparado para rodar em containers Docker usando docker-compose.

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v1.29+)

## Estrutura

- `Dockerfile` — Imagem de produção otimizada (multi-stage build)
- `docker-compose.yml` — Configuração de produção
- `docker-compose.dev.yml` — Configuração de desenvolvimento
- `.dockerignore` — Arquivos ignorados ao construir a imagem

## Desenvolvimento com Docker

### 1. Iniciar o servidor em desenvolvimento

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Isso vai:
- Construir a imagem Docker
- Iniciar o container com `npm run dev` (nodemon ativo)
- Fazer mount do código-fonte (hot reload)
- Expor porta 4000

### 2. Ver logs

```bash
docker-compose -f docker-compose.dev.yml logs -f bookshelf-api
```

### 3. Parar o servidor

```bash
docker-compose -f docker-compose.dev.yml down
```

### 4. Limpar volumes (apaga banco de dados)

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Produção com Docker

### 1. Build da imagem

```bash
docker build -t bookshelf-api:latest .
```

### 2. Iniciar servidor em produção

```bash
docker-compose up -d
```

Isso vai:
- Usar a imagem já buildada
- Iniciar em modo produção (`npm start`)
- Usar volume para persistência do banco
- Incluir health checks

### 3. Ver status

```bash
docker-compose ps
```

### 4. Ver logs

```bash
docker-compose logs -f bookshelf-api
```

### 5. Parar servidor

```bash
docker-compose down
```

## Variáveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```bash
cp .env.example .env
```

**Importante:** Mude `SECRET_KEY` em produção!

```env
NODE_ENV=production
PORT=4000
SECRET_KEY=mude-isso-em-producao-com-uma-chave-segura
```

## Persistência de Dados

O banco de dados SQLite é salvo em um Docker Volume:

- **Desenvolvimento:** `bookshelf-db-dev`
- **Produção:** `bookshelf-db`

Para verificar volumes:

```bash
docker volume ls
```

Para ver detalhes de um volume:

```bash
docker volume inspect bookshelf-db
```

## Acessar a API

- **REST:** http://localhost:4000
- **GraphQL:** http://localhost:4000/graphql

## Health Check

O container tem health check ativo. Para verificar:

```bash
docker-compose ps
```

Você verá o status: `Up (healthy)` ou `Up (unhealthy)`

## Troubleshooting

### Porta já está em uso

Se a porta 4000 já está em uso:

```bash
docker-compose down  # Para todos containers
lsof -i :4000        # Lista processo na porta
kill -9 <PID>        # Mata o processo
```

### Banco de dados corrompido

Para resetar o banco:

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recria banco vazio
```

### Ver imagem detalhes

```bash
docker images
docker inspect bookshelf-api:latest
```

### Executar comando dentro do container

```bash
docker-compose exec bookshelf-api npm run dev
docker-compose exec bookshelf-api sh
```

## Deployment

Para deploy em produção (ex: AWS, Heroku, DigitalOcean):

1. Build e push da imagem para registry:

```bash
docker build -t seu-registry/bookshelf-api:latest .
docker push seu-registry/bookshelf-api:latest
```

2. Mude `docker-compose.yml` para usar imagem remota:

```yaml
services:
  bookshelf-api:
    image: seu-registry/bookshelf-api:latest
    # ... resto da configuração
```

3. Deploy:

```bash
docker-compose -f docker-compose.yml up -d
```

## Segurança

✅ Imagem:
- Multi-stage build (reduz tamanho)
- Usuário não-root (nodejs)
- Alpine Linux (mínimo de dependências)
- Health checks

✅ Recomendações:
- Mude `SECRET_KEY` em produção
- Use secrets manager para variáveis sensíveis
- Coloque atrás de reverse proxy (nginx)
- Configure rate limiting
- Use HTTPS

## Mais Informações

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Node.js in Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
