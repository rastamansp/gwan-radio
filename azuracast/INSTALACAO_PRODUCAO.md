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
