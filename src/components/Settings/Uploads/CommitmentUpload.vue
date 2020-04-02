<template>
  <v-layout row wrap>
    <v-flex xs12 sm6>
      <v-file-input
        label="Télécharger"
        @change="checkFile($event,upload)"
        :loading="loading"
      />
    </v-flex>
    <v-flex xs12 sm6 class="body-2">
      Import d'un fichier Excel (.xlsx) comportant la liste des engagements
      issus de l'infocentre CORIOLIS. Le format à utiliser est celui généré par
      cette requête.
    </v-flex>
  </v-layout>
</template>

<script>
import { excelReadFile } from '@/excel'
import checkFile from './checkFile'
import * as types from '@/store/types'
export default {
  name: 'CommitmentUpload',
  mixins: [checkFile],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async upload (file) {
      const expectedHeaders = [
        'Year',
        'Code',
        'Number',
        'Line',
        'CreationDate',
        'ModificationDate',
        'Name',
        'Value',
        'BeneficiaryCode',
        'BeneficiaryName',
        'IrisCode',
        'Sector',
        'ActionCode',
        'ActionName',
        'SoldOut'
      ]
      const parse = d => ({
        Year: Number(d.Year),
        Code: d.Code,
        Number: Number(d.Number),
        Line: Number(d.Line),
        CreationDate: Number(d.CreationDate),
        ModificationDate: Number(d.ModificationDate),
        CaducityDate: d.CaducityDate ? Number(d.CaducityDate) : null,
        Name: d.Name,
        Value: Number(d.Value),
        BeneficiaryCode: Number(d.BeneficiaryCode),
        BeneficiaryName: d.BeneficiaryName,
        IrisCode: d.IrisCode ? String(d.IrisCode) : null,
        Sector: d.Sector,
        ActionCode: d.ActionCode ? Number(d.ActionCode) : null,
        ActionName: d.ActionName,
        SoldOut: d.SoldOut
      })
      const save = o => {
        this.$store.dispatch(types.UPLOAD_COMMITMENTS, { Commitment: o })
      }
      this.loading = true
      await excelReadFile(file, expectedHeaders, save, this.fileError, parse)
      this.loading = false
    }
  }
}
</script>
