package com.esd.PlaceAnOrderOrchestrator.messaging;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class TransactionEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "transaction-topic";

    public TransactionEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendTransactionEvent(String userId, Integer itemId, String amount, String status) {
        Map<String, Object> transaction = new HashMap<>();
        transaction.put("user_id", userId);
        transaction.put("item_id", itemId);
        transaction.put("amount", amount);
        transaction.put("status", status);

        log.info("Sending transaction event to Kafka: {}", transaction);

        try {
            kafkaTemplate.send(TOPIC, transaction);
            log.info("Transaction event sent successfully");
        } catch (Exception e) {
            log.error("Failed to send transaction event to Kafka: {}", e.getMessage(), e);
        }
    }
}