Mapa de Telas

Tela de Boas-Vindas – Apresenta o app e direciona para login, cadastro ou busca

Tela de Cadastro – Criação de conta como anunciante ou visitante

Tela de Login – Acesso à conta existente

Tela de Escolha de Plano – Seleção entre os planos Pititinga, Caranguejo e Lagosta

Tela Inicial (Busca) – Lista de imóveis com filtros

Tela de Detalhes do Imóvel – Informações completas do anúncio

Tela de Novo Anúncio – Formulário para publicar imóvel

Tela Meus Anúncios – Listagem com ações de editar/deletar

Tela Configurações da Conta – Dados do perfil, plano atual e opções de upgrade

Tela Admin – Gestão de publicidades locais

Tela de Publicidades – Exibição de banners conforme plano

Tela: Tela de Boas-Vindas

Objetivo da tela: direcionar o usuário para login, cadastro ou busca livre

Componentes obrigatórios:

Título: "Buscas da Ilha"

Texto de apresentação do app

Botão: “Buscar Imóveis” (ação: vai para Tela Inicial)

Botão: “Entrar” (ação: vai para Tela de Login)

Botão: “Criar Conta” (ação: vai para Tela de Cadastro)

Tela: Tela de Cadastro

Objetivo da tela: permitir que o usuário crie uma conta como visitante ou anunciante

Componentes obrigatórios:

Título: “Criar Conta”

Campo de texto: “Nome completo”

Campo de texto: “E-mail”

Campo de senha: “Senha”

Campo de seleção: “Tipo de conta” (Visitante ou Anunciante)

Botão: “Criar Conta” (ação: valida dados e redireciona)

Link: “Já tem conta? Entrar” (vai para Tela de Login)

Mensagens de erro e sucesso

Tela: Tela de Login

Objetivo da tela: permitir login no sistema

Componentes obrigatórios:

Título: “Entrar”

Campo de texto: “E-mail”

Campo de senha: “Senha”

Botão: “Entrar” (ação: autenticar e redirecionar)

Link: “Criar nova conta” (vai para Tela de Cadastro)

Mensagens de erro (login inválido)

Tela: Tela de Escolha de Plano

Objetivo da tela: apresentar planos disponíveis e permitir assinatura

Componentes obrigatórios:

Título: “Escolha seu Plano”

Cards com detalhes dos planos:

Pititinga (gratuito, com anúncios limitados e publicidade)

Caranguejo (anúncios com mais imagens, sem publicidade)

Lagosta (destaque nos anúncios e sem publicidade)

Botão: “Selecionar Plano” em cada card

Integração com pagamento (simulado)

Mensagens de sucesso ou erro

Tela: Tela Inicial (Busca)

Objetivo da tela: permitir navegação e busca de imóveis

Componentes obrigatórios:

Campo de busca com filtros:

Tipo de imóvel

Categoria (venda/aluguel)

Localização

Faixa de preço

Lista de anúncios com:

Imagem de capa

Título

Preço

Localização

Botão: “Ver Detalhes” (ação: vai para Tela de Detalhes)

Exibição de publicidades (conforme plano do anunciante)

Menu inferior com: Início | Novo Anúncio (anunciante) | Conta

Tela: Tela de Detalhes do Imóvel

Objetivo da tela: mostrar informações completas do anúncio

Componentes obrigatórios:

Galeria de imagens (até 15)

Player de vídeo (até 4 vídeos de 1 min)

Título, preço, localização, descrição

Nome do anunciante (opcional)

Botão: “Curtir” (apenas visitantes logados)

Campo de comentário e botão: “Comentar”

Lista de comentários (nome + comentário)

Mensagens de erro/sucesso

Tela: Tela de Novo Anúncio

Objetivo da tela: permitir ao anunciante publicar um novo imóvel

Componentes obrigatórios:

Título: “Novo Anúncio”

Campo de texto: “Título do imóvel”

Campo de texto longo: “Descrição”

Campo de seleção: “Categoria” (venda ou aluguel)

Campo de seleção: “Tipo do imóvel”

Campo de texto: “Localização”

Campo numérico: “Valor”

Upload de imagens (máx 15)

Upload de vídeos (máx 4)

Botão: “Publicar Anúncio”

Mensagem de limite excedido por plano

Mensagem de sucesso: “Anúncio publicado!”

Tela: Tela Meus Anúncios

Objetivo da tela: gerenciar os imóveis cadastrados

Componentes obrigatórios:

Lista de anúncios com:

Título, status, data de publicação

Botões: “Editar”, “Excluir”

Botão: “Novo Anúncio” (vai para Tela de Novo Anúncio)

Tela: Tela Configurações da Conta

Objetivo da tela: permitir edição de perfil e gestão do plano

Componentes obrigatórios:

Título: “Minha Conta”

Exibir dados pessoais (nome, e-mail)

Plano atual com opção de upgrade

Botão: “Alterar Plano” (vai para Tela de Escolha de Plano)

Botão: “Sair da Conta”

Tela: Tela Admin

Objetivo da tela: permitir que o administrador gerencie publicidades

Componentes obrigatórios:

Lista de banners por anunciante

Campos para upload e edição de banner

Botão: “Aprovar” / “Remover” banner

Tela: Tela de Publicidades

Objetivo da tela: exibir banners conforme o plano do anunciante

Componentes obrigatórios:

Bloco de publicidade no topo, meio ou rodapé

Exibição controlada por plano:

Pititinga: exibe banner

Caranguejo/Lagosta: não exibe

Fluxograma Mermaid

Você pode visualizar este fluxograma colando o código no site https://mermaid.live

graph TD
  BoasVindas -->|Buscar| TelaInicial
  BoasVindas -->|Entrar| Login
  BoasVindas -->|Criar Conta| Cadastro
  Cadastro --> EscolhaPlano
  Login --> EscolhaPlano
  EscolhaPlano -->|Visitante| TelaInicial
  EscolhaPlano -->|Anunciante| MeusAnuncios
  MeusAnuncios --> NovoAnuncio
  NovoAnuncio --> MeusAnuncios
  TelaInicial --> DetalhesImovel
  DetalhesImovel --> TelaInicial
  DetalhesImovel -->|Curtir/Comentar| DetalhesImovel
  TelaInicial --> ConfiguracoesConta
  ConfiguracoesConta --> EscolhaPlano
  Admin --> TelaPublicidades