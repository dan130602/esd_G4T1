package com.esd.PlaceAnOrderOrchestrator.dto;

import java.util.List;

import lombok.Data;

@Data
public class ShopRequest {
    private Long orderId;
    private List<OrderItemDto> items;
}
