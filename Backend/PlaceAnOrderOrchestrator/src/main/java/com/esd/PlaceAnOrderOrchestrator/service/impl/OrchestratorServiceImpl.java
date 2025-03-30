package com.esd.PlaceAnOrderOrchestrator.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.esd.PlaceAnOrderOrchestrator.dto.CheckoutRequest;
import com.esd.PlaceAnOrderOrchestrator.dto.ItemResponse;
import com.esd.PlaceAnOrderOrchestrator.dto.OrderItemDto;
import com.esd.PlaceAnOrderOrchestrator.dto.OrderResponse;
import com.esd.PlaceAnOrderOrchestrator.dto.OrderStatusUpdateRequest;
import com.esd.PlaceAnOrderOrchestrator.dto.PaymentRequest;
import com.esd.PlaceAnOrderOrchestrator.dto.PaymentResponse;
import com.esd.PlaceAnOrderOrchestrator.dto.PaymentWebhookRequest;
import com.esd.PlaceAnOrderOrchestrator.dto.StockUpdateRequest;
import com.esd.PlaceAnOrderOrchestrator.dto.TransactionResponse;
import com.esd.PlaceAnOrderOrchestrator.service.OrchestratorService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j //For logging
public class OrchestratorServiceImpl implements OrchestratorService {
    private final RestTemplate restTemplate;

    // Getting urls from application properties
    @Value("${service.order.url}")
    private String orderServiceUrl;

    @Value("${service.payment.url}")
    private String paymentServiceUrl;

    @Value("${service.shop.url}")
    private String shopServiceUrl;

    @Value("${service.transaction.url}")
    private String transactionServiceUrl;

    // @Value("${service.email.url:}") 
    // private String emailServiceUrl;

    public OrchestratorServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final class OrderStatus {
        public static final String CREATED = "CREATED";
        public static final String PAID = "PAID";
        public static final String FAILED = "FAILED";
        public static final String PAYMENT_FAILED = "PAYMENT_FAILED";
    }

    @Override
    public PaymentResponse processCheckout(CheckoutRequest checkoutRequest) {
        log.info("Processing checkout for user: {}", checkoutRequest.getUserId());

        try {
            //1. Create order in Order Service
            OrderResponse orderResponse = createOrder(checkoutRequest);
            log.info("Order created with ID: {}", orderResponse.getOrder_id());

            //2. Check for stock
            boolean shopResponse = checkStock(orderResponse);
            if (shopResponse) { // 2.1 if have stock, proceed to payment
                // 3. Update stock
                boolean updateItemQuantityResponse = updateStock(orderResponse); 
                
                if (!updateItemQuantityResponse) {
                    updateOrderStatus(orderResponse, OrderStatus.PAID);
                    return createFailedResponse(400, "STOCK_UPDATE_FAILED");
                }

                // 4. Initiate payment in Payment service
                PaymentResponse paymentResponse = initiatePayment(orderResponse);
                log.info("Payment initiated, checkout URL: {}", paymentResponse.getCheckout_url());

                //Update order status
                updateOrderStatus(orderResponse, OrderStatus.PAID);

                return paymentResponse;
            } else { // 2.2 if not, reject order
                log.warn("Insufficient stock. Order {} failed", orderResponse.getOrder_id());
                updateOrderStatus(orderResponse, OrderStatus.FAILED);
                return createFailedResponse(400, "Insufficient stock for some items.");
            }        
        } catch (Exception e) {
            log.error("Error during checkout process {}", e.getMessage());
            return createFailedResponse(500, "An unexpected error occured during checkout.");
        }
    }

    @Override
    public void handlePaymentWebhook(PaymentWebhookRequest webhookRequest) {
        log.info("Received payment webhook with event type: {}", webhookRequest.getEventType());

        // Get order ID from webhook data
        Long orderId = webhookRequest.getData().getOrderId();
        try {
            if ("payment.completed".equals(webhookRequest.getEventType())) {
                // Payment successful - Update order status
                updateOrderStatus(orderId, OrderStatus.PAID);
                log.info("Order {} marked as PAID", orderId);
                
                // Get order details and process items for transaction table
                try {
                    processTransactionLogging(orderId);
                } catch (Exception e) {
                    log.error("Failed to log transactions for oder {}. Error: {}",
                        orderId, e.getMessage()
                    );
                }
                
                // TODO: Call email service (OutSystems) to send email to user
                log.info("Writing to email outsystems");
                //sendOrderConfirmationEmail(userId, orderId)
            
            } else if ("payment.failed".equals(webhookRequest.getEventType())) {
                // Payment failed - Update order status
                updateOrderStatus(orderId, OrderStatus.PAYMENT_FAILED);
                log.info("Order {} marked as PAYMENT_FAILED", orderId);
            } else {
                log.warn("Unhandled payment event type: {}", webhookRequest.getEventType());
            }
        } catch (Exception e) {
            log.error("Error during transcation logging and email sending process", e);
            // return createFailedResponse(500, "An unexpected error occured during checkout.");
        }
        
    }

    // Helper method to create an order
    private OrderResponse createOrder(CheckoutRequest checkoutRequest) {
        String url = orderServiceUrl + "/api/order";
        log.info("Creating order on {}", url);
        return restTemplate.postForObject(url, checkoutRequest, OrderResponse.class);
    }

    // Helper method to check stock availability
    private boolean checkStock(OrderResponse orderResponse) {
        for (OrderItemDto item : orderResponse.getItems()) {
            String getItemFromShopURL = shopServiceUrl + "/shop/" + item.getProduct_id();
            int retryCount = 0;
            int maxRetries = 3;
            
            while (retryCount < maxRetries) {
                try {
                    ItemResponse itemResponse = restTemplate.getForObject(getItemFromShopURL, ItemResponse.class);
                    
                    if (itemResponse == null) {
                        log.warn("Received null response for item id: {} name: {}", item.getProduct_id(), item.getProduct_name());
                        retryCount++;
                        if (retryCount < maxRetries) {
                            Thread.sleep(1000); //Wait 1 second before retry
                            continue;
                        }
                        return false;
                    }

                    if (itemResponse.getItem_stock_quantity() < item.getQuantity()) {
                        log.warn("Insufficient stock for item named: {} id: {}. Required amount: {}, Available: {}",
                            item.getProduct_name(),
                            item.getProduct_id(),
                            item.getQuantity(),
                            itemResponse.getItem_stock_quantity()
                        );
                        return false;
                    }
                    break;
                } catch (Exception e) {
                    log.error("Error checking stock for item named: {} and id :{}. Attempt {}/{}. Error: {}", 
                        item.getProduct_name(), 
                        item.getProduct_id(),
                        retryCount + 1,
                        maxRetries,
                        e.getMessage()
                    );
                    retryCount++;

                    if (retryCount >= maxRetries) {
                        log.error("Max retries exceeded for checking stock of item id: {} name: {}",
                            item.getProduct_id(),
                            item.getProduct_name()
                        );
                        return false;
                    }

                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return false;
                    }
                }

            }
        }
        
        return true;
    }

    // Helper method to update item stock in shop
    private boolean updateStock(OrderResponse orderResponse) {
        boolean allUpdatesSuccessful = true;

        for (OrderItemDto item : orderResponse.getItems()) {
            String putItemFromShopURL = shopServiceUrl + "/shop/" + item.getProduct_id();
            
            StockUpdateRequest updateRequest = new StockUpdateRequest();
            updateRequest.setItem_quantity(item.getQuantity());

            try {
                restTemplate.put(putItemFromShopURL, updateRequest);
            } catch (Exception e) {
                log.warn("Failed to update item name: {} id: {}.", item.getProduct_name(), item.getProduct_id());
                allUpdatesSuccessful = false;
            }
        }

        return allUpdatesSuccessful;
    }

    // Helper method to update order to Failed
    private boolean updateOrderStatus(OrderResponse orderResponse, String status) {
        String updateOrderURL = orderServiceUrl + "/api/order/" + orderResponse.getOrder_id() + "/status";
        boolean updateSuccess = true;

        OrderStatusUpdateRequest orderStatusUpdateRequest = new OrderStatusUpdateRequest();
        orderStatusUpdateRequest.setOrder_id(orderResponse.getOrder_id());
        orderStatusUpdateRequest.setNew_order_status(status);

        try {
            restTemplate.put(updateOrderURL, orderStatusUpdateRequest);    
        } catch (Exception e) {
            log.warn("Failed to update order of order_id: {} and user_id: {}", 
                    orderResponse.getOrder_id(), 
                    orderResponse.getUser_id()
                );
            updateSuccess = false;
        }

        return updateSuccess;
    }
    
    // Helper method to update PaymentResponse for failed processes
    private PaymentResponse createFailedResponse(int code, String message) {
        PaymentResponse failedResponse = new PaymentResponse();
        failedResponse.setCode(code);
        failedResponse.setSuccess(false);
        failedResponse.setCheckout_url(null);
        failedResponse.setCheckout_session_id(null);
        log.warn("Checkout failed: {}", message);

        return failedResponse;
    }
    
    
    // Helper method to initiate payment
    private PaymentResponse initiatePayment(OrderResponse orderResponse) {
        String url = paymentServiceUrl + "/api/payment/create-checkout-session";

        // Create payment request from order response
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setOrder_id(orderResponse.getOrder_id());
        paymentRequest.setUser_id(orderResponse.getUser_id());
        paymentRequest.setTotal_amount(orderResponse.getTotal_amount());
        paymentRequest.setCreated_on(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        paymentRequest.setItems(orderResponse.getItems());

        return restTemplate.postForObject(url, paymentRequest, PaymentResponse.class);
    }

    // Helper method to update order status
    private void updateOrderStatus(Long orderId, String status) {
        String url = orderServiceUrl + "/api/order/" + orderId + "/status";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> statusUpdate = new HashMap<>();
        statusUpdate.put("status", status);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(statusUpdate, headers);

        restTemplate.put(url, requestEntity);
    }

    // Helper method for transcation logging
    private void processTransactionLogging(Long orderId) {
        OrderResponse userOrder = getOrder(orderId);
        Long user_id = userOrder.getUser_id();
        List<OrderItemDto> order_items = userOrder.getItems();

        for (OrderItemDto item : order_items) {
            Long item_id = item.getProduct_id();
            String item_amount = item.getUnit_price();
            String status = "Completed";

            // Call transactions service
            TransactionResponse transactionResponse = createTransaction(user_id, item_id, item_amount, status);
            if (transactionResponse != null) {
                log.info("UserId: {}, orderId: {}, Item: {}, itemID: {} is successfully logged as '{}'' in table.",
                        user_id, orderId, item.getProduct_name(), item_id, status);
            } else {
                log.info("UserId: {}, orderId: {}, Item: {}, itemID: {} was not logged",
                        user_id, orderId, item.getProduct_name(), item_id, status);
            }

        }
    }

    // Helper method to get order details
    private OrderResponse getOrder(Long orderId) {
        String url = orderServiceUrl + "/api/order/" + orderId;

        return restTemplate.getForObject(url, OrderResponse.class);

    }   

    // Helper method to create transaction 
    private TransactionResponse createTransaction(Long user_id, Long item_id, String amount, String status) {
        String url = transactionServiceUrl + "/transactions";
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", user_id);
        requestBody.put("item_id", item_id);
        requestBody.put("amount", amount);
        requestBody.put("status", status);

        return restTemplate.postForObject(url, requestBody, TransactionResponse.class);
    }

    // Helper method for email
    // private void sendOrderConfirmationEmail(Long userId, Long orderId) {
    //     // Skip if email service URL is not configured
    //     if (emailServiceUrl == null || emailServiceUrl.isEmpty()) {
    //         log.info("Email service not configured. Skipping email confirmation.");
    //         return;
    //     }

    //     try {
    //         String url = emailServiceUrl + "/api/email/order-confirmation";

    //         Map<String, Object> emailRequest = new HashMap<>();
    //         emailRequest.put("userId", userId);
    //         emailRequest.put("orderId", orderId);
    //         emailRequest.put("emailType", "ORDER_CONFIRMATION");

    //         restTemplate.postForObject(url, emailRequest, Object.class);
    //         log.info("Order confirmation email request sent for user: {}, order: {}", userId, orderId);
    //     } catch (Exception e) {
    //         // Log but don't fail the process
    //         log.error("Failed to send order confirmation email. Error: {}", e.getMessage());
    //     }
    // }
}
