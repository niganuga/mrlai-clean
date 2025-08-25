/**
 * Create Calendly Event Types via API
 * Run this script to automatically create all 6 service event types
 */

// Load environment variables
require('dotenv').config();

class CalendlyEventCreator {
    constructor() {
        this.baseUrl = 'https://api.calendly.com';
        this.accessToken = null;
        
        // Service definitions matching your booking system
        this.eventTypes = [
            {
                name: "Basic Wash",
                slug: "basic-wash",
                duration: 90,
                description: "Quick exterior wash, dry, and basic interior vacuum. Perfect for maintaining your car's appearance.",
                price: 50,
                deposit: 25,
                color: "#A8E6CF" // Mint green
            },
            {
                name: "Premium Detail", 
                slug: "premium-detail",
                duration: 180, // 3 hours
                description: "Complete exterior detail, interior deep clean, wax protection. Your car will look showroom ready.",
                price: 150,
                deposit: 50,
                color: "#A8E6CF"
            },
            {
                name: "Luxury Detail",
                slug: "luxury-detail", 
                duration: 300, // 5 hours
                description: "Premium detail with paint correction and ceramic wax finish. The ultimate car care experience.",
                price: 300,
                deposit: 75,
                color: "#A8E6CF"
            },
            {
                name: "Ceramic Coating",
                slug: "ceramic-coating",
                duration: 480, // 8 hours
                description: "Paint correction and professional ceramic coating application. Long-lasting protection and shine.",
                price: "500-1500",
                deposit: 100,
                color: "#FFD700" // Gold for premium services
            },
            {
                name: "Paint Protection Film",
                slug: "paint-protection-film",
                duration: 600, // 10 hours
                description: "Clear protective film installation for ultimate paint protection. Invisible armor for your vehicle.",
                price: "800-3000", 
                deposit: 200,
                color: "#FFD700"
            },
            {
                name: "Window Tinting",
                slug: "window-tinting",
                duration: 180, // 3 hours
                description: "Professional automotive window tint installation. Style, privacy, and UV protection.",
                price: "200-600",
                deposit: 50,
                color: "#F8BBD9" // Pastel pink
            }
        ];
    }

    /**
     * Get OAuth access token using client credentials
     */
    async getAccessToken() {
        if (this.accessToken) return this.accessToken;

        try {
            console.log('🔐 Getting OAuth access token...');
            
            const response = await fetch(`${this.baseUrl}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'client_credentials',
                    client_id: process.env.CALENDLY_CLIENT_ID,
                    client_secret: process.env.CALENDLY_CLIENT_SECRET,
                    scope: 'read write'
                })
            });

            if (!response.ok) {
                throw new Error(`OAuth failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            
            console.log('✅ Access token obtained successfully');
            return this.accessToken;
        } catch (error) {
            console.error('❌ OAuth Error:', error);
            throw error;
        }
    }

    /**
     * Get current user info to get organization URI
     */
    async getCurrentUser() {
        const token = await this.getAccessToken();
        
        const response = await fetch(`${this.baseUrl}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get user info: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Create a single event type
     */
    async createEventType(eventData) {
        const token = await this.getAccessToken();
        const user = await this.getCurrentUser();
        
        const eventTypeData = {
            name: eventData.name,
            duration: eventData.duration,
            slug: eventData.slug,
            description_plain: eventData.description,
            color: eventData.color,
            active: true,
            scheduling_url: `https://calendly.com/mrlai-clean/${eventData.slug}`,
            
            // Location settings (mobile service)
            locations: [{
                kind: "physical",
                location: "Mobile Service - I'll come to you",
                additional_info: "Service performed at your location within 25 miles of Los Angeles"
            }],

            // Booking settings
            booking_questions: [
                {
                    name: "vehicle_info",
                    type: "text", 
                    required: true,
                    answer_choices: [],
                    question: "Vehicle Make, Model, Year (e.g., 2020 Tesla Model 3)"
                },
                {
                    name: "service_address",
                    type: "text",
                    required: true, 
                    answer_choices: [],
                    question: "Service Location Address (where you'd like the service performed)"
                },
                {
                    name: "special_requests",
                    type: "text",
                    required: false,
                    answer_choices: [],
                    question: "Special Requests or Concerns (optional)"
                }
            ],

            // Availability settings
            availability_rules: [{
                type: "wday",
                intervals: [
                    { from: "08:00", to: "18:00" } // 8 AM to 6 PM
                ],
                wday: "monday"
            }, {
                type: "wday", 
                intervals: [
                    { from: "08:00", to: "18:00" }
                ],
                wday: "tuesday"
            }, {
                type: "wday",
                intervals: [
                    { from: "08:00", to: "18:00" }
                ],
                wday: "wednesday"
            }, {
                type: "wday",
                intervals: [
                    { from: "08:00", to: "18:00" }
                ],
                wday: "thursday"
            }, {
                type: "wday",
                intervals: [
                    { from: "08:00", to: "18:00" }
                ],
                wday: "friday"
            }, {
                type: "wday",
                intervals: [
                    { from: "09:00", to: "17:00" } // Shorter Saturday hours
                ],
                wday: "saturday"
            }],

            // Buffer time between appointments
            buffer_time: 30, // 30 minutes

            // Notifications
            email_confirmation: {
                enabled: true,
                reply_to: process.env.BUSINESS_EMAIL || "mrlai.mcds@gmail.com"
            },
            
            // Custom fields for pricing info
            custom_questions: [
                {
                    name: "pricing_info",
                    type: "text",
                    required: false,
                    answer_choices: [],
                    question: `Service Price: $${eventData.price} (${eventData.deposit} deposit required to book)`
                }
            ]
        };

        try {
            console.log(`📅 Creating event type: ${eventData.name}...`);
            
            const response = await fetch(`${this.baseUrl}/event_types`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventTypeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create ${eventData.name}: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            console.log(`✅ Created: ${eventData.name} at https://calendly.com/mrlai-clean/${eventData.slug}`);
            
            return result;
        } catch (error) {
            console.error(`❌ Error creating ${eventData.name}:`, error);
            throw error;
        }
    }

    /**
     * Create all event types
     */
    async createAllEventTypes() {
        console.log('🚀 Starting Calendly event type creation...');
        console.log(`📊 Creating ${this.eventTypes.length} event types for Mr. Lai's Mobile Detailing`);
        
        const results = [];
        
        for (const eventType of this.eventTypes) {
            try {
                const result = await this.createEventType(eventType);
                results.push({ success: true, eventType: eventType.name, data: result });
                
                // Small delay between API calls
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                results.push({ success: false, eventType: eventType.name, error: error.message });
            }
        }

        // Summary
        console.log('\n📋 Creation Summary:');
        console.log('=====================');
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        successful.forEach(r => {
            console.log(`✅ ${r.eventType} - Created successfully`);
        });
        
        failed.forEach(r => {
            console.log(`❌ ${r.eventType} - Failed: ${r.error}`);
        });
        
        console.log(`\n🎯 Results: ${successful.length} created, ${failed.length} failed`);
        
        if (successful.length > 0) {
            console.log('\n🔗 Your booking URLs:');
            this.eventTypes.forEach(et => {
                console.log(`   https://calendly.com/mrlai-clean/${et.slug}`);
            });
        }

        return results;
    }
}

// Run the script
async function main() {
    const creator = new CalendlyEventCreator();
    
    try {
        await creator.createAllEventTypes();
        console.log('\n🎉 Event type creation process completed!');
    } catch (error) {
        console.error('\n💥 Script failed:', error);
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    main();
}

module.exports = CalendlyEventCreator;