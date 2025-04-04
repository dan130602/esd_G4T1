package com.esd.PlaceAnOrderOrchestrator.messaging;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.esd.PlaceAnOrderOrchestrator.dto.PaymentWebhookRequest;
import com.esd.PlaceAnOrderOrchestrator.service.OrchestratorService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PaymentEventListener {

    private final OrchestratorService orchestratorService;
    private final ObjectMapper objectMapper;

    public PaymentEventListener(OrchestratorService orchestratorService) {
        this.orchestratorService = orchestratorService;
        this.objectMapper = new ObjectMapper();
    }

    @KafkaListener(topics = "payment-events", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(String message) {
        try {
            log.info("Received payment event: {}", message);

            // Parse the JSON message
            JsonNode eventNode = objectMapper.readTree(message);
            String eventType = eventNode.get("event_type").asText();

            // Create a payment webhook request DTO from the Kafka message
            PaymentWebhookRequest webhookRequest = new PaymentWebhookRequest();
            webhookRequest.setEventType(eventType);

            PaymentWebhookRequest.PaymentData paymentData = new PaymentWebhookRequest.PaymentData();

            // Extract event data based on event type
            if ("payment.completed".equals(eventType)) {
                JsonNode dataNode = eventNode.get("data");
                paymentData.setOrderId(dataNode.get("order_id").asInt());
                paymentData.setPaymentId(dataNode.get("payment_id").asText());
                paymentData.setStatus("succeeded");
            } else if ("payment.failed".equals(eventType)) {
                JsonNode dataNode = eventNode.get("data");
                paymentData.setOrderId(dataNode.get("order_id").asInt());
                paymentData.setPaymentId(dataNode.get("payment_intent_id").asText());
                paymentData.setStatus("failed");
                paymentData.setErrorMessage(dataNode.get("error_message").asText());
            }

            webhookRequest.setData(paymentData);

            // Process the webhook request
            orchestratorService.handlePaymentWebhook(webhookRequest);

        } catch (Exception e) {
            log.error("Error processing payment event: {}", e.getMessage(), e);
        }
    }
}