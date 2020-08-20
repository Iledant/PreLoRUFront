# <div class="text-h4 pb-3" id="prevision">Prévisions</div>

Les prévisions font l'objet de deux entrées de menu : *Prévision AP* et *Prévision CP*

## <div class="text-h5 pb-2">Prévision d'AP</div>

Les prévisions d'AP synthétisent sur 5 années l'expression des besoins pour l'année en cours et les cinq années à venir. Elles sont regroupées par action budgétaire ce qui permet à la fois de disposer du montant total et d'une ventilation par ligne budgétaire permettant de remplir CORILOLF lors de la préparation du budget de l'année à venir.

Le bouton *Export Excel* permet de générer le fichier Excel reprenant les données affichées à l'écran.

## <div class="text-h5 pb-2">Prévision de CP</div>

L'entrée du menu *Prévisions de CP* donne accès à 4 fonctions reparties par onglets :
* *Prévisions par ratios* qui permet de calculer les prévisions statistiques de consommation de CP en appliquant une méthode consistant à reproduire les clés de transformation des AP d'une année en CP au cours du temps. Les clés de transformation sont calculées grâce à la fonction de l'onglet *Ratios AP CP*. Concrètement, cela revient à calculer pour une AP donnée un pourcentage de transformation en paiement pour l'année d'engagement de l'AP, pour l'année suivant, l'année n+2 et ainsi de suite. Ce calcul est fait pour toutes les AP d'un exercice donné. Pour la prévision, le principe consiste à prendre les chroniques des AP engagées les années précédentes, la programmation de l'année en cours et l'expression des besoins pour les années à venir. Les ratios sont ensuite appliqués sur cette chronique d'AP : par exemple pour l'année en cours, on applique le ratio de l'année 0 sur la programmation, le ratio de l'année 1 sur les AP de l'année précédente, le ratio de l'année 2 sur les AP de l'avant-dernière année et ainsi de suite
* *Prévision par RAM* est une variante de la méthode précédente. Elle consiste à calculer des clés de transformation des RAM par analyse statistique. Concrètement, PreLoRU calcule le taux de transformation des RAM en CP pour les AP de différents exercice. Il moyenne alors ce taux pour déterminer des ratios. Le ratios permet de déterminer pour les RAM d'une année donnée le pourcentage de CP générée cette même année, puis pour l'année suivant et ainsi de suite. Ces ratios sont alors appliqués sur les RAM de l'année en cours en ajoutant la programmation pour l'année en cours puis les besoins. PreLoRU calcule de manière itérative les RAM d'une année, ajoute les AP prévue cette année, applique les ratios pour déterminer un montant de consommation, en déduit les RAM de la fin de cette année et ainsi de suite. Cette méthode permet de mieux gérer les phénomènes d'accélération ou de retard qui sont ignorés par la méthode des ratios
* *Enveloppe de CP* qui regroupe les informations issues de CORIOLIS sur les mouvements d'enveloppe de CP : inscription budgétaire, gel, mise en réserve et mouvements. Ceci permet de disposer à la fois de la situation et de l'historique des mouvements qui ne sont pas aisément accessible sous CORIOLIS
* *Ratios AP CP* permet d'afficher, de calculer et de modifier les ratios utilisés pour la première méthode de prévisions de CP.
