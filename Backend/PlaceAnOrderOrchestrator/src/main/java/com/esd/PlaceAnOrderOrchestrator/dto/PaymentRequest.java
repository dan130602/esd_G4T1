package com.esd.PlaceAnOrderOrchestrator.dto;

import java.util.List;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long order_id;
    private Long user_id;
    private Double total_amount;
    private String created_on;
    private List<OrderItemDto> items;
}
