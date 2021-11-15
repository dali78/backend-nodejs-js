// ça c'est la partie intellectuelle de notre programme

class Entity { // :abstract
    id; //number
}

class Person extends Entity {
    firstname; //string
    lastname; //string
}

class Company extends Entity {
    name; //string
}

class IDataProvider{ // :abstract // :interface
// class abstraite donc je ne remplis pas les fonctions
    list(){} // :tableau d'Entity // :abstract
    search(){} // :tableau d'Entity, text : string // :abstract
}

class BaseProvider extends IDataProvider{ // :abstract
    // getData() est abstrait, donc je ne le remplis pas.
    getData(){} // :tableau d'Entity // :abstract
    // la list retourne ce qu'il y a dans le getData() de Person ou Company, car le this fait appel à l'objet construit comme Sophie par ex. C'est du shadowing. 
    list(){ // :tableau d'Entity
        return this.getData();
    } 
    // le getData ne prend rien en entrée, car il n'y a pas de paramètres dans ses parenthèses. Par contre, il nous retourne un tableau d'objet.
    search(text){ // :tableau d'Entity, text: string
        let search = text.toLowerCase(); // search: string
        let results = []; // results: entity[]
        // item est une entité, car getdata renvoit des entités.
        for (const item of this.getData()) {
            if (Object.values(item).join(' ').toLowerCase().includes(search)) {
                results.push(item);
            }
        }
        return results;
    }
}

class PersonProvider extends BaseProvider{
    getData(){ // :tableau de Person
        let p = new Person();
        p.id = 1;
        p.firstname = 'Sophie';
        p.lastname = 'Lozophy';

        let p2 = new Person();
        p2.id = 2;
        p2.firstname = 'Annie';
        p2.lastname = 'Versaire';

        let p3 = new Person();
        p3.id = 3;
        p3.firstname = 'Paul';
        p3.lastname = 'Ochon';

        return [p, p2, p3];
    }
}

class CompanyProvider extends BaseProvider{
    getData(){ // : tableau de Company
        let c = new Company();
        c.id = 1;
        c.name = 'Google';

        let c2 = new Company();
        c2.id = 2;
        c2.name = 'Apple';

        let c3 = new Company();
        c3.id = 3;
        c3.name = 'Microsoft';

        return [c, c2, c3];
    }
}

class RepositoryService{
    // Dans providers, on a une liste de providers (les objets comme José et Sophie)
    providers; // :tableau de IDataProvider

    constructor(providers){
        this.providers = providers; 
    }

    // Renvoie la liste de tous les objets de Person et Company
    list(){ // :tableau d'Entity
        let result = [];
        for (const provider of this.providers){
            // un provider est un IDataProvider et lui n'a que la méthode list. Bertrand ne connaît pas les Person et Company Providers
            let resultP = provider.list();
            // Comme je peux avoir des nouveaux providers, il faut que je puisse récupérer tous les tableaux sans en écraser un. Donc je récupère le résultat de la boucle et dans une autre variable, que j'ai instancié avant la boucle, je fais la concaténation (accumulation) des tableaux sortis de la boucle
            result = result.concat(resultP);
        }
        return result;
    }

    // Renvoie la liste des résultats de la recherche
    search(text){ // :tableau d'Entity, text : text
        let result = [];
        for(const element of this.providers){
            result = result.concat(element.search(text));
        }
        return result;
    }
}

// Là, j'instancie mes objets pour qu'ils puissent jouer leur rôle. 

// jose son type est PersonProvider
const jose = new PersonProvider();
// sophie son type est CompanyProvider
const sophie = new CompanyProvider();
// bertrand son type est RepositoryService
const bertrand = new RepositoryService([jose, sophie]);

// là je dois instancier mes providers pour bertrand
// bertrand.providers = [jose, sophie];

// là je peux demander à bertrand de travailler
// console.log(bertrand.list());
// console.log(bertrand.search('so'));

const express = require('express');
const cors = require('cors');

let app = express(); //création du serveur
app.use(cors()); //utilisation de cors: autoriser les requêtes HTTP provenant d'une autre origine (nom de domaine)
app.use(express.json()); //utilisation de json : permettre la communication avec des données au format JSON

// GET(récupération de données) - list
// POST(envoi de données avec intention création) -search
// PUT(envoi de données avec intention de modification)
// PATCH(envoi de données avec intention de modification partielle)
// DELETE(suppression de données)
// HEAD(salutation)
// OPTIONS(demande d'autorisation)

// Je crée une fonction pour mes requêtes.
// C'est une fonction call back
app.get('/', function (req, res){
    // status(200) = sucess
    res.status(200).send(bertrand.list());
});

app.post('/search', function(req, res){
    // req.body.text permet de récupérer le texte qui a été envoyé dans le post dans la variable text
    res.send(bertrand.search(req.body.text));
});

// lancement du serveur
app.listen(4000, function (){
    console.log('Listening on port 4000 haha...');
});