# GWAN Radio - Plataforma Completa de Rádio Online

Repositório único contendo a infraestrutura completa da GWAN Reggae Radio, incluindo o backend de gerenciamento (AzuraCast) e o frontend público do portal.

## 📋 Índice Rápido

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Instalação Rápida](#instalação-rápida)
- [Projeto AzuraCast](#projeto-azuracast-backend)
- [Projeto Frontend](#projeto-frontend-portal-web)
- [Deploy em Produção](#deploy-em-produção)
- [URLs e Endpoints](#urls-e-endpoints)
- [Troubleshooting](#troubleshooting)
- [Documentação Adicional](#documentação-adicional)

## 🎯 Visão Geral

Este repositório contém dois projetos principais que trabalham juntos para fornecer uma plataforma completa de rádio online:

1. **AzuraCast** (`azuracast/`) - Sistema de gerenciamento de rádio online (backend)
2. **Frontend** (`gwan-radio-frontend/`) - Portal web público com player de rádio integrado

### Funcionalidades Principais

- 🎵 **Streaming de Áudio**: Transmissão de rádio 24/7 via AzuraCast
- 🎨 **Portal Web**: Site público com player de rádio fixo, notícias, agenda de eventos e galeria de artistas
- 📱 **Responsivo**: Interface adaptada para desktop e mobile
- 🔐 **Autenticação**: Sistema de login e registro (mantido da arquitetura original)
- 🤖 **Chatbot**: Sistema de chatbot integrado
- 📊 **Painel Administrativo**: Gerenciamento completo via AzuraCast

## 🏗️ Arquitetura

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuários/Visitantes                      │
└────────────────────┬───────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ radio.gwan.com.br│    │ cast.gwan.com.br │    │ stream.gwan.com.br│
│   (Frontend)     │    │   (AzuraCast)    │    │    (Stream)      │
│                  │    │                  │    │                  │
│  React + Vite    │    │  Painel Admin    │    │  Stream de Áudio │
│  Player Fixo     │───▶│  API REST        │    │  (Porta 8000)    │
│  Portal Web      │    │                  │    │                  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │                       │
         │                       │
         │         ┌─────────────┘
         │         │
         ▼         ▼
┌─────────────────────────────────┐
│      Traefik (Reverse Proxy)    │
│  - SSL/TLS (Let's Encrypt)      │
│  - Roteamento por Host          │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│    Docker Network: gwan         │
│  - Comunicação entre serviços   │
└─────────────────────────────────┘
```

### Fluxo de Dados

1. **Usuário acessa** `radio.gwan.com.br` → Frontend React (Portal público servido por Nginx/Node)
2. **Frontend carrega** → Busca informações "now playing" de `cast.gwan.com.br/api/nowplaying`
3. **Usuário clica em play** → Conecta ao stream em `stream.gwan.com.br/listen/gwan_radio/stream` (sem porta no URL, via Traefik)
4. **Administrador acessa** `cast.gwan.com.br` → Painel AzuraCast para gerenciar conteúdo

### URLs de Produção

- **Frontend (Portal Público)**: `https://radio.gwan.com.br` - Portal React servido por Nginx/Node
- **AzuraCast (Painel Admin + API)**: `https://cast.gwan.com.br` - Painel administrativo e API REST
- **Stream de Áudio**: `https://stream.gwan.com.br/listen/gwan_radio/stream` - Stream via Traefik roteando para porta 8000 (sem porta no URL, com SSL)
- **API Now Playing**: `https://cast.gwan.com.br/api/nowplaying/gwan_radio`

## 📁 Estrutura do Repositório

```
gwan-radio/
├── azuracast/                    # Backend da rádio (AzuraCast)
│   ├── docker-compose.yml        # Configuração base (desenvolvimento local)
│   ├── docker-compose.prod.yml   # Override para produção (com Traefik)
│   ├── docker-compose.install.yml # Stack temporário para instalação inicial
│   ├── .env                       # Variáveis de ambiente básicas
│   ├── .env.prod                 # Variáveis de ambiente para produção
│   ├── azuracast.env             # Variáveis de ambiente do AzuraCast
│   ├── custom/                   # Customizações CSS/JS do AzuraCast
│   │   ├── custom.css
│   │   ├── custom.js
│   │   └── README.md
│   ├── INSTALACAO_PRODUCAO.md    # Guia detalhado de instalação em produção
│   ├── SOLUCAO_ERRO_MARIADB.md   # Guia de solução de problemas do MariaDB
│   └── CRIAR_VOLUMES_PORTAINER.md # Guia para criar volumes no Portainer
│
├── gwan-radio-frontend/          # Frontend do portal
│   ├── src/                      # Código fonte
│   │   ├── presentation/         # Camada de apresentação
│   │   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── components/      # Componentes específicos
│   │   │   └── contexts/       # Contextos React (RadioContext)
│   │   ├── domain/              # Camada de domínio
│   │   ├── application/         # Camada de aplicação
│   │   ├── infrastructure/      # Camada de infraestrutura
│   │   └── shared/              # Código compartilhado
│   ├── docker-compose.yml       # Configuração Docker para produção
│   ├── docker-compose-production.yml # Configuração alternativa
│   ├── .env.example             # Exemplo de variáveis de ambiente
│   ├── package.json             # Dependências Node.js
│   └── README.md                # Documentação específica do frontend
│
└── README.md                     # Este arquivo
```

## 🔧 Pré-requisitos

### Desenvolvimento Local

- **Docker** + Docker Compose Plugin
- **Node.js** 18+ (para desenvolvimento do frontend)
- **npm** ou **yarn**
- Portas disponíveis:
  - `80`, `443` (HTTP/HTTPS)
  - `2022` (SFTP)
  - `8000-8099` (Streams)
  - `5173` (Vite dev server - frontend)

### Produção

- **Docker** + Docker Compose Plugin
- **Traefik** rodando como reverse proxy
- **Network Docker** `gwan` criada: `docker network create gwan`
- **DNS configurado**:
  - `cast.gwan.com.br` → IP da VPS (AzuraCast)
  - `radio.gwan.com.br` → IP da VPS (Frontend)
- **Firewall** liberando portas `10000-10099` (streams)

## 🚀 Instalação Rápida

### Desenvolvimento Local

#### 1. AzuraCast (Backend)

```bash
# Clone o repositório (se ainda não tiver)
git clone <repository-url>
cd gwan-radio

# Entre no diretório do AzuraCast
cd azuracast

# Primeira instalação (OBRIGATÓRIO na primeira vez)
docker compose run --rm web -- azuracast_install

# Subir os serviços
docker compose up -d

# Verificar logs
docker compose logs -f web
```

**Acesse**: `http://localhost` (criar usuário admin e primeira estação)

#### 2. Frontend

```bash
# Volte para a raiz do projeto
cd ../gwan-radio-frontend

# Instale as dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env e configure:
# VITE_STREAM_URL=http://localhost:8000/listen/gwan_radio/stream
# VITE_NOW_PLAYING_URL=http://localhost/api/nowplaying/gwan_radio

# Inicie o servidor de desenvolvimento
npm run dev
```

**Acesse**: `http://localhost:5173`

### Produção

Veja a seção [Deploy em Produção](#deploy-em-produção) abaixo.

## 🎛️ Projeto AzuraCast (Backend)

### Descrição

Sistema de gerenciamento de rádio online baseado no AzuraCast oficial. Utiliza a imagem monolítica oficial que contém todos os serviços necessários em um único container:

- **AzuraCast** (aplicação web)
- **MariaDB** (banco de dados)
- **Redis** (cache)
- **InfluxDB** (métricas)

### Tecnologias

- Docker & Docker Compose
- AzuraCast (imagem oficial: `ghcr.io/azuracast/azuracast`)
- Traefik (produção)

### Funcionalidades

- Gerenciamento de estações de rádio
- Upload e organização de músicas
- Programação automática (AutoDJ)
- Transmissão de stream (Icecast/Shoutcast)
- API REST para integração
- Painel administrativo completo
- Estatísticas e métricas

### Instalação Detalhada

#### Desenvolvimento Local

```bash
cd azuracast

# 1. Instalação inicial (primeira vez apenas)
docker compose run --rm web -- azuracast_install

# 2. Subir serviços
docker compose up -d

# 3. Verificar status
docker compose ps

# 4. Ver logs
docker compose logs -f web
```

#### Produção

```bash
cd azuracast

# 1. Verificar network do Traefik
docker network create gwan  # Se não existir

# 2. Instalação inicial (primeira vez apenas)
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install

# 3. Subir serviços
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 4. Verificar logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web
```

**Acesse**: `https://cast.gwan.com.br`

### Portas Utilizadas

- **Desenvolvimento**: `80` (HTTP), `443` (HTTPS), `2022` (SFTP), `8000-8099` (Streams)
- **Produção**: `2022` (SFTP), `10000-10099` (Streams externas → `8000-8099` internas)

### Documentação Específica

- [Guia de Instalação em Produção](azuracast/INSTALACAO_PRODUCAO.md)
- [Solução de Erros do MariaDB](azuracast/SOLUCAO_ERRO_MARIADB.md)
- [Criar Volumes no Portainer](azuracast/CRIAR_VOLUMES_PORTAINER.md)
- [Personalização CSS/JS](azuracast/custom/README.md)

## 🎨 Projeto Frontend (Portal Web)

### Descrição

Portal web público da GWAN Reggae Radio desenvolvido em React com TypeScript, seguindo Clean Architecture e princípios SOLID. Inclui player de rádio fixo, sistema de notícias, agenda de eventos e galeria de artistas.

### Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Query** - Gerenciamento de estado servidor
- **React Helmet Async** - SEO e meta tags
- **Zod** - Validação de esquemas
- **React Hook Form** - Formulários

### Funcionalidades

- 🎵 **Player de Rádio Fixo**: Player persistente no rodapé com controle de volume
- 📰 **Notícias**: Sistema de notícias sobre reggae, festivais e cultura
- 📅 **Agenda**: Agenda de eventos com filtros por cidade e mês
- 🎤 **Artistas**: Galeria de artistas brasileiros e internacionais
- 📖 **Sobre**: Página sobre a rádio
- 🔐 **Autenticação**: Sistema de login e registro
- 🤖 **Chatbot**: Sistema de chatbot para interação

### Instalação Detalhada

#### Desenvolvimento Local

```bash
cd gwan-radio-frontend

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Editar .env com URLs locais do AzuraCast
# VITE_STREAM_URL=http://localhost:8000/listen/gwan_radio/stream
# VITE_NOW_PLAYING_URL=http://localhost/api/nowplaying/gwan_radio
# Em produção, use:
# VITE_STREAM_URL=https://stream.gwan.com.br/listen/gwan_radio/stream
# VITE_NOW_PLAYING_URL=https://cast.gwan.com.br/api/nowplaying/gwan_radio
# Em produção, use:
# VITE_STREAM_URL=https://stream.gwan.com.br/listen/gwan_radio/stream
# VITE_NOW_PLAYING_URL=https://cast.gwan.com.br/api/nowplaying/gwan_radio

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

**Acesse**: `http://localhost:5173`

#### Build para Produção

```bash
cd gwan-radio-frontend

# 1. Configurar variáveis de ambiente para produção
# Edite .env ou crie .env.production:
# VITE_STREAM_URL=https://stream.gwan.com.br/listen/gwan_radio/stream
# VITE_NOW_PLAYING_URL=https://cast.gwan.com.br/api/nowplaying/gwan_radio

# 2. Build
npm run build

# 3. Preview da build
npm run preview
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
# URLs do AzuraCast
# Stream de áudio (via Traefik, sem porta no URL)
VITE_STREAM_URL=https://stream.gwan.com.br/listen/gwan_radio/stream

# API do AzuraCast (admin e API REST)
VITE_NOW_PLAYING_URL=https://cast.gwan.com.br/api/nowplaying/gwan_radio

# URL base da API (se houver backend separado)
VITE_API_BASE_URL=http://localhost:3000/api
```

### Estrutura de Arquitetura

O projeto segue **Clean Architecture** adaptada para frontend:

- **Domain**: Entidades e interfaces de repositórios
- **Application**: Casos de uso, DTOs e validadores
- **Infrastructure**: Implementações de repositórios, HTTP client, logging
- **Presentation**: Componentes React, páginas, hooks e contextos

### Documentação Específica

- [README do Frontend](gwan-radio-frontend/README.md)
- [Arquitetura e Padrões](gwan-radio-frontend/.cursorrules)

## 🚀 Deploy em Produção

### Checklist Pré-Deploy

- [ ] Traefik está rodando e configurado
- [ ] Network `gwan` existe: `docker network create gwan`
- [ ] DNS `cast.gwan.com.br` aponta para IP da VPS (AzuraCast admin/API)
- [ ] DNS `radio.gwan.com.br` aponta para IP da VPS (Frontend)
- [ ] DNS `stream.gwan.com.br` aponta para IP da VPS (Stream de áudio)
- [ ] Firewall libera portas `10000-10099` (streams adicionais, se necessário)
- [ ] Portas `80` e `443` estão disponíveis para Traefik

### 1. Deploy do AzuraCast

```bash
cd azuracast

# Verificar network
docker network inspect gwan

# Primeira instalação (se for primeira vez)
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install

# Subir serviços
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Verificar logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web
```

**Acesse**: `https://cast.gwan.com.br` e crie o usuário administrador.

### 2. Deploy do Frontend

#### Opção A: Docker Compose (Recomendado)

```bash
cd gwan-radio-frontend

# Build e deploy
docker compose up -d --build

# Verificar logs
docker compose logs -f frontend
```

#### Opção B: Build Manual + Servidor Web

```bash
cd gwan-radio-frontend

# 1. Configurar .env.production
cp .env.example .env.production
# Edite .env.production com URLs de produção

# 2. Build
npm run build

# 3. Servir arquivos estáticos (dist/) com nginx/apache
# Ou usar Vercel/Netlify apontando para o diretório dist/
```

**Acesse**: `https://radio.gwan.com.br`

### 3. Verificação Pós-Deploy

```bash
# Verificar containers rodando
docker ps | grep -E "azuracast|gwan-radio"

# Verificar network
docker network inspect gwan

# Testar conectividade
curl -I https://cast.gwan.com.br
curl -I https://radio.gwan.com.br
curl -I https://stream.gwan.com.br

# Verificar logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs azuracast
docker compose logs frontend
```

## 🌐 URLs e Endpoints

### URLs de Produção

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | `https://radio.gwan.com.br` | Portal público da rádio (React + Vite servido por Nginx/Node) |
| AzuraCast Admin | `https://cast.gwan.com.br` | Painel administrativo e API REST |
| Stream | `https://stream.gwan.com.br/listen/gwan_radio/stream` | Stream de áudio via Traefik (sem porta no URL) |

### APIs do AzuraCast

| Endpoint | Descrição |
|----------|-----------|
| `/api/nowplaying/{station}` | Informações da música tocando agora |
| `/api/stations` | Lista de estações |
| `/api/station/{id}` | Detalhes de uma estação |

### Exemplo de Uso da API

```bash
# Buscar música tocando agora
curl https://cast.gwan.com.br/api/nowplaying/gwan_radio

# Resposta esperada:
# {
#   "now_playing": {
#     "song": {
#       "title": "Nome da Música",
#       "artist": "Nome do Artista",
#       "art": "URL da capa do álbum"
#     }
#   },
#   "listeners": {
#     "current": 42
#   }
# }
```

## 🔍 Troubleshooting

### Problemas Comuns

#### AzuraCast não inicia

**Erro**: `Table 'mysql.db' doesn't exist`

**Solução**: Execute o comando de instalação inicial:
```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install
```

Veja mais detalhes em: [SOLUCAO_ERRO_MARIADB.md](azuracast/SOLUCAO_ERRO_MARIADB.md)

#### Frontend não conecta ao stream

**Verificar**:
1. Variáveis de ambiente estão corretas no `.env`
2. AzuraCast está rodando e acessível
3. Stream está configurado no AzuraCast
4. Portas de stream estão abertas no firewall

#### Traefik não roteia corretamente

**Verificar**:
1. Network `gwan` existe: `docker network create gwan`
2. Containers estão na network: `docker network inspect gwan`
3. Labels do Traefik estão corretas nos docker-compose
4. DNS está apontando para o IP correto

#### Player não mostra "now playing"

**Verificar**:
1. URL da API está correta: `VITE_NOW_PLAYING_URL`
2. CORS está habilitado no AzuraCast (se necessário)
3. Console do navegador para erros de CORS/network

### Comandos Úteis

```bash
# Ver logs do AzuraCast
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web

# Ver logs do Frontend
cd gwan-radio-frontend
docker compose logs -f frontend

# Reiniciar serviços
docker compose restart

# Verificar status
docker compose ps

# Limpar volumes (CUIDADO: apaga dados!)
docker compose down -v
```

### Documentação de Troubleshooting

- [Instalação em Produção](azuracast/INSTALACAO_PRODUCAO.md) - Guia completo
- [Solução de Erros MariaDB](azuracast/SOLUCAO_ERRO_MARIADB.md) - Problemas comuns do banco
- [Criar Volumes no Portainer](azuracast/CRIAR_VOLUMES_PORTAINER.md) - Se usar Portainer

## 📚 Documentação Adicional

### Documentação do AzuraCast

- [Guia de Instalação em Produção](azuracast/INSTALACAO_PRODUCAO.md)
- [Solução de Erros do MariaDB](azuracast/SOLUCAO_ERRO_MARIADB.md)
- [Criar Volumes no Portainer](azuracast/CRIAR_VOLUMES_PORTAINER.md)
- [Personalização CSS/JS](azuracast/custom/README.md)

### Documentação do Frontend

- [README do Frontend](gwan-radio-frontend/README.md) - Documentação completa
- [Arquitetura e Padrões](gwan-radio-frontend/.cursorrules) - Padrões de código

### Documentação Externa

- [AzuraCast Official Docs](https://www.azuracast.com/docs/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 🔄 Manutenção

### Atualizar AzuraCast

```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Atualizar Frontend

```bash
cd gwan-radio-frontend
git pull
npm install
npm run build
# Reiniciar container ou servidor web
```

### Backup

Os backups do AzuraCast são salvos automaticamente no volume `azuracast_backups`. Para backup manual:

```bash
cd azuracast
docker compose exec web azuracast_cli azuracast:backup
```

### Logs

```bash
# Logs do AzuraCast
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web

# Logs do Frontend
cd gwan-radio-frontend
docker compose logs -f frontend
```

## 📝 Notas Importantes

- **Imagem Monolítica**: O AzuraCast usa imagem oficial monolítica - todos os serviços (MariaDB, Redis, InfluxDB) estão no mesmo container
- **Primeira Instalação**: O comando `azuracast_install` é **OBRIGATÓRIO** na primeira vez
- **Portas de Stream**: Em produção, portas externas `10000-10099` são mapeadas para portas internas `8000-8099`
- **Traefik**: Em produção, o Traefik acessa os containers via network Docker, não via portas expostas
- **Volumes**: Dados são persistidos em volumes Docker nomeados - não são perdidos ao recriar containers

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário da GWAN.

---

**Desenvolvido com ❤️ para a comunidade reggae brasileira**

Para mais informações, consulte a documentação específica de cada projeto:
- [AzuraCast](azuracast/INSTALACAO_PRODUCAO.md)
- [Frontend](gwan-radio-frontend/README.md)
