#!/usr/bin/env node

/**
 * Business Accelerator - Website Template Generator
 * 
 * Takes Mr. Lai's proven brutalist design and generates new client websites
 * by replacing business info, colors, content, and assets.
 * 
 * Usage: node scripts/generate-client-website.js client-slug
 */

const fs = require('fs');
const path = require('path');

class WebsiteTemplateGenerator {
    constructor() {
        this.templatePath = path.join(__dirname, '../index.html');
        this.clientsDir = path.join(__dirname, '../clients');
        this.outputDir = path.join(__dirname, '../generated-sites');
    }

    /**
     * Generate a new client website from template
     * @param {string} clientSlug - Client folder name (e.g., 'pizza-palace')
     */
    async generateSite(clientSlug) {
        console.log(`🚀 Generating website for: ${clientSlug}`);

        try {
            // 1. Load client configuration
            const clientData = await this.loadClientData(clientSlug);
            
            // 2. Load HTML template
            const template = await this.loadTemplate();
            
            // 3. Generate customized website
            const customizedHtml = await this.customizeTemplate(template, clientData);
            
            // 4. Save generated website
            await this.saveGeneratedSite(clientSlug, customizedHtml);
            
            console.log(`✅ Website generated successfully!`);
            console.log(`📁 Output: generated-sites/${clientSlug}/index.html`);
            
        } catch (error) {
            console.error(`❌ Error generating site:`, error.message);
            process.exit(1);
        }
    }

    /**
     * Load client configuration data
     */
    async loadClientData(clientSlug) {
        const clientDir = path.join(this.clientsDir, clientSlug);
        
        if (!fs.existsSync(clientDir)) {
            throw new Error(`Client directory not found: ${clientDir}`);
        }

        // Load brand context
        const brandContextPath = path.join(clientDir, 'config/brand-context.json');
        const brandContext = JSON.parse(fs.readFileSync(brandContextPath, 'utf8'));

        // Load detailed business data
        const datasetPath = path.join(clientDir, 'datasets/detailing-data.json');
        let businessData = {};
        
        if (fs.existsSync(datasetPath)) {
            businessData = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
        }

        return {
            brandContext,
            businessData,
            clientSlug,
            clientDir
        };
    }

    /**
     * Load the HTML template
     */
    async loadTemplate() {
        if (!fs.existsSync(this.templatePath)) {
            throw new Error(`Template not found: ${this.templatePath}`);
        }
        
        return fs.readFileSync(this.templatePath, 'utf8');
    }

    /**
     * Customize template with client data
     */
    async customizeTemplate(template, clientData) {
        let html = template;
        const { brandContext, businessData } = clientData;

        // 1. Replace business name and branding
        html = this.replaceBrandInfo(html, brandContext, businessData);
        
        // 2. Replace contact information
        html = this.replaceContactInfo(html, brandContext, businessData);
        
        // 3. Replace services and pricing
        html = this.replaceServices(html, brandContext, businessData);
        
        // 4. Customize colors (keep brutalist style)
        html = this.customizeColors(html, brandContext);
        
        // 5. Replace content and copy
        html = this.replaceContent(html, brandContext, businessData);

        return html;
    }

    /**
     * Replace brand information
     */
    replaceBrandInfo(html, brandContext, businessData) {
        const businessName = businessData.businessInfo?.businessName || brandContext.brandName || 'Your Business';
        const tagline = businessData.businessInfo?.brandTagline || 'Professional Service';

        // Replace main business name
        html = html.replace(/MR\. LAI'S/g, businessName.toUpperCase());
        html = html.replace(/Mr\. Lai/g, businessName);
        html = html.replace(/mr\.lai_detailing/g, businessName.toLowerCase().replace(/[^a-z0-9]/g, '_'));
        
        // Replace tagline
        html = html.replace(/NOT JUST CLEAN,/g, tagline.toUpperCase() + ',');
        html = html.replace(/CLEAN/g, 'PROFESSIONAL');

        return html;
    }

    /**
     * Replace contact information
     */
    replaceContactInfo(html, brandContext, businessData) {
        const phone = businessData.contact?.primary?.phone || '(555) 123-4567';
        const email = businessData.contact?.primary?.email || 'info@business.com';

        // Replace phone numbers
        html = html.replace(/323-558-2652/g, phone);
        html = html.replace(/tel:323-558-2652/g, `tel:${phone}`);
        
        // Replace email
        html = html.replace(/mrlai\.mcds@gmail\.com/g, email);
        html = html.replace(/mailto:mrlai\.mcds@gmail\.com/g, `mailto:${email}`);

        return html;
    }

    /**
     * Replace services and pricing
     */
    replaceServices(html, brandContext, businessData) {
        const services = brandContext.services || ['Service 1', 'Service 2', 'Service 3'];
        
        // Create service list HTML
        const serviceListHtml = services.map(service => 
            `<li style="padding: 0.75rem 0; border-bottom: 2px solid var(--black); font-weight: 600;">✓ ${service}</li>`
        ).join('');

        // Replace service lists in pricing cards
        const servicePattern = /<li style="[^"]*">✓[^<]*<\/li>/g;
        html = html.replace(servicePattern, '').replace(
            /(<ul style="[^"]*list-style: none[^"]*">)/g,
            `$1${serviceListHtml}`
        );

        return html;
    }

    /**
     * Customize color scheme while keeping brutalist style
     */
    customizeColors(html, brandContext) {
        // Generate color palette based on business type
        const businessType = this.detectBusinessType(brandContext);
        const colorPalette = this.generateColorPalette(businessType);

        // Replace CSS color variables
        html = html.replace(/--pastel-pink: #F8BBD9;/g, `--pastel-pink: ${colorPalette.accent};`);
        html = html.replace(/--mint-green: #A8E6CF;/g, `--mint-green: ${colorPalette.secondary};`);
        html = html.replace(/--gold: #FFD700;/g, `--gold: ${colorPalette.highlight};`);

        return html;
    }

    /**
     * Replace content and copy
     */
    replaceContent(html, brandContext, businessData) {
        const businessName = businessData.businessInfo?.businessName || brandContext.brandName;
        
        // Replace testimonials section content
        html = html.replace(/PAPA LAI APPROVED/g, `${businessName.toUpperCase()} APPROVED`);
        html = html.replace(/Papa Lai/g, businessName);
        
        // Replace about section
        const aboutContent = `We're ${businessName}, and we're here to deliver exceptional ${brandContext.services?.[0] || 'service'} with unmatched quality and attention to detail.`;
        html = html.replace(/We're Mr\. Lai[^.]*\./g, aboutContent);

        return html;
    }

    /**
     * Detect business type from services
     */
    detectBusinessType(brandContext) {
        const services = (brandContext.services || []).join(' ').toLowerCase();
        
        if (services.includes('food') || services.includes('restaurant') || services.includes('pizza')) return 'food';
        if (services.includes('clean') || services.includes('detail') || services.includes('wash')) return 'cleaning';
        if (services.includes('repair') || services.includes('fix') || services.includes('maintenance')) return 'repair';
        if (services.includes('beauty') || services.includes('salon') || services.includes('spa')) return 'beauty';
        if (services.includes('fitness') || services.includes('gym') || services.includes('training')) return 'fitness';
        
        return 'general';
    }

    /**
     * Generate color palette based on business type
     */
    generateColorPalette(businessType) {
        const palettes = {
            food: { accent: '#FF6B6B', secondary: '#4ECDC4', highlight: '#FFE66D' },
            cleaning: { accent: '#A8E6CF', secondary: '#88D8C0', highlight: '#FFD93D' },
            repair: { accent: '#FF8B94', secondary: '#A8DADC', highlight: '#F1FAEE' },
            beauty: { accent: '#F8BBD9', secondary: '#C8A2C8', highlight: '#FFB7C5' },
            fitness: { accent: '#FF6B6B', secondary: '#4ECDC4', highlight: '#45B7D1' },
            general: { accent: '#F8BBD9', secondary: '#A8E6CF', highlight: '#FFD700' }
        };

        return palettes[businessType] || palettes.general;
    }

    /**
     * Save the generated website
     */
    async saveGeneratedSite(clientSlug, html) {
        const outputPath = path.join(this.outputDir, clientSlug);
        
        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        // Save HTML file
        const htmlPath = path.join(outputPath, 'index.html');
        fs.writeFileSync(htmlPath, html, 'utf8');

        // Copy assets if they exist
        await this.copyClientAssets(clientSlug, outputPath);
    }

    /**
     * Copy client assets to output directory
     */
    async copyClientAssets(clientSlug, outputPath) {
        const clientAssetsPath = path.join(this.clientsDir, clientSlug, 'assets');
        
        if (fs.existsSync(clientAssetsPath)) {
            const assetsOutputPath = path.join(outputPath, 'assets');
            
            if (!fs.existsSync(assetsOutputPath)) {
                fs.mkdirSync(assetsOutputPath, { recursive: true });
            }

            // Copy fonts directory if it exists
            const fontsPath = path.join(__dirname, '../fonts');
            const fontsOutputPath = path.join(outputPath, 'fonts');
            
            if (fs.existsSync(fontsPath) && !fs.existsSync(fontsOutputPath)) {
                this.copyDirectory(fontsPath, fontsOutputPath);
            }
        }
    }

    /**
     * Recursively copy directory
     */
    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const items = fs.readdirSync(src);
        
        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            
            if (fs.statSync(srcPath).isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

// CLI Usage
if (require.main === module) {
    const clientSlug = process.argv[2];
    
    if (!clientSlug) {
        console.error('Usage: node generate-client-website.js <client-slug>');
        console.error('Example: node generate-client-website.js pizza-palace');
        process.exit(1);
    }

    const generator = new WebsiteTemplateGenerator();
    generator.generateSite(clientSlug);
}

module.exports = WebsiteTemplateGenerator;