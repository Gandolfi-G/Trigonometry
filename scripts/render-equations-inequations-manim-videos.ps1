$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manim = Join-Path $root ".venv\Scripts\manim.exe"
$mediaDir = Join-Path $root "assets\videos\manim"
$exportDir = Join-Path $root "assets\videos\manim\equations-inequations"

if (-not (Test-Path $manim)) {
  throw "Manim n'est pas installé. Lancez d'abord scripts\setup-manim.ps1."
}

if (-not (Test-Path $exportDir)) {
  New-Item -ItemType Directory -Path $exportDir | Out-Null
}

$scenes = @(
  @{ File = "balance_equation.py"; Class = "BalanceEquation"; VideoDir = "balance_equation"; Export = "balance_equation.mp4" },
  @{ File = "equation_premier_degre.py"; Class = "EquationPremierDegre"; VideoDir = "equation_premier_degre"; Export = "equation_premier_degre.mp4" },
  @{ File = "discriminant_second_degre.py"; Class = "DiscriminantSecondDegre"; VideoDir = "discriminant_second_degre"; Export = "discriminant_second_degre.mp4" },
  @{ File = "degre_n_division.py"; Class = "DegreNDivision"; VideoDir = "degre_n_division"; Export = "degre_n_division.mp4" },
  @{ File = "systemes_lineaires.py"; Class = "SystemesLineaires"; VideoDir = "systemes_lineaires"; Export = "systemes_lineaires.mp4" },
  @{ File = "intervalles.py"; Class = "Intervalles"; VideoDir = "intervalles"; Export = "intervalles.mp4" },
  @{ File = "inequations_tableau_signes.py"; Class = "InequationsTableauSignes"; VideoDir = "inequations_tableau_signes"; Export = "inequations_tableau_signes.mp4" }
)

foreach ($scene in $scenes) {
  $sceneFile = Join-Path $root ("manim\equations_inequations\" + $scene.File)
  $renderedVideo = Join-Path $mediaDir ("videos\" + $scene.VideoDir + "\480p15\" + $scene.Class + ".mp4")
  $exportedVideo = Join-Path $exportDir $scene.Export

  & $manim -ql $sceneFile $scene.Class --media_dir $mediaDir

  if ($LASTEXITCODE -ne 0) {
    throw "Le rendu Manim a échoué pour $($scene.Class)."
  }

  Copy-Item -Path $renderedVideo -Destination $exportedVideo -Force
  Write-Host "Vidéo exportée : $exportedVideo"
}
