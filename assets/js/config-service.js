/**
 * Serviço de Configurações do Sistema
 * Busca configurações do banco de dados Supabase
 * Cache local para melhor performance
 */

class ConfigService {
    constructor() {
        this.configCache = {};
        this.loading = false;
        this.loadPromise = null;
        this.supabase = null;
        this.initialized = false;
    }

    /**
     * Inicializar o serviço
     */
    async initialize() {
        if (this.initialized) {
            return;
        }

        // Tentar obter cliente Supabase
        if (typeof window.authService !== 'undefined' && window.authService && window.authService.isInitialized) {
            this.supabase = window.authService.getSupabase();
        } else if (typeof window.getSupabaseClient === 'function') {
            this.supabase = window.getSupabaseClient();
        } else if (typeof window.supabase !== 'undefined') {
            // Fallback: criar cliente diretamente (usando configurações do banco depois)
            // Por enquanto, usar valores hardcoded apenas para conectar ao banco
            const supabaseUrl = 'https://svgmuxdxxrapepbodbgv.supabase.co';
            const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Z211eGR4eHJhcGVwYm9kYmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTU2MTQsImV4cCI6MjA3Njk5MTYxNH0.U0rQ8-EXC6b0dkcCQBoE-VuNjNgNQREvcs3fWfZ1UGM';
            this.supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
        }

        if (!this.supabase) {
            throw new Error('Supabase não disponível para ConfigService');
        }

        this.initialized = true;
    }

    /**
     * Carregar todas as configurações do banco
     * @param {boolean} forceRefresh - Forçar recarregamento mesmo se já houver cache
     */
    async loadAllConfigs(forceRefresh = false) {
        if (this.loading) {
            return this.loadPromise;
        }

        if (!forceRefresh && Object.keys(this.configCache).length > 0) {
            // Já temos cache, retornar imediatamente
            return Promise.resolve(this.configCache);
        }

        this.loading = true;
        this.loadPromise = this._fetchConfigs();

        try {
            const configs = await this.loadPromise;
            this.configCache = configs;
            return configs;
        } finally {
            this.loading = false;
            this.loadPromise = null;
        }
    }

    /**
     * Buscar configurações do banco
     */
    async _fetchConfigs() {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.supabase) {
            throw new Error('Supabase não disponível');
        }

        try {
            const { data, error } = await this.supabase
                .from('configuracoes')
                .select('chave, valor, tipo, categoria')
                .eq('ativo', true);

            if (error) {
                throw error;
            }

            // Converter para objeto chave-valor
            const configs = {};
            (data || []).forEach(config => {
                let valor = config.valor;

                // Converter valor baseado no tipo
                if (config.tipo === 'number') {
                    valor = parseFloat(valor);
                } else if (config.tipo === 'boolean') {
                    valor = valor === 'true' || valor === '1';
                } else if (config.tipo === 'json') {
                    try {
                        valor = JSON.parse(valor);
                    } catch (e) {
                        valor = config.valor; // Manter como string se não conseguir parsear
                    }
                }

                configs[config.chave] = valor;
            });

            return configs;
        } catch (error) {
            // Em caso de erro, retornar cache se existir, senão objeto vazio
            return this.configCache || {};
        }
    }

    /**
     * Buscar uma configuração específica
     * @param {boolean} forceRefresh - Forçar recarregamento antes de buscar
     */
    async getConfig(chave, defaultValue = null, forceRefresh = false) {
        await this.loadAllConfigs(forceRefresh);
        return this.configCache[chave] !== undefined ? this.configCache[chave] : defaultValue;
    }

    /**
     * Buscar múltiplas configurações de uma categoria
     */
    async getCategory(categoria) {
        await this.loadAllConfigs();

        const configs = {};
        Object.keys(this.configCache).forEach(chave => {
            if (chave.startsWith(categoria + '_')) {
                const keyWithoutPrefix = chave.replace(categoria + '_', '');
                configs[keyWithoutPrefix] = this.configCache[chave];
            }
        });

        return configs;
    }

    /**
     * Buscar configuração com fallback
     */
    async getConfigWithFallback(chave, fallbackValue) {
        const value = await this.getConfig(chave);
        return value !== null ? value : fallbackValue;
    }

    /**
     * Limpar cache (útil para forçar recarregamento)
     */
    clearCache() {
        this.configCache = {};
        this.loading = false;
        this.loadPromise = null;
    }

    /**
     * Métodos de conveniência para categorias específicas
     */
    async getSupabaseConfig() {
        return {
            url: await this.getConfig('supabase_url'),
            anonKey: await this.getConfig('supabase_anon_key')
        };
    }

    async getCloudinaryConfig() {
        return {
            cloudName: await this.getConfig('cloudinary_cloud_name'),
            uploadPreset: await this.getConfig('cloudinary_upload_preset')
        };
    }

    async getPushinPayConfig(forceRefresh = false) {
        // Sempre buscar do banco para garantir valor atualizado
        const production = await this.getConfig('pushinpay_production', 'true', forceRefresh);
        
        // Verificar se é boolean false ou string 'false'
        let isProduction;
        if (typeof production === 'boolean') {
            isProduction = production;
        } else if (typeof production === 'string') {
            isProduction = production === 'true' || production === '1';
        } else {
            // Padrão: true se não conseguir determinar
            isProduction = true;
        }
        
        return {
            apiKeyProd: await this.getConfig('pushinpay_api_key_prod', null, forceRefresh),
            apiKeySandbox: await this.getConfig('pushinpay_api_key_sandbox', null, forceRefresh),
            isProduction: isProduction
        };
    }

    async getN8NConfig() {
        return {
            pixCreateUrl: await this.getConfig('n8n_pix_create_url'),
            pixCheckUrl: await this.getConfig('n8n_pix_check_url'),
            webhookUrl: await this.getConfig('n8n_webhook_url')
        };
    }

    async getPricingConfig() {
        return {
            dailyPrice: await this.getConfig('pricing_daily_price', 5.00),
            highlightPrice: await this.getConfig('pricing_highlight_price', 8.90),
            minDays: await this.getConfig('pricing_min_days', 3),
            maxDays: await this.getConfig('pricing_max_days', 30),
            maxPrice: await this.getConfig('pricing_max_price', 150.00),
            recommendedDays: await this.getConfig('pricing_recommended_days', 7)
        };
    }

    async getPublicidadePricingConfig() {
        return {
            plano7Dias: await this.getConfig('publicidade_plano_7_dias', 35.00),
            plano15Dias: await this.getConfig('publicidade_plano_15_dias', 75.00),
            plano30Dias: await this.getConfig('publicidade_plano_30_dias', 150.00),
            diasMin: await this.getConfig('publicidade_dias_min', 7),
            diasMax: await this.getConfig('publicidade_dias_max', 30)
        };
    }

    async getLimitsConfig() {
        return {
            maxImagesPerAd: await this.getConfig('limits_max_images_per_ad', 10),
            maxBannerSizeMB: await this.getConfig('limits_max_banner_size_mb', 10),
            allowedImageTypes: await this.getConfig('limits_allowed_image_types', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
        };
    }
}

// Criar instância global
window.configService = new ConfigService();

// Inicializar quando Supabase estiver disponível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.configService.initialize().catch(err => {
            // Ignorar erros na inicialização (pode ser que Supabase ainda não esteja disponível)
        });
    });
} else {
    window.configService.initialize().catch(err => {
        // Ignorar erros na inicialização
    });
}

