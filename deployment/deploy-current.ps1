param(
  [string]$Root = $PSScriptRoot + "\\.."
)

$ErrorActionPreference = 'Stop'
$Source = Join-Path $Root 'dist\web\browser'
$Current = Join-Path $Root 'deployment\Current'
$Timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$Archive = Join-Path $Root "deployment\Archive\web-$Timestamp"

if (-not (Test-Path $Source)) {
  throw "Build output not found: $Source"
}

if (Test-Path $Current) {
  Remove-Item $Current -Recurse -Force
}

New-Item -ItemType Directory -Path $Current -Force | Out-Null
Copy-Item "$Source\*" $Current -Recurse -Force
New-Item -ItemType Directory -Path $Archive -Force | Out-Null
Copy-Item "$Source\*" $Archive -Recurse -Force
Write-Output "CURRENT=$Current"
Write-Output "ARCHIVE=$Archive"