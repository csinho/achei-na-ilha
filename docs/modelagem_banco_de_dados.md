Tabela: users
Campo	Tipo	Descrição
id	UUID (PK)	Identificador único do usuário
email	Text	E-mail do usuário
senha_hash	Text	Hash da senha
nome	Text	Nome completo
tipo_usuario	Text	'anunciante' ou 'visitante'
telefone	Text	Telefone/WhatsApp do usuário
plano_ativo_id	UUID (FK)	Último plano ativo
criado_em	Timestamp	Data de criação da conta
atualizado_em	Timestamp	Data da última atualização
Tabela: planos
Campo	Tipo	Descrição
id	UUID (PK)	Identificador do plano
nome	Text	Nome do plano: Pititinga, Caranguejo etc.
limite_anuncios	Integer	Número máximo de anúncios
limite_imagens	Integer	Número máximo de imagens por anúncio
limite_videos	Integer	Número máximo de vídeos por anúncio
inclui_ads	Boolean	Se o plano permite exibir publicidade
valor_mensal	Number	Valor mensal em reais
descricao	Text	Descrição do plano
criado_em	Timestamp	Data de criação do plano
Tabela: assinaturas
Campo	Tipo	Descrição
id	UUID (PK)	Identificador da assinatura
usuario_id	UUID (FK)	Dono da assinatura
plano_id	UUID (FK)	Plano assinado
valor_pago	Number	Valor total pago
data_inicio	Timestamp	Início da assinatura
data_fim	Timestamp	Fim da assinatura
status	Text	'ativa', 'expirada', 'cancelada'
forma_pagamento	Text	Ex: cartão, boleto, pix
transacao_id	Text	ID externo da transação (gateway)
Tabela: anuncios
Campo	Tipo	Descrição
id	UUID (PK)	Identificador do anúncio
usuario_id	UUID (FK)	Referência ao anunciante (users)
titulo	Text	Título do anúncio
descricao	Text	Descrição completa do imóvel
tipo_imovel	Text	Ex: casa, apartamento, terreno, comercial
categoria	Text	'venda' ou 'aluguel'
valor	Number	Valor do imóvel
endereco	Text	Endereço completo
bairro	Text	Bairro/localização
cidade	Text	Cidade (padrão: Ilha)
estado	Text	Estado (padrão: BA)
cep	Text	CEP do imóvel
area_terreno	Number	Área do terreno em m²
area_construida	Number	Área construída em m²
quartos	Integer	Número de quartos
banheiros	Integer	Número de banheiros
vagas_garagem	Integer	Número de vagas na garagem
ativo	Boolean	Se o anúncio está ativo
emoji	Text	Ícone/emoji do anúncio
caracteristicas	Text[]	Array de características especiais
criado_em	Timestamp	Data de publicação do anúncio
atualizado_em	Timestamp	Data da última atualização
Tabela: imagens_anuncio
Campo	Tipo	Descrição
id	UUID (PK)	Identificador da imagem
anuncio_id	UUID (FK)	Referência ao anúncio
url	Text	Caminho da imagem
nome_arquivo	Text	Nome original do arquivo
tamanho_arquivo	Integer	Tamanho do arquivo em bytes
ordem	Integer	Ordem de exibição
principal	Boolean	Se é a imagem principal
criado_em	Timestamp	Data de upload
Tabela: videos_anuncio
Campo	Tipo	Descrição
id	UUID (PK)	Identificador do vídeo
anuncio_id	UUID (FK)	Referência ao anúncio
url	Text	Caminho do vídeo
nome_arquivo	Text	Nome original do arquivo
tamanho_arquivo	Integer	Tamanho do arquivo em bytes
duracao	Integer	Duração em segundos
ordem	Integer	Ordem de exibição
criado_em	Timestamp	Data de upload
Tabela: comentarios
Campo	Tipo	Descrição
id	UUID (PK)	Identificador do comentário
anuncio_id	UUID (FK)	Anúncio comentado
visitante_id	UUID (FK)	Usuário visitante que comentou
texto	Text	Conteúdo do comentário
aprovado	Boolean	Se o comentário foi aprovado
criado_em	Timestamp	Data do comentário
atualizado_em	Timestamp	Data da última atualização
Tabela: likes
Campo	Tipo	Descrição
id	UUID (PK)	Identificador do like
anuncio_id	UUID (FK)	Anúncio curtido
visitante_id	UUID (FK)	Usuário visitante que curtiu
criado_em	Timestamp	Data do like

Tabela: caracteristicas_imovel
Campo	Tipo	Descrição
id	UUID (PK)	Identificador da característica
nome	Text	Nome da característica (ex: piscina, vista-mar)
icone	Text	Ícone/emoji da característica
categoria	Text	Categoria da característica
ativo	Boolean	Se está disponível para seleção
criado_em	Timestamp	Data de criação

Tabela: anuncio_caracteristicas
Campo	Tipo	Descrição
id	UUID (PK)	Identificador da relação
anuncio_id	UUID (FK)	Referência ao anúncio
caracteristica_id	UUID (FK)	Referência à característica
criado_em	Timestamp	Data da associação
Tabela: publicidades
Campo	Tipo	Descrição
id	UUID (PK)	Identificador da publicidade
titulo	Text	Título da publicidade
descricao	Text	Texto promocional
imagem_url	Text	Caminho da imagem
link_externo	Text	URL do anunciante
criado_por	UUID (FK)	Referência ao usuário anunciante
visivel	Boolean	Se está ativa ou pausada
criada_em	Timestamp	Data de criação
aprovada	Boolean	Se foi aprovada pelo admin
Tabela: admin
Campo	Tipo	Descrição
id	UUID (PK)	Identificador do admin
email	Text	E-mail do administrador
senha_hash	Text	Hash da senha
nome	Text	Nome do administrador
criado_em	Timestamp	Data de criação
Relacionamentos

Um usuário pode ter várias assinaturas (tabela assinaturas)

Apenas uma assinatura ativa define o plano atual do usuário

Um plano pode estar ligado a muitos usuários e assinaturas

Um usuário anunciante pode criar muitos anúncios

Um anúncio pode conter muitas imagens e vídeos

Visitantes logados podem deixar comentários e likes

Publicidades podem ser gerenciadas por usuários e aprovadas por admin

Admins têm acesso ao painel de gestão de publicidades e controle geral