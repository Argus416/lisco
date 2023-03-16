# Prérequis :

npm v 16.x
yarn ou npm, (yarn de préférence)
<br />
<br />

# Installations :

Dans le terminal vous tapez
`yarn install `
OR
`npm install `

Une fois que l'installation des packages est faite, le serveur est fonctionnel

 <br />

# Démarrage :

## Production

`yarn start`
OR
`npm start`

## Developpement

`yarn run dev`
OR
`npm run dev`

# Packages utilisés

1. [csv-to-js-parser](https://www.npmjs.com/package/csv-to-js-parser) : Transformer les fichiers csv à json
2. [express-list-routes](https://www.npmjs.com/package/express-list-routes) : Afficher tous les routes notre serveur
3. [lodash](https://lodash.com/) : Rajouter fonctionnalités qui rendre la manipulation des tableau plus facile

# Structure du serveur

Serveur construit sur le framework Express.js de Node.js

# app.js

Toutes les configurations du serveur ainsi que l'initiation de routes

## routes

la connextion entre le route le controlleur

## controllers

Renvoie la réponses des routes

## class

Chaque formation avait ses propores conditions sur le traitement des données, afin de faciliter la maintenance et l'évolution du code, chaque une de ces formations est présenetée dans une class

## Helpers

Afin d'éviter la répétion du code, les fonctions communes se trouvent dedans

## Procfile

Il contient la commande qui sera passé une fois que le serveur est sur Heroku
