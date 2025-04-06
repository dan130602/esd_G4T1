package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;

@Data
public class PaymentWebhookRequest {
    private String eventType;
    private PaymentData data;

    @Data
    public static class PaymentData {
        private String paymentId;
        private Integer orderId;
        private String status;
        private String errorMessage;
    }
}
