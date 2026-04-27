# Trigonométrie Programmable

Site pédagogique statique sur la trigonométrie, sans framework, basé sur :

- HTML
- CSS
- JavaScript natif (ES modules)
- JSXGraph

Chaque notion dispose de deux pages distinctes :

- page de rendu pédagogique
- page de personnalisation dédiée

La personnalisation génère une URL avec paramètres (query string) qui pilote réellement l’affichage.

## Lancer localement

Le projet est statique. Il faut simplement un serveur HTTP local.

Exemples :

```bash
python3 -m http.server 8080
```

ou

```bash
npx serve .
```

Puis ouvrir :

- `http://localhost:8080/`

## Structure des dossiers

```text
/
  index.html
  /assets
    /css
      base.css
      layout.css
      blocks.css
      customizer.css
    /js
      home.js
      /core
      /jsxgraph
      /content
      /pages
        /cercle
        /perimetre
        /radian
        /coordonnees
        /cosinus-sinus
        /relations-angles
  /docs
    README.md
    ARCHITECTURE.md
    CHANGELOG.md
    ROADMAP.md
```

## Système de paramètres URL

Convention unique utilisée dans tout le projet :

- booléens : `1` ou `0`
- enum : valeur texte (ex: `functionType=cos`)
- liste : CSV (ex: `angles=x,piPlusX,piMinusX`)

Exemple :

```text
?showAnimation=1&showText=1&showQuiz=0
```

Le parseur commun :

- applique les valeurs par défaut
- valide les entrées
- corrige automatiquement les valeurs invalides
- affiche un message de fallback sur la page notion

## Paramètres par notion

### 1) Cercle trigonométrique

- `rotationDirection=trigo|antiTrigo`
- `showAnimation`
- `showControls`
- `showUsefulValues`
- `showText`
- `showQuiz`

### 2) Périmètre du cercle

- `showAnimation`
- `showExplanation`
- `showText`
- `showQuiz`

### 3) Radian

- `showAnimation`
- `showExplanation`
- `showText`
- `showQuiz`

### 4) Coordonnées d’un point

- `showAnimation`
- `showDefinition`
- `showXYValues`
- `showText`
- `showQuiz`

### 5) Cosinus et sinus

- `showAnimation`
- `showTable`
- `showQuiz`

### 6) Relation entre les angles

- `showAnimation`
- `showControls`
- `functionType=cos|sin`
- `angles=x,piPlusX,piMinusX,piOver2PlusX,piOver2MinusX`
- `showFormula`

## Ajouter une nouvelle notion

1. Créer un dossier `assets/js/pages/<nouvelle-notion>/`.
2. Ajouter les fichiers suivants :
   - `index.html`
   - `page.js`
   - `config-schema.js`
   - `defaults.js`
   - `customizer.html`
   - `customizer.js`
   - `animation.js`
3. Déclarer la notion dans `assets/js/content/notions.js`.
4. Suivre le même modèle de paramètres URL (`show...`, enum, csv).
5. Vérifier la syntaxe JS.
6. Mettre à jour :
   - `assets/js/core/version.js`
   - `docs/CHANGELOG.md`
   - `docs/ROADMAP.md` (si impact roadmap)
   - `docs/README.md` si l’usage change

## Convention de versioning

- `v0.1.0` : première version exploitable
- `v0.2.0` : ajout notable de notion ou fonctionnalité majeure
- `v0.2.1` : correction mineure

Version actuelle : `v0.1.7`
