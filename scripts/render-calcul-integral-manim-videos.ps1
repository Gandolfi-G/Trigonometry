$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\calcul-integral"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "primitives_indefinie.py"; Class = "PrimitivesIndefinie"; VideoDir = "primitives_indefinie"; Export = "primitives_indefinie.mp4" },
  @{ File = "regles_primitives.py"; Class = "ReglesPrimitives"; VideoDir = "regles_primitives"; Export = "regles_primitives.mp4" },
  @{ File = "aire_sous_courbe.py"; Class = "AireSousCourbe"; VideoDir = "aire_sous_courbe"; Export = "aire_sous_courbe.mp4" },
  @{ File = "sommes_riemann.py"; Class = "SommesRiemann"; VideoDir = "sommes_riemann"; Export = "sommes_riemann.mp4" },
  @{ File = "integrale_definie.py"; Class = "IntegraleDefinie"; VideoDir = "integrale_definie"; Export = "integrale_definie.mp4" },
  @{ File = "theoreme_fondamental.py"; Class = "TheoremeFondamental"; VideoDir = "theoreme_fondamental"; Export = "theoreme_fondamental.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\calcul_integral\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
