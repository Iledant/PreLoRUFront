# ![Preloru Front](src/assets/logo_preloru.svg) PreloruFront

PReloru est une application Web qui comporte
* un front end écrit en Vue/Vuetify
* un back end écrit en go avec le framework iris

PreloruFront est le front end javascript. Il est régulièrement mis à jour en fonction des livraisons de Vue CLI et de Vuetify ce qui peut conduire à changer de repository sur Github pour éviter de faire un commit qui modifie la quasi totalité des dépendances et pour être sûr que les compilations fonctionnent bien. De plus, ces mises à jour régulières de toutes les dépendances réduisent les risques d'insécurité.

La version actuelle a été générée directement par Vue CLI 4.2.2 et le plugin Vuetify en version 2.2.

Il utilise des paramètres personnalisés :
* Utilisation de Vuex et de Vue Router sans mode history
* Linter/formatter en mode standard
* E2E testing avec Cypress même si pour l'instant aucun test n'a été implémenté

Il utilise également des paramètres personnalisé de Vuetify
* Utilisation du locale 'fr'
* Utilisation d'un thème personnalisé
* Utilisation de la compilation à la carte
* Utilisation des icônes material design (et non pas mdi utilisé désormais par défaut par Vuetify)

Le front end gère les paramètres d'authentification grâce à un JWT échangé avec le back end. Les routes sont protégées directement et provoquent une redirection par le router en cas d'accès direct non autorisé.

Il y a peu d'utilisation des chemins dynamiques même si le bundle a une taille importante. L'optimisation sera sans doute à effectuer ultérieurement.

## Configuration

### Packages utilisés

En dehors de Vue, Vuetify, Vue router et Vuex, le front end utilise
* *Vue ressource* pour toutes les requêtes
* *xlsx-populate* pour lire les fichiers Excel utilisés pour importer des données ou pour générer des fichiers Excel pour les exports
* *chart.js* et *vue-chartjs* pour les graphiques utilisés dans différents composants
* *vue-debounce*, package qui fournit une directive pour les composants de Vue. Il est utilisé dans les recherches impliquant une requête serveur afin d'offrir une bonne expérience utilisateur sans surcharger le serveur de requêtes
* *vue-currency-input*, une directive qui permet de formatter les composants v-text-field de Vuetify afin d'avoir des saisies de valeurs monétaires lisibles.

### Webpack

La configuration personnalisée utilise les recommandations de Vue CLI :
* Le fichier de configuration utilisé est *vue.config.js*
* Afin de produire des versions compressées des fichiers générés, la configuration utilise *webpack-compression-plugin* 
* Les fichiers *source map* ne sont pas générés en mode production
* Les configurations spécifiques aux modes développement et de production (adresse du backend) sont placés dans *.env.development* et *.env.production*
* Comme Preloru a vocation à n'être utilisé que sur un navigateur Chrome récent, le fichier *.browserslistrc* ne vise que les versions les plus récentes de Chrome et exclut la compatibilité avec Internet Explorer. Cela permet d'avoir d'utilisation les fonctions ES2018 sans être transpilées par Babel

### Eslint

Aucune personnalisation supplémentaire n'a été apportée à celle du CLI en mode standard. Le lint est fait au moment de la sauvegarde et les *fix* sont appliqués directement depuis VSCode, l'EDI utilisé pour le développement du front end.

## Structure de PreloruFront

La structure générale de PreloruFront est issue de Vue CLI :
* les fichiers de configuration sont dans le répertoire de base
* le répertoire *src/public* contient le template index.html qui est compilé par webpack ainsi que les assets d'image utilisés (favicon et fichiers SVG pour certains composants)
* le répertoire *tests* est générés par Vue CLI pour les test end to end Cypress. Il n'est pas configuré pour le moment
* le répertoire *src* contient tout le code du front end

### Répertoire *src*

Sa structure reprendre celle issue de Vue CLI 4. Il comprend :
* le fichier *main.js* d'initialisation de l'application
* les filtres d'affichage sont regroupés dans le fichier *filters.js*
* les imports et exports *Excel* utilisant *xlsx-populate* sont regroupés dans le fichier *excel.js*. Il comporte essentiellement deux fonctions l'une pour la lecture de fichiers, l'autre pour l'écriture
* le composant principal *App.vue* qui contient le cadre de l'application. Il utilise le cadre habituel de Vuetify pour une application avec une barre de titre et un menu latéral
* le répertoire *assets* qui est vide
* le répertoire *components* qui contient l'ensemble des composants Vue du front end
* le répertoire *router* qui contient tous les fichiers pour Vue router, le fichier principal étant index.js
* les mixins pour les composants sont placés dans le fichier *src/mixins.js*
* le répertoire *store* qui contient tous les fichiers pour Vuex. Le fichier principal est *index.js*. Tous les autres fichiers sont gérés comme des modules

### Répertoire *src/components*

Il contient la totalité des composants Vue de l'application à l'exception de App.vue.

Les composants et les sous composants sont tous stockés directement dans le répertoire *src/components*.

Un style transverse *table-link* est défini dans *App.vue* et utilisé dans certains *v-data-table* pour donner l'impression visuelle à l'utilisateur de liens.

Ils servent dans les tableau regroupant la liste des objets d'un même type pour accéder à la page individuelle d'un objet : par exemple, depuis la table de toutes les programmes de logement social, *table-link* est appliqué sur la référence du programme ; un clic sur la référence permet d'accéder à la page dédiée à l'opération.

## Authentification et sécurité

L'application comporte un mécanisme d'authentification pour assurer la sécurité des connexions. Elle utilise un *JSON web token* avec le back-end pour garantir que les échanges ont bien lieu avec un utilisateur qui s'est connecté.

Lors de l'initialisation de l'application ou après une déconnexion, le store de l'application ne contient plus aucune information sur l'utilisateur et le JWT est détruit. Le composant App.vue n'affiche plus alors que la boîte de dialogue pour se connecter qui contient elle-même une sous-boîte pour demander son inscription.

La connection entre le front end et le back end utilise du HTTPS.

Lors de la phase d'identification, l'email et le mot de passe sont envoyés via HTTPS au back end. En cas de succèss, un JWT est renvoyé. Il est stocké localement pour permettre une reconnexion automatique ultérieure. Ce JWT est stocké dans le store et dans le local storage.

Au moment de l'initialisation de l'application, le front end vérifie s'il existe un token dans le local storage et si c'est le cas l'utilise pour tous les échanges avec le back end.

Pour faciliter l'expérience client, le front end utilise la méthode de régénération automatique du JWT par le back end qui intervient pendant le "délai de grâce" au-delà de la durée normale de validation du JWT. Ce nouveau JWT est remplacé "à la volée" par l'intercepteur de Vue resources et stockés à la fois dans le store et dans le local storage.

Le JWT renvoyé contient également les droits de l'utilisateur sous la forme d'un champ numérique. Les différents droits correspondent aux bits de ce champ numérique. Les constantes correspondant à ces bits ainsi que les masques permettant de vérifier les droits sont placés dans le fichier *token.js* du répertoire *src/store*. Ils sont cohérents avec les constantes utilisées par le back end (constante Go).

Le fichier *token* du store assure le stockage et la gestion de ces droits. En particulier, il comporte les lignes du menu qui sont filtrées en fonction des droits de l'utilisateur.

Quand un utilisateur utilise la fonction de déconnexion, le token est supprimé à la fois du store et du *local storage* ce qui fait apparaître automatiquement le boîte de dialogue de connexion.