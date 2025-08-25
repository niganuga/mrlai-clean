# 📅 Calendly Event Types - Manual Setup Guide

Since API creation requires user authorization, here's the manual setup guide.

## 🎯 Go to Calendly Dashboard

1. **Login to:** https://calendly.com/app/admin
2. **Click:** "Create Event Type" button
3. **Follow the steps below for each service**

---

## 📋 Create These 6 Event Types

### 1. Basic Wash
```
Event Name: Basic Wash
URL Slug: basic-wash (must be exact)
Duration: 1 hour 30 minutes
Location: Mobile Service (I'll come to you)
Description: Quick exterior wash, dry, and basic interior vacuum. Perfect for maintaining your car's appearance.
Color: #A8E6CF (Mint Green)
```

**Custom Questions to Add:**
- "Vehicle Make, Model, Year" (Required)
- "Service Location Address" (Required)
- "Special Requests" (Optional)

**Availability:** 8 AM - 6 PM, Monday-Friday + 9 AM - 5 PM Saturday

---

### 2. Premium Detail
```
Event Name: Premium Detail  
URL Slug: premium-detail (must be exact)
Duration: 3 hours
Location: Mobile Service (I'll come to you)
Description: Complete exterior detail, interior deep clean, wax protection. Your car will look showroom ready.
Color: #A8E6CF (Mint Green)
```

**Same questions and availability as above**

---

### 3. Luxury Detail
```
Event Name: Luxury Detail
URL Slug: luxury-detail (must be exact)
Duration: 5 hours
Location: Mobile Service (I'll come to you)
Description: Premium detail with paint correction and ceramic wax finish. The ultimate car care experience.
Color: #A8E6CF (Mint Green)
```

**Same questions and availability as above**

---

### 4. Ceramic Coating
```
Event Name: Ceramic Coating
URL Slug: ceramic-coating (must be exact)
Duration: 8 hours (Full Day)
Location: Mobile Service (I'll come to you)
Description: Paint correction and professional ceramic coating application. Long-lasting protection and shine.
Color: #FFD700 (Gold)
```

**Same questions and availability as above**

---

### 5. Paint Protection Film
```
Event Name: Paint Protection Film
URL Slug: paint-protection-film (must be exact)
Duration: 10 hours (Full Day)
Location: Mobile Service (I'll come to you)
Description: Clear protective film installation for ultimate paint protection. Invisible armor for your vehicle.
Color: #FFD700 (Gold)
```

**Same questions and availability as above**

---

### 6. Window Tinting
```
Event Name: Window Tinting
URL Slug: window-tinting (must be exact)
Duration: 3 hours
Location: Mobile Service (I'll come to you)
Description: Professional automotive window tint installation. Style, privacy, and UV protection.
Color: #F8BBD9 (Pastel Pink)
```

**Same questions and availability as above**

---

## ✅ Verification Checklist

After creating each event type, verify:

- [ ] **URL matches exactly:** `https://calendly.com/mrlai-clean/basic-wash`
- [ ] **Duration is correct** for each service
- [ ] **Custom questions added** (Vehicle info, Address, Special requests)
- [ ] **Availability set** (8 AM - 6 PM weekdays, 9 AM - 5 PM Saturday)
- [ ] **Colors match** your brand (Mint green for basic services, gold for premium)
- [ ] **Descriptions are clear** and professional

---

## 🎯 Final URLs

Once created, your booking system will use these URLs:

```
https://calendly.com/mrlai-clean/basic-wash
https://calendly.com/mrlai-clean/premium-detail
https://calendly.com/mrlai-clean/luxury-detail
https://calendly.com/mrlai-clean/ceramic-coating
https://calendly.com/mrlai-clean/paint-protection-film
https://calendly.com/mrlai-clean/window-tinting
```

---

## ⚙️ Advanced Settings (Optional)

**Buffer Time:** 30 minutes between appointments

**Email Notifications:**
- Enable booking confirmations
- Enable reminder emails (24 hours before)
- Use your business email: mrlai.mcds@gmail.com

**Payment Integration:**
- We'll handle payments through Stripe separately
- Don't enable Calendly's payment features

---

## 🚀 After Creation

1. **Test each booking URL** to ensure they work
2. **Update your booking system** - it should automatically connect
3. **Set up Stripe payment links** for deposits (next step)

**Estimated Time:** 15-20 minutes to create all 6 event types

Let me know when you've created these and I'll help with the next steps!