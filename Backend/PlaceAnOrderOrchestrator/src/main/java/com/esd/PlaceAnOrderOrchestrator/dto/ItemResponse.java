package com.esd.PlaceAnOrderOrchestrator.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ItemResponse {
    private Integer item_id;
    private String item_name;
    
    @JsonProperty("price")
    private String item_price;

    @JsonProperty("quantity")
    private Integer item_stock_quantity;
}
