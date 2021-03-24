# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.

les requêtes ElasticSearch:
* le nombre d'appels par catégorie:
```bash
POST /911-calls/_search
{
  "size": 0,
  "aggs" : {
         "title1" : {
            "terms": {
                "field": "title1.keyword"
            }
        }
    }  
} 
```
* les 3 mois ayant comptabilisés le plus d'appels:
```bash
POST /911-calls/_search 
{ 
  "size": 0, 
  "aggs": 
    { 
      "timeStamp": 
        { 
          "terms": 
          { 
            "field": "timeStamp.keyword", 
            "size" : 3, 
            "order":
              { "_count": "desc" } 
            
          } 
          
        } 
      
    } 
}
```
* le top 3 des villes avec le plus d'appels pour overdose:
```bash
  POST /911-calls/_search 
{ "query" : 
    { 
        "wildcard" : 
            { 
                "title2" : 
                    { 
                        "value" : "OVERDOSE" 
                    } 
            } 
    },  
    "size": 0, 
    "aggs": 
        { 
            "twp": 
                { 
                    "terms": { "field": "twp.keyword", "size" : 3, "order": { "_count": "desc" } } 
                } 
            } 
        }
```


* le nombre d'appels autour de Lansdale dans un rayon de 500 mètres:
```bash
GET /911-calls/_count 
{ 
    "query": 
        { 
            "bool" : 
                { 
                    "filter" : 
                        { 
                            "geo_distance" : 
                            { "distance" :-ca "500m", "location" : "40.241493, -75.283783" } 
                        } 
                } 
        } 
}

```
## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

Pour nous permettre d'évaluer votre travail, ajoutez une capture d'écran du dashboard dans ce répertoire [images](images).

### Bonus : Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```
