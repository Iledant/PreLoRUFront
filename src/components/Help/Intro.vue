<template>
  <v-expansion-panel accordion flat hover>
    <v-expansion-panel-header class="text-h4">
      Introduction
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <p>PreLoRU a été conçu pour fournir un outil de prévisions pluriannuelles
      pour le secteur du logement et du renouvellement urbain mis en oeuvre par la
      Région Île-de-France. Il est complémentaire des outils financiers (IRIS et
      CORIOLIS) ou d'instruction de demandes de subventions (MesDémarches) qui
      permettent essentiellement de traiter des informations passées.</p>
      <p>
      Il permet d'établir des prévisions de besoins d'engagements et de crédits
      de paiement pour faciliter la gestion des crédits de la Région. Il est
      également utilisé pour gérer les droits de réservation de la Région afin
      de remplacer un ancien tableau Excel.</p>
      <p>
      Il est manuellement interfacé avec le système d'information géré par le pôle
      finances de la Région afin d'assurer la cohérence des données financières
      et d'éviter les resaisies qui sont source d'erreur et de perte de temps.</p>
      <p>
      Le logiciel a été conçu en lien avec le travail quotidien des équipes afin
      de faciliter l'intégration dans le travail. Un certain nombre de fonctions
      ont été développées à la demande des utilisateurs pour répondre
      à des besoins spécifiques ou pour faciliter certaines tâches pénibles ou
      très consommatrices de temps</p>
      <p>Comme il s'agit d'une application Web, plusieurs utilisateurs peuvent
      travailler simultanément sur les données qui sont mises à jour de manière
      instantanée. Cela permet en particulier aux agents d'un même service de
      travailler sur un même secteur sans avoir de problème de blocage des uns
      par les autres.</p>
      <p>Cependant, si les données sont enregistrées en temps réel, elles ne sont
      pas retransmise en temps réel à tous les utilisateurs connectés. Cela signifie
      qu'il est parfois nécessaire de demander l'actualisation d'une page pour
      avoir les informations à jour par exemple lorsque deux agents travaillent
      strictement en même temps. En effet, les informations affichées sont
      calculées par le logiciel uniquement au moment du chargement de la page ou
      lorsque des modifications sont effectuées par l'utilisateur. Une
      modification fait par un autre utilisateur ne sera pas directement mise à
      jour sur tous les écrans.</p>
      <p>Le logiciel nécessite que les utilisateurs soient inscrits et autorisés
      par une personne ayant les droits d'administrateur du logiciel. Chaque
      utilisateur est doté de droit spécifiques qui lui permettent ou non de réaliser
      certaines tâches. Ces autorisations peuvent notamment se traduire par le
      fait que certaines fonctions ou menus sont ou non accessibles.</p>
      <p>Toutes les fonctions sont regroupées dans le menu latéral signalé par
      l'icône <span class="font-italic">hamburger</span> <v-icon>menu</v-icon>. Le
      contenu du menu est visible ou non en fonction de la taille de l'écran et
      des choix effectués par l'utilisateur qui peut décider de le masquer pour
      améliorer la visibilité de la page principale.</p>
      <p>PreloRU a été conçu avec une interface dite <span class="font-italic">
      material design</span> qui est notamment utilisée sur les téléphones
      Android. Cette interface est habituellement bien connue des utilisateurs et
      facile à utiliser.</p>
      <p>Enfin d'une manière générale, les informations restituées sous forme de
      tableaux peuvent être téléchargées sous forme de fichier Excel avec au
      moins toujours autant d'information. Le fichier correspondant comporte des
      entêtes et des fonctions de filtre et de sous-total pour faciliter
      l'exploitation des données.</p>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'Intro',
}
</script>
