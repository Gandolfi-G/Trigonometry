# Architecture

## Objectif architectural

Le projet est conçu comme un moteur de pages configurables par URL, avec un noyau partagé et des modules par notion.

## Modules du noyau (`assets/js/core`)

- `query-params.js`
  - parsing des query params
  - validation et fallback
  - génération d’URL normalisée
- `page-shell.js`
  - cycle de rendu standard d’une page notion
  - affichage titre/description/version
  - gestion des warnings de paramètres
- `block-registry.js`
  - rendu déclaratif de blocs (`animation`, `text`, `quiz`, etc.)
- `customizer-shell.js`
  - rendu générique des formulaires de personnalisation
  - génération / copie / ouverture d’URL
  - sauvegarde locale via `storage.js`
- `quiz.js`
  - composant QCM simple réutilisable
- `storage.js`
  - wrapper localStorage namespacé
- `utils.js`
  - helpers utilitaires (DOM, formatage, clamp, dedupe)
- `version.js`
  - version courante et date de release

## Modules JSXGraph (`assets/js/jsxgraph`)

- `board-utils.js`
  - création et destruction de board
  - gestion du conteneur JXG
- `common-styles.js`
  - options et couleurs communes

## Modules de contenu (`assets/js/content`)

- `notions.js`
  - registre des notions (titre, description, liens page/customizer)

## Modules d’une notion (`assets/js/pages/<notion>`)

Chaque notion respecte le même contrat :

- `defaults.js` : valeurs de configuration par défaut
- `config-schema.js` : définition des paramètres (type, label, description, validation)
- `animation.js` : logique JSXGraph spécifique
- `page.js` : assemblage des blocs + logique pédagogique
- `index.html` : page de rendu
- `customizer.html` : page de personnalisation
- `customizer.js` : branchement au customizer générique

## Cycle de rendu d’une page notion

1. `page.js` appelle `bootNotionPage(...)`.
2. `page-shell.js` lit l’URL via `query-params.js`.
3. La config est validée ; les erreurs sont fallbackées sur les defaults.
4. `buildBlocks({ config })` fabrique la liste déclarative des blocs.
5. `block-registry.js` rend les blocs activés.
6. Chaque bloc peut enregistrer un cleanup pour détruire les ressources (ex: board JSXGraph, interval).

## Construction d’une URL par un customizer

1. `customizer.js` appelle `bootCustomizerPage(...)`.
2. `customizer-shell.js` génère les champs à partir du `schema`.
3. Les interactions mettent à jour une config locale.
4. `buildSearchFromConfig(...)` produit la query string normalisée.
5. L’URL finale est affichée, copiable, ouvrable, et sauvegardable localement.

## Extension future (template mental)

Pour ajouter une notion :

1. Copier la structure d’un dossier existant (`cercle` par exemple).
2. Définir `defaults` et `schema` en gardant la convention de nommage stable (`show...`, enum, csv).
3. Implémenter l’animation dans `animation.js` en réutilisant `createBoard`.
4. Assembler les blocs dans `page.js` sans logique ad hoc.
5. Ajouter l’entrée de navigation dans `content/notions.js`.
6. Mettre à jour la documentation/versioning.
