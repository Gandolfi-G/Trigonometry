$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$python = Join-Path $root ".venv\Scripts\python.exe"

if (-not (Test-Path $python)) {
  $pythonCommand = Get-Command python -ErrorAction SilentlyContinue

  if ($pythonCommand) {
    & $pythonCommand.Source -m venv (Join-Path $root ".venv")
  } else {
    $pyCommand = Get-Command py -ErrorAction SilentlyContinue

    if ($pyCommand) {
      & $pyCommand.Source -m venv (Join-Path $root ".venv")
    } else {
      throw "Python est introuvable. Installez Python 3.12+ ou créez manuellement un environnement .venv."
    }
  }
}

& $python -m pip install -r (Join-Path $root "requirements.txt")
& $python -m manim --version
