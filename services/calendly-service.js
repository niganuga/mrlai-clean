/**
 * Calendly API v2 Service
 * Professional integration following BuzzwordCRM example patterns
 */

class CalendlyService {
    constructor() {
        this.baseUrl = 'https://api.calendly.com';
        this.widgetUrl = 'https://calendly.com';
        this.accessToken = null;
        
        // Initialize from environment or config
        this.config = {
            username: 'mrlai-clean',
            clientId: process.env.CALENDLY_CLIENT_ID || 'YOUR_CLIENT_ID',
            redirectUri: process.env.CALENDLY_REDIRECT_URI || 'http://localhost:3000/oauth/callback',
            organizationUri: process.env.CALENDLY_ORGANIZATION_URI,
            userUri: process.env.CALENDLY_USER_URI
        };
        
        this.eventTypes = {
            basic: 'basic-wash',
            premium: 'premium-detail', 
            luxury: 'luxury-detail',
            ceramic: 'ceramic-coating',
            ppf: 'paint-protection-film',
            tinting: 'window-tinting'
        };
    }

    /**
     * Get OAuth authorization URL
     */
    getAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            response_type: 'code',
            redirect_uri: this.config.redirectUri,
            scope: 'read write'
        });
        
        return `${this.baseUrl}/oauth/authorize?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            const response = await fetch(`${this.baseUrl}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'authorization_code',
                    client_id: this.config.clientId,
                    client_secret: process.env.CALENDLY_CLIENT_SECRET,
                    code: code,
                    redirect_uri: this.config.redirectUri
                })
            });

            const data = await response.json();
            
            if (data.access_token) {
                this.accessToken = data.access_token;
                localStorage.setItem('calendly_access_token', this.accessToken);
                return data;
            }
            
            throw new Error('Failed to get access token');
        } catch (error) {
            console.error('Token exchange error:', error);
            throw error;
        }
    }

    /**
     * Set access token
     */
    setAccessToken(token) {
        this.accessToken = token;
    }

    /**
     * Get stored access token
     */
    getStoredToken() {
        if (!this.accessToken) {
            this.accessToken = localStorage.getItem('calendly_access_token');
        }
        return this.accessToken;
    }

    /**
     * Make authenticated API request
     */
    async apiRequest(endpoint, options = {}) {
        const token = this.getStoredToken();
        if (!token) {
            throw new Error('No access token available');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, clear it
                    localStorage.removeItem('calendly_access_token');
                    this.accessToken = null;
                    throw new Error('Access token expired');
                }
                throw new Error(`API request failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Calendly API error:', error);
            throw error;
        }
    }

    /**
     * Get user information
     */
    async getCurrentUser() {
        return await this.apiRequest('/users/me');
    }

    /**
     * Get organization information
     */
    async getOrganization() {
        const user = await this.getCurrentUser();
        if (user.resource.current_organization) {
            return await this.apiRequest(`/organizations/${user.resource.current_organization.split('/').pop()}`);
        }
        throw new Error('No organization found');
    }

    /**
     * List event types
     */
    async getEventTypes() {
        const user = await this.getCurrentUser();
        const userUri = user.resource.uri;
        return await this.apiRequest(`/event_types?user=${userUri}`);
    }

    /**
     * Create event type
     */
    async createEventType(eventData) {
        return await this.apiRequest('/event_types', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    }

    /**
     * Get scheduled events
     */
    async getScheduledEvents(options = {}) {
        const params = new URLSearchParams(options);
        return await this.apiRequest(`/scheduled_events?${params.toString()}`);
    }

    /**
     * Generate widget URL for service with advanced customization
     */
    getWidgetUrl(serviceType, options = {}) {
        const eventType = this.eventTypes[serviceType];
        if (!eventType) {
            throw new Error(`Unknown service type: ${serviceType}`);
        }

        const baseUrl = `${this.widgetUrl}/${this.config.username}/${eventType}`;
        
        // Default embed customizations following official docs
        const defaultParams = {
            // Hide/show options
            hide_event_type_details: '0',  // Show service details
            hide_gdpr_banner: '1',         // Hide GDPR banner
            hide_landing_page_details: '0', // Show profile info
            
            // Branding (Mr. Lai's colors)
            primary_color: 'A8E6CF',       // Mint green
            text_color: '000000',          // Black text
            background_color: 'ffffff',    // White background
            
            // Pre-fill options (can be overridden)
            ...this.getPreFillParams(options.preFill || {}),
            
            // Additional customizations
            ...options
        };
        
        // Remove undefined/null values
        Object.keys(defaultParams).forEach(key => {
            if (defaultParams[key] === undefined || defaultParams[key] === null) {
                delete defaultParams[key];
            }
        });
        
        const params = new URLSearchParams(defaultParams);
        return `${baseUrl}?${params.toString()}`;
    }
    
    /**
     * Generate pre-fill parameters for booking form
     */
    getPreFillParams(preFillData = {}) {
        const params = {};
        
        // Pre-fill customer information if available
        if (preFillData.name) {
            params.name = preFillData.name;
        }
        
        if (preFillData.email) {
            params.email = preFillData.email;
        }
        
        // Pre-fill custom questions
        if (preFillData.carInfo) {
            params['a1'] = preFillData.carInfo; // Assuming first custom question
        }
        
        if (preFillData.location) {
            params['a2'] = preFillData.location; // Assuming second custom question
        }
        
        return params;
    }
    
    /**
     * Create widget with pre-filled customer data
     */
    embedWithCustomerData(container, serviceType, customerData = {}) {
        const options = {
            preFill: {
                name: customerData.name,
                email: customerData.email,
                carInfo: customerData.carInfo,
                location: customerData.location
            }
        };
        
        return this.embedInlineWidget(container, serviceType, options);
    }

    /**
     * Embed inline widget using official Calendly advanced embed
     */
    embedInlineWidget(container, serviceType, options = {}) {
        const url = this.getWidgetUrl(serviceType, options);
        
        // Create unique container ID
        const containerId = `calendly-embed-${serviceType}-${Date.now()}`;
        
        // Clear container and create embed element
        container.innerHTML = `
            <div id="${containerId}" style="min-width:320px;height:700px;"></div>
        `;
        
        const embedElement = document.getElementById(containerId);
        
        // Load Calendly script and initialize widget
        this.loadWidgetScript().then(() => {
            if (window.Calendly) {
                // Use official Calendly.initInlineWidget method
                window.Calendly.initInlineWidget({
                    url: url,
                    parentElement: embedElement,
                    resize: true, // Auto-resize functionality
                    ...options
                });
                
                console.log(`✅ Calendly widget initialized: ${serviceType}`);
            } else {
                console.error('Calendly script not loaded');
                this.showEmbedError(container, serviceType);
            }
        }).catch((error) => {
            console.error('Failed to load Calendly script:', error);
            this.showEmbedError(container, serviceType);
        });
        
        return embedElement;
    }
    
    /**
     * Show error fallback when embed fails
     */
    showEmbedError(container, serviceType) {
        const serviceName = serviceType.charAt(0).toUpperCase() + serviceType.slice(1).replace('-', ' ');
        container.innerHTML = `
            <div class="calendly-error" style="
                padding: 2rem;
                text-align: center;
                background: rgba(168, 230, 207, 0.1);
                border: 2px solid var(--color-primary);
                border-radius: 12px;
                color: var(--color-light);
            ">
                <h4 style="color: var(--color-primary); margin-bottom: 1rem;">📅 ${serviceName} Booking</h4>
                <p>Calendar is loading... If this takes too long:</p>
                <div style="margin: 1rem 0;">
                    <a href="${this.getWidgetUrl(serviceType)}" 
                       target="_blank" 
                       style="
                           background: var(--color-primary);
                           color: var(--color-dark);
                           padding: 0.75rem 1.5rem;
                           text-decoration: none;
                           border-radius: 6px;
                           font-weight: bold;
                           display: inline-block;
                       ">Book in New Tab</a>
                </div>
                <p style="font-size: 0.9rem; opacity: 0.8;">Or call <a href="tel:323-558-2652" style="color: var(--color-primary);">(323) 558-2652</a></p>
            </div>
        `;
    }

    /**
     * Load official Calendly widget script with proper error handling
     */
    async loadWidgetScript() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.Calendly) {
                resolve(window.Calendly);
                return;
            }

            // Check if script is already loading
            const existingScript = document.querySelector('script[src*="calendly"]');
            if (existingScript) {
                // Wait for existing script to load
                const checkCalendly = setInterval(() => {
                    if (window.Calendly) {
                        clearInterval(checkCalendly);
                        resolve(window.Calendly);
                    }
                }, 100);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkCalendly);
                    if (!window.Calendly) {
                        reject(new Error('Calendly script load timeout'));
                    }
                }, 10000);
                
                return;
            }

            // Load official Calendly script
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.type = 'text/javascript';
            script.async = true;
            
            script.onload = () => {
                console.log('✅ Calendly script loaded successfully');
                resolve(window.Calendly);
            };
            
            script.onerror = (error) => {
                console.error('❌ Failed to load Calendly script:', error);
                reject(new Error('Failed to load Calendly script'));
            };
            
            document.head.appendChild(script);
            
            // Timeout fallback
            setTimeout(() => {
                if (!window.Calendly) {
                    reject(new Error('Calendly script load timeout after 10s'));
                }
            }, 10000);
        });
    }

    /**
     * Set up official Calendly event listeners using postMessage API
     */
    setupEventListeners(callback) {
        // Official Calendly event validation function
        const isCalendlyEvent = (e) => {
            return e.origin === "https://calendly.com" && e.data.event?.startsWith("calendly.");
        };
        
        window.addEventListener('message', (e) => {
            if (isCalendlyEvent(e)) {
                console.log('Calendly Event:', e.data.event);
                console.log('Event Details:', e.data.payload);
                
                // Handle different Calendly events
                switch (e.data.event) {
                    case 'calendly.profile_page_viewed':
                        this.handleProfileViewed(e.data.payload, callback);
                        break;
                        
                    case 'calendly.event_type_viewed':
                        this.handleEventTypeViewed(e.data.payload, callback);
                        break;
                        
                    case 'calendly.date_and_time_selected':
                        this.handleDateTimeSelected(e.data.payload, callback);
                        break;
                        
                    case 'calendly.event_scheduled':
                        this.handleEventScheduled(e.data.payload, callback);
                        break;
                        
                    default:
                        console.log('Unhandled Calendly event:', e.data.event);
                }
            }
        });
        
        console.log('✅ Calendly event listeners set up with official postMessage API');
    }
    
    /**
     * Handle profile page viewed
     */
    handleProfileViewed(payload, callback) {
        if (callback) {
            callback({
                event: 'profile_viewed',
                data: payload
            });
        }
    }
    
    /**
     * Handle event type viewed
     */
    handleEventTypeViewed(payload, callback) {
        if (callback) {
            callback({
                event: 'event_type_viewed',
                data: payload
            });
        }
    }
    
    /**
     * Handle date and time selected
     */
    handleDateTimeSelected(payload, callback) {
        if (callback) {
            callback({
                event: 'date_time_selected',
                data: payload
            });
        }
    }
    
    /**
     * Handle event scheduled (booking completed)
     */
    handleEventScheduled(payload, callback) {
        if (callback) {
            callback({
                event: 'scheduled',
                data: payload
            });
        }
    }

    /**
     * Validate service configuration
     */
    validateConfiguration() {
        const issues = [];
        
        if (!this.config.clientId || this.config.clientId === 'YOUR_CLIENT_ID') {
            issues.push('Calendly Client ID not configured');
        }
        
        if (!this.config.username) {
            issues.push('Calendly username not configured');
        }
        
        return {
            valid: issues.length === 0,
            issues: issues
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalendlyService;
} else {
    window.CalendlyService = CalendlyService;
}