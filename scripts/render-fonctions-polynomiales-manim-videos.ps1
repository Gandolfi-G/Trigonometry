$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\fonctions-polynomiales"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "fonction_representations.py"; Class = "FonctionRepresentations"; VideoDir = "fonction_representations"; Export = "fonction_representations.mp4" },
  @{ File = "image_preimage_domaine.py"; Class = "ImagePreimageDomaine"; VideoDir = "image_preimage_domaine"; Export = "image_preimage_domaine.mp4" },
  @{ File = "degre_zero_un.py"; Class = "DegreZeroUn"; VideoDir = "degre_zero_un"; Export = "degre_zero_un.mp4" },
  @{ File = "parabole_second_degre.py"; Class = "ParaboleSecondDegre"; VideoDir = "parabole_second_degre"; Export = "parabole_second_degre.mp4" },
  @{ File = "optimisation_parabole.py"; Class = "OptimisationParabole"; VideoDir = "optimisation_parabole"; Export = "optimisation_parabole.mp4" },
  @{ File = "degre_superieur_multiplicite.py"; Class = "DegreSuperieurMultiplicite"; VideoDir = "degre_superieur_multiplicite"; Export = "degre_superieur_multiplicite.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\fonctions_polynomiales\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
