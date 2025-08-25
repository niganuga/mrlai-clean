#!/usr/bin/env node

/**
 * Simple Deployment Script for Generated Client Websites
 * 
 * For MVP: Just creates local preview URLs and basic hosting-ready files
 * Future: Can integrate with Vercel, Netlify, or custom hosting
 * 
 * Usage: node scripts/deploy-client-site.js client-slug
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class SiteDeployer {
    constructor() {
        this.generatedSitesDir = path.join(__dirname, '../generated-sites');
        this.deployDir = path.join(__dirname, '../deployed-sites');
    }

    /**
     * Deploy a generated client site
     * @param {string} clientSlug - Client folder name
     */
    async deploySite(clientSlug) {
        console.log(`🚀 Deploying website for: ${clientSlug}`);

        try {
            // 1. Verify generated site exists
            const sitePath = path.join(this.generatedSitesDir, clientSlug);
            if (!fs.existsSync(sitePath)) {
                throw new Error(`Generated site not found: ${sitePath}`);
            }

            // 2. Create deployment directory
            const deployPath = path.join(this.deployDir, clientSlug);
            await this.prepareDeploy(deployPath);

            // 3. Copy and optimize files
            await this.copyFiles(sitePath, deployPath);

            // 4. Generate deployment metadata
            await this.generateMetadata(clientSlug, deployPath);

            // 5. Start local preview server
            const port = await this.startPreviewServer(deployPath);

            console.log(`✅ Site deployed successfully!`);
            console.log(`🌐 Preview URL: http://localhost:${port}`);
            console.log(`📁 Deploy files: deployed-sites/${clientSlug}/`);
            
            return {
                success: true,
                previewUrl: `http://localhost:${port}`,
                deployPath: deployPath
            };

        } catch (error) {
            console.error(`❌ Deployment failed:`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Prepare deployment directory
     */
    async prepareDeploy(deployPath) {
        if (!fs.existsSync(this.deployDir)) {
            fs.mkdirSync(this.deployDir, { recursive: true });
        }

        if (fs.existsSync(deployPath)) {
            // Clean existing deployment
            fs.rmSync(deployPath, { recursive: true, force: true });
        }

        fs.mkdirSync(deployPath, { recursive: true });
    }

    /**
     * Copy and optimize site files
     */
    async copyFiles(sourcePath, deployPath) {
        // Copy HTML file
        const htmlSource = path.join(sourcePath, 'index.html');
        const htmlDest = path.join(deployPath, 'index.html');
        
        if (fs.existsSync(htmlSource)) {
            let html = fs.readFileSync(htmlSource, 'utf8');
            
            // Add deployment optimizations
            html = this.optimizeForDeployment(html);
            
            fs.writeFileSync(htmlDest, html, 'utf8');
        }

        // Copy assets if they exist
        const assetsSource = path.join(sourcePath, 'assets');
        const assetsDest = path.join(deployPath, 'assets');
        
        if (fs.existsSync(assetsSource)) {
            this.copyDirectory(assetsSource, assetsDest);
        }

        // Copy fonts
        const fontsSource = path.join(__dirname, '../fonts');
        const fontsDest = path.join(deployPath, 'fonts');
        
        if (fs.existsSync(fontsSource)) {
            this.copyDirectory(fontsSource, fontsDest);
        }

        // Create favicon if not exists
        await this.createFavicon(deployPath);
    }

    /**
     * Optimize HTML for deployment
     */
    optimizeForDeployment(html) {
        // Add meta tags for SEO
        const seoMeta = `
    <!-- SEO Optimizations -->
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    
    <!-- Performance optimizations -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://unpkg.com">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
        `;

        // Insert SEO meta after the existing viewport meta tag
        html = html.replace(
            /(<meta name="viewport"[^>]*>)/,
            `$1${seoMeta}`
        );

        // Add structured data (JSON-LD) for local business
        const structuredData = this.generateStructuredData();
        html = html.replace(
            '</head>',
            `    ${structuredData}\n</head>`
        );

        return html;
    }

    /**
     * Generate structured data for SEO
     */
    generateStructuredData() {
        return `<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Business Name",
        "description": "Professional local business services",
        "url": "https://yourdomain.com",
        "priceRange": "$$",
        "openingHours": "Mo-Fr 09:00-17:00"
    }
    </script>`;
    }

    /**
     * Generate deployment metadata
     */
    async generateMetadata(clientSlug, deployPath) {
        const metadata = {
            clientSlug,
            generatedAt: new Date().toISOString(),
            version: '1.0.0',
            framework: 'business-accelerator-template',
            deploymentType: 'local-preview',
            files: this.getFileList(deployPath)
        };

        const metadataPath = path.join(deployPath, 'deployment.json');
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');

        // Create README for client
        const readmePath = path.join(deployPath, 'README.md');
        const readme = this.generateClientReadme(clientSlug);
        fs.writeFileSync(readmePath, readme, 'utf8');
    }

    /**
     * Get list of files in deployment
     */
    getFileList(deployPath) {
        const files = [];
        
        function walkDir(dir, relativePath = '') {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const relativeItemPath = path.join(relativePath, item);
                
                if (fs.statSync(itemPath).isDirectory()) {
                    walkDir(itemPath, relativeItemPath);
                } else {
                    files.push(relativeItemPath);
                }
            }
        }
        
        walkDir(deployPath);
        return files;
    }

    /**
     * Generate README for client
     */
    generateClientReadme(clientSlug) {
        return `# ${clientSlug.charAt(0).toUpperCase() + clientSlug.slice(1)} Website

## 🎉 Your Professional Website is Ready!

This folder contains your complete website, generated by our Business Accelerator AI system.

### 📁 What's Included:
- \`index.html\` - Your main website file
- \`fonts/\` - Custom typography files
- \`assets/\` - Your logos and images (if provided)
- \`deployment.json\` - Technical metadata

### 🚀 How to Launch:

#### Option 1: Quick Preview
1. Double-click \`index.html\` to open in your browser
2. Or serve locally: \`python3 -m http.server 8000\`

#### Option 2: Deploy to Web Hosting
1. Upload all files to your web hosting provider
2. Point your domain to the uploaded files
3. Your website is live! 🌐

### 🎯 Recommended Next Steps:
1. **Get a Domain**: Register your business domain name
2. **Choose Hosting**: Shared hosting, cloud hosting, or managed WordPress
3. **Add Analytics**: Google Analytics for visitor tracking
4. **SEO Setup**: Submit to Google Search Console
5. **Social Media**: Link your website to social profiles

### 💡 Need Help?
Contact our support team for assistance with deployment, customization, or digital marketing setup.

---
*Generated by Business Accelerator AI - Professional websites in minutes*
`;
    }

    /**
     * Start preview server
     */
    async startPreviewServer(deployPath) {
        return new Promise((resolve, reject) => {
            // Find available port starting from 3000
            let port = 3000;
            
            const tryPort = (p) => {
                const server = require('http').createServer((req, res) => {
                    const filePath = path.join(deployPath, req.url === '/' ? 'index.html' : req.url);
                    
                    if (fs.existsSync(filePath)) {
                        const ext = path.extname(filePath);
                        const contentType = {
                            '.html': 'text/html',
                            '.css': 'text/css',
                            '.js': 'application/javascript',
                            '.png': 'image/png',
                            '.jpg': 'image/jpeg',
                            '.gif': 'image/gif',
                            '.ico': 'image/x-icon'
                        }[ext] || 'text/plain';
                        
                        res.writeHead(200, { 'Content-Type': contentType });
                        fs.createReadStream(filePath).pipe(res);
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('Not Found');
                    }
                });

                server.listen(p, (err) => {
                    if (err) {
                        if (err.code === 'EADDRINUSE') {
                            tryPort(p + 1);
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve(p);
                    }
                });
            };
            
            tryPort(port);
        });
    }

    /**
     * Create simple favicon
     */
    async createFavicon(deployPath) {
        const faviconPath = path.join(deployPath, 'favicon.ico');
        
        // Create a simple text-based favicon for MVP
        // In production, this would generate a proper ICO file
        const simpleFavicon = `<!-- Favicon placeholder - replace with actual favicon.ico -->`;
        
        // For now, just create a placeholder file
        // In production, you'd use a library like 'to-ico' to generate proper favicon
        fs.writeFileSync(faviconPath, '', 'utf8');
    }

    /**
     * Copy directory recursively
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
        console.error('Usage: node deploy-client-site.js <client-slug>');
        console.error('Example: node deploy-client-site.js pizza-palace');
        process.exit(1);
    }

    const deployer = new SiteDeployer();
    deployer.deploySite(clientSlug);
}

module.exports = SiteDeployer;