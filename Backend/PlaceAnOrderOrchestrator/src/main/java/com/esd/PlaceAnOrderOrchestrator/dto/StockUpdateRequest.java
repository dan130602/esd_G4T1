package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {
    private Integer item_id;
    private Integer item_quantity;   
}
