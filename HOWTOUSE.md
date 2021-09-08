# Comment utiliser
**PickThem** est une mini application web conçue pour attribuer aléatoirement des activités aux membres d'un collective. Ce n'est pas totalement aléatoire, parce que les membres ne sont pas attribués 2 fois tant que tou·tes les autres sont attribué·es (également pour les cas où il y a plus que 2 attributions par personne. Exemple: il n'est pas possible que la différence du nombre d'attributions d'une personne ne soit supérieur de 1, par rapport une autre). Le but est de faire participer tout le monde.

## Téléchargement
- Téléchargez la dernière version sous [la page des publications](https://github.com/samuelroland/PickThem/releases) (la dernière version apparaît tout en haut).
- Désarchiver le fichier `.zip` (toute l'application se trouve dans ce dossier).
- Ouvrez en double-cliquant le fichier `index.html`.
- L'app devrait être ouverte dans votre navigateur web par défaut et vous pouvez l'utilisez.

**Information**: L'application ne fait pas de requêtes/connexions sur Internet, elle fonctionne donc entièrement hors-ligne. Tout les données entrées et générées sont perdus au rechargement de la page. Il faut donc gérer une liste des activités et des personnes de manière séparée, ainsi que le résultat du tableau généré (dans un fichier Excel ou Libreoffice par ex.).

## Utilisation
1. Choisissez un nombre de semaine pour la plage à générer (6 par défaut)
1. Remplissez la liste des membres et la liste des activités à la main (un élément par semaine, les lignes vides sont ignorées) ou en reprenant le contenu de votre liste
1. Choisissez le nombre de semaine par activité
1. Cliquez sur `Go` pour la lancer la génération et les résultats apparaîtront. (Cliquez sur `Go` à nouveau si besoin de régénerer).
1. Vous pouvez maintenant sauver le contenu du tableau ailleurs en le copiant-collant

---
# How to use
TODO.
<!-- 
The app is designed to attribute randomly some tasks during one week to members of the collective (without distinction) and to.  
It's not totally random because, here is the algorithm: for each cell of the array, choose a member in the list of not assigned members (to prevent a member to be attributed 2 times if they are enough members), and if the list of not assigned members is empty, then the list is reloaded with the total list of users to make a second round of attributions, etc.

## Download
Download the latest version under Releases, unzip the file and open the index.html app. The app is only this file, all is locally in the browser (everything is deleted at page refresh), and it's totally offline.

## Use
1. Choose a number of weeks to generate (6 by default)
1. Fill the tasks list activities (one per line, empty lines are ignored)
1. Fill the members list (one per line, empty lines are ignored)
1. Choose how much weeks do you want per activity
1. Click on Go, the results will appear (click on Go again if needed)
1. You can now save the attributions somewhere else (for example in a excel sheet). The selection can be made on the name only (to avoid selecting first line and left column).
-->