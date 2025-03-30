package com.esd.PlaceAnOrderOrchestrator.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OrderResponse {
    private Long order_id;

    @JsonProperty("userId")
    private Long user_id;

    private Double total_amount;
    private String status;
    private String created;
    private String modified;

    private List<OrderItemDto> items;
}
