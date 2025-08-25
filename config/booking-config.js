/**
 * Mr. Lai's Booking System Configuration
 * 
 * This file contains all configuration for Calendly + Stripe + n8n integration
 * Replace placeholder values with actual credentials when ready to go live
 */

const BOOKING_CONFIG = {
  // Business Information
  BUSINESS: {
    name: "Mr. Lai's Mobile Car Wash & Detailing",
    phone: "(323) 558-2652",
    email: "mrlai.mcds@gmail.com",
    timezone: "America/Los_Angeles",
    serviceArea: "Los Angeles County",
    businessHours: {
      monday: { start: "08:00", end: "18:00" },
      tuesday: { start: "08:00", end: "18:00" },
      wednesday: { start: "08:00", end: "18:00" },
      thursday: { start: "08:00", end: "18:00" },
      friday: { start: "08:00", end: "18:00" },
      saturday: { start: "08:00", end: "18:00" },
      sunday: { start: "closed", end: "closed" }
    }
  },

  // Service Definitions
  SERVICES: {
    basic: {
      id: "basic_wash",
      name: "Basic Wash",
      price: 60,
      deposit: 25,
      duration: 90, // minutes
      description: "Exterior wash, tire cleaning, windows, basic interior vacuum",
      features: [
        "Exterior wash & rinse",
        "Tire cleaning",
        "Window cleaning", 
        "Basic interior vacuum",
        "1-2 hour service"
      ],
      calendlyEventType: "basic-wash",
      stripeProductId: "PLACEHOLDER_BASIC_PRODUCT_ID"
    },
    premium: {
      id: "premium_detail",
      name: "Premium Detail", 
      price: 150,
      deposit: 50,
      duration: 180, // minutes
      description: "Complete detail with clay bar, light paint correction, wax",
      features: [
        "Everything in Basic Wash",
        "Clay bar treatment",
        "Paint correction (light)",
        "Wax application",
        "Interior deep clean",
        "2-3 hour service"
      ],
      calendlyEventType: "premium-detail",
      stripeProductId: "PLACEHOLDER_PREMIUM_PRODUCT_ID"
    },
    luxury: {
      id: "luxury_detail",
      name: "Luxury Detail",
      price: 300,
      deposit: 75, 
      duration: 300, // minutes
      description: "Full paint correction, ceramic coating, complete restoration",
      features: [
        "Everything in Premium Detail",
        "Paint correction (full)",
        "Ceramic coating application", 
        "Leather conditioning",
        "Engine bay cleaning",
        "4-5 hour service"
      ],
      calendlyEventType: "luxury-detail",
      stripeProductId: "PLACEHOLDER_LUXURY_PRODUCT_ID"
    }
  },

  // Calendly Integration
  CALENDLY: {
    // Calendly Pro username
    username: "mrlai-clean",
    baseUrl: "https://calendly.com",
    
    // Event type URLs
    eventTypes: {
      basic: "mrlai-clean/basic-wash",
      premium: "mrlai-clean/premium-detail", 
      luxury: "mrlai-clean/luxury-detail",
      ceramic: "mrlai-clean/ceramic-coating",
      ppf: "mrlai-clean/paint-protection-film",
      tinting: "mrlai-clean/window-tinting"
    },
    
    // API Configuration
    api: {
      baseUrl: "https://api.calendly.com",
      version: "v1",
      accessToken: "CALENDLY_API_TOKEN_PLACEHOLDER", // Set in environment variables
      organizationUri: "https://api.calendly.com/organizations/ORGANIZATION_UUID",
      userUri: "https://api.calendly.com/users/USER_UUID"
    },
    
    // Custom fields to collect in Calendly
    customFields: [
      {
        name: "car_year_model",
        question: "What year and model is your car?",
        type: "text",
        required: true
      },
      {
        name: "service_location", 
        question: "Where should we come to detail your car?",
        type: "text",
        required: true
      },
      {
        name: "location_type",
        question: "What type of location?",
        type: "multiple_choice",
        options: ["Driveway", "Street Parking", "Parking Garage", "Other"],
        required: true
      },
      {
        name: "special_requests",
        question: "Any special requests or concerns about your car?",
        type: "text",
        required: false
      },
      {
        name: "preferred_contact",
        question: "Best way to reach you?",
        type: "multiple_choice", 
        options: ["Phone", "Text", "Email"],
        required: true
      }
    ],

    // Webhook configuration for n8n integration
    webhooks: {
      newBooking: "https://your-n8n-instance.com/webhook/calendly-new-booking",
      cancelled: "https://your-n8n-instance.com/webhook/calendly-cancelled",
      rescheduled: "https://your-n8n-instance.com/webhook/calendly-rescheduled"
    },
    
    // Widget Configuration
    widget: {
      height: 630,
      hideEventTypeDetails: false,
      hideLandingPageDetails: false,
      primaryColor: "A8E6CF",
      textColor: "000000",
      backgroundColor: "ffffff"
    },

    // Branding settings
    branding: {
      primaryColor: "#A8E6CF", // Mint green
      textColor: "#000000",
      backgroundColor: "#FFFFFF"
    }
  },

  // Stripe Integration
  STRIPE: {
    // Replace with actual Stripe account details after setup
    publishableKey: "pk_test_PLACEHOLDER_STRIPE_PUBLISHABLE_KEY",
    
    // Payment link URLs - will be created in Stripe dashboard
    paymentLinks: {
      basic: "https://buy.stripe.com/PLACEHOLDER_BASIC_PAYMENT_LINK",
      premium: "https://buy.stripe.com/PLACEHOLDER_PREMIUM_PAYMENT_LINK",
      luxury: "https://buy.stripe.com/PLACEHOLDER_LUXURY_PAYMENT_LINK"
    },
    
    // Product IDs from Stripe dashboard
    products: {
      basic_deposit: "PLACEHOLDER_BASIC_DEPOSIT_PRODUCT_ID",
      premium_deposit: "PLACEHOLDER_PREMIUM_DEPOSIT_PRODUCT_ID", 
      luxury_deposit: "PLACEHOLDER_LUXURY_DEPOSIT_PRODUCT_ID"
    },

    // Webhook endpoints for n8n
    webhooks: {
      paymentSuccess: "PLACEHOLDER_N8N_WEBHOOK_URL/stripe-payment-success",
      paymentFailed: "PLACEHOLDER_N8N_WEBHOOK_URL/stripe-payment-failed"
    },

    // Success/cancel redirect URLs
    redirectUrls: {
      success: "/booking-confirmed.html",
      cancel: "/booking.html"
    }
  },

  // n8n Automation Configuration
  N8N: {
    // Replace with actual n8n instance URL
    baseUrl: "PLACEHOLDER_N8N_INSTANCE_URL",
    
    // Webhook URLs for different triggers
    webhooks: {
      bookingConfirmation: "PLACEHOLDER_N8N_WEBHOOK_URL/booking-confirmation",
      paymentProcessed: "PLACEHOLDER_N8N_WEBHOOK_URL/payment-processed", 
      reminderSchedule: "PLACEHOLDER_N8N_WEBHOOK_URL/reminder-schedule",
      serviceCompleted: "PLACEHOLDER_N8N_WEBHOOK_URL/service-completed"
    },

    // Workflow IDs (created in n8n)
    workflows: {
      bookingConfirmation: "PLACEHOLDER_WORKFLOW_ID_1",
      paymentProcessing: "PLACEHOLDER_WORKFLOW_ID_2", 
      reminderAutomation: "PLACEHOLDER_WORKFLOW_ID_3",
      followUpSequence: "PLACEHOLDER_WORKFLOW_ID_4"
    }
  },

  // Email Configuration (for n8n workflows)
  EMAIL: {
    // Business email settings
    from: {
      name: "Mr. Lai's Detailing",
      email: "mrlai.mcds@gmail.com"
    },
    
    // Email templates (used by n8n workflows)
    templates: {
      bookingConfirmation: {
        subject: "✅ Your {{serviceName}} is Confirmed!",
        template: "booking-confirmation-email.html"
      },
      reminderEmail: {
        subject: "🚗 Tomorrow's Detail - What You Need to Know", 
        template: "reminder-email.html"
      },
      thankYou: {
        subject: "🌟 How did your detailing service go?",
        template: "thank-you-email.html"
      }
    },

    // SMTP settings (for n8n)
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mrlai.mcds@gmail.com",
        pass: "PLACEHOLDER_APP_PASSWORD"
      }
    }
  },

  // SMS Configuration (optional)
  SMS: {
    provider: "twilio", // or "textbelt"
    
    twilio: {
      accountSid: "PLACEHOLDER_TWILIO_ACCOUNT_SID",
      authToken: "PLACEHOLDER_TWILIO_AUTH_TOKEN",
      fromNumber: "PLACEHOLDER_TWILIO_PHONE_NUMBER"
    },

    templates: {
      bookingConfirmation: "🎉 {{customerName}}, your {{serviceName}} is confirmed for {{appointmentDate}}! We'll text 15min before arrival. Questions? Reply or call {{businessPhone}}. -Mr. Lai's",
      reminder: "📅 Hi {{customerName}}, your {{serviceName}} is tomorrow at {{appointmentTime}}! We'll text before we arrive. Weather looks {{weather}}. -Mr. Lai's",
      onTheWay: "🚗 Hi {{customerName}}, we're on our way! ETA {{eta}} minutes. Have your car ready and accessible. See you soon! -Mr. Lai's"
    }
  },

  // Google Calendar Integration
  GOOGLE_CALENDAR: {
    calendarId: "PLACEHOLDER_GOOGLE_CALENDAR_ID",
    
    // OAuth credentials (for n8n workflows)
    oauth: {
      clientId: "PLACEHOLDER_GOOGLE_CLIENT_ID",
      clientSecret: "PLACEHOLDER_GOOGLE_CLIENT_SECRET",
      refreshToken: "PLACEHOLDER_GOOGLE_REFRESH_TOKEN"
    },

    // Event templates
    eventTemplates: {
      booking: {
        summary: "{{serviceName}} - {{customerName}}",
        description: "Customer: {{customerName}}\nPhone: {{customerPhone}}\nEmail: {{customerEmail}}\nCar: {{carInfo}}\nLocation: {{serviceLocation}}\nType: {{locationType}}\n\nSpecial Requests:\n{{specialRequests}}",
        location: "{{serviceLocation}}"
      }
    }
  },

  // System Settings
  SYSTEM: {
    // Environment (development/production)
    environment: "development",
    
    // Debug mode
    debug: true,
    
    // API rate limits
    rateLimits: {
      bookingsPerHour: 10,
      paymentsPerHour: 5
    },

    // Retry settings
    retries: {
      maxAttempts: 3,
      backoffMs: 1000
    },

    // Cache settings
    cache: {
      ttlSeconds: 3600,
      maxEntries: 1000
    }
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BOOKING_CONFIG;
} else {
  window.BOOKING_CONFIG = BOOKING_CONFIG;
}

// Validation function to check if configuration is complete
function validateConfig() {
  const issues = [];
  
  // Check for placeholder values
  const placeholderCheck = JSON.stringify(BOOKING_CONFIG).match(/PLACEHOLDER_[\w]+/g);
  if (placeholderCheck && placeholderCheck.length > 0) {
    issues.push(`Found ${placeholderCheck.length} placeholder values that need to be replaced`);
  }
  
  // Check required fields
  if (!BOOKING_CONFIG.BUSINESS.phone || !BOOKING_CONFIG.BUSINESS.email) {
    issues.push('Missing required business contact information');
  }
  
  if (issues.length > 0) {
    console.warn('Booking configuration issues:', issues);
    return false;
  }
  
  console.log('✅ Booking configuration is valid');
  return true;
}

// Auto-validate in development
if (BOOKING_CONFIG.SYSTEM.debug) {
  validateConfig();
}