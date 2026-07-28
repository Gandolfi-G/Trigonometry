$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\limites-continuite"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "limite_trou.py"; Class = "LimiteTrou"; VideoDir = "limite_trou"; Export = "limite_trou.mp4" },
  @{ File = "limites_laterales.py"; Class = "LimitesLaterales"; VideoDir = "limites_laterales"; Export = "limites_laterales.mp4" },
  @{ File = "asymptote_verticale.py"; Class = "AsymptoteVerticale"; VideoDir = "asymptote_verticale"; Export = "asymptote_verticale.mp4" },
  @{ File = "asymptote_horizontale.py"; Class = "AsymptoteHorizontale"; VideoDir = "asymptote_horizontale"; Export = "asymptote_horizontale.mp4" },
  @{ File = "indetermination_factorisation.py"; Class = "IndeterminationFactorisation"; VideoDir = "indetermination_factorisation"; Export = "indetermination_factorisation.mp4" },
  @{ File = "continuite_point.py"; Class = "ContinuitePoint"; VideoDir = "continuite_point"; Export = "continuite_point.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\limites_continuite\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
