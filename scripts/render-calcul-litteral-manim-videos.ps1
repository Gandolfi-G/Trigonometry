$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\calcul-litteral"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "developper_reduire.py"; Class = "DevelopperReduire"; VideoDir = "developper_reduire"; Export = "developper_reduire.mp4" },
  @{ File = "identite_remarquable_carre.py"; Class = "IdentiteRemarquableCarre"; VideoDir = "identite_remarquable_carre"; Export = "identite_remarquable_carre.mp4" },
  @{ File = "identite_remarquable_difference.py"; Class = "IdentiteRemarquableDifference"; VideoDir = "identite_remarquable_difference"; Export = "identite_remarquable_difference.mp4" },
  @{ File = "identite_remarquable_difference_carres.py"; Class = "IdentiteRemarquableDifferenceCarres"; VideoDir = "identite_remarquable_difference_carres"; Export = "identite_remarquable_difference_carres.mp4" },
  @{ File = "factoriser_facteur_commun.py"; Class = "FactoriserFacteurCommun"; VideoDir = "factoriser_facteur_commun"; Export = "factoriser_facteur_commun.mp4" },
  @{ File = "division_polynomiale.py"; Class = "DivisionPolynomiale"; VideoDir = "division_polynomiale"; Export = "division_polynomiale.mp4" },
  @{ File = "division_polynomiale_equations.py"; Class = "DivisionPolynomialeEquations"; VideoDir = "division_polynomiale_equations"; Export = "division_polynomiale_equations.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\calcul_litteral\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
