import * as types from '@/store/types'

export default {
  methods: {
    fileError () {
      this.$store.commit(
        types.SET_ERROR_MESSAGE,
        'Erreur de fichier, vérifier si les colonnes requises sont présentes'
      )
    },
    async checkFile (file, callback) {
      if (!file || typeof callback !== 'function') {
        return
      }
      if (!file.name.endsWith('.xlsx')) {
        this.$store.commit(types.SET_ERROR_MESSAGE,
          'Un fichier Excel XLSX est attendu')
        return
      }
      await callback(file)
    },
  },
}
