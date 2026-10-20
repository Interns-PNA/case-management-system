param(
    [Parameter(Mandatory)] [string]$MongoUri,
    [Parameter(Mandatory)] [string]$AdminInitialPassword,
    [string]$Location = 'southeastasia',
    [string]$ResourceGroup = 'rg-case-project',
    [string]$EnvironmentName = 'env-mern-project',
    [string]$BackendApp = 'cms-backend',
    [string]$FrontendApp = 'cms-frontend',
    [string]$StorageAccount = '',
    [string]$ShareName = 'uploads',
    [string]$OidcAppDisplayName = 'cms-github-oidc',
    [string]$GitHubRepo = 'Interns-PNA/case-management-system',
    [string]$SubscriptionId = '',
    [switch]$SetGitHubSecrets
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

if ($SubscriptionId) { az account set --subscription $SubscriptionId | Out-Null }
$ctx = az account show | ConvertFrom-Json
if (-not $ctx) { throw 'Not logged in. Run: az login --use-device-code' }
Write-Host "Subscription: $($ctx.name) ($($ctx.id))  Tenant: $($ctx.tenantId)"

az group create --name $ResourceGroup --location $Location --output none
Write-Host "Resource group $ResourceGroup ready"

if (-not $StorageAccount) {
    $hex = -join ((48..57) + (97..102) | Get-Random -Count 8 | ForEach-Object { [char]$_ })
    $StorageAccount = "stmern$hex"
}
az storage account create --name $StorageAccount --resource-group $ResourceGroup --location $Location --sku Standard_LRS --kind StorageV2 --output none
$key = az storage account keys list --resource-group $ResourceGroup --account-name $StorageAccount --query '[0].value' -o tsv
az storage share-rm create --storage-account $StorageAccount --name $ShareName --quota 5 --output none
Write-Host "Storage account $StorageAccount + file share $ShareName ready"

$wsId = az monitor log-analytics workspace create --resource-group $ResourceGroup --name law-mern-project --location $Location --query customerId -o tsv
az containerapp env create --name $EnvironmentName --resource-group $ResourceGroup --location $Location --logs-workspace-id $wsId --output none
Write-Host "Container Apps environment $EnvironmentName ready"

az containerapp create --name $BackendApp --resource-group $ResourceGroup --environment $EnvironmentName `
    --image ghcr.io/interns-pna/case-management-system-backend:latest `
    --ingress internal --transport auto --target-port 8080 `
    --min-replicas 0 --max-replicas 1 --revision-mode single `
    --secrets "mongo-uri=$MongoUri" "admin-initial-password=$AdminInitialPassword" `
    --env-vars PORT=8080 "MONGO_URI@secretref=mongo-uri" "ADMIN_INITIAL_PASSWORD@secretref=admin-initial-password" `
    --azure-file-volume-account-name $StorageAccount --azure-file-volume-account-key $key `
    --azure-file-volume-share-name $ShareName --azure-file-volume-mount-path /app/uploads `
    --output none
Write-Host "Backend $BackendApp created (internal-only ingress)"

az containerapp create --name $FrontendApp --resource-group $ResourceGroup --environment $EnvironmentName `
    --image ghcr.io/interns-pna/case-management-system-frontend:latest `
    --ingress external --transport auto --target-port 80 `
    --min-replicas 0 --max-replicas 1 --revision-mode single `
    --env-vars "BACKEND_URL=http://$BackendApp" `
    --output none
Write-Host "Frontend $FrontendApp created (external ingress)"

$sp = az ad app create --display-name $OidcAppDisplayName | ConvertFrom-Json
$clientId = $sp.appId
az ad sp create --id $clientId --output none
az role assignment create --assignee $clientId --role Contributor --scope "/subscriptions/$($ctx.id)" --output none
$fed = @{
    name      = 'github-main'
    issuer    = 'https://token.actions.githubusercontent.com'
    subject   = "repo:${GitHubRepo}:ref:refs/heads/main"
    audiences = @('api://AzureADTokenExchange')
} | ConvertTo-Json -Compress
az ad app federated-credential create --id $sp.id --parameters $fed --output none
Write-Host "OIDC app $OidcAppDisplayName + federated credential ready (role assignment may need ~1-2 min to propagate)"

$values = [ordered]@{
    AZURE_CLIENT_ID     = $clientId
    AZURE_TENANT_ID     = $ctx.tenantId
    AZURE_SUBSCRIPTION_ID = $ctx.id
    MONGO_URI           = $MongoUri
}
$values.GetEnumerator() | ForEach-Object {
    $shown = if ($_.Key -eq 'MONGO_URI') { $_.Value -replace '://[^@]*@', '://***@' } else { $_.Value }
    Write-Host ("  {0} = {1}" -f $_.Key, $shown)
}

if ($SetGitHubSecrets) {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'gh CLI not found' }
    gh auth status | Out-Null
    $values.GetEnumerator() | ForEach-Object {
        $_.Value | gh secret set $_.Key --repo $GitHubRepo
        Write-Host "gh secret set $($_.Key) OK"
    }
}

Write-Host 'Provisioning complete. Re-run the failed deploy job in Actions.'
