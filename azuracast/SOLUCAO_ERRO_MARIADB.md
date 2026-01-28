# Solução: Erro "Table 'mysql.db' doesn't exist" no Portainer

## ⚠️ Problema

Você está vendo este erro nos logs:
```
ERROR: Can't open and lock privilege tables: Table 'mysql.db' doesn't exist
ERROR: Fatal error: Can't open and lock privilege tables
```

Isso significa que o volume do banco de dados está **corrompido** ou **não foi inicializado corretamente**.

## ✅ Solução Passo a Passo (Portainer)

### Passo 1: Parar o Stack

1. No Portainer, vá em **Stacks**
2. Encontre `gwan-radio`
3. Clique em **Stop** (ou no ícone de stop)

### Passo 2: Remover Volume Corrompido

1. Vá em **Volumes**
2. Procure por `azuracast_db_data`
3. Clique no volume
4. Clique em **Remove**
5. Confirme a remoção

⚠️ **Atenção:** Isso apagará todos os dados do banco. Se você já tinha dados importantes, faça backup primeiro.

### Passo 3: Executar Instalação Inicial

**IMPORTANTE:** Este passo é **OBRIGATÓRIO** na primeira vez!

#### Opção A: Via Portainer (Mais Visual)

1. Vá em **Containers**
2. Clique em **Add container**
3. Configure:

   **Basic Settings:**
   - **Name**: `azuracast-install-temp`
   - **Image**: `ghcr.io/azuracast/azuracast:latest`
   - **Command**: `azuracast_install`

   **Volumes:**
   - Clique em **map additional volume**
   - Adicione os volumes do stack:
     - `azuracast_db_data` → `/var/lib/mysql`
     - `azuracast_station_data` → `/var/azuracast/stations`
     - `azuracast_backups` → `/var/azuracast/backups`
     - `azuracast_www_uploads` → `/var/azuracast/storage/uploads`
     - `azuracast_shoutcast2_install` → `/var/azuracast/storage/shoutcast2`
     - `azuracast_stereo_tool_install` → `/var/azuracast/storage/stereo_tool`
     - `azuracast_rsas_install` → `/var/azuracast/storage/rsas`
     - `azuracast_geolite_install` → `/var/azuracast/storage/geoip`
     - `azuracast_sftpgo_data` → `/var/azuracast/storage/sftpgo`
     - `azuracast_acme` → `/var/azuracast/storage/acme`

   **Networks:**
   - Clique em **connect additional network**
   - Selecione `azuracast_internal` (ou crie se não existir)

   **Environment:**
   - Clique em **add environment variable**
   - Adicione:
     - `APPLICATION_ENV` = `production`
     - `TZ` = `America/Sao_Paulo`
     - `MARIADB_RANDOM_ROOT_PASSWORD` = `yes`
     - `AUTO_ASSIGN_PORT_MIN` = `8000`
     - `AUTO_ASSIGN_PORT_MAX` = `8099`

4. Clique em **Deploy the container**
5. Aguarde 2-5 minutos
6. Vá em **Containers** → `azuracast-install-temp` → **Logs**
7. Procure por mensagens de sucesso como:
   - `Database initialized`
   - `Installation complete`
8. **Remova o container temporário** após a instalação:
   - Vá em **Containers** → `azuracast-install-temp`
   - Clique em **Remove**

#### Opção B: Via SSH (Mais Rápido)

Se você tem acesso SSH, execute:

```bash
cd azuracast

# Parar containers
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Remover volume corrompido
docker volume rm azuracast_db_data

# Executar instalação inicial
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install

# Aguardar conclusão (2-5 minutos)
# Você verá mensagens de progresso
```

### Passo 4: Subir o Stack Novamente

1. No Portainer, vá em **Stacks** → `gwan-radio`
2. Clique em **Start** (ou **Update the stack**)
3. Aguarde 2-3 minutos para inicialização

### Passo 5: Verificar Logs

1. Vá em **Containers** → `gwan-radio-web-1`
2. Clique em **Logs**
3. Procure por:
   - ✅ `Services started up and ready!`
   - ✅ `startup entered RUNNING state`
   - ✅ Sem erros de `Table 'mysql.db' doesn't exist`
   - ❌ Se ainda aparecer o erro, repita os passos acima

## 🔍 Verificar se Funcionou

### Teste 1: Verificar se MariaDB está rodando

Via Portainer Console:
1. Vá em **Containers** → `gwan-radio-web-1`
2. Clique em **Console**
3. Execute: `service mariadb status`
4. Deve mostrar: `mariadb.service is running`

### Teste 2: Verificar se o banco foi criado

Via Portainer Console:
1. Vá em **Containers** → `gwan-radio-web-1`
2. Clique em **Console**
3. Execute: `mysql -u azuracast -p -e "SHOW DATABASES;"`
4. Deve mostrar o banco `azuracast` na lista

### Teste 3: Acessar o site

1. Acesse `https://radio.gwan.com.br`
2. Deve aparecer a tela de criação do usuário administrador

## ⚠️ Avisos Importantes

1. **Nunca pule o passo 3** (`azuracast_install`) - ele é essencial!
2. **Aguarde a conclusão** - pode levar 2-5 minutos
3. **Não suba os containers** antes de executar `azuracast_install`
4. **Remova o container temporário** após a instalação

## 🐛 Se o Problema Persistir

1. Verifique espaço em disco: `df -h` (via SSH)
2. Verifique logs completos do container
3. Tente remover TODOS os volumes e recomeçar:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
   ```
4. Execute `azuracast_install` novamente

## 📝 Notas

- O warning sobre `io_uring` é **normal** e não afeta o funcionamento
- O MariaDB usa `libaio` como fallback, o que é perfeitamente funcional
- O importante é que não apareça mais o erro `Table 'mysql.db' doesn't exist`
