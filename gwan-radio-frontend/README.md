# GWAN Radio Frontend

Plataforma web da GWAN Reggae Radio - sua rádio de reggae 24 horas. Ouça o melhor do reggae, dancehall, roots e dub direto do Brasil.

## 🎵 Sobre o Projeto

A GWAN Reggae Radio é uma rádio online brasileira dedicada a difundir o melhor do reggae, dancehall, dub e sound system 24 horas por dia, 7 dias por semana. O projeto frontend foi desenvolvido seguindo os princípios de Clean Architecture, SOLID e melhores práticas de desenvolvimento.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Query** - Gerenciamento de estado servidor
- **React Helmet Async** - SEO e meta tags
- **Zod** - Validação de esquemas
- **React Hook Form** - Formulários

## 📁 Estrutura do Projeto

O projeto segue Clean Architecture adaptada para frontend:

```
src/
├── domain/                      # Camada de Domínio
│   ├── entities/               # Entidades de negócio
│   ├── repositories/           # Interfaces dos repositórios
│   └── errors/                 # Erros de domínio
├── application/                # Camada de Aplicação
│   ├── use-cases/             # Casos de uso
│   ├── dto/                   # Data Transfer Objects
│   └── validators/            # Validadores Zod
├── infrastructure/             # Camada de Infraestrutura
│   ├── repositories/          # Implementações dos repositórios
│   ├── logging/               # Sistema de logging
│   └── http/                  # Cliente HTTP
├── presentation/              # Camada de Apresentação
│   ├── hooks/                # Custom hooks
│   ├── components/           # Componentes específicos de páginas
│   │   ├── RadioPlayer.tsx   # Player de rádio fixo
│   │   └── NowPlayingWidget.tsx # Widget de música atual
│   ├── pages/                # Páginas da aplicação
│   │   ├── Home.tsx          # Página inicial
│   │   ├── Noticias.tsx      # Lista de notícias
│   │   ├── NoticiaDetalhe.tsx # Detalhe da notícia
│   │   ├── Agenda.tsx        # Agenda de eventos
│   │   ├── Artistas.tsx      # Lista de artistas
│   │   ├── ArtistaDetalhe.tsx # Detalhe do artista
│   │   ├── Sobre.tsx         # Sobre a rádio
│   │   └── TestChatbot.tsx   # Página de teste do chatbot
│   └── contexts/             # Contextos React
│       └── RadioContext.tsx  # Contexto do player de rádio
├── components/               # Componentes globais
│   ├── Navbar.tsx           # Navegação principal
│   ├── Footer.tsx            # Rodapé
│   └── ui/                   # Componentes shadcn/ui
├── contexts/                 # Contextos globais
│   └── AuthContext.tsx       # Contexto de autenticação
├── shared/                   # Código compartilhado
│   ├── data/                # Dados JSON (notícias, eventos, artistas)
│   ├── constants/           # Constantes
│   ├── di/                  # DI Container
│   └── utils/               # Utilitários
├── App.tsx                  # Componente principal
└── main.tsx                 # Arquivo de entrada
```

## 🎨 Design System

O projeto utiliza um tema dark com cores reggae (verde, amarelo, vermelho):

- **Primary**: Verde reggae (`hsl(145 63% 42%)`)
- **Secondary**: Amarelo reggae (`hsl(51 100% 50%)`)
- **Accent**: Vermelho reggae (`hsl(348 83% 47%)`)

## 🎵 Funcionalidades

- **Player de Rádio**: Player fixo no rodapé com controle de volume e informações da música atual
- **Now Playing**: Exibição da música tocando agora com informações do AzuraCast
- **Notícias**: Sistema de notícias sobre reggae, festivais e cultura
- **Agenda**: Agenda de eventos com filtros por cidade e mês
- **Artistas**: Galeria de artistas brasileiros e internacionais
- **Chatbot**: Sistema de chatbot para interação com usuários
- **Autenticação**: Sistema de login e registro (mantido da arquitetura original)

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 18+ (recomendado usar [nvm](https://github.com/nvm-sh/nvm))
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre no diretório
cd gwan-radio-frontend

# Instale as dependências
npm install

# Copie o arquivo .env.example para .env
cp .env.example .env

# Configure as variáveis de ambiente (veja seção abaixo)
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL do stream de áudio do AzuraCast
# Stream via Traefik em stream.gwan.com.br (sem porta no URL)
VITE_STREAM_URL=https://stream.gwan.com.br/listen/gwan_radio/stream

# URL da API do AzuraCast para buscar "now playing"
# API do AzuraCast em cast.gwan.com.br
VITE_NOW_PLAYING_URL=https://cast.gwan.com.br/api/nowplaying/gwan_radio

# URL base da API (se houver backend)
VITE_API_BASE_URL=http://localhost:3000/api
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173` (ou outra porta se 5173 estiver ocupada).

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run build:dev` - Gera build de desenvolvimento
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## 🎯 Rotas da Aplicação

- `/` - Página inicial com hero, notícias em destaque, eventos e artista da semana
- `/noticias` - Lista de todas as notícias
- `/noticias/:slug` - Detalhe de uma notícia
- `/agenda` - Agenda de eventos com filtros
- `/artistas` - Lista de artistas
- `/artistas/:slug` - Perfil detalhado do artista
- `/sobre` - Sobre a GWAN Reggae Radio
- `/testar-chatbot` - Página de teste do chatbot
- `/login` - Página de login (autenticação)

## 🎨 Componentes Principais

### RadioPlayer

Player de rádio fixo no rodapé da aplicação. Permite:
- Play/Pause do stream
- Controle de volume
- Visualização expandida com mais informações
- Indicador "AO VIVO"

### NowPlayingWidget

Widget que exibe a música tocando agora, com:
- Capa do álbum (ou placeholder)
- Nome da música e artista
- Número de ouvintes (opcional)
- Indicador "LIVE"

### RadioContext

Contexto React que gerencia o estado do player:
- Estado de reprodução
- Volume
- Informações da música atual
- Integração com API do AzuraCast

## 📚 Documentação Adicional

- **[.cursorrules](.cursorrules)** - Regras e padrões de código do projeto
- **[Arquitetura Clean Architecture](docs/architecture.md)** - Documentação detalhada da arquitetura (se existir)

## 🚀 Deploy

O projeto pode ser deployado em qualquer plataforma que suporte aplicações React/Vite:

- **Vercel**: Conecte o repositório e configure as variáveis de ambiente
- **Netlify**: Conecte o repositório e configure as variáveis de ambiente
- **GitHub Pages**: Use `npm run build` e configure o GitHub Actions
- **Docker**: Use Dockerfile para containerização

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
