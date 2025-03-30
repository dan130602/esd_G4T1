package com.esd.PlaceAnOrderOrchestrator.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TransactionResponse {
    private Integer transcation_id;

    @JsonProperty("userId")
    private Long user_id;
    
    private Long item_id;
    private BigDecimal amount;
    private String status;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private LocalDateTime created_at;
}
