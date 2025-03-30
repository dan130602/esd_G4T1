package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;

@Data
public class ItemResponse {
    private Long item_id;
    private String item_name;
    private Double item_price;
    private Double item_stock_quantity;
}
