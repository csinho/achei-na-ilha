// Sistema de autenticação e gerenciamento de usuário com Supabase
async function checkUserLogin() {
    const btnLogin = document.getElementById('btnLogin');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userType = document.getElementById('userType');
    const userAvatar = document.getElementById('userAvatar');

    try {
        // Verificar se o AuthService está disponível
        if (typeof authService === 'undefined') {
            return;
        }

        // Aguardar inicialização se necessário
        if (!authService.isInitialized) {
            await authService.initialize();
        }

        // Verificar se usuário está logado
        const user = authService.getCurrentUser();
        
        if (user) {
            // Buscar perfil completo do usuário
            const userProfile = await authService.getCurrentUserProfile();
            
            if (userProfile) {
                // Esconder botão de login e mostrar menu do usuário
                if (btnLogin) btnLogin.classList.add('hidden');
                if (userMenu) userMenu.classList.remove('hidden');
                
                // Atualizar informações do usuário
                if (userName) userName.textContent = userProfile.nome;
                if (userType) userType.textContent = userProfile.tipo_usuario === 'anunciante' ? 'Anunciante' : 'Visitante';
                if (userAvatar) userAvatar.textContent = userProfile.nome.charAt(0).toUpperCase();
                
                // Atualizar links de navegação baseado no tipo de usuário
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    if (link.textContent === 'Anunciar' && userProfile.tipo_usuario !== 'anunciante') {
                        link.style.display = 'none';
                    }
                });
            }
        } else {
            // Mostrar botão de login e esconder menu do usuário
            if (btnLogin) btnLogin.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
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
    }
}

async function logout() {
    try {
        if (typeof authService !== 'undefined') {
            await authService.signOut();
        }
        window.location.href = 'index.html';
    } catch (error) {
        // Fallback: limpar localStorage e redirecionar
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    }
}

// Verificar login quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
});
