$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\trigonometrie"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{
    File = "coordonnees_point_cercle_trigo.py"
    Class = "CoordonneesPointCercleTrigo"
    VideoDir = "coordonnees_point_cercle_trigo"
    Export = "coordonnees_point_cercle_trigo.mp4"
  },
  @{
    File = "cosinus_sinus_cercle_trigo.py"
    Class = "CosinusSinusCercleTrigo"
    VideoDir = "cosinus_sinus_cercle_trigo"
    Export = "cosinus_sinus_cercle_trigo.mp4"
  },
  @{
    File = "relation_fondamentale_trigo.py"
    Class = "RelationFondamentaleTrigo"
    VideoDir = "relation_fondamentale_trigo"
    Export = "relation_fondamentale_trigo.mp4"
  },
  @{
    File = "tangente_cercle_trigo.py"
    Class = "TangenteCercleTrigo"
    VideoDir = "tangente_cercle_trigo"
    Export = "tangente_cercle_trigo.mp4"
  },
  @{
    File = "valeurs_classiques_trigo.py"
    Class = "ValeursClassiquesTrigo"
    VideoDir = "valeurs_classiques_trigo"
    Export = "valeurs_classiques_trigo.mp4"
  }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\trigonometrie\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
