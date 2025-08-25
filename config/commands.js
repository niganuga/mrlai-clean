/**
 * Claude Code Commands Configuration
 * Custom commands for booking automation and client management
 */

const commands = {
  // Booking Automation Generator
  'create-booking-plan': {
    description: 'Generate complete booking automation plan for a client',
    usage: '/create-booking-plan --client="Business Name" --services="wash,detail,coating" --industry="auto"',
    examples: [
      '/create-booking-plan --client="Mr. Lai\'s Detailing" --services="basic wash,premium detail,luxury detail" --industry="auto detailing"',
      '/create-booking-plan --client="Green Lawn Care" --services="mowing,fertilizing,cleanup" --industry="landscaping"',
      '/create-booking-plan --client="Bella Salon" --services="haircut,color,styling" --industry="beauty"'
    ],
    parameters: {
      client: {
        required: true,
        type: 'string',
        description: 'Client business name'
      },
      services: {
        required: true,
        type: 'string',
        description: 'Comma-separated list of services'
      },
      industry: {
        required: false,
        type: 'string',
        default: 'service',
        description: 'Business industry type'
      },
      email: {
        required: false,
        type: 'string',
        description: 'Client contact email'
      },
      phone: {
        required: false,
        type: 'string', 
        description: 'Client phone number'
      }
    },
    script: './commands/booking-automation-generator.js'
  },

  // Quick Client Setup
  'setup-client': {
    description: 'Quick client onboarding with basic info collection',
    usage: '/setup-client --name="Business Name" --type="service_type"',
    examples: [
      '/setup-client --name="Martinez Plumbing" --type="plumbing"',
      '/setup-client --name="Elite Fitness" --type="personal_training"'
    ],
    parameters: {
      name: {
        required: true,
        type: 'string',
        description: 'Business name'
      },
      type: {
        required: true,
        type: 'string',
        description: 'Business type/industry'
      }
    },
    action: (params) => {
      return `
# 🏢 Client Setup: ${params.name}

## Basic Information Collected
- **Business Name:** ${params.name}
- **Industry:** ${params.type}
- **Setup Date:** ${new Date().toLocaleDateString()}

## Next Steps
1. Run full booking plan generator:
   \`/create-booking-plan --client="${params.name}" --services="service1,service2" --industry="${params.type}"\`

2. Collect detailed service information
3. Get Stripe account details
4. Configure Calendly integration
`;
    }
  },

  // n8n Workflow Templates
  'generate-n8n-workflows': {
    description: 'Generate n8n workflow JSON files for client automation',
    usage: '/generate-n8n-workflows --client="Business Name"',
    examples: [
      '/generate-n8n-workflows --client="Mr. Lai\'s Detailing"'
    ],
    parameters: {
      client: {
        required: true,
        type: 'string',
        description: 'Client business name'
      }
    },
    script: './commands/n8n-workflow-generator.js'
  },

  // Email Template Generator
  'create-email-templates': {
    description: 'Generate branded email templates for client communications',
    usage: '/create-email-templates --client="Business Name" --brand_color="#A8E6CF"',
    examples: [
      '/create-email-templates --client="Mr. Lai\'s Detailing" --brand_color="#A8E6CF"'
    ],
    parameters: {
      client: {
        required: true,
        type: 'string',
        description: 'Client business name'
      },
      brand_color: {
        required: false,
        type: 'string',
        default: '#007bff',
        description: 'Primary brand color (hex)'
      }
    },
    script: './commands/email-template-generator.js'
  },

  // Client Status Check
  'check-client-status': {
    description: 'Check client onboarding and system status',
    usage: '/check-client-status --client="Business Name"',
    examples: [
      '/check-client-status --client="Mr. Lai\'s Detailing"'
    ],
    parameters: {
      client: {
        required: true,
        type: 'string',
        description: 'Client business name'
      }
    },
    action: (params) => {
      return `
# 📊 Client Status: ${params.client}

## System Components Status
- [ ] Stripe Account Setup
- [ ] Calendly Configuration  
- [ ] n8n Workflows Deployed
- [ ] Email Templates Configured
- [ ] Testing Complete
- [ ] Live & Accepting Bookings

## Recent Activity
- Setup initiated: [Date]
- Last update: [Date]  
- Next milestone: [Action needed]

## Action Items
1. Complete client homework checklist
2. Verify integrations are working
3. Monitor booking performance
`;
    }
  },

  // Service Pricing Calculator
  'calculate-pricing': {
    description: 'Calculate optimal service pricing and deposit amounts',
    usage: '/calculate-pricing --services="service1:60,service2:150" --market="premium"',
    examples: [
      '/calculate-pricing --services="basic wash:60,premium detail:150,luxury detail:300" --market="premium"'
    ],
    parameters: {
      services: {
        required: true,
        type: 'string',
        description: 'Services with prices (service:price format)'
      },
      market: {
        required: false,
        type: 'string',
        default: 'standard',
        description: 'Market positioning (budget/standard/premium)'
      }
    },
    action: (params) => {
      const services = params.services.split(',').map(s => {
        const [name, price] = s.split(':');
        const servicePrice = parseInt(price);
        const deposit = Math.max(25, Math.min(100, servicePrice * 0.33));
        return { name: name.trim(), price: servicePrice, deposit: Math.round(deposit) };
      });

      return `
# 💰 Pricing Analysis

## Optimized Service Pricing
${services.map(s => `
### ${s.name}
- **Service Price:** $${s.price}
- **Recommended Deposit:** $${s.deposit} (${Math.round(s.deposit/s.price*100)}%)
- **Balance Due:** $${s.price - s.deposit}
`).join('\n')}

## Market Position: ${params.market.toUpperCase()}

## Deposit Strategy Benefits:
- Reduces no-shows by 60%+
- Improves cash flow
- Builds customer commitment
- Industry standard compliance
`;
    }
  }
};

// Export for use in other modules
module.exports = commands;

// CLI handler for direct execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const commandName = args[0]?.replace('/', '');
  
  if (!commandName || !commands[commandName]) {
    console.log('Available commands:');
    Object.keys(commands).forEach(cmd => {
      console.log(`  /${cmd} - ${commands[cmd].description}`);
    });
    process.exit(1);
  }
  
  const command = commands[commandName];
  const params = {};
  
  // Parse parameters
  args.slice(1).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');
      params[key.replace('--', '')] = value?.replace(/"/g, '') || true;
    }
  });
  
  // Validate required parameters
  if (command.parameters) {
    for (const [paramName, paramConfig] of Object.entries(command.parameters)) {
      if (paramConfig.required && !params[paramName]) {
        console.error(`❌ Required parameter missing: --${paramName}`);
        console.log(`Usage: ${command.usage}`);
        process.exit(1);
      }
      
      // Set defaults
      if (!params[paramName] && paramConfig.default) {
        params[paramName] = paramConfig.default;
      }
    }
  }
  
  // Execute command
  if (command.script) {
    // Run external script
    const { execSync } = require('child_process');
    const scriptPath = require('path').resolve(__dirname, command.script);
    const paramString = Object.entries(params)
      .map(([key, value]) => `--${key}="${value}"`)
      .join(' ');
    
    try {
      execSync(`node ${scriptPath} ${paramString}`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`❌ Command failed: ${error.message}`);
      process.exit(1);
    }
  } else if (command.action) {
    // Run inline action
    const result = command.action(params);
    console.log(result);
  }
}