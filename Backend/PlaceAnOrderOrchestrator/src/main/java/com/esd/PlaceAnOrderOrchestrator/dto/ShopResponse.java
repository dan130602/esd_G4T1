package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;
import java.util.List;

@Data
public class ShopResponse {
    private boolean stockAvailable;
    private List<StockItemResult> itemResults;

    public static class StockItemResult {
        private Long itemId;
        private boolean available;
        private Integer requestedQuantity;
        private Integer availableQuantity;
    }
}
