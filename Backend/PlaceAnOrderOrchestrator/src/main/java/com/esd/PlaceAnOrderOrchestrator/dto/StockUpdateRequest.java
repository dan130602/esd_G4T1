package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {
    private Long item_id;
    private Integer item_quantity;   
}
