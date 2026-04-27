# Changelog

## v0.1.7 - 2026-04-27

- Notion 01 (cercle) :
  - ajout d’un rendu switch (2 états) pour `rotationDirection` dans le customizer.
  - ajout d’un bouton de changement de sens directement dans les contrôles de l’animation (`Play / Pause / Reset / Sens`).
  - ajout d’une flèche courbée extérieure de sens, en conservant la flèche locale près de `P`.
  - correction visuelle du mode anti-trigonométrique : même taille d’arc que le mode trigo et position maintenue en haut à droite.
- Notion 02 (périmètre) :
  - animation en boucle continue, avec arrêt possible via `Pause`.
  - ajout d’une pause de fin de cycle pour laisser lire l’égalité des longueurs.
  - repositionnement de la règle à droite du cercle et remontée verticale pour éviter la confusion avec l’axe des abscisses.
  - correction du sens de déroulement sur la règle : `(1,0) -> π` et `(-1,0) -> 0`.
- Notion 03 (radian) :
  - ajout d’une pause entre la phase rotation et la phase enroulement.
  - amélioration de la lisibilité de `1 rad` (plus grand, plus contrasté, en gras).
  - animation passée en boucle avec pause de fin de cycle.
- Notion 04 (coordonnées) :
  - suppression des angles `α` et `β` dans l’animation.
  - suppression des labels `A` et `B` en conservant les points de projection noirs.
- Notion 05 (cosinus/sinus) :
  - suppression de la bulle `Aimantation active: angles remarquables` (aimantation conservée active par défaut).
  - ajout d’un paramètre de personnalisation `valueMode` : `cosinus et sinus` / `cosinus uniquement` / `sinus uniquement`.
  - adaptation du tableau selon le mode choisi (colonnes dynamiques angle + cos et/ou sin).
  - adaptation des lectures dans l’animation selon le mode choisi (masquage de cos ou de sin si nécessaire).
- Notion 06 (relations entre les angles) :
  - déplacement du slider de l’angle `x` directement dans le bloc animation pour un accès immédiat.
  - simplification du bloc `Contrôles` : en mode `full`, il contient les options de fonction et d’angles (le slider n’est plus en bas).
  - mise à jour du libellé du paramètre `controlsMode` dans le customizer pour refléter ce nouveau comportement.
  - inversion de la mise en page desktop : `Contrôles` à droite de l’animation, `Formules` en bas sur toute la largeur.

## v0.1.6 - 2026-04-26

- Notion 06 (relations entre les angles) : refonte majeure alignée sur la référence `trigo-9-formulaire-rotation-projections-plus.html`.
- Ajout des 7 angles configurables : `x`, `-x`, `π+x`, `π-x`, `π/2+x`, `π/2-x`, `2π-x`.
- Ajout de la fonction `tangente` (en plus de cosinus/sinus) dans les contrôles et les formules.
- Amélioration de l’animation : projections dynamiques selon la fonction choisie (cos/sin/tan), droite tangente affichée en mode tangente, et déplacement de `P` par drag/clic sur le cercle.
- Harmonisation visuelle : `x` en noir, `-x` en gris, légende explicite dans l’animation (`bleu = cosinus`, `rouge = sinus`).
- Mise en page page 06 : cercle à gauche et formules à droite sur desktop, contrôles en dessous ; fallback mobile en colonne unique.
- Contrôles page 06 plus personnalisables : `Tous les contrôles` / `Slider uniquement` / `Aucun contrôle`.
- Nettoyage des formules : la formule triviale de base (`f(x)=f(x)`) n’est plus affichée.

## v0.1.5 - 2026-04-17

- Notion 01 (cercle) :
  - suppression des valeurs affichées dans l’animation (angle, x et y) sur la zone du board.
- Notion 05 (cosinus/sinus) :
  - mise en page optimisée desktop : cercle à gauche et tableau à droite, avec retour en une colonne sur mobile.
  - valeurs exactes affichées pour les angles remarquables (`π/6`, `π/4`, `π/3`, etc.) et pour `cos`/`sin` (`√3/2`, `√2/2`, ...).
  - aimantation ajustée : déplacement libre du point conservé, avec accrochage uniquement à proximité des angles remarquables (pas d’aimantation forcée permanente).

## v0.1.4 - 2026-04-17

- Notion 01 (cercle) :
  - ajout du choix de sens de rotation (`trigo` / `antiTrigo`) dans la personnalisation.
  - adaptation automatique des explications et du quiz selon le sens sélectionné.
  - suppression des mentions en radians / cosinus / sinus dans cette page, remplacées par la lecture des valeurs `x` et `y`.
- Refonte des animations pour ressembler aux références :
  - notion 02 : animation de déroulement demi-cercle -> règle (style `trigo-02`).
  - notion 03 : animation en 3 phases segment -> rotation -> enroulement (style `trigo-03`).
  - notion 04 : animation de projections du point `P` sur les axes (style `trigo-04`).
  - notion 05 : animation cercle + projections + aimantation d’angles + enregistrement (style `trigo-05`).

## v0.1.3 - 2026-04-17

- Ajout d’un paramètre commun `showHero` sur toutes les pages notions personnalisables.
- Mise à jour des customizers: chaque notion peut maintenant afficher/masquer la section hero (titre, description, objectif).
- Mise à jour de `page-shell` pour appliquer dynamiquement l’affichage de la section `hero` selon la configuration URL.

## v0.1.2 - 2026-04-17

- Correction de l’animation `cercle` : le point mobile `P` est maintenant contraint au cercle trigonométrique (objet JSXGraph `glider`), et ne peut plus être déplacé hors du cercle.
- Harmonisation sur `coordonnees` et `cosinus-sinus` : les points mobiles utilisent aussi un `glider` contraint au cercle unité.

## v0.1.1 - 2026-04-17

- Refonte de l’affichage de la liste des notions sur l’accueil pour un rendu “cartes visuelles” inspiré de la page de référence `trigonometry.html`.
- Ajout de métadonnées de carte dans `assets/js/content/notions.js` (`order`, `cardFormula`, `cardColors`) afin de conserver une génération déclarative et maintenable.
- Mise à jour de `assets/js/home.js` pour un rendu ordonné, avec vignette, numéro de chapitre, formule courte et actions `Voir la notion` / `Personnaliser`.
- Mise à jour de `assets/css/layout.css` pour le nouveau style responsive des cartes.

## v0.1.0 - 2026-04-17

- Mise en place de l’architecture modulaire statique (core + notions + docs).
- Ajout de la page d’accueil listant toutes les notions.
- Ajout d’un moteur de parsing/validation/fallback des paramètres URL.
- Ajout d’un moteur de rendu déclaratif de blocs pédagogiques.
- Ajout d’un customizer dédié pour chaque notion avec génération/copie d’URL et sauvegarde locale.
- Implémentation des 6 notions :
  - cercle trigonométrique
  - périmètre du cercle
  - radian
  - coordonnées d’un point
  - cosinus/sinus avec tableau dynamique
  - relation entre les angles (fonction + angles sélectionnables)
- Ajout de helpers JSXGraph partagés et nettoyage des boards.
- Ajout de la documentation technique (`README`, `ARCHITECTURE`, `ROADMAP`).
