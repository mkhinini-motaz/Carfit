# Carfit

Ceci est un petit projet constituant d'un endpoint node.js qui reçoit une requete POST qui contient une date sous format JSON et renvoi un response qui contient le nombre de jours restant jusqu'à cet date.


Exemple de corps de requête POST que vous pouvez envoyez : 

    {
        jour : 25,
        mois : 12,
        an: 2017
    }


Exemple de réponse qu'on peut reçevoir :

    {
        jour: 18
    }
    
Si la date envoyée est inférieur à la date actuel, le serveur va envoyer le nombre de jours passées depuis la date envoyé en négatif avec un champs erreur qui indique que la date envoyé est inférieur à la date actuel.

Exemple : 

    {
        jour: 18,
        erreur: La date envoyé est inférieur à la date actuel
    }


Si la requete envoyé par l'utilisateur ne contient pas les champs "jour", "mois" et "an" ou bien si les champs existent mais contiennent des valeurs invalides, le serveur va répondre de la maniére suivante : 

    {
        erreur: Date envoyée invalide
    }

Le fichier .gitignore a été supprimé pour faciliter le test.

Pour tester, il suffit de faire : 
    
    node index.js

Puis envoyer votre requête POST à l'url 127.0.0.1:3000
