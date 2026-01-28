# GWAN Radio (AzuraCast + Traefik)

Projeto de webradio usando AzuraCast oficial (imagem monolítica) com suporte para desenvolvimento local e produção com Traefik.

## Estrutura do Projeto

```
gwan-radio/
  azuracast/
    docker-compose.yml          # Configuração base (desenvolvimento local)
    docker-compose.prod.yml     # Override para produção (com Traefik)
    .env                        # Variáveis de ambiente básicas
    azuracast.env              # Variáveis de ambiente do AzuraCast
  README.md
```

## Sobre a Imagem Oficial

Este projeto usa a **imagem oficial do AzuraCast** (`ghcr.io/azuracast/azuracast`), que é uma imagem monolítica contendo:
- AzuraCast (aplicação web)
- MariaDB (banco de dados)
- Redis (cache)
- InfluxDB (métricas)
- Todos os serviços necessários em um único container

Isso simplifica a configuração e evita problemas de conectividade entre serviços.

## Pré-requisitos

### Desenvolvimento Local
- Docker + Docker Compose Plugin
- Portas 80, 443, 2022 (SFTP), 8000-8099 disponíveis

### Produção
- Docker + Docker Compose Plugin
- Traefik rodando e com network externa `gwan` criada
- DNS: `radio.gwan.com.br` apontando para o IP da VPS
- Firewall: Portas 10000-10099 liberadas para streams (mapeadas externamente)

## Desenvolvimento Local

### Primeira Instalação

**IMPORTANTE:** Na primeira vez, você precisa executar o comando de instalação antes de subir os containers:

```bash
cd azuracast

# 1. Executar instalação inicial (cria o banco de dados e configura tudo)
docker compose run --rm web -- azuracast_install

# 2. Subir os containers
docker compose up -d
```

O comando `azuracast_install` irá:
- Inicializar o banco de dados MariaDB
- Criar todas as tabelas necessárias
- Configurar o sistema
- Preparar o ambiente para uso

**Atenção:** Este comando pode levar alguns minutos na primeira execução.

### Subir os serviços (após instalação inicial)

Após a primeira instalação, você pode simplesmente usar:

```bash
cd azuracast
docker compose up -d
```

### Acessar

- Interface web: `http://localhost` ou `http://localhost:80`
- Streams: Portas 8000-8099

### Ver logs

```bash
docker compose logs -f --tail=200 azuracast
```

Ou usando o nome do container:

```bash
docker compose logs -f --tail=200 web
```

### Parar os serviços

```bash
docker compose down
```

## Produção (VPS Hostinger KVM4)

### 1. Preparação

Certifique-se de que:
- Traefik está rodando
- Network `gwan` existe: `docker network create gwan` (se necessário)
- DNS `radio.gwan.com.br` aponta para o IP da VPS
- Firewall libera portas 10000-10099 (portas externas para streams)

### 2. Configurar variáveis de ambiente

**IMPORTANTE:** Para evitar conflito de portas com o Traefik, você precisa usar portas alternativas.

**Opção 1 (Recomendada):** Copie o arquivo `.env.prod` para `.env`:
```bash
cd azuracast
cp .env.prod .env
```

**Opção 2:** Edite `azuracast/.env` manualmente e ajuste as portas:
```env
AZURACAST_HTTP_PORT=10080
AZURACAST_HTTPS_PORT=10443
```

**Nota:** O arquivo `docker-compose.prod.yml` não expõe portas HTTP/HTTPS (apenas SFTP e streams). O Traefik acessa o container diretamente via network Docker na porta 80 interna, então não há necessidade de expor essas portas externamente. Isso evita conflitos de portas.

### 3. Primeira Instalação (se for a primeira vez)

**IMPORTANTE:** Na primeira vez em produção, você DEVE executar o comando de instalação ANTES de subir os containers:

```bash
cd azuracast

# 1. Executar instalação inicial (cria o banco de dados e configura tudo)
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install

# 2. Subir os serviços
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Atenção:** O comando `azuracast_install` pode levar alguns minutos na primeira execução. Ele irá:
- Inicializar o banco de dados MariaDB
- Criar todas as tabelas necessárias
- Configurar o sistema
- Preparar o ambiente para uso

### 4. Subir os serviços (após instalação inicial)

```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 5. Acessar

- Interface web: `https://radio.gwan.com.br` (via Traefik)
- HTTP será automaticamente redirecionado para HTTPS
- Streams: Portas externas 10000-10099 (mapeadas para portas internas 8000-8099)

### 5. Ver logs

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f --tail=200 azuracast
```

Ou usando o nome do container:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f --tail=200 web
```

### 7. Parar os serviços

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## Primeiro Acesso

### Desenvolvimento Local

1. Acesse `http://localhost`
2. Crie o usuário administrador
3. Crie a primeira estação de rádio

### Produção

1. Acesse `https://radio.gwan.com.br`
2. Crie o usuário administrador
3. Crie a primeira estação de rádio
4. Em **Admin → Settings**, verifique a **Base URL** (deve ser `https://radio.gwan.com.br`)

## Configuração de Firewall

### UFW (Ubuntu/Debian)

```bash
# Liberar portas para streams (portas externas em produção)
sudo ufw allow 10000:10099/tcp

# Verificar status
sudo ufw status
```

### Hostinger Firewall

Se houver firewall no painel da Hostinger, também libere a faixa de portas 10000-10099 (portas externas para streams).

## Portas Utilizadas

### Desenvolvimento Local
- **80**: HTTP (interface web)
- **443**: HTTPS (interface web)
- **2022**: SFTP (transferência de arquivos)
- **10000-10099**: Streams de rádio (portas externas, mapeadas para 8000-8099 internas)

### Produção
- **80/443**: HTTP/HTTPS interno (não exposto externamente - Traefik acessa via network Docker)
- **2022**: SFTP (transferência de arquivos)
- **10000-10099**: Streams de rádio (portas externas, acessíveis diretamente pelo IP da VPS)

## Troubleshooting

### Erro: "Table 'mysql.db' doesn't exist" ou "Can't open and lock privilege tables"

Se você receber erros como:
```
ERROR: Can't open and lock privilege tables: Table 'mysql.db' doesn't exist
ERROR: Fatal error: Can't open and lock privilege tables
ERROR: Could not open mysql.plugin table: "Table 'mysql.plugin' doesn't exist"
```

Isso indica que o volume do banco de dados está corrompido ou não foi inicializado corretamente.

**Solução para Desenvolvimento Local:**

1. **Parar todos os containers:**
   ```bash
   cd azuracast
   docker compose down
   ```

2. **Remover o volume do banco de dados:**
   ```bash
   docker volume rm azuracast_db_data
   ```
   
   Ou, se preferir remover todos os volumes (cuidado: apaga todos os dados!):
   ```bash
   docker compose down -v
   ```

3. **Executar instalação inicial:**
   ```bash
   docker compose run --rm web -- azuracast_install
   ```

4. **Subir os containers:**
   ```bash
   docker compose up -d
   ```

5. **Aguardar a inicialização completa (pode levar 2-5 minutos):**
   ```bash
   docker compose logs -f web
   ```

**Solução para Produção:**

1. **Parar todos os containers:**
   ```bash
   cd azuracast
   docker compose -f docker-compose.yml -f docker-compose.prod.yml down
   ```

2. **Remover o volume do banco de dados:**
   ```bash
   docker volume rm azuracast_db_data
   ```
   
   Ou, se preferir remover todos os volumes (cuidado: apaga todos os dados!):
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
   ```

3. **Executar instalação inicial:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install
   ```

4. **Subir os containers:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

5. **Aguardar a inicialização completa (pode levar 2-5 minutos):**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web
   ```

**Nota:** O comando `azuracast_install` é ESSENCIAL na primeira vez. Ele:
- Inicializa o MariaDB e cria as tabelas do sistema
- Cria o banco de dados `azuracast`
- Executa as migrations
- Configura o sistema

Se o problema persistir após 5 minutos, verifique:
- Espaço em disco suficiente: `df -h`
- Logs completos: `docker compose logs web` (ou com `-f` para produção)
- Permissões do volume Docker

### Erro: "Table 'azuracast.settings' doesn't exist"

Se você receber o erro:
```
SQLSTATE[42S02]: Base table or view not found: 1146 Table 'azuracast.settings' doesn't exist
```

Isso indica que o AzuraCast está tentando executar o setup antes do banco estar completamente pronto.

**Solução:** Siga os mesmos passos acima para limpar e recriar os volumes.

### Erro de network no Traefik

Se receber erro sobre network `gwan` não encontrada:

```bash
docker network create gwan
```

### Verificar se os serviços estão rodando

```bash
docker compose ps
```

### Reiniciar o container

```bash
docker compose restart azuracast
```

Ou usando o nome do serviço:

```bash
docker compose restart web
```

### Limpar volumes (cuidado: apaga dados!)

```bash
docker compose down -v
```

## Comandos Úteis

### Backup

Os backups são salvos automaticamente em `azuracast_backups` volume. Para fazer backup manual:

```bash
docker compose exec azuracast azuracast_cli azuracast:backup
```

### Atualizar AzuraCast

```bash
docker compose pull
docker compose up -d
```

### Verificar versão

```bash
docker compose exec azuracast php azuracast.php version
```

## Notas Importantes

- **Imagem Oficial**: Usa a imagem oficial monolítica do AzuraCast (`ghcr.io/azuracast/azuracast`)
- **Desenvolvimento**: Usa portas padrão (80/443) diretamente, sem Traefik
- **Produção**: Não expõe portas HTTP/HTTPS (Traefik acessa via network Docker) e Traefik como reverse proxy
- **Streams**: 
  - **Desenvolvimento**: Portas 8000-8099 (internas e externas)
  - **Produção**: Portas externas 10000-10099 mapeadas para portas internas 8000-8099
- **Volumes**: Dados são persistidos em volumes Docker nomeados
- **Serviços Internos**: MariaDB, Redis e InfluxDB estão todos dentro do mesmo container, evitando problemas de conectividade
