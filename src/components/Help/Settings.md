# <div class="text-h4 pb-3" id="settings">Administration</div>

L'entrée de menu *Administration* est accessible uniquement aux utilisateurs ayant des droits d'administrateur. Elle regroupe les fonctions de configuration de PreLoRU qui peuvent avoir le plus d'impact.

## <div class="text-h5 pb-2">Utilisateurs</div>

L'entrée du menu *Administration/Utilisateurs* <a href="/users/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour créer, supprimer ou modifier les droits et caractéristiques d'un utilisateur. L'écran comporte la liste de tous utilisateurs enregistrés dans PreLoRU et indique pour chacun s'il est actif, administrateur ou observateur et ses droits sur les secteurs. Le fonctionnement des droits est expliqué dans le paragraphe principes de cette aide.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier le nom ou les caractéristiques d'un utilisateur et l'icône <i class="material-icons">delete</i> de le supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer un nouvel utilisateur.

La fonction de modification permet de rendre actif ou inactif un utilisateur. Elle permet également de modifier son mot de passe. Si le mot de passe est laissé vide dans la boite de dialogue d'utilisateur, le mot de passe est inchangé.

## <div class="text-h5 pb-2">Secteurs budgétaires</div>

L'entrée du menu *Administration/Secteurs budgétaires* <a href="/sector/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer les secteurs budgétaires utilisés dans PreLoRU. 

La table des secteurs budgétaires comporte le code (généralement celui utilisé dans les documents budgétaires) et le nom complet.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier le nom ou le code d'un secteur budgétaire et l'icône <i class="material-icons">delete</i> de le supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer un nouveau secteur budgétaire.

Le secteur budgétaire est lié à un certain nombre de données. Il n'est donc pas possible, compte tenu de l'intégrité référentielle de la base de données de PreLoRU, de supprimer un secteur si des éléments lui sont encore liés.

## <div class="text-h5 pb-2">Actions budgétaires</div>

L'entrée du menu *Administration/Actions budgétaires* <a href="/action/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer les actions budgétaires utilisées dans PreLoRU. 

La table des actions budgétaires comporte le code (généralement celui utilisé dans les documents budgétaires), le nom complet et le secteur budgétaire de rattachement.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier le nom, le code et le secteur budgétaire de rattachement d'une action budgétaire et l'icône <i class="material-icons">delete</i> de la supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer une nouvelle action budgétaire.

Une action budgétaire est liée à un certain nombre de données. Il n'est donc pas possible, compte tenu de l'intégrité référentielle de la base de données de PreLoRU, de supprimer une action budgétaire si des éléments lui sont encore liés.

## <div class="text-h5 pb-2">Commissions</div>

L'entrée du menu *Administration/Commissions* <a href="/commission/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer les commissions utilisées dans PreLoRU.

La table des commission comporte le nom et la date indicative ou réelle de la commission. Les commissions servent à l'expression des besoins, à la préprogrammation et à la programmation. Chacun de ces éléments doit en effet comporter une référence à une commission préalablement enregistrée dans PreLoRU. Un administrateur doit donc créer des commissions pour permettre aux autres utilisateurs d'utiliser les autres fonctions. La bonne pratique consiste notamment à créer des commissions fictive pour les années à venir avec par exemple une date fixée au 1er janvier de l'année. Lorsque l'exercice change, la commission fictive créée pour l'année en cours est renommée pour correspondre à la première commission programmée et les autres commissions de l'année sont créée au fur et à mesure. Ceci permet de gérer le lien entre une commission fictive et les besoins.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier le nom ou la date d'une commission  et l'icône <i class="material-icons">delete</i> de la supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer une nouvelle commission.

Une commission est liée à un certain nombre de données. Il n'est donc pas possible, compte tenu de l'intégrité référentielle de la base de données de PreLoRU, de supprimer une commission si des éléments lui sont encore liés.

## <div class="text-h5 pb-2">Intercommunalité</div>

L'entrée du menu *Administration/Intercommunalités* <a href="/communities/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer les intercommunalités utilisées dans PreLoRU. 

La table comporte le code INSEE et le nom qui ont été extrait du SI finances. Cependant, le code INSEE a été vérifié car il est parfois erroné dans IRIS.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier le code et le nom d'une intercommunalité et l'icône <i class="material-icons">delete</i> de la supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer une nouvelle action budgétaire.

Une intercommunalité est liée notamment aux communes qui la composent. Il n'est donc pas possible, compte tenu de l'intégrité référentielle de la base de données de PreLoRU, de supprimer une intercommunalité si des éléments lui sont encore liés.

## <div class="text-h5 pb-2">Communes</div>

L'entrée du menu *Administration/Communes* <a href="/communities/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer les communes utilisées dans PreLoRU. 

La table comporte le code INSEE, le nom, l'intercommunalité de rattachement et précise si la ville comporte au moins un QPV. A la constitution de PreLoRU, le lien entre les communes et les intercommunalité a été vérifié et mis en cohérence avec les données de la DGCL. Toutefois, la table peut nécessiter des mises à jour pour tenir compte des fusions de commune ou du changement de périmètre de certaines intercommunalités.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier le code, le nom, l'intercommunalité de rattachement et la présence d'un QPV pour la commune concernée et l'icône <i class="material-icons">delete</i> de la supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer une nouvelle action budgétaire.

Une commune est liée à des données notamment les projets de renouvellement urbain ou les programmes de logement social. Il n'est donc pas possible, compte tenu de l'intégrité référentielle de la base de données de PreLoRU, de supprimer une commune si des éléments lui sont encore liés.

Par ailleurs, les liens sont généralement fait en utilisant le code INSEE d'une commune qui est unique. Le modification de ce code a donc des conséquences importantes. Si une commune fusionne, il est préférable de créer une nouvelle ligne avec le nom et le code de la commune fusionnée et de laisser la commune historique dans la base quitte à préciser dans son nom qu'elle a disparu.

## <div class="text-h5 pb-2">RPLS</div>
## <div class="text-h5 pb-2">Logement social</div>
## <div class="text-h5 pb-2">Contingent régional</div>
## <div class="text-h5 pb-2">Engagements</div>
## <div class="text-h5 pb-2">Paiements</div>
## <div class="text-h5 pb-2">Demandes de paiement</div>
## <div class="text-h5 pb-2">Import</div>
