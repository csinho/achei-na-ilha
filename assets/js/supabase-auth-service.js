/**
 * Serviço de Autenticação Supabase
 * Implementado seguindo as melhores práticas oficiais do Supabase
 * Documentação: https://supabase.com/docs/guides/auth
 */

class SupabaseAuthService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.isInitialized = false;
        this.authListeners = [];
    }

    /**
     * Inicializar o cliente Supabase
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // Verificar se o Supabase está disponível
            if (typeof window.supabase === 'undefined') {
                throw new Error('Supabase não está disponível. Certifique-se de incluir o script do Supabase.');
            }

            // Criar cliente Supabase
            this.supabase = window.supabase.createClient(
                'https://svgmuxdxxrapepbodbgv.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Z211eGR4eHJhcGVwYm9kYmd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTU2MTQsImV4cCI6MjA3Njk5MTYxNH0.U0rQ8-EXC6b0dkdCQBoE-VuNjNgNQREvcs3fWfZ1UGM'
            );

            // Configurar listener de mudanças de autenticação
            this.supabase.auth.onAuthStateChange(async (event, session) => {
                this.handleAuthStateChange(event, session);
                
                // Criar perfil automaticamente quando usuário for confirmado
                if (event === 'SIGNED_IN' && session?.user) {
                    // Aguardar um pouco para garantir que o usuário está totalmente confirmado
                    setTimeout(async () => {
                        await this.ensureUserProfile(session.user);
                    }, 2000);
                }
            });

            // Verificar sessão atual
            await this.checkCurrentSession();
            
            this.isInitialized = true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verificar sessão atual
     */
    async checkCurrentSession() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            
            if (error) {
                // Não logar erro se não há sessão (comportamento normal)
                if (!this.isSessionError(error)) {
                }
                this.currentUser = null;
                return;
            }

            if (session?.user) {
                this.currentUser = session.user;
            } else {
                this.currentUser = null;
            }

        } catch (error) {
            if (!this.isSessionError(error)) {
            }
            this.currentUser = null;
        }
    }

    /**
     * Verificar se é um erro de sessão (comportamento normal)
     */
    isSessionError(error) {
        const sessionErrors = [
            'Auth session missing',
            'session not found',
            'No session',
            'Invalid session',
            'Session expired'
        ];
        
        return sessionErrors.some(msg => 
            error.message?.includes(msg) || error.toString().includes(msg)
        );
    }

    /**
     * Manipular mudanças de estado de autenticação
     */
    handleAuthStateChange(event, session) {
        this.currentUser = session?.user || null;
        
        // Notificar listeners
        this.authListeners.forEach(listener => {
            try {
                listener(event, session, this.currentUser);
            } catch (error) {
            }
        });
        
        // Forçar atualização do header se a função estiver disponível
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
            setTimeout(() => {
                if (typeof window.updateHeaderLogin === 'function') {
                    window.updateHeaderLogin();
                }
            }, 500);
        }
    }

    /**
     * Adicionar listener para mudanças de autenticação
     */
    onAuthStateChange(callback) {
        this.authListeners.push(callback);
    }

    /**
     * Remover listener
     */
    removeAuthListener(callback) {
        const index = this.authListeners.indexOf(callback);
        if (index > -1) {
            this.authListeners.splice(index, 1);
        }
    }

    /**
     * Verificar se usuário está logado
     */
    async isLoggedIn() {
        const user = await this.getCurrentUser();
        return !!user;
    }

    /**
     * Obter usuário atual
     * Verifica a sessão do Supabase se currentUser estiver null
     */
    async getCurrentUser() {
        // Se já temos o usuário e o supabase está inicializado, retornar
        if (this.currentUser && this.supabase) {
            return this.currentUser;
        }
        
        // Se o supabase não está inicializado, tentar inicializar
        if (!this.supabase) {
            try {
                await this.initialize();
            } catch (error) {
                return null;
            }
        }
        
        // Verificar sessão diretamente do Supabase
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            
            if (error) {
                if (!this.isSessionError(error)) {
                }
                this.currentUser = null;
                return null;
            }
            
            if (session?.user) {
                this.currentUser = session.user;
                return this.currentUser;
            } else {
                this.currentUser = null;
                return null;
            }
        } catch (error) {
            if (!this.isSessionError(error)) {
            }
            this.currentUser = null;
            return null;
        }
    }

    /**
     * Obter perfil completo do usuário
     */
    async getCurrentUserProfile() {
        if (!this.currentUser) return null;

        try {
            const { data: profile, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                return null;
            }

            return profile;
        } catch (error) {
            return null;
        }
    }

    /**
     * Cadastrar novo usuário
     */
    async signUp(email, password, userData = {}) {
        try {
            // Construir URL de redirecionamento após confirmação
            // URL absoluta completa para garantir que funcione
            const redirectPath = `${window.location.origin}/pages/auth/confirmar-email.html?email=${encodeURIComponent(email)}&confirmed=true`;
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData,
                    emailRedirectTo: redirectPath
                }
            });

            if (error) throw error;

            if (data.user) {
                // Aguardar um pouco para garantir que o usuário está disponível
                await this.waitForUser(data.user.id);
                
                // Criar perfil do usuário na tabela users com retry
                const profileResult = await this.createUserProfile(data.user.id, email, userData);
                
                if (!profileResult.success) {
                    // Não falhar o cadastro por causa do perfil
                }
            }

            return { success: true, data, error: null };
        } catch (error) {
            return { success: false, data: null, error };
        }
    }

    /**
     * Aguardar usuário estar disponível
     */
    async waitForUser(userId, maxAttempts = 10, delay = 500) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const { data: { user }, error } = await this.supabase.auth.getUser();
                if (user && user.id === userId && !error) {
                    return true;
                }
            } catch (error) {
                // Continuar tentando
            }
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return false;
    }

    /**
     * Criar perfil do usuário com retry
     */
    async createUserProfile(userId, email, userData, maxAttempts = 5, delay = 1000) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const { error } = await this.supabase
                    .from('users')
                    .insert({
                        id: userId,
                        nome: userData.nome || '',
                        email: email,
                        tipo_usuario: userData.tipo_usuario || 'visitante',
                        telefone: userData.telefone || null,
                        senha_hash: null, // Não armazenamos senha quando usamos Supabase Auth
                        criado_em: new Date().toISOString()
                    });

                if (!error) {
                    return { success: true, error: null };
                }

                // Se é erro de duplicação, usuário já existe
                if (error.code === '23505' || error.message.includes('duplicate')) {
                    return { success: true, error: null };
                }
                if (i < maxAttempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                if (i < maxAttempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        return { success: false, error: new Error('Falha ao criar perfil após múltiplas tentativas') };
    }

    /**
     * Garantir que o usuário tem perfil na tabela users
     */
    async ensureUserProfile(user) {
        try {
            // Verificar se o perfil já existe
            const { data: existingProfile, error: checkError } = await this.supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();

            if (existingProfile && !checkError) {
                return { success: true };
            }

            // Criar perfil com dados do Auth
            const userData = {
                nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
                tipo_usuario: user.user_metadata?.tipo_usuario || 'visitante',
                telefone: user.user_metadata?.telefone || null
            };

            const result = await this.createUserProfile(user.id, user.email, userData);
            
            if (result.success) {
            } else {
            }

            return result;
        } catch (error) {
            return { success: false, error };
        }
    }

    /**
     * Fazer login
     */
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return { success: true, data, error: null };
        } catch (error) {
            return { success: false, data: null, error };
        }
    }

    /**
     * Fazer logout
     */
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            
            if (error) throw error;

            this.currentUser = null;
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error };
        }
    }

    /**
     * Redefinir senha
     */
    async resetPassword(email) {
        try {
            const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password.html`
            });

            if (error) throw error;

            return { success: true, data, error: null };
        } catch (error) {
            return { success: false, data: null, error };
        }
    }

    /**
     * Atualizar perfil do usuário
     */
    async updateProfile(updates) {
        const user = await this.getCurrentUser();
        if (!user) {
            return { success: false, error: 'Usuário não logado' };
        }

        try {
            const { data, error } = await this.supabase
                .from('users')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            return { success: true, data, error: null };
        } catch (error) {
            return { success: false, data: null, error };
        }
    }

    /**
     * Obter instância do Supabase
     */
    getSupabase() {
        return this.supabase;
    }
}

// Criar instância global
window.authService = new SupabaseAuthService();

// Inicializar automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.authService.initialize();
    } catch (error) {
    }
});

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseAuthService;
}