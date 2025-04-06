package com.esd.PlaceAnOrderOrchestrator.service;

import com.esd.PlaceAnOrderOrchestrator.dto.CheckoutRequest;
import com.esd.PlaceAnOrderOrchestrator.dto.PaymentResponse;
import com.esd.PlaceAnOrderOrchestrator.dto.PaymentWebhookRequest;

public interface OrchestratorService {
    // Process a checkout request
    PaymentResponse processCheckout(CheckoutRequest checkoutRequest);

    // Handle payment webhook events
    void handlePaymentWebhook(PaymentWebhookRequest webhookRequest);
}
