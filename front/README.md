# Prérequis :

npm v 16.x
yarn ou npm, (yarn de préférence)

# Installations :

Dans le terminal vous tapez
`yarn install `
OR
`npm install `

Une fois que l'installation des packages est faite, le site est fonctionnel

# Démarrage :

## Developpement

`yarn start`
OR
`npm start`

## Faire un build

`yarn run build`
OR
`npm run build`

# Packages utilisés

1. [Material UI](https://mui.com/) : UI library
2. [Redux toolkit](https://redux-toolkit.js.org/) : Gestionnaire des "states" global, cette bibliotique rendre l'utilisation de Redux plus facile
3. [Font Awesome](https://fontawesome.com/v5/docs/web/use-with/react) : Pour les icons
4. [downloadjs](https://www.npmjs.com/package/downloadjs): Rendre le fichier téléchargable
5. [pdf-lib](https://pdf-lib.js.org/) : Ecrire sur un fichiers PDF déjà existant
6. [SASS](https://sass-lang.com/) : css preprocesseur, Ajouter des fonctionnalités au CSS

# Structure du serveur

Interface construit sur la library React.js 17, tous le logic du code est dans le dossier `src`

## class

Chaque formation avait sa propres page pdf; les résulat de l'api n'étant pas les même et afin de faciliter la maintenance et l'évolution du code, chaque une de ces formations est présenetée dans une class

# components

Dans le formulaire multistep, chaque vu est dans une composant avec ses logic.

## Features

Les methodes de gestion des states globals

## Helpers

Afin d'éviter la répétion du code, les fonctions communes se trouvent dedans
