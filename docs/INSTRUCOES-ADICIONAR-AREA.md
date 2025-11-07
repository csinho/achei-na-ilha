# Instruções: Adicionar Campo de Área (m²) aos Anúncios

## O que foi implementado

Foi adicionado o campo `area` (área em m²) para que os usuários possam informar a área total do imóvel ao criar ou editar anúncios.

## Passo 1: Executar SQL no Banco de Dados

Execute o arquivo `sql/add-area-campo.sql` no Supabase:

1. **Acesse o Supabase Dashboard**
   - Vá em: https://app.supabase.com
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute o Script**
   - Copie o conteúdo do arquivo `sql/add-area-campo.sql`
   - Cole no editor SQL
   - Clique em "Run" ou pressione `Ctrl+Enter`

4. **Verificar**
   - O script verifica se a coluna já existe antes de adicionar
   - Se a coluna `area` já existir, o script não fará nada (seguro para executar múltiplas vezes)

## O que foi alterado no código

### 1. **Formulário de Criação/Edição** (`pages/property/novo-anuncio.html`)
   - ✅ Campo de input para área (m²) adicionado após o campo de banheiros
   - ✅ Campo incluído na função `coletarDadosAnuncio()`
   - ✅ Campo salvo ao criar rascunho
   - ✅ Campo salvo ao atualizar anúncio
   - ✅ Campo carregado ao editar anúncio existente

### 2. **Página de Busca** (`pages/property/busca.html`)
   - ✅ Área exibida nas tags dos cards (📐 Xm²)
   - ✅ Área incluída no mapeamento dos dados do Supabase
   - ✅ Fallback: usa `area_construida` ou `area_terreno` se `area` não estiver preenchida

### 3. **Página de Detalhes** (`pages/property/detalhes.html`)
   - ✅ Área exibida na seção de detalhes do imóvel
   - ✅ Ícone 📐 com label "Área" e valor em m²
   - ✅ Fallback: usa `area_construida` ou `area_terreno` se `area` não estiver preenchida

### 4. **Página de Pagamento** (`pages/payment/pagamento.html`)
   - ✅ Campo `area` incluído ao criar/atualizar anúncio após pagamento

## Estrutura do Campo

- **Nome da coluna**: `area`
- **Tipo**: `DECIMAL(8,2)` (permite até 99.999.999,99 m²)
- **Opcional**: Sim (pode ser NULL)
- **Unidade**: metros quadrados (m²)

## Comportamento

- Se o campo `area` estiver preenchido, ele será usado
- Se `area` estiver vazio, o sistema tenta usar `area_construida`
- Se `area_construida` também estiver vazio, tenta usar `area_terreno`
- Se nenhum estiver preenchido, a área não é exibida

## Teste após aplicar

1. Execute o SQL no Supabase
2. Crie um novo anúncio e preencha o campo "Área (m²)"
3. Verifique se a área aparece:
   - Nas tags do card na listagem (`/busca`)
   - Na página de detalhes (`/detalhes?id=...`)
4. Edite um anúncio existente e verifique se o campo de área é carregado corretamente

