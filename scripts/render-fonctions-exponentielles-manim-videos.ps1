$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\fonctions-exponentielles"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "croissance_multiplicative.py"; Class = "CroissanceMultiplicative"; VideoDir = "croissance_multiplicative"; Export = "croissance_multiplicative.mp4" },
  @{ File = "puissances_racines.py"; Class = "PuissancesRacines"; VideoDir = "puissances_racines"; Export = "puissances_racines.mp4" },
  @{ File = "fonction_exponentielle.py"; Class = "FonctionExponentielle"; VideoDir = "fonction_exponentielle"; Export = "fonction_exponentielle.mp4" },
  @{ File = "nombre_e.py"; Class = "NombreE"; VideoDir = "nombre_e"; Export = "nombre_e.mp4" },
  @{ File = "logarithme_reciproque.py"; Class = "LogarithmeReciproque"; VideoDir = "logarithme_reciproque"; Export = "logarithme_reciproque.mp4" },
  @{ File = "proprietes_logarithmes.py"; Class = "ProprietesLogarithmes"; VideoDir = "proprietes_logarithmes"; Export = "proprietes_logarithmes.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\fonctions_exponentielles\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
