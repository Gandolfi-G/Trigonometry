$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$sceneFile = Join-Path $root "manim\trigonometrie\perimetre_demi_cercle_trigo.py"
$exportDir = Join-Path $root "assets\videos\manim\trigonometrie"
$renderedVideo = Join-Path $root "assets\videos\manim\videos\perimetre_demi_cercle_trigo\480p15\PerimetreDemiCercleTrigo.mp4"
$exportedVideo = Join-Path $exportDir "perimetre_demi_cercle_trigo.mp4"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

& $manim -ql $sceneFile PerimetreDemiCercleTrigo --media_dir (Join-Path $root "assets\videos\manim")

if ($LASTEXITCODE -ne 0) {
  throw "Le rendu Manim a échoué."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
Write-Host "Vidéo exportée : $exportedVideo"
