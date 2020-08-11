<span class="text-h4" id="intro">Introduction</span>

PreLoRU a été conçu pour fournir un outil de prévisions pluriannuelles
pour le secteur du logement et du renouvellement urbain mis en oeuvre par la
Région Île-de-France. Il est complémentaire des outils financiers (IRIS et
CORIOLIS) ou d'instruction de demandes de subventions (MesDémarches) qui
permettent essentiellement de traiter des informations passées ou en cours.

Il permet d'établir des prévisions de besoins d'engagements et de crédits
de paiement pour faciliter la gestion des crédits de la Région. Il est cohérent
avec le contrôle de gestion du pôle logement transport notamment en termes de
consommation de crédits et de suivi des délais de paiement.

Il est également utilisé pour gérer les droits de réservation de la Région afin
de remplacer un ancien tableau Excel dans la mesure où il est en capacité
d'assurer un lien avec les programmes de construction de logements sociaux
subventionnés par la Région.

Il est manuellement interfacé avec le système d'information géré par le pôle
finances de la Région afin d'assurer la cohérence des données financières
et d'éviter les resaisies qui sont source d'erreur et de perte de temps. Cela
signifie qu'il faut réaliser des imports de données en utilisant les fonctions
d'administration du logiciel à partir soit de tableaux de bord d'IRIS soit d'un
export CORIOLIS utilisant l'infocentre dédié.

Le logiciel a été conçu en lien avec le travail quotidien des équipes afin
de faciliter l'intégration dans le travail. Un certain nombre de fonctions
ont été développées à la demande des utilisateurs pour répondre
à des besoins spécifiques ou pour faciliter certaines tâches pénibles ou
très consommatrices de temps. C'est par exemple le cas pour suivre la répartition
des subventions au logement social en fonction du taux RPLS des communes.

Comme il s'agit d'une application Web, plusieurs utilisateurs peuvent
travailler simultanément sur les données qui sont mises à jour de manière
instantanée. Cela permet en particulier aux agents d'un même service de
travailler sur un même secteur sans avoir de problème de blocage des uns
par les autres.

Cependant, si les données sont enregistrées en temps réel, elles ne sont
pas retransmises en temps réel à tous les utilisateurs connectés. Cela signifie
qu'il est parfois nécessaire de demander l'actualisation d'une page pour
avoir les informations à jour par exemple lorsque deux agents travaillent
strictement en même temps. En effet, les informations affichées sont
calculées par le logiciel uniquement au moment du chargement de la page ou
lorsque des modifications sont effectuées par l'utilisateur. Une
modification fait par un autre utilisateur ne sera généralement pas mise à
jour sur tous les écrans des autres utilisateurs connectés.

Seuls utilisateurs inscrits et autorisés par administrateur du logiciel peuvent
s'y connecter. Chaque utilisateur est doté de droits particuliers qui lui
permettent de réaliser certaines tâches. Certaines fonctions seront accessibles
uniquement à certains utilisateurs.

Toutes les fonctions sont regroupées dans le menu latéral signalé par
l'icône <i class="material-icons">menu</i>. Le contenu du menu est visible en
fonction de la taille de l'écran et du choix de  l'utilisateur qui peut décider
de le masquer pour améliorer la visibilité de la page principale.

PreloRU a été conçu avec une interface dite *material design* qui est notamment
utilisée sur les téléphones Android. Cette interface est habituellement bien connue
des utilisateurs et facile à utiliser.

Enfin d'une manière générale, les informations restituées sous forme de
tableaux à l'écran peuvent être téléchargées sous forme de fichier Excel. Ces
exports contient au moins toujours autant d'information que celle affichées.
Le fichier Excel comporte des entêtes, un filtre et des sous-totaux pour les
colonnes où un total a effectivement un sens.
