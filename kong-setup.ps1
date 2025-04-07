# PowerShell script to configure Kong service, route, and plugin

Write-Host "Creating shop-service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" -Body @{
    name = "shop-service"
    url  = "http://shop-service:3006"
} -ContentType "application/x-www-form-urlencoded"

Start-Sleep -Seconds 1

Write-Host "Creating READ route for /shop..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/shop-service/routes" -Body @{
    name   = "READ"
    paths  = "/shop"
    methods = "GET"
} -ContentType "application/x-www-form-urlencoded"

Start-Sleep -Seconds 1

Write-Host "Adding CORS plugin to shop-service..."
$pluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&config.methods=POST&config.methods=PUT&config.methods=DELETE&
config.methods=CONNECT&config.methods=OPTIONS&config.methods=TRACE&config.methods=PATCH&config.methods=HEAD&
config.headers=Accept&config.headers=Authorization&config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/shop-service/plugins" `
  -Body $pluginBody `
  -ContentType "application/x-www-form-urlencoded"

# Register the orchestrator service
Write-Host "Creating orchestrator service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" -Body @{
    name = "cart-orchestrator"
    url  = "http://cart-orchestrator:4000"
} -ContentType "application/x-www-form-urlencoded"

# Add route for orchestrator (e.g., /cart-api)
Write-Host "Creating route for orchestrator..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/cart-orchestrator/routes" -Body @{
    name   = "cart-orchestrator-route"
    paths  = "/cart-api"
} -ContentType "application/x-www-form-urlencoded"

# Add CORS plugin for orchestrator
Write-Host "Enabling CORS for orchestrator..."
$orchestratorPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&config.methods=POST&config.methods=OPTIONS&
config.headers=Accept&config.headers=Authorization&config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/cart-orchestrator/plugins" `
  -Body $orchestratorPluginBody `
  -ContentType "application/x-www-form-urlencoded"

# ---------------------------
# NEW: refund-orchestrator setup
# ---------------------------

Write-Host "Creating refund-orchestrator service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" -Body @{
    name = "refund-orchestrator"
    url  = "http://refund-orchestrator:3010"
} -ContentType "application/x-www-form-urlencoded"

Write-Host "Creating POST route for /refunds..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/refund-orchestrator/routes" -Body @{
    name   = "refunds-route"
    paths  = "/refunds"
    methods = "POST"
} -ContentType "application/x-www-form-urlencoded"

Write-Host "Enabling CORS for refund-orchestrator..."
$refundPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&config.methods=POST&config.methods=OPTIONS&
config.headers=Accept&config.headers=Authorization&config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/refund-orchestrator/plugins" `
  -Body $refundPluginBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ Kong setup complete!"


# ----------------------------------
# NEW: login-service setup
# ----------------------------------

Write-Host "Creating login-service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" `
  -Body "name=login-service&url=http://login-service:3000" `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Creating POST+OPTIONS route for /login-service..."
$loginRouteBody = @"
name=login-route&
paths=/login-service&
methods=POST&
methods=OPTIONS
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/login-service/routes" `
  -Body $loginRouteBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Enabling CORS for login-service..."
$loginPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&
config.methods=POST&
config.methods=OPTIONS&
config.headers=Accept&
config.headers=Authorization&
config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/login-service/plugins" `
  -Body $loginPluginBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ login-service setup complete!"

Write-Host "Creating supplier-service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" `
  -Body "name=supplier-service&url=http://supplier-service:3011" `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Creating route for /supplier..."
$supplierRouteBody = @"
name=supplier-route&
paths=/&
methods=GET&
methods=POST&
methods=PUT&
methods=DELETE&
methods=OPTIONS
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/supplier-service/routes" `
  -Body $supplierRouteBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Enabling CORS for supplier-service..."
$supplierPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&
config.methods=POST&
config.methods=PUT&
config.methods=DELETE&
config.methods=OPTIONS&
config.headers=Accept&
config.headers=Authorization&
config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/supplier-service/plugins" `
  -Body $supplierPluginBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ supplier-service setup complete!"
Write-Host "Creating order-service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" `
  -Body "name=order-service&url=http://order-service:5001" `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Creating GET and POST route for /api/order..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/order-service/routes" `
  -Body "name=order-route&paths=/api/order&strip_path=false&methods=GET&methods=POST&methods=PUT&methods=DELETE" `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Enabling CORS for order-service..."
$ordersPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&config.methods=POST&config.methods=PUT&
config.methods=DELETE&
config.headers=Accept&config.headers=Authorization&config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/order-service/plugins" `
  -Body $ordersPluginBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ order-service setup complete!"

# ----------------------------------
# PlaceAnOrderOrchestrator setup
# ----------------------------------

Write-Host "Creating place-order-orchestrator service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" -Body @{
    name = "place-order-orchestrator"
    url  = "http://place-order-orchestrator:5004/api/place-an-order"
} -ContentType "application/x-www-form-urlencoded"

Write-Host "Creating routes for place-order-orchestrator..."
$placeOrderRouteBody = @"
name=place-order-route&
paths=/place-order&
methods=POST&
methods=OPTIONS
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/place-order-orchestrator/routes" `
  -Body $placeOrderRouteBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Enabling CORS for place-order-orchestrator..."
$placeOrderPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&
config.methods=POST&
config.methods=OPTIONS&
config.headers=Accept&
config.headers=Authorization&
config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/place-order-orchestrator/plugins" `
  -Body $placeOrderPluginBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ place-order-orchestrator setup complete!"

Write-Host "Creating supplier-service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" `
  -Body "name=supplier-service&url=http://supplier-service:3011" `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Creating route for /supplier..."
$supplierRouteBody = @"
name=supplier-route&
paths=/&
methods=GET&
methods=POST&
methods=PUT&
methods=DELETE&
methods=OPTIONS
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/supplier-service/routes" `
  -Body $supplierRouteBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Enabling CORS for supplier-service..."
$supplierPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&
config.methods=POST&
config.methods=PUT&
config.methods=DELETE&
config.methods=OPTIONS&
config.headers=Accept&
config.headers=Authorization&
config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/supplier-service/plugins" `
  -Body $supplierPluginBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ supplier-service setup complete!"

Write-Host "Creating order-service..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services" `
  -Body "name=order-service&url=http://order-service:5001" `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Creating GET and POST route for /api/order..."
Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/order-service/routes" `
  -Body "name=order-route&paths=/api/order&strip_path=false&methods=GET&methods=POST" `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "Enabling CORS for order-service..."
$ordersPluginBody = @"
name=cors&
config.origins=* &
config.methods=GET&config.methods=POST&
config.headers=Accept&config.headers=Authorization&config.headers=Content-Type
"@ -replace "\s+", ""

Invoke-RestMethod -Method POST -Uri "http://localhost:8001/services/order-service/plugins" `
  -Body $ordersPluginBody `
  -ContentType "application/x-www-form-urlencoded"

Write-Host "✅ order-service setup complete!"
