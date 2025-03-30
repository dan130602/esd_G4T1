package com.esd.PlaceAnOrderOrchestrator.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long id;
    private Long order_id;
    private String order_item_subtotal;

    @JsonProperty("item_id")
    private Long product_id;

    @JsonProperty("item_name")
    private String product_name;

    private Integer quantity;

    @JsonProperty("price")
    private String unit_price;
}
