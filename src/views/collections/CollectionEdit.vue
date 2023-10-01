<template>
    <div class="metaDataViewAll">
      <h2>Set-Meta-Daten bearbeiten</h2>
        <div>
            
            <Button label="View" @click="$router.push({path: `/collection/view/${collectionId}`})" style="float: right"/>
            <InputText type="text" v-model.lazy.trim="collectionId" style="float: right"/>
            <p style="float: right">Set Id:</p>
            
        </div>
        <br/>
        <br/>
        <br/>
      
        <div>
    
          
          <hr/>
          <CollectionMetaDataEdit
            :collectionId="($route.params.collection_id as string)">
          </CollectionMetaDataEdit>
          <hr/>
          <!--
          <h4>Ergebnis-Ansicht:</h4>
          <MetaDataView
            :collectionId="($route.params.collection_id as string)"
            :mode="'showSummary'">
          </MetaDataView>

          <hr/>
          -->
          <br/>
          <br/>
          <br/>
        </div>
    </div>
</template>

<script lang="ts">

import { hasOwn } from '@vue/shared'
import { defineComponent } from 'vue'

import { 
  iAppSettings,
  iCollection,
  iContext,
  iContextKey,
  iKeyword,
  iMetaData,
  iMetaKey,
  iPerson,
  iVocabulary
} from '../../api_resources'

import CollectionMetaDataEdit from '../../components/meta-data/CollectionMetaDataEdit.vue'
import MetaDataView from '../../components/meta-data/MetaDataView.vue'
import { apiHelper } from '../../modules/api'
import { authHelper } from '../../modules/auth'
import { madekHelper } from '../../modules/madek'

const { authParams } = authHelper()
const { api } = apiHelper()
const {
  
  
  } = madekHelper()

  
export default defineComponent({
  name: 'CollectionEdit',

  components: {
    CollectionMetaDataEdit: CollectionMetaDataEdit,
    MetaDataView: MetaDataView
  },
  data () {
    return {
      error_msg: 'on error' as string,
      //showAppSettings: false,
      //showCollectionList: false,
      //collectionList: [] as iCollection[],

      collectionId: '' as string,
      col_me_get_metadata_and_previews: true,
      col_me_get_full_size: true,
      col_public_get_metadata_and_previews: true,
      
      
      
    }
  },
  mounted () {
    
    this.collectionId = this.$route.params.collection_id as string
    this.updateData()
  },
  
  methods: {
    handle_error (msg:string, error:Response) {
      const mmsg = 'ERROR: ' + msg + ' status: ' + error.status
      console.error(mmsg)
      this.error_msg = mmsg
    },
    reset_error () { this.error_msg = 'no error' },
    
    updateData () {
  
    },
  

  }
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
    width: 24em;

}
img {
  width: 10em;
  height: auto;
}
</style>