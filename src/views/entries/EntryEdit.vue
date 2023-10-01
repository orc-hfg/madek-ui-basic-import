<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiHelper } from '../../modules/api'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import EntryMetaDataEdit from '../../components/meta-data/EntryMetaDataEdit.vue'
import Chip from 'primevue/chip'
import SelectButton from 'primevue/selectbutton'
import { GenMetaData, madekHelper } from '../../modules/madek'
import { errorHelper } from '../../modules/error'
import { iMediaEntry, iMetaData, iPerson, iPublishableResult, iUser } from '../../api_resources'
import EntryPermView from '../../components/entries/EntryPermView.vue'
import EntryPreview from '../../components/files/EntryPreview.vue'
import EntryPublishInfo from '../../components/entries/EntryPublishInfo.vue'
import TemplateEntryMetaDataEdit from '../../components/meta-data/template/TemplateEntryMetaDataEdit.vue'
import { useMadekStore } from '../../stores/madek_store'

const route = useRoute()
const router = useRouter()

const { api, authParams } = apiHelper()
const { 
  
  
  
  initMD,
  loadResourceMetaData,
  saveResourceMetaData,
  copyMDInto,
  checkPublishableMetaData } = madekHelper()

const madek_store = useMadekStore()

const { error_msg, handle_error, reset_error} = errorHelper()

const mediaEntryId = ref('' as string)
const mediaEntryDetails = ref({} as iMediaEntry)

const personCreator = ref({} as iPerson)
const personResponsible = ref({} as iPerson)

const publish_result = ref({} as iPublishableResult)
const metaDataMap = ref(new Map<string,iMetaData>)

const show_descs = ref(false as boolean)
const show_hints = ref(false as boolean)
const loadedMetaData = ref({} as GenMetaData)
const editMetaData = ref({} as GenMetaData)

const getEditContexts = () => {
  return madek_store.appSettings.contexts_for_entry_edit
}
const getPersonId4User = (userId: string, cb: any) => {
    api.api.usersDetail(userId, authParams?.value)
        .then(resp => {
          const user = resp.data as iUser
          cb(user.person_id)
        })
}

const updatePersonData = (entry: iMediaEntry) => {
  getPersonId4User(entry.creator_id, (pid: string) => {
      api.api.peopleDetail(pid, authParams?.value)
          .then(resp => {
            personCreator.value = resp.data as iPerson
          })
  })

  getPersonId4User(entry.responsible_user_id, (pid: string) => {
      api.api.peopleDetail(pid, authParams?.value)
          .then(resp => {
            personResponsible.value = resp.data as iPerson
          })
  })

} 

const loadMetaData = () => {
  loadResourceMetaData('media_entry_id', mediaEntryId.value, loadedMetaData.value, () => {
      console.log("loaded meta-data")// + JSON.stringify(loadedMetaData.value))
      initMD(getEditContexts(), editMetaData.value)
      copyMDInto(loadedMetaData.value, editMetaData.value, true)
  })
}

const saveMetaData = () => {
  saveResourceMetaData('media_entry_id', mediaEntryId.value,
    editMetaData.value, loadedMetaData.value, () => {
      console.log("finished md save")
      updateData()
    })
}
const updateData = () => {
    reset_error()
    mediaEntryId.value = route.params.entry_id as string

    api.api.mediaEntryDetail(mediaEntryId.value, authParams?.value)
      .then(resp => {
        mediaEntryDetails.value = resp.data

        updatePersonData(resp.data as iMediaEntry)

        if (mediaEntryDetails.value.is_published != true) {

          api.api.mediaEntryMetaDataDetail(mediaEntryId.value, {}, authParams?.value)
            .then(result => {
              const metaData = result.data['meta-data']
              metaDataMap.value.clear()
              metaData.map(md => {
                metaDataMap.value.set(md.meta_key_id, md)
              })

              publish_result.value = checkPublishableMetaData(metaDataMap.value)
              if (publish_result.value.publishable == true) {

                api.api.mediaEntryPublishUpdate(mediaEntryId.value, authParams?.value)
                
                  .then(resp => {

                    console.log("got publish result : " + JSON.stringify(resp.data))
                    if (resp.data.is_published == true) {

                      console.log("got success publish result : ")
                      updateData()
                    }
                    
                  })
              }
            })
            .catch(error => handle_error('get MetaData: ', error))
            
        }
      })
      .catch(error => {
        handle_error("get mediaEntryDetail", error)
      })

      setTimeout(() => {
        
      }, 200)
      
      loadMetaData()
      
}

const clickedView = () => {
  router.push({ path: `/entry/view/${mediaEntryId.value}`})
}



onMounted(() => {
  initMD(getEditContexts(), editMetaData.value)
  updateData()
  
})


</script>

<template>
    <div class="mediaEntryEdit">
      <div style="float: right">
        <InputText type="text" v-model.lazy.trim="mediaEntryId" class="pad-1"/>
        &nbsp;
        <Button label="View"  @click.prevent="clickedView()" >
          <i class="pi pi-eye"/>
          &nbsp;
          <i class="pi pi-caret-right"/>
        </Button>
      </div>
      <h2>Medien Eintrag bearbeiten:</h2>
      
      <p severity="danger" v-if="error_msg">ERROR: {{ error_msg }}</p>    
        
      <hr/>

      <div class="flex flex-wrap">
        
        <div class="col-4 lg:h-20rem sm:h-10rem sm:col-12 md:col-4 lg:col-3 border-1 surface-border border-round px-1 py-1" >
          <EntryPreview :entry_data="mediaEntryDetails" class=""/>
        </div>

        <div class="col-8 md:col-12 lg:col-9 border-1 surface-border border-round px-3 py-1">
          <TabView>
            <TabPanel>
              <template #header>
                Meta-Daten
              </template>

              <div class="flex flex-wrap py-2">
                <Button @click="saveMetaData()"
                  severity="secondary"
                  icon="pi pi-save"
                  />
                  &nbsp;
                  <Button @click="loadMetaData()"
                    severity="secondary"
                    icon="pi pi-history"
                  />

                  <div class="px-2" severity="danger">
                    <span >Zeige Beschreibungen:</span>
                    &nbsp;
                    <InputSwitch v-model="show_descs"/>
                    &nbsp;
                  </div>

                  

                  <div class="px-1">
                    Zeige Hinweise
                    &nbsp;
                  <InputSwitch v-model="show_hints"/>
                </div>
              </div>

              <div v-if="mediaEntryDetails.is_published != true">
                
                <h4>Unvollstängide Meta-Daten!</h4>
                <EntryPublishInfo
                    :entry_id="mediaEntryId"
                    :publish_result="publish_result"/>
                    <hr/>
              </div>


              <TemplateEntryMetaDataEdit
                :context_ids="getEditContexts()"
                :meta_data="editMetaData"
                :publish_result="publish_result"
                :show_descs="show_descs"
                :show_hints="show_hints"
                />

<!--              
              LD<JsonViewer :value="loadedMetaData" />
              ED<JsonViewer :value="editMetaData" />

              LD<JsonViewer v-if="loadedMetaData['madek_core:keywords']" :value="loadedMetaData['madek_core:keywords']"/>
              ED<JsonViewer v-if="editMetaData['madek_core:keywords']" :value="editMetaData['madek_core:keywords']" />

              LD<JsonViewer v-if="loadedMetaData['madek_core:authors']" :value="loadedMetaData['madek_core:authors']" />
              ED<JsonViewer v-if="editMetaData['madek_core:authors']" :value="editMetaData['madek_core:authors']" />
-->
            </TabPanel>
            <TabPanel
            v-if="mediaEntryDetails.is_published == true">
              <template #header>
                Berechtigungen
              </template>
              <EntryPermView
            :entry_id="mediaEntryId" />
            </TabPanel>
          </TabView>
        </div>
<!--
        <div class="col-8 md:col-12 lg:col-9 border-1 surface-border border-round px-3 py-1">
          

          <h3>Meta-Daten bearbeiten
            <Button @click="saveMetaData()"
          icon="pi pi-save"
          style="float: right;"
          />
          </h3>

        
          <div v-if="mediaEntryDetails.is_published != true">
            
            <h4>Unvollstängide Meta-Daten!</h4>
            <EntryPublishInfo
                :entry_id="mediaEntryId"
                :publish_result="publish_result"/>
                <hr/>
          </div>
          
          <TemplateEntryMetaDataEdit
            
            :context_ids="getEditContexts()"
            :template="templateEditMetaData"
            :meta_data="editMetaData"
            :publish_result="publish_result"
            />

        </div>

        <div class="col-12 border-1 surface-border border-round px-1 py-1"
          v-if="mediaEntryDetails.is_published == true">

          <h3>Berechtigungen:</h3>
          <EntryPermView
            :entry_id="mediaEntryId" />
        </div>
        -->
<!--
        LD: <JsonViewer :value="loadedMetaData" />
        TEMP: <JsonViewer :value="templateEditMetaData" />
        ED: <JsonViewer :value="editMetaData" />


        

        

        <EntryMetaDataEdit :mediaEntryId="mediaEntryId"></EntryMetaDataEdit>
    -->    
        
    
        <br/>
        <hr/>
      </div>
  </div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.preview {
  width: 100%;
  
  height: 100%;
  border: 1px solid lightgray;
}
.ippad-small {
  padding: 0.7rem;
}
input {
    width: 24em;
    
}
</style>