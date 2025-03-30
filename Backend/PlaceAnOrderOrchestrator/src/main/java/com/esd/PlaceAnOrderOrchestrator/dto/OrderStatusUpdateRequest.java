package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private Long order_id;
    private String new_order_status;
}
