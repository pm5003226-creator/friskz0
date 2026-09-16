// Friskz0 Proxy Application
class FriskzProxy {
    constructor() {
        this.swRegistered = false;
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/uv/sw.js', {
                    scope: '/uv/',
                });
                this.swRegistered = true;
                console.log('✓ Proxy service worker registered');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
                this.fallbackProxy();
            }
        }
    }

    async proxyUrl(targetUrl) {
        // Validate URL
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        try {
            new URL(targetUrl);
        } catch {
            throw new Error('Invalid URL');
        }

        if (this.swRegistered) {
            // Use service worker proxy
            const proxyUrl = '/uv/' + encodeURIComponent(targetUrl);
            return proxyUrl;
        } else {
            // Fallback proxy methods
            return this.fallbackProxyUrl(targetUrl);
        }
    }

    fallbackProxyUrl(targetUrl) {
        // Multiple fallback methods
        const methods = [
            'https://cors-anywhere.herokuapp.com/' + targetUrl,
            'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl),
            '/proxy/?url=' + encodeURIComponent(targetUrl),
        ];
        return methods[0];
    }

    async fallbackProxy() {
        console.log('Using fallback proxy method');
    }
}

// Initialize on load
const friskzProxy = new FriskzProxy();

// Update the main index.html to use this
window.FriskzProxy = friskzProxy;
