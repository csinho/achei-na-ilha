// =============================================
// CONFIGURAÇÃO DO SUPABASE - VERSÃO OFICIAL
// Projeto: Achei na Ilha
// Baseado na documentação oficial do Supabase
// =============================================

// Configurações do Supabase
const SUPABASE_CONFIG = {
    url: 'https://svgmuxdxxrapepbodbgv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Z211eGR4eHJhcGVwYm9kYmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTU2MTQsImV4cCI6MjA3Njk5MTYxNH0.U0rQ8-EXC6b0dkdCQBoE-VuNjNgNQREvcs3fWfZ1UGM'
};

// Instância única do cliente Supabase (singleton)
let supabaseClientInstance = null;

// Função para obter instância do Supabase (singleton)
function getSupabase() {
    // Prioridade 1: usar instância do authService se disponível (mesmo que não esteja inicializado ainda)
    if (window.authService && window.authService.getSupabase) {
        // Tentar obter a instância do authService
        // Se ainda não estiver inicializado, aguardar um pouco e tentar novamente
        const authClient = window.authService.getSupabase();
        if (authClient) {
            // Armazenar a instância do authService como singleton
            supabaseClientInstance = authClient;
            return authClient;
        }
        
        // Se authService existe mas ainda não está inicializado, aguardar inicialização
        if (window.authService && !window.authService.isInitialized) {
            // Retornar null e deixar que o código que chama aguarde a inicialização
            // Isso evita criar múltiplas instâncias
            return null;
        }
    }
    
    // Prioridade 2: reutilizar instância singleton se já existir
    if (supabaseClientInstance) {
        return supabaseClientInstance;
    }
    
    // Prioridade 3: criar instância única apenas se authService não existir
    // Se authService existe mas não está inicializado, não criar nova instância
    if (typeof window !== 'undefined' && window.supabase && (!window.authService || window.authService.isInitialized)) {
        supabaseClientInstance = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        return supabaseClientInstance;
    }
    
    return null;
}

// Função para obter cliente Supabase (compatibilidade)
function getSupabaseClient() {
    return getSupabase();
}

// Exportar para uso global
window.getSupabase = getSupabase;
window.getSupabaseClient = getSupabaseClient;

// Log de inicialização