# Solides et volume 9e

Site statique mobile-first en HTML, CSS et JavaScript vanilla pour travailler le chapitre "Solides et volume" en 9e CO Geneve.

## Contenu

- `index.html` : accueil, progression, plan de semaine, liens PDF
- `lessons/` : 5 modules de cours avec quiz et devoir ludique
- `evaluation.html` : evaluation finale avec partie auto-corrigee et partie papier
- `teacher.html` : guide enseignant, baremes et solutions
- `parametrage.html` : page enseignant pour preparer le calendrier d'ouverture
- `config.js` : dates d'ouverture partagees au deploiement
- `assets/img/` : SVG simples
- `assets/pdfs/` : copies des PDF fournis
- `app.js` : progression locale, quiz, verrouillage par calendrier
- `style.css` : design global et mode impression

## Test local

Depuis le dossier `solides-volume-9e/` :

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Hebergement sur serveur perso

1. Copier le dossier sur le serveur :

```bash
scp -r solides-volume-9e user@serveur:/var/www/solides-volume-9e/
```

2. Verifier les droits de lecture web.
3. Configurer Apache ou Nginx.

### Apache : exemple simple avec Alias

```apache
Alias /solides-volume-9e /var/www/solides-volume-9e

<Directory /var/www/solides-volume-9e>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

Redemarrer Apache puis tester l'URL :

```bash
sudo systemctl reload apache2
```

Tester ensuite :

```text
https://votre-domaine/solides-volume-9e/
```

### Nginx : exemple simple

```nginx
location /solides-volume-9e/ {
    alias /var/www/solides-volume-9e/;
    index index.html;
}
```

Redemarrer Nginx puis tester l'URL publique.

## GitHub Pages

### Option A : publication depuis la branche `main`

1. Creer un depot GitHub public, ou prive si votre offre GitHub Pages le permet.
2. Initialiser le depot :

```bash
cd solides-volume-9e
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:VOTRE_COMPTE/solides-volume-9e.git
git push -u origin main
```

3. Dans GitHub :
   - ouvrir `Settings > Pages`
   - choisir `Deploy from a branch`
   - selectionner `main` et le dossier `/ (root)`
4. Attendre la publication puis tester l'URL fournie.

### Option B : publication depuis `docs/`

Si vous avez deja un depot parent :

1. Copier ce dossier dans `docs/solides-volume-9e/` ou publier directement `docs/`.
2. Dans `Settings > Pages`, choisir la branche `main` et le dossier `/docs`.
3. Tester l'URL Pages.

## Donnees eleve

- La progression est gardee dans `localStorage`.

## Calendrier des modules

- Les eleves ne voient que les modules deja ouverts.
- Les dates d'ouverture partagees sont definies dans `config.js`.
- Exemple par defaut :
  - lundi 2 mars 2026 : module 1
  - mardi 3 mars 2026 : module 2
  - mercredi 4 mars 2026 : module 3
  - jeudi 5 mars 2026 : module 4
  - vendredi 6 mars 2026 : module 5
  - lundi 9 mars 2026 : evaluation finale

## Parametrage enseignant

- Ouvrir `parametrage.html`.
- Le code d'acces leger est aussi defini dans `config.js`.
- Important : sur GitHub Pages, le formulaire de `parametrage.html` sert d'aperçu local.
- Pour changer vraiment le calendrier pour tous les eleves, il faut modifier `config.js`, committer puis republier.
