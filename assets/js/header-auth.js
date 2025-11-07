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
            updateMobileDrawer(false, null);
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
                updateMobileDrawer(false, null);
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
                
                // Atualizar drawer mobile
                updateMobileDrawer(true, userProfile);
            }
    } else {
        // Mostrar botão de login e esconder menu do usuário
        if (btnLogin) btnLogin.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
            
            // Esconder botão "Anunciar" quando não logado
            if (btnAnnounce) btnAnnounce.classList.add('hidden');
        
        // Esconder botão flutuante
        showFloatingAnnounceButton(false);
            
            // Atualizar drawer mobile
            updateMobileDrawer(false, null);
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
        updateMobileDrawer(false, null);
    }
}

// Função para o botão flutuante clicar (reutiliza a mesma lógica)
async function handleFloatingAnnounceClick(e) {
    // Usar a mesma função de verificação
    await verificarEAbrirNovoAnuncio(e);
}

function showFloatingAnnounceButton(show) {
    // Verificar se estamos nas páginas onde o botão não deve aparecer
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('/login.html') || currentPath.includes('/auth/login.html');
    const isCadastroPage = currentPath.includes('/cadastro.html') || currentPath.includes('/auth/cadastro.html');
    const isIndexPage = currentPath.endsWith('/index.html') || currentPath.endsWith('/') || currentPath === '/index.html';
    
    // Se estiver em login, cadastro ou index, sempre esconder o botão
    if (isLoginPage || isCadastroPage || isIndexPage) {
        show = false;
    }
    
    let floatingBtn = document.getElementById('floatingAnnounceBtn');
    
    if (!floatingBtn) {
        // Criar o botão se não existir
        floatingBtn = document.createElement('button');
        floatingBtn.id = 'floatingAnnounceBtn';
        floatingBtn.className = 'floating-announce-btn';
        
        // Verificar se é mobile para mostrar apenas o ícone
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            floatingBtn.innerHTML = '<span class="btn-icon">➕</span>';
        } else {
        floatingBtn.innerHTML = '<span class="btn-icon">➕</span> Anunciar';
        }
        
        floatingBtn.addEventListener('click', handleFloatingAnnounceClick);
        document.body.appendChild(floatingBtn);
        
        // Atualizar quando a janela for redimensionada
        window.addEventListener('resize', function() {
            const isMobileNow = window.innerWidth <= 768;
            if (isMobileNow) {
                floatingBtn.innerHTML = '<span class="btn-icon">➕</span>';
            } else {
                floatingBtn.innerHTML = '<span class="btn-icon">➕</span> Anunciar';
            }
        });
    } else {
        // Atualizar conteúdo se já existe
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            floatingBtn.innerHTML = '<span class="btn-icon">➕</span>';
        } else {
            floatingBtn.innerHTML = '<span class="btn-icon">➕</span> Anunciar';
        }
    }
    
    if (show) {
        floatingBtn.classList.remove('hidden');
    } else {
        floatingBtn.classList.add('hidden');
    }
}

// Função global para alternar o dropdown do usuário
window.toggleUserDropdown = function(event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    const dropdown = document.getElementById('userDropdown');
    const userMenu = document.getElementById('userMenu');
    
    console.log('=== DEBUG DROPDOWN ===');
    console.log('Dropdown encontrado:', dropdown);
    console.log('UserMenu encontrado:', userMenu);
    
    if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        console.log('Estado atual (hidden):', isHidden);
        
        dropdown.classList.toggle('hidden');
        
        const isHiddenAfter = dropdown.classList.contains('hidden');
        console.log('Estado após toggle (hidden):', isHiddenAfter);
        
        // Forçar z-index e display
        if (!isHiddenAfter) {
            // Primeiro, garantir que o dropdown está visível e com position fixed
            dropdown.style.position = 'fixed';
            dropdown.style.zIndex = '2147483647'; // Valor máximo do z-index
            dropdown.style.display = 'block';
            dropdown.style.pointerEvents = 'auto';
            dropdown.style.visibility = 'visible';
            dropdown.style.opacity = '1';
            dropdown.style.isolation = 'isolate'; // Criar novo stacking context
            dropdown.style.transform = 'translateZ(0)'; // Força aceleração de hardware e novo stacking context
            dropdown.style.willChange = 'transform'; // Otimização de performance
            
            // Calcular posição do dropdown baseado no user-info
            const userInfo = userMenu ? userMenu.querySelector('.user-info') : null;
            if (userInfo) {
                const userInfoRect = userInfo.getBoundingClientRect();
                
                // Para position: fixed, getBoundingClientRect() já retorna valores relativos ao viewport
                // Não precisamos adicionar window.scrollY
                const topPosition = userInfoRect.bottom + 4; // 4px de margem
                const rightPosition = window.innerWidth - userInfoRect.right;
                
                dropdown.style.top = topPosition + 'px';
                dropdown.style.right = rightPosition + 'px';
                dropdown.style.left = 'auto';
                dropdown.style.bottom = 'auto';
                
                console.log('UserInfo rect:', userInfoRect);
                console.log('Top calculado (sem scrollY):', topPosition);
                console.log('Right calculado:', rightPosition);
                console.log('Window innerWidth:', window.innerWidth);
                console.log('UserInfo right:', userInfoRect.right);
            } else {
                // Fallback: posicionar no canto superior direito
                dropdown.style.top = '70px';
                dropdown.style.right = '20px';
                dropdown.style.left = 'auto';
                dropdown.style.bottom = 'auto';
                console.warn('UserInfo não encontrado, usando posição fallback');
            }
            
            // Aguardar um frame para garantir que o layout foi aplicado
            requestAnimationFrame(() => {
                // Verificar z-index computado
                const computedStyle = window.getComputedStyle(dropdown);
                console.log('Z-index computado:', computedStyle.zIndex);
                console.log('Position computado:', computedStyle.position);
                console.log('Display computado:', computedStyle.display);
                console.log('Top computado:', computedStyle.top);
                console.log('Right computado:', computedStyle.right);
                
                // Verificar elementos que podem estar sobrepondo
                const rect = dropdown.getBoundingClientRect();
                console.log('Posição do dropdown (DOMRect):', rect);
                
                // Verificar elementos na mesma posição
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                console.log('Ponto de verificação (centro):', { x: centerX, y: centerY });
                
                const elementsAtPoint = document.elementsFromPoint(centerX, centerY);
                console.log('Elementos no ponto do dropdown (centro):', elementsAtPoint);
                console.log('Primeiro elemento (deve ser o dropdown):', elementsAtPoint[0]);
                
                // Verificar se o dropdown está no topo
                if (elementsAtPoint.length > 0) {
                    const firstElement = elementsAtPoint[0];
                    if (firstElement !== dropdown && !dropdown.contains(firstElement)) {
                        console.warn('⚠️ ALERTA: Outro elemento está sobrepondo o dropdown!');
                        console.log('Elemento sobrepondo:', firstElement);
                        console.log('Tag do elemento:', firstElement.tagName);
                        console.log('Classes do elemento:', firstElement.className);
                        const overlappingStyle = window.getComputedStyle(firstElement);
                        console.log('Z-index do elemento sobrepondo:', overlappingStyle.zIndex);
                        console.log('Position do elemento sobrepondo:', overlappingStyle.position);
                    } else {
                        console.log('✅ Dropdown está no topo!');
                    }
                }
            });
        } else {
            // Quando esconder, limpar estilos inline
            dropdown.style.removeProperty('top');
            dropdown.style.removeProperty('right');
            dropdown.style.removeProperty('left');
            dropdown.style.removeProperty('bottom');
        }
    } else {
        console.error('Dropdown não encontrado!');
    }
};

// Manter compatibilidade com chamadas diretas
function toggleUserDropdown(event) {
    return window.toggleUserDropdown(event);
}

// Função para verificar login antes de abrir novo anúncio
async function verificarEAbrirNovoAnuncio(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Verificar via authService para garantir que o usuário está realmente logado
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
            // Se não há service disponível, redirecionar para login
            const currentPath = window.location.pathname;
            let basePath = '';
            if (currentPath.includes('/pages/')) {
                basePath = '../../';
            } else if (currentPath.includes('/auth/') || currentPath.includes('/user/') || currentPath.includes('/payment/') || currentPath.includes('/admin/')) {
                basePath = '../../';
            }
            window.location.href = `${basePath}pages/auth/login.html`;
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
            // Usuário não está logado, redirecionar para login
            const currentPath = window.location.pathname;
            let basePath = '';
            if (currentPath.includes('/pages/')) {
                basePath = '../../';
            } else if (currentPath.includes('/auth/') || currentPath.includes('/user/') || currentPath.includes('/payment/') || currentPath.includes('/admin/')) {
                basePath = '../../';
            }
            window.location.href = `${basePath}pages/auth/login.html`;
            return;
        }
        
        // Usuário logado, permitir acesso
        const rootPath = window.location.origin;
        window.location.href = rootPath + '/pages/property/novo-anuncio.html';
        
    } catch (error) {
        // Em caso de erro, redirecionar para login
        const currentPath = window.location.pathname;
        let basePath = '';
        if (currentPath.includes('/pages/')) {
            basePath = '../../';
        } else if (currentPath.includes('/auth/') || currentPath.includes('/user/') || currentPath.includes('/payment/') || currentPath.includes('/admin/')) {
            basePath = '../../';
        }
        window.location.href = `${basePath}pages/auth/login.html`;
    }
}

// Tornar função global
window.verificarEAbrirNovoAnuncio = verificarEAbrirNovoAnuncio;

// Função para garantir que menu inferior e drawer estejam no lugar certo
function ensureMobileMenusInPlace() {
    const headerContainer = document.getElementById('header-container');
    
    // Buscar bottomNav de várias formas diferentes
    let bottomNav = document.getElementById('bottomNav');
    
    // Se não encontrou, tentar dentro do header-container
    if (!bottomNav && headerContainer) {
        bottomNav = headerContainer.querySelector('#bottomNav');
    }
    
    // Se ainda não encontrou, verificar se está no innerHTML e criar se necessário
    if (!bottomNav && headerContainer) {
        const headerHTML = headerContainer.innerHTML || '';
        
        if (headerHTML.includes('id="bottomNav"') || headerHTML.includes("id='bottomNav'") || headerHTML.includes('bottom-nav')) {
            // Tentar encontrar usando querySelector em um elemento temporário
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = headerHTML;
            bottomNav = tempDiv.querySelector('#bottomNav');
            if (bottomNav) {
                // Remover do tempDiv e adicionar ao body
                tempDiv.removeChild(bottomNav);
                document.body.appendChild(bottomNav);
            }
        } else {
            // Se não encontrou, criar o bottomNav diretamente no body
            bottomNav = document.createElement('nav');
            bottomNav.id = 'bottomNav';
            bottomNav.className = 'bottom-nav';
            // Determinar caminho base baseado na localização atual
            const currentPath = window.location.pathname;
            let basePath = '';
            if (currentPath.includes('/pages/')) {
                basePath = '../../';
            } else if (currentPath.includes('/auth/')) {
                basePath = '../../';
            } else if (currentPath.includes('/user/')) {
                basePath = '../../';
            } else if (currentPath.includes('/payment/')) {
                basePath = '../../';
            } else if (currentPath.includes('/admin/')) {
                basePath = '../../';
            } else {
                basePath = '';
            }
            
            bottomNav.innerHTML = `
                <a href="${basePath}index.html" class="bottom-nav-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Início</span>
                </a>
                <a href="${basePath}pages/property/busca.html" class="bottom-nav-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <span>Buscar</span>
                </a>
                <a href="${basePath}pages/property/novo-anuncio.html" class="bottom-nav-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span>Anunciar</span>
                </a>
            `;
            document.body.appendChild(bottomNav);
            
            // Garantir que está visível no mobile
            if (window.innerWidth <= 768) {
                bottomNav.style.display = 'flex';
                bottomNav.style.visibility = 'visible';
            }
        }
    }
    
    // Buscar mobileDrawer de várias formas diferentes
    let mobileDrawer = document.getElementById('mobileDrawer');
    
    // Se não encontrou, tentar dentro do header-container
    if (!mobileDrawer && headerContainer) {
        mobileDrawer = headerContainer.querySelector('#mobileDrawer');
    }
    
    // Se ainda não encontrou, verificar se está no innerHTML
    if (!mobileDrawer && headerContainer) {
        const headerHTML = headerContainer.innerHTML || '';
        if (headerHTML.includes('id="mobileDrawer"') || headerHTML.includes("id='mobileDrawer'")) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = headerHTML;
            mobileDrawer = tempDiv.querySelector('#mobileDrawer');
            if (mobileDrawer) {
                tempDiv.removeChild(mobileDrawer);
                document.body.appendChild(mobileDrawer);
            }
        }
    }
    
    // Mover menu inferior para o body se estiver dentro do header-container
    if (bottomNav) {
        // Verificar se está dentro do header-container ou já no body
        const isInHeader = headerContainer && headerContainer.contains(bottomNav);
        const isInBody = document.body.contains(bottomNav) && !isInHeader;
        
        if (isInHeader) {
            document.body.appendChild(bottomNav);
        } else if (!isInBody) {
            document.body.appendChild(bottomNav);
        }
        
        // Garantir que está visível no mobile
        if (window.innerWidth <= 768) {
            bottomNav.style.display = 'flex';
            bottomNav.style.visibility = 'visible';
        }
    } else {
        // Tentar buscar novamente após um pequeno delay
        setTimeout(() => {
            const retryBottomNav = document.getElementById('bottomNav') || 
                                  (headerContainer && headerContainer.querySelector('#bottomNav'));
            if (retryBottomNav) {
                document.body.appendChild(retryBottomNav);
                if (window.innerWidth <= 768) {
                    retryBottomNav.style.display = 'flex';
                    retryBottomNav.style.visibility = 'visible';
                }
            }
        }, 100);
    }
    
    // Mover drawer para o body se estiver dentro do header-container
    if (mobileDrawer) {
        const isInHeader = headerContainer && headerContainer.contains(mobileDrawer);
        const isInBody = document.body.contains(mobileDrawer) && !isInHeader;
        
        if (isInHeader) {
            document.body.appendChild(mobileDrawer);
        } else if (!isInBody) {
            document.body.appendChild(mobileDrawer);
        }
    }
}

// Funções para controlar o menu mobile
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) {
        drawer.classList.toggle('active');
        // Prevenir scroll do body quando menu estiver aberto
        if (drawer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            // Quando o drawer abre, atualizar os elementos do drawer
            // Aguardar um pouco para garantir que o drawer está visível
            setTimeout(async () => {
                try {
                    // Verificar se usuário está logado e atualizar drawer
                    await checkUserLogin();
                    // Forçar atualização do drawer após verificar login
                    const service = window.authService || (typeof authService !== 'undefined' ? authService : null);
                    if (service) {
                        const user = await service.getCurrentUser();
                        if (user) {
                            const profile = await service.getCurrentUserProfile();
                            if (profile) {
                                updateMobileDrawer(true, profile);
                            }
                        } else {
                            updateMobileDrawer(false, null);
                        }
                    } else {
                        updateMobileDrawer(false, null);
                    }
                } catch (error) {
                    updateMobileDrawer(false, null);
                }
            }, 150);
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Atualizar drawer mobile baseado no estado de login
function updateMobileDrawer(isLoggedIn, userProfile) {
    // Garantir que menus estão no lugar certo primeiro
    ensureMobileMenusInPlace();
    
    // Tentar encontrar os elementos, com retry se não estiverem disponíveis
    const tryUpdateDrawer = (attempts = 0) => {
        
        // Buscar elementos em todo o documento, incluindo dentro do header-container
        const headerContainer = document.getElementById('header-container');
        let mobileDrawer = document.getElementById('mobileDrawer');
        
        // Se não encontrou mobileDrawer, buscar em todo o documento
        if (!mobileDrawer) {
            mobileDrawer = document.querySelector('#mobileDrawer');
        }
        
        // Se ainda não encontrou, buscar dentro do header-container
        if (!mobileDrawer && headerContainer) {
            mobileDrawer = headerContainer.querySelector('#mobileDrawer');
        }
        
        
        let drawerLogin = document.getElementById('drawerLogin');
        let drawerAnnounce = document.getElementById('drawerAnnounce');
        let drawerUser = document.getElementById('drawerUser');
        let drawerUserName = document.getElementById('drawerUserName');
        let drawerMeusAnuncios = document.getElementById('drawerMeusAnuncios');
        let drawerLogout = document.getElementById('drawerLogout');
        
        
        // Se não encontrou, tentar dentro do header-container
        if (headerContainer) {
            if (!drawerLogin) drawerLogin = headerContainer.querySelector('#drawerLogin');
            if (!drawerAnnounce) drawerAnnounce = headerContainer.querySelector('#drawerAnnounce');
            if (!drawerUser) drawerUser = headerContainer.querySelector('#drawerUser');
            if (!drawerUserName) drawerUserName = headerContainer.querySelector('#drawerUserName');
            if (!drawerMeusAnuncios) drawerMeusAnuncios = headerContainer.querySelector('#drawerMeusAnuncios');
            if (!drawerLogout) drawerLogout = headerContainer.querySelector('#drawerLogout');
        }
        
        // Se ainda não encontrou, buscar em todo o documento usando querySelector
        if (!drawerLogin) drawerLogin = document.querySelector('#drawerLogin');
        if (!drawerAnnounce) drawerAnnounce = document.querySelector('#drawerAnnounce');
        if (!drawerUser) drawerUser = document.querySelector('#drawerUser');
        if (!drawerUserName) drawerUserName = document.querySelector('#drawerUserName');
        if (!drawerMeusAnuncios) drawerMeusAnuncios = document.querySelector('#drawerMeusAnuncios');
        if (!drawerLogout) drawerLogout = document.querySelector('#drawerLogout');
        
        // Buscar todos os elementos dentro do mobileDrawer se ainda não encontrou
        if (mobileDrawer) {
            if (!drawerLogin) drawerLogin = mobileDrawer.querySelector('#drawerLogin');
            if (!drawerAnnounce) drawerAnnounce = mobileDrawer.querySelector('#drawerAnnounce');
            if (!drawerUser) drawerUser = mobileDrawer.querySelector('#drawerUser');
            if (!drawerUserName) drawerUserName = mobileDrawer.querySelector('#drawerUserName');
            if (!drawerMeusAnuncios) {
                drawerMeusAnuncios = mobileDrawer.querySelector('#drawerMeusAnuncios');
            }
            if (!drawerLogout) {
                drawerLogout = mobileDrawer.querySelector('#drawerLogout');
            }
            
            // Se ainda não encontrou, buscar por classe também
            if (!drawerLogout) {
                const logoutButtons = mobileDrawer.querySelectorAll('button.drawer-logout, .drawer-logout');
                if (logoutButtons.length > 0) {
                    drawerLogout = logoutButtons[0];
                }
            }
            
            if (!drawerMeusAnuncios) {
                const meusAnunciosLinks = mobileDrawer.querySelectorAll('a[href*="meus-anuncios"]');
                if (meusAnunciosLinks.length > 0) {
                    drawerMeusAnuncios = meusAnunciosLinks[0];
                }
            }
        }
        
        // Se drawerLogout não foi encontrado, criar dinamicamente
        if (!drawerLogout && mobileDrawer) {
            const drawerMenu = mobileDrawer.querySelector('.drawer-menu');
            if (drawerMenu) {
                drawerLogout = document.createElement('button');
                drawerLogout.id = 'drawerLogout';
                drawerLogout.className = 'drawer-item drawer-logout';
                // Usar addEventListener ao invés de onclick para garantir que funcione
                drawerLogout.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (typeof logout === 'function') {
                        logout();
                    }
                });
                drawerLogout.innerHTML = `
                    <span class="drawer-icon">🚪</span>
                    <span>Sair</span>
                `;
                drawerMenu.appendChild(drawerLogout);
            }
        }
        
        // Se drawerMeusAnuncios não foi encontrado, criar dinamicamente
        if (!drawerMeusAnuncios && mobileDrawer) {
            const drawerMenu = mobileDrawer.querySelector('.drawer-menu');
            if (drawerMenu) {
                // Determinar caminho base
                const currentPath = window.location.pathname;
                let basePath = '';
                if (currentPath.includes('/pages/')) {
                    basePath = '../../';
                } else if (currentPath.includes('/auth/') || currentPath.includes('/user/') || currentPath.includes('/payment/') || currentPath.includes('/admin/')) {
                    basePath = '../../';
                }
                
                drawerMeusAnuncios = document.createElement('a');
                drawerMeusAnuncios.id = 'drawerMeusAnuncios';
                drawerMeusAnuncios.className = 'drawer-item';
                drawerMeusAnuncios.href = `${basePath}pages/user/meus-anuncios.html`;
                drawerMeusAnuncios.innerHTML = `
                    <span class="drawer-icon">📋</span>
                    <span>Meus Anúncios</span>
                `;
                // Inserir após drawerAnnounce ou drawerUser, antes do drawerLogout
                const drawerUser = mobileDrawer.querySelector('#drawerUser');
                const drawerAnnounce = mobileDrawer.querySelector('#drawerAnnounce');
                if (drawerUser && drawerUser.parentNode) {
                    // Se drawerUser existe, inserir após ele
                    if (drawerUser.nextSibling) {
                        drawerUser.parentNode.insertBefore(drawerMeusAnuncios, drawerUser.nextSibling);
                    } else {
                        drawerUser.parentNode.appendChild(drawerMeusAnuncios);
                    }
                } else if (drawerAnnounce && drawerAnnounce.parentNode) {
                    // Se não tem drawerUser, inserir após drawerAnnounce
                    if (drawerAnnounce.nextSibling) {
                        drawerAnnounce.parentNode.insertBefore(drawerMeusAnuncios, drawerAnnounce.nextSibling);
                    } else {
                        drawerAnnounce.parentNode.appendChild(drawerMeusAnuncios);
                    }
                } else if (drawerLogout && drawerLogout.parentNode) {
                    // Último recurso: inserir antes do drawerLogout
                    drawerLogout.parentNode.insertBefore(drawerMeusAnuncios, drawerLogout);
                } else if (drawerMenu) {
                    drawerMenu.appendChild(drawerMeusAnuncios);
                }
            }
        }
        
        // Se os elementos não existem ainda e ainda temos tentativas, tentar novamente
        if (!drawerLogin && attempts < 50) {
            setTimeout(() => tryUpdateDrawer(attempts + 1), 100);
            return;
        }
        
        // Garantir que menus estão no lugar certo antes de atualizar
        ensureMobileMenusInPlace();
        
        if (isLoggedIn && userProfile) {
            // Usuário logado
            if (drawerLogin) {
                drawerLogin.classList.add('hidden');
                drawerLogin.style.display = 'none';
                drawerLogin.style.visibility = 'hidden';
            }
            if (drawerUser) {
                drawerUser.classList.remove('hidden');
                drawerUser.style.display = 'flex';
                drawerUser.style.visibility = 'visible';
                drawerUser.style.opacity = '1';
            }
            if (drawerUserName) {
                drawerUserName.textContent = userProfile.nome;
            }
            if (drawerMeusAnuncios) {
                drawerMeusAnuncios.classList.remove('hidden');
                drawerMeusAnuncios.style.display = 'flex';
                drawerMeusAnuncios.style.visibility = 'visible';
                drawerMeusAnuncios.style.opacity = '1';
                drawerMeusAnuncios.style.height = 'auto';
                drawerMeusAnuncios.style.minHeight = '48px';
                drawerMeusAnuncios.style.position = 'relative';
                drawerMeusAnuncios.style.zIndex = '1';
                // Garantir que o conteúdo HTML está presente
                if (!drawerMeusAnuncios.innerHTML || drawerMeusAnuncios.innerHTML.trim() === '' || drawerMeusAnuncios.innerHTML.trim() === '<span></span>') {
                    drawerMeusAnuncios.innerHTML = `
                        <span class="drawer-icon">📋</span>
                        <span>Meus Anúncios</span>
                    `;
                }
            }
            if (drawerLogout) {
                drawerLogout.classList.remove('hidden');
                drawerLogout.style.display = 'flex';
                drawerLogout.style.visibility = 'visible';
                drawerLogout.style.opacity = '1';
                drawerLogout.style.height = 'auto';
                drawerLogout.style.minHeight = '48px';
                drawerLogout.style.position = 'relative';
                drawerLogout.style.zIndex = '1';
                // Garantir que o conteúdo HTML está presente
                if (!drawerLogout.innerHTML || drawerLogout.innerHTML.trim() === '' || drawerLogout.innerHTML.trim() === '<span></span>') {
                    drawerLogout.innerHTML = `
                        <span class="drawer-icon">🚪</span>
                        <span>Sair</span>
                    `;
                    // Garantir que o evento de clique está configurado
                    drawerLogout.onclick = logout;
                }
            }
            // "Anunciar" sempre visível (usuário logado - vai direto para novo-anuncio)
            if (drawerAnnounce) {
                drawerAnnounce.classList.remove('hidden');
                drawerAnnounce.style.display = 'flex';
                drawerAnnounce.style.visibility = 'visible';
                drawerAnnounce.style.opacity = '1';
                // Remover listener de login e garantir que vai para novo-anuncio
                drawerAnnounce.removeEventListener('click', redirectToLogin);
                // Garantir que o href está correto
                const currentPath = window.location.pathname;
                let basePath = '';
                if (currentPath.includes('/pages/')) {
                    basePath = '../../';
                } else if (currentPath.includes('/auth/') || currentPath.includes('/user/') || currentPath.includes('/payment/') || currentPath.includes('/admin/')) {
                    basePath = '../../';
                }
                drawerAnnounce.href = `${basePath}pages/property/novo-anuncio.html`;
            }
            
            // Forçar reflow para garantir que os estilos sejam aplicados
            if (drawerMeusAnuncios) {
                drawerMeusAnuncios.offsetHeight;
            }
            if (drawerLogout) {
                drawerLogout.offsetHeight;
            }
        } else {
            // Usuário não logado
            if (drawerLogin) {
                drawerLogin.classList.remove('hidden');
                drawerLogin.style.display = 'flex';
                drawerLogin.style.visibility = 'visible';
                drawerLogin.style.opacity = '1';
            }
            if (drawerUser) {
                drawerUser.classList.add('hidden');
                drawerUser.style.display = 'none';
                drawerUser.style.visibility = 'hidden';
            }
            if (drawerMeusAnuncios) {
                drawerMeusAnuncios.classList.add('hidden');
                drawerMeusAnuncios.style.display = 'none';
                drawerMeusAnuncios.style.visibility = 'hidden';
                drawerMeusAnuncios.style.opacity = '0';
            }
            if (drawerLogout) {
                drawerLogout.classList.add('hidden');
                drawerLogout.style.display = 'none';
                drawerLogout.style.visibility = 'hidden';
                drawerLogout.style.opacity = '0';
                drawerLogout.style.height = '0';
                drawerLogout.style.minHeight = '0';
                drawerLogout.style.padding = '0';
                drawerLogout.style.margin = '0';
            }
            // "Anunciar" sempre visível (usuário não logado - redireciona para login)
            if (drawerAnnounce) {
                drawerAnnounce.classList.remove('hidden');
                drawerAnnounce.style.display = 'flex';
                drawerAnnounce.style.visibility = 'visible';
                drawerAnnounce.style.opacity = '1';
                // Adicionar listener para redirecionar para login se não estiver logado
                drawerAnnounce.removeEventListener('click', redirectToLogin);
                drawerAnnounce.addEventListener('click', redirectToLogin);
                // Calcular caminho para login
                const currentPath = window.location.pathname;
                let basePath = '';
                if (currentPath.includes('/pages/')) {
                    basePath = '../../';
                } else if (currentPath.includes('/auth/') || currentPath.includes('/user/') || currentPath.includes('/payment/') || currentPath.includes('/admin/')) {
                    basePath = '../../';
                }
                drawerAnnounce.href = `${basePath}pages/auth/login.html`;
            }
        }
    };
    
    tryUpdateDrawer();
}

// Função para redirecionar para login quando clicar em "Anunciar" sem estar logado
function redirectToLogin(event) {
    event.preventDefault();
    const currentPath = window.location.pathname;
    let basePath = '';
    if (currentPath.includes('/pages/')) {
        basePath = '../../';
    } else if (currentPath.includes('/auth/') || currentPath.includes('/user/') || currentPath.includes('/payment/') || currentPath.includes('/admin/')) {
        basePath = '../../';
    }
    window.location.href = `${basePath}pages/auth/login.html`;
}

// Tornar funções globais
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

async function logout() {
    try {
        const service = window.authService || (typeof authService !== 'undefined' ? authService : null);
        if (service) {
            await service.signOut();
        }
        closeMobileMenu();
        
        // Calcular caminho correto para index.html baseado na localização atual
        const currentPath = window.location.pathname;
        let indexPath = 'index.html';
        
        // Se estiver em uma subpasta, calcular o caminho relativo
        if (currentPath.includes('/pages/')) {
            // Está em /pages/property/, /pages/user/, etc.
            indexPath = '../../index.html';
        } else if (currentPath.includes('/auth/') || currentPath.includes('/admin/') || currentPath.includes('/payment/')) {
            // Está em /pages/auth/, /pages/admin/, /pages/payment/
            indexPath = '../../index.html';
        } else if (currentPath !== '/' && currentPath !== '/index.html') {
            // Está na raiz mas não é index.html
            indexPath = 'index.html';
        } else {
            // Já está na raiz
            indexPath = 'index.html';
        }
        
        window.location.href = indexPath;
    } catch (error) {
        // Fallback: limpar localStorage e redirecionar
    localStorage.removeItem('usuarioLogado');
        // Limpar tokens do Supabase
        Object.keys(localStorage).forEach(key => {
            if (key.includes('supabase') && key.includes('auth-token')) {
                localStorage.removeItem(key);
            }
        });
        
        // Calcular caminho correto para index.html baseado na localização atual
        const currentPath = window.location.pathname;
        let indexPath = 'index.html';
        
        if (currentPath.includes('/pages/')) {
            indexPath = '../../index.html';
        } else if (currentPath.includes('/auth/') || currentPath.includes('/admin/') || currentPath.includes('/payment/')) {
            indexPath = '../../index.html';
        } else if (currentPath !== '/' && currentPath !== '/index.html') {
            indexPath = 'index.html';
        } else {
            indexPath = 'index.html';
        }
        
        window.location.href = indexPath;
    }
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('userDropdown');
    const userInfo = userMenu ? userMenu.querySelector('.user-info') : null;
    
    // Se o clique foi no user-info, não fechar (já é tratado pelo toggle)
    if (userInfo && userInfo.contains(event.target)) {
        return;
    }
    
    // Se o clique foi dentro do dropdown, não fechar
    if (dropdown && dropdown.contains(event.target)) {
        return;
    }
    
    // Se o clique foi fora do menu do usuário, fechar o dropdown
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

// Atualizar item ativo no menu inferior
function updateBottomNavActive() {
    // Garantir que menu está no lugar certo primeiro
    ensureMobileMenusInPlace();
    
    // Tentar encontrar os elementos, com retry se não estiverem disponíveis
    const tryUpdateNav = (attempts = 0) => {
        const headerContainer = document.getElementById('header-container');
        
        // Buscar bottomNav em todo o documento, incluindo dentro do header-container
        let bottomNav = document.getElementById('bottomNav');
        if (!bottomNav && headerContainer) {
            bottomNav = headerContainer.querySelector('#bottomNav');
        }
        
        // Buscar itens do menu
        let bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        if (bottomNavItems.length === 0 && headerContainer) {
            bottomNavItems = headerContainer.querySelectorAll('.bottom-nav-item');
        }
        
        // Garantir que menu está visível no mobile
        if (bottomNav && window.innerWidth <= 768) {
            bottomNav.style.display = 'flex';
            bottomNav.style.visibility = 'visible';
        }
        
        // Se não encontrou elementos e ainda temos tentativas, tentar novamente
        if (bottomNavItems.length === 0 && attempts < 20) {
            setTimeout(() => tryUpdateNav(attempts + 1), 150);
            return;
        }
        
        const currentPath = window.location.pathname;
        
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href) {
                // Normalizar o caminho
                let itemPath = href;
                if (itemPath.startsWith('http://') || itemPath.startsWith('https://')) {
                    itemPath = new URL(itemPath).pathname;
                } else if (itemPath.startsWith('/')) {
                    // Já é um caminho absoluto
                } else {
                    // Caminho relativo, converter para absoluto baseado na página atual
                    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                    itemPath = basePath + '/' + itemPath;
                }
                
                // Comparar caminhos
                if (currentPath === itemPath || 
                    currentPath.includes(itemPath) ||
                    (itemPath === '/index.html' && (currentPath === '/' || currentPath === '/index.html')) ||
                    (itemPath.includes('index.html') && (currentPath === '/' || currentPath.endsWith('/index.html')))) {
                    item.classList.add('active');
                }
            }
        });
    };
    
    tryUpdateNav();
}

// Verificar login quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    ensureMobileMenusInPlace();
    startLoginCheck();
    updateBottomNavActive();
    
    // Verificar novamente após um tempo
    setTimeout(() => {
        ensureMobileMenusInPlace();
        updateBottomNavActive();
    }, 500);
});

// Também verificar quando a página estiver totalmente carregada
window.addEventListener('load', function() {
    ensureMobileMenusInPlace();
    startLoginCheck();
    updateBottomNavActive();
    
    // Verificar novamente após um tempo
    setTimeout(() => {
        ensureMobileMenusInPlace();
        updateBottomNavActive();
    }, 500);
});

// Verificar quando a janela é redimensionada (para garantir menu aparece no mobile)
window.addEventListener('resize', function() {
    ensureMobileMenusInPlace();
    updateBottomNavActive();
});

// Verificar periodicamente se os menus estão no lugar certo (especialmente útil após carregamento dinâmico)
setInterval(function() {
    ensureMobileMenusInPlace();
}, 1000);

// Verificar quando o header for carregado dinamicamente
function checkHeaderLoaded() {
    const headerContainer = document.getElementById('header-container');
    
    if (headerContainer && headerContainer.innerHTML.trim() !== '') {
        // Garantir que menus estão no lugar certo
        ensureMobileMenusInPlace();
        
        // Header foi carregado, aguardar um pouco e verificar login
        setTimeout(() => {
            startLoginCheck();
            updateBottomNavActive();
            ensureMobileMenusInPlace();
        }, 200);
        
        // Verificar novamente após mais tempo
        setTimeout(() => {
            ensureMobileMenusInPlace();
            updateBottomNavActive();
        }, 500);
    }
}

// Usar MutationObserver para detectar quando o header é inserido
const headerObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    const headerContainer = document.getElementById('header-container');
                    let bottomNav = document.getElementById('bottomNav');
                    let mobileDrawer = document.getElementById('mobileDrawer');
                    
                    // Usar função centralizada para mover elementos
                    ensureMobileMenusInPlace();
                    
                    if (node.id === 'mobileDrawer' || 
                        node.id === 'bottomNav' ||
                        (node.querySelector && node.querySelector('#mobileDrawer')) ||
                        (node.querySelector && node.querySelector('#bottomNav'))) {
                        // Elementos do menu foram inseridos, atualizar
                        setTimeout(() => {
                            ensureMobileMenusInPlace();
                            checkUserLogin();
                            updateBottomNavActive();
                        }, 100);
                    }
                }
            });
        }
        if (mutation.type === 'attributes' && mutation.attributeName === 'innerHTML') {
            if (mutation.target.id === 'header-container') {
                // Aguardar um pouco para o DOM atualizar
                setTimeout(() => {
                    checkHeaderLoaded();
                }, 50);
            }
        }
        
        // Também verificar quando elementos são adicionados ao header-container
        if (mutation.type === 'childList' && mutation.target.id === 'header-container') {
            setTimeout(() => {
                ensureMobileMenusInPlace();
                
                const bottomNav = document.getElementById('bottomNav');
                const mobileDrawer = document.getElementById('mobileDrawer');
                
                // Atualizar após mover
                if (bottomNav || mobileDrawer) {
                    setTimeout(() => {
                        ensureMobileMenusInPlace();
                        checkUserLogin();
                        updateBottomNavActive();
                    }, 100);
                }
            }, 50);
        }
    });
});

// Observar mudanças no header-container
document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerObserver.observe(headerContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['innerHTML']
        });
        checkHeaderLoaded();
    }
});

// Fallback: verificar quando o header for carregado dinamicamente (método antigo)
document.addEventListener('DOMNodeInserted', function(event) {
    if (event.target.id === 'header-container' || 
        (event.target.querySelector && event.target.querySelector('#header-container'))) {
        setTimeout(() => {
            startLoginCheck();
            updateBottomNavActive();
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
