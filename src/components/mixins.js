import { SET_ERROR_MESSAGE } from '@/store/types'

export const yearRule = {
  methods: {
    yearCheck (y) {
      return /^20\d{2}$/.test(y)
    },
    yearRule (y) {
      return this.yearCheck(y) || 'Année attendue de type 2009'
    },
    emptyOrYearRule (y) {
      return y === null || y === '' || y === 0 || this.yearRule(y)
    }
  }
}

export const uintRule = {
  methods: {
    uintCheck (i) {
      return /^(0|[1-9]\d*)$/.test(i)
    },
    uintRule (i) {
      return this.uintCheck(i) || 'Nombre nul ou positif attendu'
    }
  }
}

export const intRule = {
  methods: {
    intCheck (i) {
      return /^-?\d+$/.test(i)
    },
    intRule (i) {
      return this.intCheck(i) || 'Nombre attendu'
    }
  }
}

export const nullUintRule = {
  methods: {
    nullUintCheck (i) {
      return i === null || i === '' || /^[1-9]\d*$/.test(i)
    },
    nullUintRule (i) {
      return this.nullUintCheck(i) || 'Champ vide ou nombre positif attendu'
    }
  }
}

export const ratioRule = {
  methods: {
    ratioCheck (r) {
      return /^(0|100|[1-9]\d?(,\d+)?)$/.test(r)
    },
    ratioRule (r) {
      return this.ratioCheck(r) || 'Pourcentage attendu de type "35,12"'
    }
  }
}

export const chkAndUpload = {
  methods: {
    async chkAndUpload (file, callback) {
      if (!file || typeof callback !== 'function') {
        return
      }
      if (!file.name.endsWith('.xlsx')) {
        this.$store.commit(SET_ERROR_MESSAGE, 'Un fichier Excel XLSX est attendu')
        return
      }
      await callback(file)
    }
  }
}

const curFmt = c => new Intl.NumberFormat(
  'fr-FR',
  { style: 'currency', currency: 'Eur' }
).format(c)

export const currencyFormat = {
  methods: {
    currencyFormat (c) {
      return c ? curFmt(c) : ''
    },
    parseCurrency (c) {
      return c === null || c === '' ? null : this.$parseCurrency(c) * 100
    }
  }
}

export const prevRequired = {
  methods: {
    prevRequired (x) {
      return x !== '' || 'Montant de la prévision nécessaire'
    }
  }
}

export const preProgMethods = {
  methods: {
    preProgAdd () {
      this.item = { ...this.nullItem }
      this.item.ID = ++this.maxID
      this.dlgAction = 'create'
      this.opDlg = true
    },
    preProgModify (item) {
      const i = this.items.find(i => i.ID === item.ID)
      this.item = { ...i }
      this.item.PreProgValue = i.PreProgValue / 100
      this.dlgAction = 'modify'
      this.opDlg = true
    },
    preProgRemove (item) {
      this.item = { ...item }
      this.delDlg = true
    },
    async preProgRemoveConfirm () {
      const idx = this.items.findIndex(i => i.ID === this.item.ID)
      if (this.item.ForecastValue !== null) {
        this.item.PreProgValue = null
        this.item.PreProgComment = null
        this.item.PreProgProject = null
        this.items.splice(idx, 1, this.item)
      } else {
        this.items.splice(idx, 1)
      }
      await this.preProgSave()
    },
    async preProgAddConfirm () {
      if (this.dlgAction === 'create') {
        this.items.push(this.item)
      } else {
        const idx = this.items.findIndex(i => i.ID === this.item.ID)
        this.items.splice(idx, 1, this.item)
      }
      await this.preProgSave()
    },
    forecastCopy (item) {
      const i = this.items.find(i => i.ID === item.ID)
      this.item = { ...i }
      this.item.PreProgValue = i.ForecastValue / 100
      this.item.PreProgComment = i.ForecastComment
      this.item.PreProgProject = i.ForecastProject
      this.dlgAction = 'modify'
      this.opDlg = true
    },
    changeYear (y) {
      this.yearText = y
      if (this.yearCheck(y)) {
        this.year = parseInt(this.yearText)
        this.getPreProg()
      }
    },
    async preProgCancel () {
      await this.getPreProg()
      this.modified = false
    }
  }
}
