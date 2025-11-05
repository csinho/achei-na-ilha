# Configuração Centralizada do Sistema

## 📋 Visão Geral

O sistema agora utiliza um arquivo de configuração centralizado (`assets/js/config.js`) que contém todas as variáveis de ambiente e configurações do sistema. Isso facilita a manutenção e permite diferentes configurações para desenvolvimento, staging e produção.

## 📁 Arquivos de Configuração

### **`assets/js/config.js`**
Arquivo principal de configuração contendo todas as variáveis do sistema.

### **`.env.example`**
Arquivo de exemplo com template das variáveis necessárias (não contém valores reais).

## 🔧 Como Usar

### 1. **Configurar o arquivo `config.js`**

Edite o arquivo `assets/js/config.js` e ajuste as configurações conforme necessário:

```javascript
const APP_CONFIG = {
    supabase: {
        url: 'https://seu-projeto.supabase.co',
        anonKey: 'sua-chave-anon-aqui'
    },
    cloudinary: {
        cloudName: 'seu-cloud-name',
        uploadPreset: 'seu-upload-preset'
    },
    // ... outras configurações
};
```

### 2. **Carregar o arquivo de configuração**

O arquivo `config.js` deve ser carregado **antes** de outros scripts que dependem dele:

```html
<!-- Configuração Centralizada (SEMPRE PRIMEIRO) -->
<script src="../../assets/js/config.js"></script>
<!-- Depois os outros scripts -->
<script src="../../assets/js/supabase-config.js"></script>
<script src="../../assets/js/supabase-auth-service.js"></script>
```

### 3. **Acessar configurações no código**

```javascript
// Acessar configuração específica
const supabaseUrl = window.APP_CONFIG.supabase.url;
const apiKey = window.APP_CONFIG.pushinpay.apiKey;

// Ou usar função auxiliar
const cloudName = getConfig('cloudinary', 'cloudName');
const dailyPrice = getConfig('pricing', 'dailyPrice');
```

## 📦 Estrutura de Configurações

### **Supabase**
```javascript
supabase: {
    url: 'https://seu-projeto.supabase.co',
    anonKey: 'sua-chave-anon'
}
```

### **Cloudinary**
```javascript
cloudinary: {
    cloudName: 'seu-cloud-name',
    uploadPreset: 'seu-upload-preset'
}
```

### **PushinPay PIX**
```javascript
pushinpay: {
    apiKey: 'sua-api-key',
    apiUrl: 'https://api.pushinpay.com.br'
}
```

### **N8N Webhooks**
```javascript
n8n: {
    pixCreateUrl: 'https://hooks.upcaodigital.com.br/webhook/criar-pix',
    pixCheckUrl: 'https://hooks.upcaodigital.com.br/webhook/verificar-pix',
    webhookUrl: 'https://hooks.upcaodigital.com.br/webhook/acheinailha'
}
```

### **Preços e Limites**
```javascript
pricing: {
    dailyPrice: 5.00,
    highlightPrice: 8.90,
    minDays: 3,
    maxDays: 30,
    maxPrice: 150.00,
    recommendedDays: 7,
    publicidadePrecoDia: 5.00,
    publicidadeDiasMin: 3,
    publicidadeDiasMax: 30,
    publicidadePrecoMax: 150.00
}
```

### **Limites do Sistema**
```javascript
limits: {
    maxImagesPerAd: 10,
    maxBannerSizeMB: 10,
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}
```

## 🔄 Fallback (Compatibilidade)

O sistema mantém valores padrão (fallback) para garantir compatibilidade caso o `config.js` não esteja carregado:

```javascript
// Exemplo com fallback
const DAILY_PRICE = window.APP_CONFIG?.pricing?.dailyPrice || 5.00;
const supabaseUrl = window.APP_CONFIG?.supabase?.url || 'url-padrão';
```

## 🔐 Segurança

### **⚠️ IMPORTANTE**

1. **NUNCA commite o arquivo `config.js` com credenciais reais no Git**
2. Use `.env.example` como template
3. Adicione `config.js` ao `.gitignore` se contiver credenciais sensíveis
4. Para produção, use variáveis de ambiente do servidor ou um serviço de gerenciamento de secrets

### **Recomendações**

- **Desenvolvimento**: Use `config.js` com valores de desenvolvimento
- **Produção**: Use variáveis de ambiente do servidor ou um serviço de secrets
- **Git**: Commite apenas `.env.example` (sem valores reais)

## 📝 Exemplo de Uso

### **Antes (hardcoded)**
```javascript
const PUSHINPAY_API_KEY = '53083|94CNbHuMZhZMY1vbeyBzJ2GwBwuONhllGIbcXPFE674011cc';
const CLOUDINARY_CONFIG = {
    cloudName: 'demv63uh4',
    uploadPreset: 'produtos'
};
```

### **Depois (centralizado)**
```javascript
// No config.js
const APP_CONFIG = {
    pushinpay: {
        apiKey: '53083|94CNbHuMZhZMY1vbeyBzJ2GwBwuONhllGIbcXPFE674011cc'
    },
    cloudinary: {
        cloudName: 'demv63uh4',
        uploadPreset: 'produtos'
    }
};

// No código
const PUSHINPAY_API_KEY = window.APP_CONFIG.pushinpay.apiKey;
const CLOUDINARY_CONFIG = window.APP_CONFIG.cloudinary;
```

## ✅ Benefícios

1. **Centralização**: Todas as configurações em um único lugar
2. **Manutenção**: Fácil atualização de valores
3. **Ambientes**: Diferentes configurações para dev/staging/prod
4. **Segurança**: Pode ser facilmente protegido/ignorado no Git
5. **Consistência**: Mesmas configurações em todo o sistema

## 🔍 Arquivos Atualizados

Os seguintes arquivos foram atualizados para usar a configuração centralizada:

- ✅ `assets/js/supabase-config.js`
- ✅ `assets/js/supabase-auth-service.js`
- ✅ `pages/payment/pagamento.html`
- ✅ `pages/admin/admin.html`
- ✅ `pages/admin/login.html`
- ✅ `pages/property/novo-anuncio.html`

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Cloudinary](https://cloudinary.com/documentation)
- [Documentação PushinPay](https://docs.digitalmanager.guru/)

