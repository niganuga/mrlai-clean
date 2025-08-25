# Mr. Lai's Stripe Account Setup Guide

## 🎯 Overview
This guide walks Mr. Lai through setting up his Stripe account for deposit payments. Each payment link corresponds to a service deposit amount.

---

## 📋 Step 1: Create Stripe Account

### 1.1 Sign Up
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Use business email: **mrlai.mcds@gmail.com**
4. Create strong password

### 1.2 Business Information
Enter the following details:

**Business Details:**
- **Business Name:** Mr. Lai's Mobile Car Wash & Detailing
- **Business Type:** Individual/Sole Proprietorship (or LLC if applicable)
- **Industry:** Car Wash and Auto Detailing Services
- **Business Website:** [Your website URL when live]

**Personal Information:**
- **Full Legal Name:** [Mr. Lai's legal name]
- **Date of Birth:** [DOB]
- **SSN:** [Last 4 digits initially, full SSN for verification]
- **Address:** [Business address]

**Bank Account:**
- **Routing Number:** [Bank routing number]
- **Account Number:** [Business checking account number]
- **Account Type:** Checking

---

## 💳 Step 2: Create Payment Links

### 2.1 Basic Wash Deposit ($25)

1. Go to **Products** → **Payment Links**
2. Click **"Create payment link"**
3. Fill out:

```
Product Name: Basic Wash Deposit
Description: $25 deposit for Basic Wash service ($60 total)
Price: $25.00
Currency: USD
Payment Type: One-time payment

Custom Fields:
✓ Customer Name (required)
✓ Phone Number (required) 
✓ Email (required)
✓ Car Year & Model (required)
✓ Service Address (required)

After Payment:
✓ Redirect to success page
✓ Send receipt email
```

4. **Save the payment link URL** → Replace `PLACEHOLDER_BASIC_PAYMENT_LINK` in config

### 2.2 Premium Detail Deposit ($50)

Repeat process with:
```
Product Name: Premium Detail Deposit
Description: $50 deposit for Premium Detail service ($150 total)
Price: $50.00
[Same settings as Basic Wash]
```

Save URL → Replace `PLACEHOLDER_PREMIUM_PAYMENT_LINK`

### 2.3 Luxury Detail Deposit ($75)

Repeat process with:
```
Product Name: Luxury Detail Deposit  
Description: $75 deposit for Luxury Detail service ($300 total)
Price: $75.00
[Same settings as Basic/Premium]
```

Save URL → Replace `PLACEHOLDER_LUXURY_PAYMENT_LINK`

---

## 🔗 Step 3: Configure Webhooks (for n8n Integration)

### 3.1 Create Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter webhook URL: `[N8N_INSTANCE_URL]/webhook/stripe-payment-success`
4. Select events:
   - `payment_intent.succeeded`
   - `checkout.session.completed`

### 3.2 Get Webhook Secret
1. Copy the **Webhook Signing Secret**
2. Replace `PLACEHOLDER_WEBHOOK_SECRET` in n8n configuration

---

## 🛠️ Step 4: Get API Keys

### 4.1 Publishable Key (for frontend)
1. Go to **Developers** → **API Keys**
2. Copy **Publishable key** (starts with `pk_live_` or `pk_test_`)
3. Replace `PLACEHOLDER_STRIPE_PUBLISHABLE_KEY` in booking-config.js

### 4.2 Secret Key (for n8n workflows)
1. Copy **Secret key** (starts with `sk_live_` or `sk_test_`)
2. Add to n8n credentials (never put in code)

---

## ✅ Step 5: Test Everything

### 5.1 Test Payment Links
1. Click each payment link
2. Use Stripe test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any CVC
5. Verify redirects work correctly

### 5.2 Verify Webhooks
1. Make test payment
2. Check n8n workflow triggers
3. Confirm email automations fire

---

## 📊 Step 6: Update Configuration Files

Replace these placeholders in `/config/booking-config.js`:

```javascript
// Replace with actual values from Stripe dashboard
STRIPE: {
  publishableKey: "pk_live_YOUR_ACTUAL_KEY_HERE",
  paymentLinks: {
    basic: "https://buy.stripe.com/YOUR_BASIC_LINK_HERE",
    premium: "https://buy.stripe.com/YOUR_PREMIUM_LINK_HERE", 
    luxury: "https://buy.stripe.com/YOUR_LUXURY_LINK_HERE"
  }
}
```

---

## 🔒 Security Checklist

### ✅ Account Security
- [ ] Enable 2-factor authentication
- [ ] Use strong, unique password
- [ ] Set up account recovery options
- [ ] Review notification settings

### ✅ Business Verification
- [ ] Complete identity verification
- [ ] Upload business documents if requested
- [ ] Verify bank account (micro-deposits)
- [ ] Set up tax settings

### ✅ Payment Settings
- [ ] Set payout schedule (daily/weekly)
- [ ] Configure account statements
- [ ] Set up receipt emails
- [ ] Test dispute/chargeback process

---

## 📈 Step 7: Go Live

### 7.1 Switch to Live Mode
1. Complete all Stripe verification steps
2. Switch from "Test" to "Live" mode
3. Update all API keys and payment links
4. Test with small real payment

### 7.2 Monitor Performance
- Check payment success rates
- Monitor failed payments
- Track deposit amounts vs. full service payments
- Review customer feedback on payment process

---

## 🆘 Troubleshooting

### Common Issues:

**Payment link not working:**
- Check if Stripe account is fully verified
- Verify payment link is "active" in dashboard
- Test with different browsers/devices

**Webhooks not firing:**
- Verify webhook URL is accessible
- Check n8n workflow is active
- Review webhook event logs in Stripe

**Customer complaints:**
- Payment appears twice (check for duplicate charges)
- Card declined (guide customer to contact bank)
- Receipt not received (check email settings)

### Support Resources:
- Stripe Documentation: [docs.stripe.com](https://docs.stripe.com)
- Stripe Support: Available in dashboard chat
- Phone Support: Available for verified accounts

---

## 💰 Pricing Summary

| Service | Total Price | Deposit | Balance Due |
|---------|-------------|---------|-------------|
| Basic Wash | $60 | $25 | $35 |
| Premium Detail | $150 | $50 | $100 |
| Luxury Detail | $300 | $75 | $225 |

**Stripe Fees:** 2.9% + 30¢ per transaction
- Basic deposit fee: $1.03
- Premium deposit fee: $1.75  
- Luxury deposit fee: $2.48

**Net deposits received:**
- Basic: $23.97
- Premium: $48.25
- Luxury: $72.52

---

## 📞 Next Steps After Setup

1. **Test the complete booking flow**
2. **Train on Stripe dashboard navigation**
3. **Set up payout schedule preferences**
4. **Configure email receipt templates**
5. **Review terms of service and policies**

**Questions?** Contact OneFlow support during setup process.