<template>
    <div class="metaDataViewAll">
      <div style="float: right">
        <InputText type="text" v-model.lazy.trim="collectionId" class="pad-1"/>
        &nbsp;
        <Button label="View"  @click.prevent="clickedView()" >
          <i class="pi pi-eye"/>
          &nbsp;
          <i class="pi pi-caret-right"/>
        </Button>
      </div>
      <h2>Set-Meta-Daten bearbeiten</h2>
      <OkOrError :error_msg="error_msg" :ok_msg="ok_msg"/>
      <hr/>
      <div class="flex flex-wrap">
        <TabView>
            <TabPanel>
              <template #header>
                Meta-Daten
              </template>

              <div class="flex flex-wrap py-2 gap-2">
                <div>
                <Button @click="saveMetaData()"
                  severity="secondary"
                  icon="pi pi-save"
                  />
                </div>
                <div>
                
                  <Button @click="loadMetaData()"
                    severity="secondary"
                    icon="pi pi-history"
                  />

                </div>

                <div class="py-1 gap-1 flex flex-row bg:surface-200">
                  <div class="px-1 gap-1 flex flex-row bg:surface-200">
                    <div class=""><InputSwitch v-model="show_descs"/></div>
                    <div class="py-2"><i class="pi pi-eye"/>&nbsp;<span>Beschreibung</span></div>
                  </div>

                  <div class="px-1 gap-1 flex flex-row bg:surface-200">
                    <div class=""><InputSwitch v-model="show_hints"/></div>
                    <div class="py-2"><i class="pi pi-eye"/>&nbsp;<span>Hinweise</span></div>
                  </div>

                  <div class="px-1 gap-1 flex flex-row bg:surface-200">
                    <div class=""><InputSwitch v-model="show_keys"/></div>
                    <div class="py-2"><i class="pi pi-eye"/>&nbsp;<span>Schlüssel</span></div>
                  </div>

                </div>
                
              </div>



              <TemplateEntryMetaDataEdit
                resource_key="collection_id"
                :resource_id="collectionId"
                :context_ids="getEditContexts()"
                :meta_data="editMetaData"
                :show_descs="show_descs"
                :show_hints="show_hints"
                :show_keys="show_keys"
                />


            </TabPanel>
            <TabPanel>
              <template #header>
                Berechtigungen
              </template>
              <EntryPermView
               :entry_id="collectionId" />
            </TabPanel>
          </TabView>
      </div>
<!--
      LD: <JsonViewer :value="loadedMetaData" />
      ED: <JsonViewer :value="editMetaData" />
-->
          <!--
        <div>
          <CollectionMetaDataEdit
            :collectionId="collectionId">
          </CollectionMetaDataEdit>
          <hr/>
          <h4>Ergebnis-Ansicht:</h4>
          <MetaDataView
            :collectionId="($route.params.collection_id as string)"
            :mode="'showSummary'">
          </MetaDataView>
          <hr/>
          <br/>
          <br/>
          <br/>
        </div>
          -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import CollectionMetaDataEdit from '../../components/meta-data/CollectionMetaDataEdit.vue'
import TemplateEntryMetaDataEdit from '../../components/meta-data/template/TemplateEntryMetaDataEdit.vue'
import MetaDataView from '../../components/meta-data/MetaDataView.vue'
import OkOrError from '../../components/OkOrError.vue'

import { apiHelper } from '../../modules/api'
import { authHelper } from '../../modules/auth'
import { iGenMetaData, madekHelper } from '../../modules/madek'
import { errorHelper } from '../../modules/error'

import { useMadekStore } from '../../stores/madek_store'


const { api, authParams } = apiHelper()
const { error_msg, ok_msg } = errorHelper()

const route = useRoute()
const router = useRouter()
const madek_store = useMadekStore()

const {
  initMD,
  loadResourceMetaData,
  saveResourceMetaData,
  copyMDInto
} = madekHelper()


const show_descs = ref(false as boolean)
const show_hints = ref(false as boolean)
const show_keys = ref(false as boolean)
const RES_KEY = 'collection_id'
const collectionId = ref('' as string)
const loadedMetaData = ref({} as iGenMetaData)
const editMetaData = ref({} as iGenMetaData)


const clickedView = () => {
  router.push({ path: `/collection/entryList/${collectionId.value}`})
}



const getEditContexts = () => {
  return madek_store.appSettings.contexts_for_collection_edit
}

const loadMetaData = () => {
  initMD(getEditContexts(), editMetaData.value)
  loadResourceMetaData(RES_KEY, collectionId.value, loadedMetaData.value, () => {
      console.log("loaded meta-data")// + JSON.stringify(loadedMetaData.value))
      
      copyMDInto(loadedMetaData.value, editMetaData.value, true)
  })
}

const saveMetaData = () => {
  const loaded = {} as iGenMetaData
  loadResourceMetaData(RES_KEY, collectionId.value, loaded, () => {
  
    saveResourceMetaData(RES_KEY, collectionId.value,
      editMetaData.value, loaded, () => {
        console.log("finished md save")
        updateData()
      })
  })
}

collectionId.value = route.params.collection_id as string

onMounted(() => {
  
  //initMD(getEditContexts(), editMetaData.value)
  loadMetaData()
})

/*  
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
*/
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