package com.esd.PlaceAnOrderOrchestrator.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PaymentRequest {
    private Integer order_id;
    private Integer user_id;
    private Double total_amount;

    @JsonProperty("created")
    private String created_on;
    
    private List<OrderItemDto> items;
}
