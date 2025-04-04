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


Write-Host "✅ Kong setup complete!"
