// Module pour la création du serveur et traitement des requetes et réponses http
var http = require('http');
// Module pour parser les paramétres réçus
var qs = require('querystring');
// Module pour le formatage et la validation des dates
var moment = require('moment');
moment().format();

// function pour extraire les paramétres post réçus
function processPost(request, response, callback) {
    // Objet qui contiendra les paramétres POST
    var queryData = "";
    if (typeof callback !== 'function') return null;

    // Vérifier que la méthode http est bien POST 
    if (request.method == 'POST') {
        // Lorsqu'on reçoit du data
        request.on('data', function(data) {
            // On stocke la data réçu
            queryData += data;
            // Si la data réçu est trôp lourd, on tue la connection
            if (queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, { 'Content-Type': 'text/plain' }).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            // Conversion du data réçu 
            request.post = qs.parse(queryData);
            callback();
        });

        // Si la méthode http n'est pas POST, on informe l'utilisateur
    } else {
        response.writeHead(405, { 'Content-Type': 'text/plain' });
        response.end();
    }
}

// Création serveur
var server = http.createServer(function(request, response) {
    processPost(request, response, function() {
        // Extraction des paramétres
        var jour = request.post.jour;
        var mois = request.post.mois;
        var an = request.post.an;

        // Les deux condition If ci-dessous sert à respecter le format ISO standarisé des dates
        if (Number(mois) < 10) {
            mois = "0" + mois;
        }
        if (Number(jour) < 10) {
            jour = "0" + jour;
        }

        // Date actuel
        var currentDate = moment();
        // Date reçu
        var recievedDate = moment(an + "-" + mois + "-" + jour);

        // Vérifier que la date réçu est une date valide
        if (recievedDate.isValid() && an.length === 4) {
            // Calcul de la différence entre la date envoyée est la date actuel
            var diffrenceInDays = recievedDate.diff(currentDate, 'days');

            // Construction du corps de la réponse http sous format JSON
            var responseBody = '{"jour": ' + diffrenceInDays;
            if (diffrenceInDays < 0) {
                responseBody += ', "erreur": "La date envoyé est inférieur à la date actuel"'
            }
            responseBody += ' }';

            // Ecriture des headers
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
            // Ecriture du body
            response.write(responseBody);
            // Envoi de la réponse
            response.end();
            // Si la date réçu est invalide
        } else {
            response.writeHead(400, "Invalid Date", { 'Content-Type': 'application/json' });
            response.write('{"erreur": "Date envoyée invalide"}');
            response.end();

        }
    });

});

// Démarrage du serveur
server.listen(3000);
