# <div class="text-h4 pb-3" id="housing">Logement social</div>

Les fonctions pour le logement social sont réparties dans 4 entrées du menu :
* *Logement social* du menu qui regroupe l'ensemble des programmes, l'expression des besoins et la préprogrammatoin
* *Synthèses territoriales* qui regroupe les synthèses sur le RPLS
* *Administration/Logement social* qui regroupe la fonction de l'administrateur pour définir les types de logements socials (logement familial, foyer de jeune travailleur...)
* *Administration/RPLS* qui permet de consulter le taux officiel de logements sociaux des communes ou de le modifier manuellement
* *Administration/Imports* qui permet de créer automatiquement les nouveaux programmes subventionnés lors d'une commission permanente par lecture du fichier Excel de bilan et d'importer les fichiers RPLS pour l'ensemble de la Région.

Les fonctions de logement social <a href="/housings/"><i class="material-icons">open_in_new</i></a> sont regroupées par onglets :
* *Programmes* regroupe la liste de tous les programmes de logement social. La fonction de recherche permet de filtrer par la référence unique du programme, par adresse, par ville ou par code INSEE de la ville. Sur chaque ligne du tableau l'icône <i class="material-icons">edit</i> permet de modifier le contenu du programme et l'icône <i class="material-icons">delete</i> de le supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer un nouveau programme
* *Besoins* qui permet de définir les besoins ou de les modifier. Sur chaque ligne du tableau l'icône <i class="material-icons">edit</i> permet de modifier le besoin et l'icône <i class="material-icons">delete</i> de le supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer un nouveau besoin. Le logement social reposant sur une logique de guichet, les besoins sont exprimés par dispositif donc par action budgétaire
* *Préprogrammation* qui permet de définir ou de modifier les éléments de la préprogrammation. La première ligne permet de définir l'année de préprogrammation. Le tableau ne contient donc que les lignes relatives à cette année. Sur chaque ligne du tableau l'icône <i class="material-icons">edit</i> permet de modifier le contenu du programme et l'icône <i class="material-icons">delete</i> de le supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer un nouveau programme. Le bouton *Exporter en Excel* permet de générer le fichier Excel contenant toutes les informations relatives à la préprogrammation.

La fonction de synthèse territoriale de l'onglet RPLS permet de calculer sur une période la répartition des subventions de la région pour les communes comprises entre deux taux de logements sociaux. Le calcul est effectué une fois que l'ensemble des informations requises sont remplies :
* Année de RPLS (seules celles de la base de PreLoRU sont utilisables)
* Les années de subventions à choisir
* Les taux de logements sociaux des communes à retenir.

Les boutons *Export Excel* et *Export Détaillé *Excel* permettent de générer les fichiers Excel correspondant respectivement au tableau de l'écran et aux listes de subventions qui correspondent aux critères.
