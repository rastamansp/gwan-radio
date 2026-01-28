# Como Criar Volumes no Portainer

## ⚠️ Problema

O volume `azuracast_db_data` não existe porque os volumes são criados automaticamente quando você faz o deploy do stack. Se o stack não foi deployado corretamente ou foi removido, os volumes não existem.

## ✅ Solução: Criar Volumes Manualmente

### Opção 1: Criar Volumes Individualmente no Portainer

1. No Portainer, vá em **Volumes**
2. Clique em **+ Add volume**
3. Crie cada volume com os seguintes nomes:

**Volumes necessários:**
- `azuracast_db_data` (mais importante - banco de dados)
- `azuracast_station_data`
- `azuracast_backups`
- `azuracast_www_uploads`
- `azuracast_shoutcast2_install`
- `azuracast_stereo_tool_install`
- `azuracast_rsas_install`
- `azuracast_geolite_install`
- `azuracast_sftpgo_data`
- `azuracast_acme`

**Para cada volume:**
- **Name**: Use o nome exato acima (ex: `azuracast_db_data`)
- **Driver**: `local` (padrão)
- Clique em **Create the volume**

### Opção 2: Deployar Stack para Criar Volumes Automaticamente

Os volumes são criados automaticamente quando você faz o deploy do stack. Siga estes passos:

1. **Certifique-se de que o stack está configurado corretamente:**
   - Vá em **Stacks** → `gwan-radio`
   - Verifique se os arquivos `docker-compose.yml` e `docker-compose.prod.yml` estão corretos
   - Os volumes devem estar definidos na seção `volumes:` do docker-compose.yml

2. **Deployar o stack:**
   - Se o stack não existe, crie um novo:
     - Vá em **Stacks** → **Add stack**
     - **Name**: `gwan-radio`
     - Use **Repository** ou **Web editor**
     - Configure os arquivos docker-compose
   - Clique em **Deploy the stack**

3. **Verificar se os volumes foram criados:**
   - Vá em **Volumes**
   - Procure por volumes começando com `azuracast_` ou `gwan-radio_`
   - O Docker Compose pode prefixar com o nome do stack

### Opção 3: Criar Volumes via SSH (Mais Rápido)

Se você tem acesso SSH, execute:

```bash
# Criar todos os volumes necessários
docker volume create azuracast_db_data
docker volume create azuracast_station_data
docker volume create azuracast_backups
docker volume create azuracast_www_uploads
docker volume create azuracast_shoutcast2_install
docker volume create azuracast_stereo_tool_install
docker volume create azuracast_rsas_install
docker volume create azuracast_geolite_install
docker volume create azuracast_sftpgo_data
docker volume create azuracast_acme

# Verificar se foram criados
docker volume ls | grep azuracast
```

## 🔍 Verificar Nome Real dos Volumes

O Docker Compose pode prefixar os volumes com o nome do projeto/stack. Verifique:

1. **No Portainer:**
   - Vá em **Volumes**
   - Procure por volumes que podem ter nomes diferentes:
     - `gwan-radio_db_data` (se o stack se chama `gwan-radio`)
     - `azuracast_db_data` (se o projeto se chama `azuracast`)

2. **Via SSH:**
   ```bash
   # Listar todos os volumes
   docker volume ls
   
   # Filtrar volumes do AzuraCast
   docker volume ls | grep -E "azuracast|gwan-radio"
   ```

## 📝 Nota sobre Nomenclatura

No Docker Compose, volumes são nomeados como:
- `<project_name>_<volume_name>`

Onde:
- `project_name` = nome do stack/projeto (definido em `name:` no docker-compose.yml)
- `volume_name` = nome definido na seção `volumes:`

No nosso caso:
- Se o stack se chama `gwan-radio` → volumes serão `gwan-radio_db_data`
- Se o projeto se chama `azuracast` → volumes serão `azuracast_db_data`

## ✅ Após Criar os Volumes

1. **Execute a instalação inicial:**
   - Use o arquivo `docker-compose.install.yml` no Portainer
   - Ou execute via SSH: `docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install`

2. **Deployar o stack principal:**
   - Vá em **Stacks** → `gwan-radio`
   - Clique em **Deploy** ou **Update**

3. **Verificar logs:**
   - Vá em **Containers** → `gwan-radio-web-1` → **Logs**
   - Deve aparecer: `Services started up and ready!`
