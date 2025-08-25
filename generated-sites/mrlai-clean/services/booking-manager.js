/**
 * Booking Manager - Orchestrates the complete booking flow
 * Integrates Calendly, Stripe, and form management
 */

class BookingManager {
    constructor() {
        this.calendlyService = new CalendlyService();
        this.selectedService = null;
        this.bookingData = null;
        
        // Service configuration
        this.services = {
            basic: {
                id: 'basic',
                name: 'Basic Wash',
                price: 50,
                deposit: 25,
                duration: '1hr'
            },
            premium: {
                id: 'premium',
                name: 'Premium Detail',
                price: 150,
                deposit: 50,
                duration: '3hrs'
            },
            luxury: {
                id: 'luxury',
                name: 'Luxury Treatment',
                price: 300,
                deposit: 75,
                duration: '5hrs'
            },
            ceramic: {
                id: 'ceramic',
                name: 'Ceramic Coating',
                price: '500-1500',
                deposit: 100,
                duration: '8hrs'
            },
            ppf: {
                id: 'ppf',
                name: 'Paint Protection Film',
                price: '800-3000',
                deposit: 200,
                duration: '10hrs'
            },
            tinting: {
                id: 'tinting',
                name: 'Window Tinting',
                price: '200-600',
                deposit: 50,
                duration: '3hrs'
            }
        };

        // Stripe payment links (to be configured)
        this.stripeLinks = {
            basic: process.env.STRIPE_BASIC_LINK || 'https://buy.stripe.com/PLACEHOLDER_BASIC',
            premium: process.env.STRIPE_PREMIUM_LINK || 'https://buy.stripe.com/PLACEHOLDER_PREMIUM',
            luxury: process.env.STRIPE_LUXURY_LINK || 'https://buy.stripe.com/PLACEHOLDER_LUXURY',
            ceramic: process.env.STRIPE_CERAMIC_LINK || 'https://buy.stripe.com/PLACEHOLDER_CERAMIC',
            ppf: process.env.STRIPE_PPF_LINK || 'https://buy.stripe.com/PLACEHOLDER_PPF',
            tinting: process.env.STRIPE_TINTING_LINK || 'https://buy.stripe.com/PLACEHOLDER_TINTING'
        };

        this.init();
    }

    /**
     * Initialize booking manager
     */
    init() {
        this.setupServiceSelection();
        this.setupFormValidation();
        this.setupCalendlyEventHandlers();
        this.setupPaymentButton();
    }

    /**
     * Set up service selection handlers
     */
    setupServiceSelection() {
        const serviceRows = document.querySelectorAll('.service-row');
        
        serviceRows.forEach(row => {
            row.addEventListener('click', (e) => {
                this.selectService(row.dataset.service);
            });
        });
    }

    /**
     * Select a service and update UI
     */
    selectService(serviceId) {
        // Remove previous selection
        document.querySelectorAll('.service-row').forEach(r => r.classList.remove('selected'));
        
        // Select current service
        const serviceRow = document.querySelector(`[data-service="${serviceId}"]`);
        if (serviceRow) {
            serviceRow.classList.add('selected');
        }

        // Update selected service
        this.selectedService = this.services[serviceId];
        if (!this.selectedService) {
            console.error(`Unknown service: ${serviceId}`);
            return;
        }

        // Update UI
        this.updateSelectedServiceUI();
        
        // Load Calendly widget
        this.loadCalendlyWidget(serviceId);
        
        // Enable payment button
        this.enablePaymentButton();
        
        console.log('Selected service:', this.selectedService);
    }

    /**
     * Update selected service UI elements
     */
    updateSelectedServiceUI() {
        const selectedServiceSpan = document.getElementById('selected-service');
        const depositAmountSpan = document.getElementById('deposit-amount');
        const balanceAmountSpan = document.getElementById('balance-amount');

        if (selectedServiceSpan) {
            selectedServiceSpan.textContent = this.selectedService.name;
        }

        if (depositAmountSpan) {
            depositAmountSpan.textContent = `$${this.selectedService.deposit} to start`;
        }

        if (balanceAmountSpan) {
            const isRange = typeof this.selectedService.price === 'string' && this.selectedService.price.includes('-');
            if (isRange) {
                balanceAmountSpan.textContent = `varies (${this.selectedService.price})`;
            } else {
                balanceAmountSpan.textContent = this.selectedService.price - this.selectedService.deposit;
            }
        }
    }

    /**
     * Load Calendly widget with customer pre-fill and advanced options
     */
    loadCalendlyWidget(serviceId) {
        const calendlyContainer = document.getElementById('calendly-container');
        if (!calendlyContainer) {
            console.error('Calendly container not found');
            return;
        }

        try {
            // Get customer data from form for pre-filling
            const customerData = this.getFormData();
            
            // Advanced embed options following official docs
            const embedOptions = {
                hide_landing_page_details: '0',  // Show profile info for trust
                hide_event_type_details: '0',   // Show service details
                resize: true,                   // Auto-resize widget
                preFill: {
                    name: customerData.name,
                    email: customerData.email,
                    carInfo: customerData.carInfo,
                    location: customerData.location
                }
            };
            
            // Use official Calendly embed method with pre-fill
            if (customerData.name || customerData.email) {
                this.calendlyService.embedWithCustomerData(calendlyContainer, serviceId, customerData);
            } else {
                this.calendlyService.embedInlineWidget(calendlyContainer, serviceId, embedOptions);
            }
            
            console.log(`✅ Advanced Calendly widget loaded: ${serviceId}`);
        } catch (error) {
            console.error('Failed to load Calendly widget:', error);
            this.calendlyService.showEmbedError(calendlyContainer, serviceId);
        }
    }
    
    /**
     * Get current form data for pre-filling Calendly
     */
    getFormData() {
        const data = {};
        
        const nameInput = document.getElementById('customer-name');
        if (nameInput?.value) data.name = nameInput.value;
        
        const emailInput = document.getElementById('customer-email');
        if (emailInput?.value) data.email = emailInput.value;
        
        const carInput = document.getElementById('car-info');
        if (carInput?.value) data.carInfo = carInput.value;
        
        const locationInput = document.getElementById('service-location');
        if (locationInput?.value) data.location = locationInput.value;
        
        return data;
    }

    /**
     * Set up form validation
     */
    setupFormValidation() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        // Phone number formatting
        const phoneInput = document.getElementById('customer-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 10) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                }
                e.target.value = value;
            });
        }

        // Form validation on submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    /**
     * Handle form submission
     */
    handleFormSubmission() {
        const form = document.getElementById('booking-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        // Collect form data
        const formData = new FormData(form);
        this.bookingData = {
            service: this.selectedService,
            customer: {
                name: formData.get('customerName'),
                phone: formData.get('customerPhone'),
                email: formData.get('customerEmail'),
                carInfo: formData.get('carInfo'),
                location: formData.get('serviceLocation'),
                locationType: formData.get('locationType'),
                requests: formData.get('specialRequests')
            },
            timestamp: new Date().toISOString()
        };

        console.log('Form data collected:', this.bookingData);
        return true;
    }

    /**
     * Set up Calendly event handlers
     */
    setupCalendlyEventHandlers() {
        this.calendlyService.setupEventListeners((event) => {
            this.handleCalendlyEvent(event);
        });
    }

    /**
     * Handle official Calendly events using postMessage API
     */
    handleCalendlyEvent(event) {
        console.log('Calendly event received:', event.event, event.data);

        switch (event.event) {
            case 'profile_viewed':
                this.handleProfileViewed(event.data);
                break;
                
            case 'event_type_viewed':
                this.handleEventTypeViewed(event.data);
                break;
                
            case 'date_time_selected':
                this.handleDateTimeSelected(event.data);
                break;
                
            case 'scheduled':
                this.handleBookingCompleted(event.data);
                break;
                
            default:
                console.log('Unhandled event:', event.event);
        }
    }
    
    /**
     * Handle profile page viewed
     */
    handleProfileViewed(data) {
        console.log('Profile viewed - user is browsing services');
        // Could track analytics here
    }
    
    /**
     * Handle event type viewed
     */
    handleEventTypeViewed(data) {
        console.log('Event type viewed:', data);
        // Could show additional service info or pricing details
    }
    
    /**
     * Handle date and time selected
     */
    handleDateTimeSelected(data) {
        console.log('Date/time selected:', data);
        
        // Show user feedback that they've selected a time slot
        this.showDateTimeConfirmation(data);
        
        // Pre-validate form before final booking
        this.preValidateForm();
    }
    
    /**
     * Show confirmation when user selects date/time
     */
    showDateTimeConfirmation(data) {
        // Could add a subtle notification or update UI
        const paymentBtn = document.getElementById('stripe-payment-btn');
        if (paymentBtn) {
            paymentBtn.style.background = 'var(--color-accent)';
            paymentBtn.style.transform = 'scale(1.02)';
            setTimeout(() => {
                paymentBtn.style.background = '';
                paymentBtn.style.transform = '';
            }, 2000);
        }
    }
    
    /**
     * Pre-validate form when user selects time
     */
    preValidateForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;
        
        const requiredFields = form.querySelectorAll('[required]');
        let missingFields = [];
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                missingFields.push(field.labels[0]?.textContent || field.name);
            }
        });
        
        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            // Could show gentle reminder to complete form
        }
    }

    /**
     * Handle successful booking completion with official Calendly data
     */
    handleBookingCompleted(calendlyPayload) {
        console.log('Booking completed with Calendly data:', calendlyPayload);
        
        // Ensure form data is collected
        if (!this.bookingData) {
            this.handleFormSubmission();
        }

        // Extract important info from Calendly payload
        const appointmentInfo = this.extractAppointmentInfo(calendlyPayload);
        
        // Combine booking data with Calendly event
        const completeBookingData = {
            ...this.bookingData,
            calendly: {
                payload: calendlyPayload,
                appointment: appointmentInfo
            },
            bookingId: this.generateBookingId(),
            confirmedAt: new Date().toISOString()
        };

        // Store booking data
        this.storeBookingData(completeBookingData);

        // Show success message with appointment details
        this.showBookingSuccess(appointmentInfo);

        // Redirect to payment after user acknowledgment
        setTimeout(() => {
            this.redirectToPayment();
        }, 4000);
    }
    
    /**
     * Extract key appointment info from Calendly payload
     */
    extractAppointmentInfo(payload) {
        const info = {
            eventName: payload?.event_type?.name || this.selectedService?.name || 'Service',
            startTime: payload?.scheduled_event?.start_time,
            endTime: payload?.scheduled_event?.end_time,
            timezone: payload?.scheduled_event?.timezone,
            location: payload?.scheduled_event?.location?.join?.(', ') || 'Mobile Service',
            inviteeEmail: payload?.invitee?.email,
            inviteeName: payload?.invitee?.name
        };
        
        // Format date/time for display
        if (info.startTime) {
            const startDate = new Date(info.startTime);
            info.displayDate = startDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            info.displayTime = startDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        
        return info;
    }

    /**
     * Generate unique booking ID
     */
    generateBookingId() {
        return `MRLAI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    /**
     * Store booking data for later processing
     */
    storeBookingData(data) {
        try {
            sessionStorage.setItem('completedBooking', JSON.stringify(data));
            localStorage.setItem(`booking_${data.bookingId}`, JSON.stringify(data));
            console.log('Booking data stored:', data.bookingId);
        } catch (error) {
            console.error('Failed to store booking data:', error);
        }
    }

    /**
     * Show enhanced booking success message with appointment details
     */
    showBookingSuccess(appointmentInfo = {}) {
        const customerName = this.bookingData?.customer?.name || appointmentInfo.inviteeName || 'Customer';
        
        let message = `✅ Appointment Confirmed!

`;
        message += `Service: ${this.selectedService.name}
`;
        message += `Customer: ${customerName}
`;
        
        if (appointmentInfo.displayDate && appointmentInfo.displayTime) {
            message += `Date: ${appointmentInfo.displayDate}
`;
            message += `Time: ${appointmentInfo.displayTime}
`;
        }
        
        message += `
💳 Next Step: Secure $${this.selectedService.deposit} deposit
`;
        message += `Redirecting to payment in 4 seconds...`;

        alert(message);

        // TODO: Replace with professional modal/notification system
        // Could show appointment details in a nice modal with:
        // - Service details
        // - Appointment time
        // - Customer info
        // - Next steps
    }

    /**
     * Set up payment button
     */
    setupPaymentButton() {
        const paymentBtn = document.getElementById('stripe-payment-btn');
        if (!paymentBtn) return;

        paymentBtn.addEventListener('click', () => {
            if (!this.selectedService) {
                alert('Please select a service first');
                return;
            }

            if (!this.handleFormSubmission()) {
                return;
            }

            this.redirectToPayment();
        });
    }

    /**
     * Enable payment button
     */
    enablePaymentButton() {
        const paymentBtn = document.getElementById('stripe-payment-btn');
        if (paymentBtn) {
            paymentBtn.disabled = false;
            paymentBtn.textContent = `🔒 Drop $${this.selectedService.deposit} to Start`;
        }
    }

    /**
     * Redirect to Stripe payment
     */
    redirectToPayment() {
        if (!this.selectedService) {
            console.error('No service selected');
            return;
        }

        const paymentLink = this.stripeLinks[this.selectedService.id];
        
        if (!paymentLink || paymentLink.includes('PLACEHOLDER')) {
            console.log('Payment integration pending for:', this.selectedService.id);
            alert(`
Payment system ready for ${this.selectedService.name}!

Deposit: $${this.selectedService.deposit}
Balance: Due after service completion

(Stripe integration pending - booking confirmed!)
            `);
            return;
        }

        // Redirect to actual Stripe payment
        console.log('Redirecting to payment:', paymentLink);
        window.location.href = paymentLink;
    }

    /**
     * Get booking status
     */
    getBookingStatus() {
        return {
            hasSelectedService: !!this.selectedService,
            hasValidForm: !!this.bookingData,
            isReadyForPayment: !!(this.selectedService && this.bookingData)
        };
    }

    /**
     * Reset booking state
     */
    reset() {
        this.selectedService = null;
        this.bookingData = null;
        
        // Clear UI
        document.querySelectorAll('.service-row').forEach(r => r.classList.remove('selected'));
        
        const selectedServiceSpan = document.getElementById('selected-service');
        if (selectedServiceSpan) {
            selectedServiceSpan.textContent = 'Choose service above first';
        }

        const paymentBtn = document.getElementById('stripe-payment-btn');
        if (paymentBtn) {
            paymentBtn.disabled = true;
            paymentBtn.textContent = '🔒 Book It (Stripe Keeps It Safe)';
        }
    }

    /**
     * Validate configuration
     */
    validateConfiguration() {
        const calendlyValidation = this.calendlyService.validateConfiguration();
        
        const issues = [...calendlyValidation.issues];
        
        // Check Stripe configuration
        const hasStripeLinks = Object.values(this.stripeLinks).some(link => !link.includes('PLACEHOLDER'));
        if (!hasStripeLinks) {
            issues.push('No Stripe payment links configured');
        }

        return {
            valid: issues.length === 0,
            issues: issues
        };
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingManager;
} else {
    window.BookingManager = BookingManager;
}