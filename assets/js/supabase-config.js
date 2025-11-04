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

// Função para obter instância do Supabase
function getSupabase() {
    if (window.authService && window.authService.getSupabase()) {
        return window.authService.getSupabase();
    }
    
    // Fallback: criar instância direta se o serviço não estiver disponível
    if (typeof window !== 'undefined' && window.supabase) {
        return window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
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
