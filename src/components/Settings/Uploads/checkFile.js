import * as types from '@/store/types'

export default {
  methods: {
    fileError () {
      this.$store.commit(
        types.SET_ERROR_MESSAGE,
        'Erreur de chargement de fichier, vérifier si les colonnes requises sont présentes'
      )
    },
    checkFile (file, callback) {
      if (!file) {
        return
      }
      if (!file.name.endsWith('.xlsx')) {
        this.$store.commit(types.SET_ERROR_MESSAGE, 'Fichier XLSX attendu')
        return
      }
      callback(file)
    }
  }
}
