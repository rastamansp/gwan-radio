# Personalização do AzuraCast - GWAN Radio

Este diretório contém arquivos para personalizar a interface e funcionalidades do AzuraCast.

## Estrutura

```
custom/
├── custom.css      # Estilos CSS customizados
├── custom.js       # JavaScript customizado
└── README.md       # Este arquivo
```

## Como Usar

### 1. Habilitar Customizações no AzuraCast

1. Acesse o painel administrativo: `https://radio.gwan.com.br`
2. Vá em **Administration** → **Settings** → **Custom Branding**
3. Ative as opções:
   - ✅ **Enable Custom CSS**
   - ✅ **Enable Custom JavaScript**

### 2. Editar Arquivos

Os arquivos `custom.css` e `custom.js` estão montados como volumes no Docker e podem ser editados diretamente:

```bash
# Via SSH na VPS
cd azuracast/custom
nano custom.css
nano custom.js
```

Ou edite diretamente no seu editor local e faça commit/push.

### 3. Aplicar Alterações

Após editar os arquivos:

1. **Se editou via SSH**: As alterações são aplicadas automaticamente após alguns segundos
2. **Se editou localmente**: Faça commit e push, depois atualize no servidor:
   ```bash
   git pull
   # Reinicie o container se necessário
   docker compose -f docker-compose.yml -f docker-compose.prod.yml restart web
   ```

## Arquivos Disponíveis

### custom.css

Arquivo CSS para personalizar a aparência da interface:
- Cores e temas
- Layout e espaçamentos
- Tipografia
- Componentes (botões, cards, etc.)

**Localização no container**: `/var/azuracast/www/backend/public/custom/custom.css`

### custom.js

Arquivo JavaScript para adicionar funcionalidades:
- Eventos personalizados
- Integrações com APIs externas
- Analytics e tracking
- Funcionalidades customizadas

**Localização no container**: `/var/azuracast/www/backend/public/custom/custom.js`

## Exemplos de Personalização

### CSS - Alterar Cores do Tema

```css
:root {
    --primary-color: #1a73e8;
    --secondary-color: #34a853;
}
```

### CSS - Personalizar Logo

```css
.navbar-brand {
    background-image: url('/custom/logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    width: 200px;
    height: 50px;
}
```

### JavaScript - Adicionar Analytics

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Google Analytics
    gtag('event', 'page_view', {
        'page_title': document.title
    });
});
```

### JavaScript - Personalizar Player

```javascript
const audioPlayer = document.querySelector('audio');
if (audioPlayer) {
    audioPlayer.addEventListener('play', function() {
        // Sua lógica aqui
    });
}
```

## Documentação Oficial

- [Using Custom CSS](https://www.azuracast.com/docs/administration/using-custom-css/)
- [Using Custom JavaScript](https://www.azuracast.com/docs/administration/using-custom-javascript/)

## Notas Importantes

1. **Backup**: Sempre faça backup antes de fazer alterações significativas
2. **Testes**: Teste as alterações em ambiente de desenvolvimento primeiro
3. **Performance**: Evite CSS/JS muito pesados que possam afetar a performance
4. **Compatibilidade**: Teste em diferentes navegadores
5. **Atualizações**: As customizações são preservadas durante atualizações do AzuraCast

## Troubleshooting

### Alterações não aparecem

1. Verifique se as opções estão habilitadas no painel administrativo
2. Limpe o cache do navegador (Ctrl+F5)
3. Verifique se os arquivos estão no local correto
4. Verifique os logs do container: `docker compose logs web`

### Erros no JavaScript

1. Abra o console do navegador (F12) para ver erros
2. Verifique a sintaxe do JavaScript
3. Certifique-se de que não há conflitos com o código do AzuraCast

### CSS não aplicado

1. Verifique se o CSS está correto
2. Use `!important` se necessário para sobrescrever estilos padrão
3. Verifique a especificidade dos seletores CSS
