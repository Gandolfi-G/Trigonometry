$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\geometrie-vectorielle"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "vecteur_definition.py"; Class = "VecteurDefinition"; VideoDir = "vecteur_definition"; Export = "vecteur_definition.mp4" },
  @{ File = "operations_vecteurs.py"; Class = "OperationsVecteurs"; VideoDir = "operations_vecteurs"; Export = "operations_vecteurs.mp4" },
  @{ File = "base_composantes.py"; Class = "BaseComposantes"; VideoDir = "base_composantes"; Export = "base_composantes.mp4" },
  @{ File = "norme_produit_scalaire.py"; Class = "NormeProduitScalaire"; VideoDir = "norme_produit_scalaire"; Export = "norme_produit_scalaire.mp4" },
  @{ File = "droites_param_cartesien.py"; Class = "DroitesParamCartesien"; VideoDir = "droites_param_cartesien"; Export = "droites_param_cartesien.mp4" },
  @{ File = "plans_produit_vectoriel.py"; Class = "PlansProduitVectoriel"; VideoDir = "plans_produit_vectoriel"; Export = "plans_produit_vectoriel.mp4" },
  @{ File = "cercles_tangente.py"; Class = "CerclesTangente"; VideoDir = "cercles_tangente"; Export = "cercles_tangente.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\geometrie_vectorielle\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
