package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private Integer code;
    private Boolean success;
    private String checkout_url;
    private String checkout_session_id;
}
