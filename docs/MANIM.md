# Studio Manim

Le dossier `manim/` contient les scènes Python utilisées pour générer les vidéos mathématiques du site.

## Installation

Depuis la racine du projet :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-manim.ps1
```

Cette commande crée l'environnement local `.venv/`, puis installe les dépendances listées dans `requirements.txt`.

## Rendu de la première vidéo de trigonométrie

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\render-intro-cercle-trigo.ps1
```

La vidéo exportée pour le site est copiée ici :

```text
assets/videos/manim/trigonometrie/intro_cercle_trigo.mp4
```

## Convention de travail

- Les sources Manim restent dans `manim/<chapitre>/`.
- Les vidéos affichées par le site restent dans `assets/videos/manim/<chapitre>/`.
- Les fichiers temporaires générés par Manim restent ignorés par Git.
- Les scènes d'introduction évitent `Tex` et `MathTex` pour ne pas dépendre de LaTeX tant que ce n'est pas nécessaire.
