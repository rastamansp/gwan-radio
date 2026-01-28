# Guia de Instalação em Produção (Portainer)

## ⚠️ IMPORTANTE: Imagem Monolítica

A imagem oficial do AzuraCast (`ghcr.io/azuracast/azuracast`) é **monolítica**, o que significa:
- ✅ MariaDB está **dentro** do mesmo container `gwan-radio-web-1`
- ✅ Redis está **dentro** do mesmo container
- ✅ InfluxDB está **dentro** do mesmo container
- ❌ **NÃO** aparecerá um container separado de MariaDB no Portainer

Isso é **normal e esperado**!

## Passo a Passo para Instalação Inicial

### 1. Parar o Container Atual

No Portainer:
1. Vá em **Containers**
2. Encontre `gwan-radio-web-1`
3. Clique em **Stop**

Ou via terminal SSH:
```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### 2. Remover Volume do Banco de Dados (se necessário)

Se você já tentou iniciar antes e teve erros, remova o volume corrompido:

Via terminal SSH:
```bash
docker volume rm azuracast_db_data
```

Ou remova todos os volumes (cuidado: apaga dados!):
```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

### 3. Executar Instalação Inicial

**Este passo é OBRIGATÓRIO na primeira vez!**

Via terminal SSH (recomendado):
```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm web -- azuracast_install
```

**Via Portainer (alternativa):**

1. Vá em **Stacks** → `gwan-radio`
2. Clique em **Editor**
3. Certifique-se de que os arquivos `docker-compose.yml` e `docker-compose.prod.yml` estão corretos
4. Salve e vá para **Containers**
5. Clique em **Add container**
6. Configure:
   - **Name**: `azuracast-install` (temporário)
   - **Image**: `ghcr.io/azuracast/azuracast:latest`
   - **Command**: `azuracast_install`
   - **Volumes**: Adicione os mesmos volumes do stack
   - **Networks**: Adicione `azuracast_internal`
   - **Env**: Adicione as variáveis de `azuracast.env` e `.env`
7. Clique em **Deploy the container**
8. Aguarde a conclusão (pode levar 2-5 minutos)
9. Verifique os logs para confirmar sucesso
10. Remova o container temporário após a instalação

### 4. Subir os Containers

Via terminal SSH:
```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Via Portainer:
1. Vá em **Stacks** → `gwan-radio`
2. Clique em **Editor**
3. Verifique os arquivos
4. Clique em **Update the stack**

### 5. Verificar Logs

Via terminal SSH:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web
```

Via Portainer:
1. Vá em **Containers** → `gwan-radio-web-1`
2. Clique em **Logs**
3. Procure por mensagens como:
   - `MariaDB started successfully`
   - `Database initialized`
   - `AzuraCast setup complete`

### 6. Verificar se MariaDB Está Rodando Dentro do Container

Via terminal SSH:
```bash
# Entrar no container
docker exec -it gwan-radio-web-1 bash

# Dentro do container, verificar processos
ps aux | grep mariadb

# Ou verificar se o serviço está rodando
service mariadb status

# Ou tentar conectar ao banco
mysql -u azuracast -p
# (a senha está em azuracast.env após a instalação)

# Sair do container
exit
```

Via Portainer:
1. Vá em **Containers** → `gwan-radio-web-1`
2. Clique em **Console**
3. Execute: `ps aux | grep mariadb`
4. Deve mostrar processos do MariaDB rodando

## Verificar se o Banco Foi Criado

Via terminal SSH:
```bash
docker exec -it gwan-radio-web-1 mysql -u azuracast -p -e "SHOW DATABASES;"
```

Você deve ver o banco `azuracast` na lista.

## Acessar a Interface Web

Após a instalação completa:
1. Acesse `https://radio.gwan.com.br`
2. Você deve ver a tela de criação do usuário administrador
3. Se não aparecer, verifique os logs para erros

## Como Testar se Está Funcionando

### 1. Verificar Status dos Serviços Dentro do Container

```bash
# Entrar no container
docker exec -it gwan-radio-web-1 bash

# Verificar se MariaDB está rodando
service mariadb status
# Deve mostrar: "mariadb.service is running"

# Verificar se Redis está rodando
service redis-server status
# Deve mostrar: "redis-server.service is running"

# Verificar processos
ps aux | grep -E "mariadb|redis|influxdb"
# Deve mostrar processos de todos os serviços

# Sair do container
exit
```

### 2. Verificar se o Banco de Dados Foi Criado

```bash
# Conectar ao banco e listar databases
docker exec -it gwan-radio-web-1 mysql -u azuracast -p -e "SHOW DATABASES;"
# (a senha está em azuracast.env após a instalação)

# Ou verificar se o banco azuracast existe
docker exec -it gwan-radio-web-1 mysql -u azuracast -p -e "USE azuracast; SHOW TABLES;"
# Deve mostrar várias tabelas como: stations, users, settings, etc.
```

### 3. Verificar Logs do Container

```bash
# Ver logs recentes
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=100 web

# Ver logs em tempo real
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f web
```

**Procure por:**
- ✅ `Services started up and ready!`
- ✅ `startup entered RUNNING state`
- ✅ `MariaDB started successfully`
- ❌ Evite: `FATAL state`, `exited`, `ERROR`

### 4. Testar Acesso Web

1. **Acesse no navegador:**
   ```
   https://radio.gwan.com.br
   ```

2. **O que você deve ver:**
   - ✅ Tela de criação do usuário administrador (primeira vez)
   - ✅ Ou tela de login (se já criou usuário)
   - ❌ Se aparecer erro 502/503, o Traefik não está conseguindo conectar

3. **Verificar resposta HTTP:**
   ```bash
   curl -I https://radio.gwan.com.br
   # Deve retornar: HTTP/2 200 ou HTTP/2 302
   ```

### 5. Verificar Conectividade do Traefik

```bash
# Verificar se o container está na network do Traefik
docker network inspect gwan | grep gwan-radio-web-1

# Testar conexão HTTP direta no container (porta 80 interna)
docker exec -it gwan-radio-web-1 curl -I http://localhost
# Deve retornar: HTTP/1.1 200 OK
```

### 6. Verificar Portas Expostas

```bash
# Ver portas do container
docker port gwan-radio-web-1

# Deve mostrar:
# 2022/tcp -> 0.0.0.0:2022 (SFTP)
# 8000-8099/tcp -> 0.0.0.0:10000-10099 (Streams)
```

### 7. Testar SFTP (se necessário)

```bash
# Testar conexão SFTP na porta 2022
sftp -P 2022 usuario@seu-ip-vps
```

## Checklist de Verificação

Marque cada item após verificar:

- [ ] Container `gwan-radio-web-1` está rodando
- [ ] MariaDB está rodando dentro do container (`service mariadb status`)
- [ ] Redis está rodando dentro do container (`service redis-server status`)
- [ ] Banco de dados `azuracast` existe e tem tabelas
- [ ] Logs mostram "Services started up and ready!"
- [ ] Site `https://radio.gwan.com.br` está acessível
- [ ] Traefik está conseguindo conectar ao container
- [ ] Portas 2022 (SFTP) e 10000-10099 (streams) estão expostas

## Erro: Bad Gateway (502)

Se você receber "Bad Gateway" ao acessar `https://radio.gwan.com.br`, siga estes passos:

### 1. Verificar se o Container Está na Network Correta

```bash
# Verificar networks do container
docker inspect gwan-radio-web-1 | grep -A 10 "Networks"

# Verificar se está na network gwan
docker network inspect gwan | grep gwan-radio-web-1

# Se não estiver, adicione manualmente:
docker network connect gwan gwan-radio-web-1
```

### 2. Verificar se o AzuraCast Está Respondendo Internamente

```bash
# Testar HTTP direto no container (porta 80 interna)
docker exec -it gwan-radio-web-1 curl -I http://localhost

# Deve retornar: HTTP/1.1 200 OK ou HTTP/1.1 302 Found
# Se retornar erro, o AzuraCast ainda não está pronto
```

### 3. Verificar se o Container Está Completamente Inicializado

```bash
# Ver logs recentes
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=50 web

# Procure por:
# ✅ "Services started up and ready!"
# ✅ "startup entered RUNNING state"
# ❌ Evite: "Waiting...", "ERROR", "FATAL"
```

### 4. Verificar Configuração do Traefik

```bash
# Verificar se o Traefik está vendo o container
# (acesse o dashboard do Traefik ou verifique logs)
docker logs traefik | grep azuracast

# Verificar se os labels estão corretos
docker inspect gwan-radio-web-1 | grep -A 20 "Labels"
```

### 5. Reiniciar o Container (se necessário)

```bash
cd azuracast
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart web

# Aguarde 1-2 minutos e teste novamente
```

### 6. Verificar se o Traefik Está Rodando

```bash
# Verificar status do Traefik
docker ps | grep traefik

# Ver logs do Traefik
docker logs traefik --tail=50
```

### 7. Solução: Recriar Container na Network Correta

Se nada funcionar, recrie o container:

```bash
cd azuracast

# Parar e remover container (mantém volumes)
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Subir novamente
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Verificar se está na network correta
docker network inspect gwan | grep gwan-radio-web-1
```

### 8. Verificar IP do Container na Network

```bash
# Ver IP do container na network gwan
docker inspect gwan-radio-web-1 | grep -A 5 '"gwan"'

# Testar conexão do Traefik ao IP do container
docker exec traefik curl -I http://<IP_DO_CONTAINER>
```

## Se Algo Não Estiver Funcionando

### Site não carrega (502 Bad Gateway)
- Verifique se o Traefik está rodando
- Verifique se o container está na network `gwan`
- Verifique se o AzuraCast está respondendo na porta 80 interna
- Verifique logs do Traefik e do AzuraCast
- Aguarde alguns minutos se o container acabou de iniciar

### MariaDB não inicia
- Verifique espaço em disco: `df -h`
- Remova volume e execute `azuracast_install` novamente
- Verifique logs completos: `docker compose logs web`

### Container reinicia constantemente
- Verifique logs para erros específicos
- Verifique se há conflito de portas
- Verifique recursos do servidor (RAM/CPU)

## Troubleshooting

### Erro: "Table 'mysql.db' doesn't exist"

O banco não foi inicializado. Execute novamente o passo 3 (instalação inicial).

### Container não inicia

Verifique os logs no Portainer ou via SSH:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs web
```

### MariaDB não aparece no Portainer

**Isso é normal!** O MariaDB está dentro do container `gwan-radio-web-1`. Use os comandos acima para verificar se está rodando.
