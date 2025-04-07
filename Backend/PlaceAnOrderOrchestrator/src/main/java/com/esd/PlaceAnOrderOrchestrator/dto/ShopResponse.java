package com.esd.PlaceAnOrderOrchestrator.dto;

import lombok.Data;
import java.util.List;

@Data
public class ShopResponse {
    private boolean stockAvailable;
    private List<StockItemResult> itemResults;

    public static class StockItemResult {
        private Integer itemId;
        private boolean available;
        private Integer requestedQuantity;
        private Integer availableQuantity;
    }
}
