/**
 * Sistema de Toast Notifications
 * Achei na Ilha - Notificações no canto superior direito
 */

class ToastSystem {
    constructor() {
        this.container = null;
        this.initialized = false;
        // Aguardar DOM estar pronto antes de inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // DOM já está pronto
            this.init();
        }
    }

    init() {
        // Verificar se body existe
        if (!document.body) {
            // Se body ainda não existe, tentar novamente em breve
            setTimeout(() => this.init(), 10);
            return;
        }

        // Criar container de toasts se não existir
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
        
        this.initialized = true;
    }

    ensureInitialized() {
        // Garantir que o container existe antes de mostrar toast
        if (!this.initialized || !this.container) {
            this.init();
            // Se ainda não funcionou, tentar criar container na hora
            if (!this.container && document.body) {
                this.container = document.createElement('div');
                this.container.id = 'toast-container';
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
                this.initialized = true;
            }
        }
    }

    show(message, type = 'info', duration = 4000) {
        // Garantir que está inicializado antes de mostrar
        this.ensureInitialized();
        
        // Se ainda não conseguiu inicializar, retornar null (o fallback será usado)
        if (!this.container || !document.body) {
            return null;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Ícone baseado no tipo
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const icon = icons[type] || icons.info;
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${this.escapeHtml(message)}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }
        
        return toast;
    }

    remove(toast) {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Métodos de conveniência
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }
}

// Criar instância global
window.toast = new ToastSystem();

// CSS inline para garantir que funcione em todas as páginas
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 400px;
            pointer-events: none;
        }

        .toast {
            background: white;
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            min-width: 300px;
            max-width: 400px;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: auto;
            border-left: 4px solid;
        }

        .toast-show {
            opacity: 1;
            transform: translateX(0);
        }

        .toast-hide {
            opacity: 0;
            transform: translateX(400px);
        }

        .toast-success {
            border-left-color: #28a745;
        }

        .toast-error {
            border-left-color: #dc3545;
        }

        .toast-warning {
            border-left-color: #ffc107;
        }

        .toast-info {
            border-left-color: #17a2b8;
        }

        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }

        .toast-icon {
            font-size: 20px;
            flex-shrink: 0;
        }

        .toast-message {
            font-size: 14px;
            color: #333;
            line-height: 1.5;
            flex: 1;
        }

        .toast-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: color 0.2s;
        }

        .toast-close:hover {
            color: #333;
        }

        @media (max-width: 768px) {
            .toast-container {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
            }

            .toast {
                min-width: auto;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

