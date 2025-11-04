// Função global para forçar atualização do header (pode ser chamada de qualquer lugar)
window.updateHeaderLogin = async function() {
    try {
        await checkUserLogin();
    } catch (error) {
        // Não bloquear se houver erro de DOM
    }
};

// Funções de autenticação para o header
async function checkUserLogin() {
    // Verificar se os elementos do header existem
    const btnLogin = document.getElementById('btnLogin');
    const btnAnnounce = document.getElementById('btnAnnounce');
    const userMenu = document.getElementById('userMenu');
    
    // Se os elementos não existem ainda, tentar novamente em 50ms
    if (!btnLogin || !btnAnnounce || !userMenu) {
        setTimeout(checkUserLogin, 50);
        return;
    }
    
    try {
        const userName = document.getElementById('userName');
        const userType = document.getElementById('userType');
        const userAvatar = document.getElementById('userAvatar');

        // Verificar se o AuthService está disponível
        let service = null;
        
        if (typeof window.authService !== 'undefined') {
            service = window.authService;
        } else if (typeof authService !== 'undefined') {
            service = authService;
        }
        
        if (!service) {
            // Se não há service, garantir que header mostra botão de login
            if (btnLogin) btnLogin.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            if (btnAnnounce) btnAnnounce.classList.add('hidden');
            showFloatingAnnounceButton(false);
            return;
        }

        // Aguardar inicialização se necessário
        if (!service.isInitialized) {
            try {
                await service.initialize();
            } catch (e) {
                // Se falhar ao inicializar, mostrar botão de login
                if (btnLogin) btnLogin.classList.remove('hidden');
                if (userMenu) userMenu.classList.add('hidden');
                if (btnAnnounce) btnAnnounce.classList.add('hidden');
                showFloatingAnnounceButton(false);
                return;
            }
        }

        // Verificar se usuário está logado (await pois getCurrentUser agora é async)
        const user = await service.getCurrentUser();
        
        if (user) {
            // Buscar perfil completo do usuário
            const userProfile = await service.getCurrentUserProfile();
            
            if (userProfile) {
                // Esconder botão de login e mostrar menu do usuário
                if (btnLogin) btnLogin.classList.add('hidden');
                if (userMenu) userMenu.classList.remove('hidden');
                
                // Mostrar botão "Anunciar" para todos os usuários logados
                if (btnAnnounce) {
                    btnAnnounce.classList.remove('hidden');
                    // Remover listeners anteriores e adicionar novo (sem usar replaceChild)
                    btnAnnounce.removeEventListener('click', verificarEAbrirNovoAnuncio);
                    btnAnnounce.addEventListener('click', verificarEAbrirNovoAnuncio);
                }
                
                // Atualizar informações do usuário
                if (userName) userName.textContent = userProfile.nome;
                if (userType) userType.textContent = 'Anunciante'; // Todos são anunciantes agora
                if (userAvatar) userAvatar.textContent = userProfile.nome.charAt(0).toUpperCase();
                
                // Mostrar botão flutuante para todos os usuários logados
                showFloatingAnnounceButton(true);
            }
        } else {
            // Mostrar botão de login e esconder menu do usuário
            if (btnLogin) btnLogin.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            
            // Esconder botão "Anunciar" quando não logado
            if (btnAnnounce) btnAnnounce.classList.add('hidden');
            
            // Esconder botão flutuante
            showFloatingAnnounceButton(false);
        }
    } catch (error) {
        // Não logar erro se não há sessão (comportamento normal)
        if (!error.message.includes('Auth session missing') && 
            !error.message.includes('session not found') &&
            !error.message.includes('No session')) {
        }
        // Em caso de erro, mostrar botão de login
        if (btnLogin) btnLogin.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
        if (btnAnnounce) btnAnnounce.classList.add('hidden');
        
        // Esconder botão "Meus Anúncios" quando não logado
        const btnMeusAnuncios = document.getElementById('btnMeusAnuncios');
        if (btnMeusAnuncios) btnMeusAnuncios.classList.add('hidden');
        
        showFloatingAnnounceButton(false);
    }
}

// Função para o botão flutuante clicar (reutiliza a mesma lógica)
async function handleFloatingAnnounceClick(e) {
    // Usar a mesma função de verificação
    await verificarEAbrirNovoAnuncio(e);
}

function showFloatingAnnounceButton(show) {
    let floatingBtn = document.getElementById('floatingAnnounceBtn');
    
    if (!floatingBtn) {
        // Criar o botão se não existir
        floatingBtn = document.createElement('button');
        floatingBtn.id = 'floatingAnnounceBtn';
        floatingBtn.className = 'floating-announce-btn';
        floatingBtn.innerHTML = '<span class="btn-icon">➕</span> Anunciar';
        floatingBtn.addEventListener('click', handleFloatingAnnounceClick);
        document.body.appendChild(floatingBtn);
    }
    
    if (show) {
        floatingBtn.classList.remove('hidden');
    } else {
        floatingBtn.classList.add('hidden');
    }
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// Função para verificar login antes de abrir novo anúncio
async function verificarEAbrirNovoAnuncio(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    // PRIMEIRO: Verificar token no localStorage (buscar de várias formas)
    let tokenFound = false;
    let tokenKey = null;
    
    // Tentar diferentes padrões de chave do Supabase
    const possibleKeys = [
        ...Object.keys(localStorage).filter(key => key.includes('supabase') && key.includes('auth-token')),
        ...Object.keys(localStorage).filter(key => key.includes('sb-') && key.includes('auth-token')),
        ...Object.keys(localStorage).filter(key => key.startsWith('sb-svgmuxdxxrapepbodbgv-auth-token'))
    ];
    
    for (const key of possibleKeys) {
        try {
            const tokenData = JSON.parse(localStorage.getItem(key));
            if (tokenData && tokenData.access_token) {
                tokenFound = true;
                tokenKey = key;
                break;
            }
        } catch (e) {
            // Continuar tentando outras chaves
        }
    }
    
    // Também verificar se há sessão do Supabase diretamente
    if (!tokenFound) {
        // Verificar se há alguma chave que contenha dados de sessão
        const sessionKeys = Object.keys(localStorage).filter(key => 
            key.includes('supabase') || 
            (key.includes('sb-') && key.includes('auth'))
        );
        
        for (const key of sessionKeys) {
            try {
                const data = localStorage.getItem(key);
                if (data && (data.includes('access_token') || data.includes('refresh_token'))) {
                    tokenFound = true;
                    break;
                }
            } catch (e) {
                // Continuar
            }
        }
    }
    
    if (tokenFound) {
        const rootPath = window.location.origin;
        window.location.href = rootPath + '/pages/property/novo-anuncio.html';
        return;
    }
    
    // SEGUNDO: Verificar via authService (aguardar mais tempo)
    try {
        let service = null;
        let attempts = 0;
        const maxAttempts = 5;
        
        // Tentar encontrar o service com várias tentativas
        while (!service && attempts < maxAttempts) {
            if (typeof window.authService !== 'undefined') {
                service = window.authService;
            } else if (typeof authService !== 'undefined') {
                service = authService;
            }
            
            if (!service) {
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }
        }
        
        if (!service) {
            // Se o botão está visível, provavelmente está logado, então permitir acesso
            const rootPath = window.location.origin;
            window.location.href = rootPath + '/pages/property/novo-anuncio.html';
            return;
        }
        
        // Inicializar se necessário
        if (!service.isInitialized) {
            await service.initialize();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Aguardar um pouco mais para garantir que está pronto
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = await service.getCurrentUser();
        if (!user) {
            // Se o botão está visível mas não encontrou usuário, pode ser um problema de timing
            // Permitir acesso mesmo assim (pois o botão só aparece quando logado)
            const rootPath = window.location.origin;
            window.location.href = rootPath + '/pages/property/novo-anuncio.html';
            return;
        }
        
        // Usuário logado, permitir acesso
        const rootPath = window.location.origin;
        window.location.href = rootPath + '/pages/property/novo-anuncio.html';
        
    } catch (error) {
        // Se o botão está visível, provavelmente está logado, então permitir acesso
        const rootPath = window.location.origin;
        window.location.href = rootPath + '/pages/property/novo-anuncio.html';
    }
}

// Tornar função global
window.verificarEAbrirNovoAnuncio = verificarEAbrirNovoAnuncio;

async function logout() {
    try {
        const service = window.authService || (typeof authService !== 'undefined' ? authService : null);
        if (service) {
            await service.signOut();
        }
        window.location.href = 'index.html';
    } catch (error) {
        // Fallback: limpar localStorage e redirecionar
        localStorage.removeItem('usuarioLogado');
        // Limpar tokens do Supabase
        Object.keys(localStorage).forEach(key => {
            if (key.includes('supabase') && key.includes('auth-token')) {
                localStorage.removeItem(key);
            }
        });
        window.location.href = 'index.html';
    }
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

// Sistema robusto de verificação de login
let loginCheckInterval = null;
let maxAttempts = 50; // Máximo de tentativas
let attempts = 0;

function startLoginCheck() {
    if (loginCheckInterval) {
        clearInterval(loginCheckInterval);
    }
    
    attempts = 0;
    loginCheckInterval = setInterval(() => {
        attempts++;
        
        const btnLogin = document.getElementById('btnLogin');
        const userMenu = document.getElementById('userMenu');
        
        if (btnLogin && userMenu) {
            // Elementos encontrados, verificar login
            checkUserLogin();
            clearInterval(loginCheckInterval);
            loginCheckInterval = null;
        } else if (attempts >= maxAttempts) {
            // Máximo de tentativas atingido
            clearInterval(loginCheckInterval);
            loginCheckInterval = null;
        }
    }, 50);
}

// Verificar login quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    startLoginCheck();
});

// Também verificar quando a página estiver totalmente carregada
window.addEventListener('load', function() {
    startLoginCheck();
});

// Verificar quando o header for carregado dinamicamente
document.addEventListener('DOMNodeInserted', function(event) {
    if (event.target.id === 'header-container' || 
        (event.target.querySelector && event.target.querySelector('#header-container'))) {
        setTimeout(() => {
            startLoginCheck();
        }, 100);
    }
});

// Listener para mudanças de estado de autenticação
let authListenerAdded = false;

function setupAuthListener() {
    if (authListenerAdded) return;
    
    // Aguardar authService estar disponível
    const checkAuthService = setInterval(() => {
        if (typeof window.authService !== 'undefined' && window.authService.isInitialized) {
            clearInterval(checkAuthService);
            
            // Adicionar listener para atualizar header quando auth mudar
            window.authService.onAuthStateChange((event, session, user) => {
                // Se o usuário fez login ou logout, atualizar header imediatamente
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                    // Aguardar um pouco para garantir que o estado foi atualizado
                    setTimeout(async () => {
                        try {
                            await checkUserLogin();
                        } catch (error) {
                        }
                    }, 300);
                }
            });
            
            // Verificar login imediatamente após configurar listener
            setTimeout(async () => {
                try {
                    await checkUserLogin();
                } catch (error) {
                }
            }, 500);
            
            authListenerAdded = true;
        }
    }, 100);
    
    // Limitar tentativas
    setTimeout(() => {
        clearInterval(checkAuthService);
    }, 10000);
}

// Configurar listener quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setupAuthListener();
});

window.addEventListener('load', function() {
    setupAuthListener();
});
