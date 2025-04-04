package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private Integer order_id;
    private String new_order_status;
}
