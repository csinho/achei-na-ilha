# Instruções: Corrigir Problema de Imagens Não Aparecendo

## Problema Identificado

As imagens dos anúncios não aparecem na listagem (`busca.html`) nem na página de detalhes (`detalhes.html`) após a criação de um anúncio.

## Causa Raiz

O problema está nas **políticas RLS (Row Level Security)** da tabela `imagens_anuncio`. As políticas atuais só permitem que:

1. Anunciantes vejam imagens de seus próprios anúncios
2. Mas NÃO permitem que visitantes públicos vejam imagens de anúncios publicados

Além disso, as políticas antigas usavam `anunciante_id`, mas a tabela `anuncios` usa `usuario_id`.

## Solução

Execute o arquivo SQL `sql/fix-imagens-rls.sql` no Supabase para corrigir as políticas RLS.

### Passos:

1. **Acesse o Supabase Dashboard**
   - Vá em: https://app.supabase.com
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute o Script**
   - Copie o conteúdo do arquivo `sql/fix-imagens-rls.sql`
   - Cole no editor SQL
   - Clique em "Run" ou pressione `Ctrl+Enter`

4. **Verifique as Políticas**
   - Após executar, vá em "Authentication" → "Policies"
   - Verifique se a tabela `imagens_anuncio` tem as novas políticas:
     - "Anyone can view images of active ads"
     - "Advertisers can view own ad images"
     - "Advertisers can create images for own ads"
     - "Advertisers can update own ad images"
     - "Advertisers can delete own ad images"

## O que foi corrigido:

1. ✅ **Política pública**: Qualquer pessoa pode ver imagens de anúncios com `ativo = true` e `status = 'publicado'`
2. ✅ **Política de proprietário**: Anunciantes podem ver imagens de seus próprios anúncios (mesmo não publicados)
3. ✅ **Correção de campo**: Usa `usuario_id` em vez de `anunciante_id` (que não existe na tabela)
4. ✅ **Tratamento de erros**: Agora os erros ao salvar imagens são lançados como exceções em vez de apenas logados

## Teste após aplicar:

1. Crie um novo anúncio com imagens
2. Complete o pagamento
3. Verifique se as imagens aparecem na listagem (`/busca`)
4. Verifique se as imagens aparecem na página de detalhes (`/detalhes?id=...`)

## Nota

Se após aplicar a correção as imagens ainda não aparecerem, verifique:

1. **Console do navegador**: Veja se há erros de RLS ou de requisição
2. **Supabase Logs**: Verifique se há erros de política RLS
3. **Dados no banco**: Confirme que as imagens foram salvas na tabela `imagens_anuncio`

