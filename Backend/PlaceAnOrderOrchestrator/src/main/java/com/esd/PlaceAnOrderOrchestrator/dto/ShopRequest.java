package com.esd.PlaceAnOrderOrchestrator.dto;

import java.util.List;

import lombok.Data;

@Data
public class ShopRequest {
    private Integer orderId;
    private List<OrderItemDto> items;
}
