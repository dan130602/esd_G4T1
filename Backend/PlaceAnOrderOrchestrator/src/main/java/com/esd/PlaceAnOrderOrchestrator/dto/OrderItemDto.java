package com.esd.PlaceAnOrderOrchestrator.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OrderItemDto {
    private Integer id;
    private Integer order_id;
    private String order_item_subtotal;

    // @JsonProperty("item_id")
    // @JsonAlias({"product_id"})
    private Integer item_id;

    // @JsonProperty("name")
    // @JsonAlias({"product_name", "item_name"})
    private String item_name;

    private Integer quantity;

    // @JsonProperty("price") // Send as 'price'
    // @JsonAlias({"unit_price"}) // Can receive as 'price' 'unit_price'
    private String item_price;
}
