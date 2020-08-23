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

L'entrée du menu *Administration/RPLS* <a href="/rpls/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer la base de données du taux de logements sociaux des communes.

PreLoRU permet de stocker pour une commune le taux officiel recensé par les services de l'Etat pour chaque commune.

La table comporte la totalité des données RPLS en précisant le code INSEDE, le nom de la commune, l'année du RPLS et le taux stockés.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier la commune par le biais d'un menu déroulant comportant une recherche rapide, l'année du RPLS et le taux de logements sociaux <i class="material-icons">delete</i> de la supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer une nouvelle ligne de RPLS.

## <div class="text-h5 pb-2">Logement social</div>

L'entrée du menu *Administration/Logement social* <a href="/housing_settings/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer la liste de type de logements sociaux afin d'unifier la manière dont ils sont codés. LA tableau comporte le nom court qui est habituellement utilisé dans les tableaux de synthèse et le nom complet.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet de modifier le nom court et le nom complet d'un type de logements sociaux <i class="material-icons">delete</i> de le supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer un nouveau et logements sociaux.

## <div class="text-h5 pb-2">Contingent régional</div>

L'entrée du menu *Administration/Contingent régional* <a href="/reservation_fee_settings/"><i class="material-icons">open_in_new</i></a> regroupe les fonctions pour gérer les listes des typologies, commentaires, cessions et types de conventions utilisées dans la base de données de réservation de logements sociaux. Ces listes permettent de traiter de manière uniforme ces différentes informations de la base de données. Seul l'administrateur peut les modifier ou ajouter de nouvelles lignes. Elles apparaîtront ensuite dans les menus déroulant pour les utilisateurs des droits de réservation. Comme pour les autres parties de la base de données, ces listes sont liés aux éléments de la base de données des réservations. Une ligne ne peut donc pas être supprimée si des lignes de la réservation de logements sociaux font encore référence à la base de données.

Dans chaque onglet de cette fonction, et sur chaque ligne de la table affichée, l'icône <i class="material-icons">edit</i> permet de modifier le nom de l'élément concerné <i class="material-icons">delete</i> de le supprimer définitivement. L'icône <i class="material-icons">add_circle</i> en bas du tableau permet de créer une nouvelle ligne.

## <div class="text-h5 pb-2">Engagements</div>

L'entrée du menu *Administration/Engagements* <a href="/commitments/"><i class="material-icons">open_in_new</i></a> permet de chercher un engagement spécifique et de rétirer son lien avec un projet ou un programme. Elle permet aussi de gérer des fichiers filtrant une partie de ces engagements pour des utilisations particulièrement comme le RAM ou la caducité.

La fonction ne comporte qu'une seule page et une seule table qui permet d'afficher la date d'engagement (issue de CORIOLIS), le budget de rattachement (secteur et action budgétaires), l'indication si l'engagement est lié à un projet ou un programme (L), le numéro de la fiche IRIS, le nom de l'engagement issu de CORIOLIS qui est généralement une version raccourcie de la fiche IRIS, le bénéficiaire et le montant de l'engagement initial.

Deux champs de recherche permettent de filtrer les engagements :
* un champ textuel permettant de filtrer les lignes d'engagement dont le nom CORIOLIS, le CODE, le nom du bénéficiaire, le numéro de fiche IRIS ou l'action budgétaire comporte une partie du texte rentrée
* un champ d'année permettant de ne retenir que les engagements pris à compter de l'année spécifiée.

Pour supprimer un lien entre un engagement et un projet ou programme, une fois l'engagement trouvé, il faut cliquer sur la case à cocher de la première colonne et cliquer sur le bouton *Supprimer le lien* situé sous le tableau.

Trois exports sous forme de fichier Excel peuvent être générés :
* *Export Excel RAM* qui liste la totalité des engagements de la base de données en donnant toutes les informations affichées dans la table ainsi que la date de modification de l'engagement, l'information sur le fait que l'engagement est déclaré soldé dans CORIOLIS et le détail du numéro d'engagement dans CORIOLIS. Ce fichier sert aux échanges avec le pôle finances. Le fichier comporte plus de 3000 lignes
* *Export Excel caducité* qui liste les engagements de CORIOLIS qui sont susceptible d'être concerné par une caducité c'est à dire qui ne sont pas déclarés soldés dans CORIOLIS et dont les dates de notification ou de premier paiement peuvent entraîner une caducité de l'engagement conformément au règlement budgétaire et financier de la Région
* *Export Excel* qui permet de transformer le tableau en fichier Excel conformément aux champs de recherche. Le fichier Excel comporte la totalité des informations affichées dans la table mais également la date de modification de l'engagement, et le nom des projets ou programmes liés à l'engagement.

## <div class="text-h5 pb-2">Paiements</div>

L'entrée du menu *Administration/Paiements* <a href="/payments/"><i class="material-icons">open_in_new</i></a> permet de chercher un mandatement spécifique et d'exporter une liste de paiements suivant des critères particuliers.

La fonction ne comporte qu'une seule page et une seule table qui permet d'afficher la date du paiement (issue de CORIOLIS), l'exercice et le numéro de mandate, le montant du mandatement, la date de l'engagement, le nom de l'engagement tel qu'il apparaît dans CORIOLIS, le montant de l'engagement, le bénéficiaire et le budget de rattachement (secteur et action budgétaires).

Deux champs de recherche permettent de filtrer les engagements :
* un champ textuel permettant de filtrer les lignes  dont le nom CORIOLIS de l'engagement, le nom du bénéficiaire,  ou l'action budgétaire comporte une partie du texte rentrée
* un champ d'année permettant de ne retenir que les mandatements passés à compter de l'année spécifiée.

Le bouton *Export Excel* permet de transformer le tableau en fichier Excel conformément aux champs de recherche. Le fichier Excel comporte la totalité des informations affichées dans la table mais également la date de modification du mandatement.

## <div class="text-h5 pb-2">Demandes de paiement</div>

L'entrée du menu *Administration/Demandes de paiements* <a href="/payment_demands/"><i class="material-icons">open_in_new</i></a> permet de gérer les exclusions de prise en compte des demandes de paiement dans les indicateurs de la page d'accueil et d'exporter les données complètes des demandes sous la forme d'un fichier Excel.

Sur chaque ligne, l'icône <i class="material-icons">edit</i> permet d'exclure ou d'inclure une demande de paiement dans les requête et de préciser la raison d'une exclusion par un commentaire.

Le bouton *Export Excel* permet de générer un fichier Excel comportant la totalité des demandes de paiement et des informations récupérer depuis IRIS : date d'import dans PréloRU,code IRIS,	nom IRIS,	code et nom du bénéficiaire, numéro de la demande (en cas de demandes multiples sur une même facture), date de la demande, date de réception, montant indiqué dans IRIS pour le CSF, date de délivrance du CSF dans IRIS, commentaire entré par la direction de la comptabilité dans IRIS, status indiqué dans IRIS,indicateur d'exclusion dans PreLoRU, commentaire d'exclus dans PreLoRU et indication de la date de traitement.

La demande de paiement est considérée comme traitée lorsqu'elle n'apparaît plus dans les tableaux de bord d'IRIS. La première date d'import dans PreLoRU où cette ligne n'apparaît pas est considérée comme celle de traitement de la demande de paiement par la direction de la comptabilité.

## <div class="text-h5 pb-2">Import</div>

L'entrée du menu *Administration/Imports* <a href="/uploads/"><i class="material-icons">open_in_new</i></a> regroupe l'ensemble des fonctions d'import des fichiers Excel qui permettent d'alimenter la base de données de PreLoRU.

Trous sources d'import sont possible dans PreLoRU :
* les fichiers générés par SQLDevelopper pour récupérer les données CORIOLIS depuis l'infocentre de ce dernier SI. Ils concernent les paiements, les engagements et les mouvements sur les enveloppes de crédits de paiement
* les tableaux de bord IRIS qui ont été spécialement conçus pour PReLoRU et qui comporte le nom "PreLoRU" dans IRIS. Il faut les utiliser sous la forme de fichiers Excel .xlsx et les importer tels quels. Ils ont été formattés spécialement pour PreLoRU
* le tableau de bilan des logements sociaux qui peut être importé directement pour créer automatiquement les programmes de logements sociaux et pour rattacher des engagements par le biais du numéro de fichier IRIS. L'import utilise le format actuel de ce fichier en recherchant uniquement les colonnes utiles dans le premier onglet. Pour accélérer l'import, il suffit d'importer une copie de ce fichier en supprimant les autres onglets. On peut également filtrer les lignes pour ne faire figurer que celles concernant la dernière commission permanente par exemple
* le tableau initial des réservations de logement social. L'import a été concerné pour le lire directement et créer les lignes. Toutefois, le fichier a été fortement retravaillé pour comporter des données cohérentes avec les listes de PReLoRU et pour s'assurer que les bénéficiaires sont correctement codés et que les codes INSEE des villes sont corrects.

Pour réaliser un import, il faut dans un premier temps utiliser le menu déroulant pour indiquer le type d'import qui est souhaité, pour les demandes de paiement indiquer la date du tableau de bord, puis cliquer sur la ligne de téléchargement qui fait apparaître une boîte de dialogue de sélection de fichier. Lorsqu'un type d'import a été sélectionner un petit texte d'aide apparaît à droite du bouton d'import.