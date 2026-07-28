$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\calcul-differentiel"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "taux_moyen_secante.py"; Class = "TauxMoyenSecante"; VideoDir = "taux_moyen_secante"; Export = "taux_moyen_secante.mp4" },
  @{ File = "secante_vers_tangente.py"; Class = "SecanteVersTangente"; VideoDir = "secante_vers_tangente"; Export = "secante_vers_tangente.mp4" },
  @{ File = "definition_derivee.py"; Class = "DefinitionDerivee"; VideoDir = "definition_derivee"; Export = "definition_derivee.mp4" },
  @{ File = "fonction_derivee.py"; Class = "FonctionDerivee"; VideoDir = "fonction_derivee"; Export = "fonction_derivee.mp4" },
  @{ File = "continuite_derivabilite.py"; Class = "ContinuiteDerivabilite"; VideoDir = "continuite_derivabilite"; Export = "continuite_derivabilite.mp4" },
  @{ File = "regles_derivation.py"; Class = "ReglesDerivation"; VideoDir = "regles_derivation"; Export = "regles_derivation.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\calcul_differentiel\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
