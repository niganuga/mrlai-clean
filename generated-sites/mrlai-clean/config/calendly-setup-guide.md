# Calendly Integration Setup Guide

## 🔑 Account Setup (Complete These Steps)

### 1. Calendly Pro Account
✅ **Already configured:** `calendly.com/mrlai-clean`

### 2. Create Event Types
You need to create these event types in your Calendly dashboard:

#### **Basic Wash** (`/basic-wash`)
- **Duration:** 1.5 hours
- **Price:** $50 (mention $25 deposit required)
- **Description:** "Quick exterior wash, tire cleaning, windows, and basic interior vacuum"
- **Location:** Ask invitee (for mobile service address)

#### **Premium Detail** (`/premium-detail`) 
- **Duration:** 3 hours  
- **Price:** $150 (mention $50 deposit required)
- **Description:** "Complete detail with clay bar, light paint correction, wax, and interior deep clean"
- **Location:** Ask invitee (for mobile service address)

#### **Luxury Treatment** (`/luxury-detail`)
- **Duration:** 5 hours
- **Price:** $300 (mention $75 deposit required) 
- **Description:** "Full paint correction, ceramic coating prep, engine bay cleaning, premium restoration"
- **Location:** Ask invitee (for mobile service address)

#### **Ceramic Coating** (`/ceramic-coating`)
- **Duration:** 8 hours
- **Price:** $500-1500 (mention $100 deposit required)
- **Description:** "Professional ceramic coating application with 2-5 year protection"
- **Location:** Ask invitee (requires covered area)

#### **Paint Protection Film** (`/paint-protection-film`)
- **Duration:** 10 hours
- **Price:** $800-3000 (mention $200 deposit required)
- **Description:** "Clear paint protection film installation with 10-year warranty"
- **Location:** Ask invitee (requires covered area)

#### **Window Tinting** (`/window-tinting`)
- **Duration:** 3 hours
- **Price:** $200-600 (mention $50 deposit required)
- **Description:** "Professional window tint installation with lifetime warranty"
- **Location:** Ask invitee (requires covered area)

### 3. Configure Business Hours
- **Monday-Saturday:** 8:00 AM - 6:00 PM (PST)
- **Sunday:** Closed
- **Time Zone:** America/Los_Angeles

### 4. Custom Questions (Add These)
Set up these questions for all event types:

1. **"What year and model is your car?"**
   - Type: Short text
   - Required: Yes

2. **"Service address (where should we come?)"**
   - Type: Long text  
   - Required: Yes

3. **"Location type"**
   - Type: Multiple choice
   - Options: Driveway, Street Parking, Parking Garage, Other
   - Required: Yes

4. **"Any special requests or concerns?"**
   - Type: Long text
   - Required: No

5. **"Best way to reach you?"**
   - Type: Multiple choice
   - Options: Phone, Text, Email
   - Required: Yes

### 5. Branding Settings
- **Primary Color:** #A8E6CF (mint green)
- **Text Color:** #000000 (black)
- **Background:** #FFFFFF (white)

## 🔗 API Integration (Optional - For Advanced Features)

### Get API Access Token
1. Go to Calendly Developer Settings: https://calendly.com/integrations/api_webhooks
2. Generate Personal Access Token
3. Update `booking-config.js`:
```javascript
api: {
  accessToken: "your_actual_token_here"
}
```

### Set Up Webhooks (For n8n Automation)
1. In Calendly webhook settings, add:
   - **Endpoint URL:** `https://your-n8n-instance.com/webhook/calendly-new-booking`
   - **Events:** `invitee.created`, `invitee.canceled`

## ✅ Integration Status

**Current Status:**
- ✅ Calendly username configured: `mrlai-clean`
- ✅ Widget integration ready
- ✅ Event listener for booking completion
- ✅ Automatic redirect to Stripe payment
- ⏳ **Next:** Create event types in Calendly dashboard
- ⏳ **Next:** Set up Stripe payment links

**Live URLs:**
- Basic Wash: https://calendly.com/mrlai-clean/basic-wash
- Premium Detail: https://calendly.com/mrlai-clean/premium-detail  
- Luxury Treatment: https://calendly.com/mrlai-clean/luxury-detail
- Ceramic Coating: https://calendly.com/mrlai-clean/ceramic-coating
- Paint Protection: https://calendly.com/mrlai-clean/paint-protection-film
- Window Tinting: https://calendly.com/mrlai-clean/window-tinting

## 🔄 How It Works

1. **Customer selects service** on booking page
2. **Calendly widget loads** with correct event type
3. **Customer books appointment** with custom questions
4. **System captures booking** via event listener
5. **Automatic redirect** to Stripe for deposit payment
6. **Booking data stored** for post-payment processing

## 🚨 Important Notes

- Make sure all event type URLs match the configuration
- Test each booking flow before going live
- Webhooks are optional but recommended for automation
- Keep API tokens secure (use environment variables)

---

**Ready to test!** Once you create the event types, the booking system will be fully functional.