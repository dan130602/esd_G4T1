package com.esd.PlaceAnOrderOrchestrator.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.esd.PlaceAnOrderOrchestrator.dto.CheckoutRequest;
import com.esd.PlaceAnOrderOrchestrator.dto.PaymentResponse;
import com.esd.PlaceAnOrderOrchestrator.dto.PaymentWebhookRequest;
import com.esd.PlaceAnOrderOrchestrator.service.OrchestratorService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/place-an-order")
@Slf4j
public class OrchestratorController {
    private final OrchestratorService orchestratorService;

    public OrchestratorController(OrchestratorService orchestratorService) {
        this.orchestratorService = orchestratorService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<PaymentResponse> checkout(@RequestBody CheckoutRequest checkoutRequest) {
        log.info("Received checkout request");
        PaymentResponse response = orchestratorService.processCheckout(checkoutRequest);
        return ResponseEntity.ok(response);    
    }

    @PostMapping("/payment-webhook")
    public ResponseEntity<String> paymentWebhook(@RequestBody PaymentWebhookRequest webhookRequest) {
        log.info("Received payment webhook");
        orchestratorService.handlePaymentWebhook(webhookRequest);
        return ResponseEntity.ok("Webhook processed successfully");
    }

}
