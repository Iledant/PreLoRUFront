# <div class="text-h4 pb-3" id="principles">Principes généraux</div>

PreLoRU, comme Propera, utilise une notion de **programme** ou de **projet** pour organiser les données. Un programme peut regrouper une ou plusieurs subvention pour la réalisation de logements sociaux qui sont situés dans une même opération. Un projet peut être un équipement réalisé dans le cadre d'un projet de renouvellement urbain ou l'ensemble des opérations depuis les études jusqu'aux travaux correspondant à un label régional.

Ces programmes ou projets représentent normalement un objet physique que la Région va aider financièrement avec une ou plusieurs subventions. Son avancement va être suivi par PreLoRU que ce soit de manière prévisionnelle ou passée.

Toutes les données financières issue de CORIOLIS et d'IRIS vont être liées à un programme ou à un projet. Cette phase de liaison entre les données financières et les objets physiques s'appellent un rattachement. Plus précisément, les engagements sont rattachés à un programme ou un projet. Les paiements sont liés à un engagement et donc à un programme ou un projet. De même, l'essentielle des prévisions d'engagement vont être rattachées à programme ou un projet.

Afin d'éviter des incohérences, la base de données de PreLoRU utilise *l'intégrité référentielle*. Cela signifie que les liens entre les données sont directement inscrites dans la base de données. Chaque modification ou suppression s'assure qu'il n'y a aucune altération de ces liens. Ceci peut conduire à une erreur qui interdit la suppression de données si cette suppression a pour effet de faire disparaître des liens. Par exemple, un programme de logement social ne pourra pas être supprimés si des engagements lui sont rattachés. De même, un label de copropriété ne peut pas être supprimé si des prévisions lui sont liées. Cette sécurité assure la cohérence des données dans la base et notamment évite tout problème entre les paiements et les engagements contrairement aux outils financiers de la Région.

## <div class="test-h5 pb-2">Besoins, préprogrammation et programmation</div>

Pour les prévisions relatives à un projet ou à un programme, trois notions sont mises en oeuvre :
* les **besoins**. Ils expriment les intentions du maître d'ouvrage sans aucune contrainte. Ces besoins ont vocation à évoluer dans le temps pour des raisons propre au projet ou au programme (procédures d'autorisation, aléas...) ou en lien avec les décisions de la Région. PreLoRU doit permettre de suivre au plus près cette information pour estimer l'évolution des besoins théoriques au cours du temps des programmes et des projets suivis
* la **préprogrammation**. Elle constitue une proposition d'un agent ayant des droits particuliers au cours de l'année budgétaire. Elle permet à la fois de relativiser l'expression des besoins qui a toujours tendance à être trop optimiste et à tenir compte des contraintes et priorités propre à chaque secteur. Le préprogrammation concerne un des trois secteurs de PreLoRU : logement social, copropriétés et renouvellement urbain
* la **programmation**. Elle n'est accessible qu'aux administrateurs de PreLoRU. Elle vise à mettre en adéquation les disponibilités budgétaires, les priorités de l'Exécutif et les besoins exprimés notamment au travers de la préprogrammation. La programmation est notamment utilisées pour les prévisions à plus long terme. La programmation n'est normalement conçue que pour l'année en cours mais elle peut aussi être définie pour d'autres années. Cela permet notamment d'anticiper en décembre les décisions à prendre pour le début de l'année suivante.

## <div class="test-h5 pb-2">Droits des utilisateurs</div>

Les droits de chaque utilisateur définissent les fonctions auxquelles ils ont accès. Sous PreLoRU, les droits sont les suivants :

* **observateur**. Ces droits permettent de consulter la quasi-totalité des données et des synthèses mais pas de modifier les données. Ces droits sont conçus pour d'autres pôles notamment le pôle finances afin de partager en temps réel les informations de PReLoRU
* **logement social**. Ces droits permettent de consulter l'essentiel des données et des synthèses mais également de renseigner les besoins prévisionnels de ce secteur. Pour ce secteur, les besoins sont limités aux dispositifs. Ce droit permet également de créer ou de modifier un programme
* **copropriété**. Ces droits permettent de consulter l'essentiel des données et des synthèses mais également de créer de nouveaux labels, de les modifier et de modifier ou créer des besoins d'un label
* **renouvellement urbain**. Ces droits permettent de consulter l'essentiel des données et des synthèses mais également de créer de nouveaux projets, de les modifier et de modifier ou créer des besoins d'un label et de ventiler les informations entre communes d'un projet
* **préprogrammation** d'un secteur (logement social, copropriété, renouvellement urbain). Ces droits permettent de créer ou de modifier la préprogrammation du secteur donné
* **droits de réservation**. Ces droits permettent d'accéder aux fonctions relatives au contingent de logement sociaux à la fois en consultation et en modification.
* **administrateur** permet d'accéder à la totalité des fonctions en lecture et en 
modification. Un administrateur peut donc modifier les besoins et préprogrammation de tous les secteurs, créer des projets, labels et programmes. Il peut créer des commissions, des secteurs budgétaires, des actions budgétaires, faire les imports de données et gérer les droits des utilisateurs.

À noter qu'un utilisateur ne peut accéder à PreLoRU que s'il possède des droits minimaux et si son compte est actif. La possibilité de désactiver un compte permet, pour des raisons de sécurité, de gérer les absences des utilisateurs sans avoir à supprimer un compte et sa configuration.