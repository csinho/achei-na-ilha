# Instruções: Deletar Imagens do Cloudinary

## Visão Geral

Este sistema implementa a deleção automática de imagens do Cloudinary quando:
- Um banner de publicidade é removido
- Uma publicidade é deletada
- Um anúncio é deletado
- Imagens de anúncio são substituídas durante edição

## Configuração Necessária

### 1. Executar SQL para adicionar campos

Execute os seguintes scripts SQL no Supabase:

```sql
-- Adicionar campo cloudinary_public_id na tabela imagens_anuncio
-- Arquivo: sql/add-cloudinary-public-id.sql

-- Adicionar credenciais do Cloudinary Admin API na tabela configuracoes
-- Arquivo: sql/add-cloudinary-api-credentials.sql
```

### 2. Configurar credenciais do Cloudinary Admin API

No painel admin (`pages/admin/admin.html`), vá em "Configurações do Sistema" e configure:

- **cloudinary_api_key**: API Key do Cloudinary (encontre no Dashboard do Cloudinary)
- **cloudinary_api_secret**: API Secret do Cloudinary (encontre no Dashboard do Cloudinary)

**Importante**: As credenciais são necessárias para usar a Admin API e deletar imagens.

## Como Funciona

### Para Publicidades

1. **Upload**: Quando uma imagem é enviada, o `public_id` retornado pelo Cloudinary é salvo no atributo `data-cloudinary-public-id` do elemento HTML e no campo `cloudinary_public_id` do JSON `banners_principais`.

2. **Remoção de Banner**: Ao clicar na lixeira para remover um banner:
   - O sistema verifica se há `public_id` armazenado
   - Se houver, deleta a imagem do Cloudinary usando a Admin API
   - Remove o banner do DOM

3. **Deleção de Publicidade**: Ao deletar uma publicidade:
   - O sistema busca todos os banners com `cloudinary_public_id`
   - Deleta cada imagem do Cloudinary
   - Deleta a publicidade do banco de dados

4. **Edição de Publicidade**: Ao editar uma publicidade:
   - O sistema compara banners antigos com novos
   - Identifica imagens que foram removidas
   - Deleta essas imagens do Cloudinary
   - Salva os novos banners com seus `public_id`

### Para Anúncios

1. **Upload**: Quando uma imagem é enviada, o `public_id` é armazenado no array `imagensSelecionadas` como objeto `{url, public_id}`.

2. **Remoção de Imagem**: Ao remover uma imagem:
   - O sistema verifica se há `public_id`
   - Se houver, deleta a imagem do Cloudinary
   - Remove a imagem do array

3. **Deleção de Anúncio**: Ao deletar um anúncio:
   - O sistema busca todas as imagens com `cloudinary_public_id` na tabela `imagens_anuncio`
   - Deleta cada imagem do Cloudinary
   - Deleta o anúncio do banco (as imagens são deletadas automaticamente por CASCADE)

4. **Edição de Anúncio**: Ao editar um anúncio:
   - O sistema busca imagens antigas
   - Deleta imagens antigas do Cloudinary que não estão mais na lista
   - Salva novas imagens com seus `public_id`

## Arquivos Modificados

### Backend (SQL)
- `sql/add-cloudinary-public-id.sql`: Adiciona campo `cloudinary_public_id` na tabela `imagens_anuncio`
- `sql/add-cloudinary-api-credentials.sql`: Adiciona configurações de API Key e Secret

### Frontend (JavaScript)
- `assets/js/cloudinary-delete.js`: Função global `deletarImagemCloudinary()` para deletar imagens
- `pages/admin/admin.html`: 
  - Função `deletarImagemCloudinary()` (Admin API)
  - Atualização de `uploadToCloudinary()` para retornar `public_id`
  - Atualização de `removerBanner()` para deletar do Cloudinary
  - Atualização de `removerPublicidade()` para deletar todas as imagens
  - Atualização de `coletarBanners()` e `coletarBannersEdit()` para incluir `public_id`
  - Atualização de `adicionarBannerEdit()` para carregar `public_id` existente
  - Atualização do formulário de edição para deletar imagens removidas

- `pages/property/novo-anuncio.html`:
  - Atualização de `uploadToCloudinary()` para retornar `public_id`
  - Atualização de `imagensSelecionadas` para armazenar objetos `{url, public_id}`
  - Atualização de `removerImagem()` para deletar do Cloudinary
  - Atualização de `salvarRascunho()` e `salvarAlteracoes()` para salvar `cloudinary_public_id`
  - Atualização de `carregarAnuncioParaEdicao()` para carregar com `public_id`

- `pages/user/meus-anuncios.html`:
  - Atualização de `confirmarExclusao()` para deletar imagens do Cloudinary antes de deletar anúncio

## Segurança

- A função `deletarImagemCloudinary()` não bloqueia o fluxo se der erro (pode ser que a imagem já não exista)
- As credenciais do Cloudinary são armazenadas no banco de dados e carregadas dinamicamente
- A autenticação usa timestamp e signature SHA-1 conforme documentação do Cloudinary

## Referências

- [Cloudinary Admin API - Delete Assets](https://cloudinary.com/documentation/image_upload_api_reference#destroy)
- [Cloudinary Authentication](https://cloudinary.com/documentation/authentication)

