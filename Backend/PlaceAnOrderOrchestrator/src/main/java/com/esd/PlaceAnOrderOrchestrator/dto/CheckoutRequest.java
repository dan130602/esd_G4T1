package com.esd.PlaceAnOrderOrchestrator.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String user_id;

    // // @JsonProperty("item")
    // private List<OrderItemDto> items;
}
