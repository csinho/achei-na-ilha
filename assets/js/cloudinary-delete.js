// =============================================
// FUNÇÃO GLOBAL PARA DELETAR IMAGENS DO CLOUDINARY
// =============================================

/**
 * Deleta uma imagem do Cloudinary usando Admin API
 * @param {string} publicId - Public ID da imagem no Cloudinary
 * @returns {Promise<Object|null>} Resultado da deleção ou null se der erro
 */
async function deletarImagemCloudinary(publicId) {
    try {
        if (!publicId) {
            return null; // Se não tiver public_id, não há nada para deletar
        }

        // Carregar configurações do Cloudinary Admin API
        let cloudinaryConfig = null;
        if (window.configService) {
            await window.configService.initialize();
            cloudinaryConfig = await window.configService.getCloudinaryConfig();
        }

        if (!cloudinaryConfig || !cloudinaryConfig.cloudName) {
            // Se não tiver configurações, não bloquear
            return null;
        }

        // Carregar API Key e API Secret do banco
        if (!window.configService) {
            return null;
        }

        const apiKey = await window.configService.getConfig('cloudinary_api_key');
        const apiSecret = await window.configService.getConfig('cloudinary_api_secret');

        if (!apiKey || !apiSecret || !cloudinaryConfig.cloudName) {
            // Se não tiver credenciais, não bloquear
            return null;
        }

        // Gerar timestamp e signature para autenticação
        const timestamp = Math.round(new Date().getTime() / 1000);
        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        
        // Calcular SHA-1 hash para signature
        const signature = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(stringToSign))
            .then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            });

        // Fazer requisição DELETE para Admin API
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    api_key: apiKey,
                    timestamp: timestamp,
                    signature: signature
                })
            }
        );

        if (!response.ok) {
            // Não bloquear se der erro (pode ser que a imagem já não exista)
            return null;
        }

        const result = await response.json();
        return result;
    } catch (error) {
        // Não bloquear se der erro na deleção
        return null;
    }
}

// Tornar função global
window.deletarImagemCloudinary = deletarImagemCloudinary;

