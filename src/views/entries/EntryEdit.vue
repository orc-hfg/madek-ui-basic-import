<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiHelper } from '../../modules/api'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import EntryMetaDataEdit from '../../components/meta-data/EntryMetaDataEdit.vue'
import Chip from 'primevue/chip'
import SelectButton from 'primevue/selectbutton'
import { iGenMetaData, madekHelper } from '../../modules/madek'
import { errorHelper } from '../../modules/error'
import { iMediaEntry, iMetaData, iPerson, iPublishableResult, iUser } from '../../api_resources'
import EntryPermView from '../../components/entries/EntryPermView.vue'
import EntryPreview from '../../components/files/EntryPreview.vue'
import EntryPublishInfo from '../../components/entries/EntryPublishInfo.vue'
import TemplateEntryMetaDataEdit from '../../components/meta-data/template/TemplateEntryMetaDataEdit.vue'
import { useMadekStore } from '../../stores/madek_store'
import { useMetadataStore } from '../../stores/metadata_store'
import OkOrError from '../../components/OkOrError.vue'

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

const { error_msg, ok_msg, handle_error, reset_error, timed_handle_ok, timed_handle_error } = errorHelper()

const mediaEntryId = ref('' as string)
const mediaEntryDetails = ref({} as iMediaEntry)

const personCreator = ref({} as iPerson)
const personResponsible = ref({} as iPerson)

const publish_result = ref({} as iPublishableResult)
const metaDataMap = ref(new Map<string,iMetaData>)

const show_descs = ref(false as boolean)
const show_hints = ref(false as boolean)
const show_keys = ref(false as boolean)
const loadedMetaData = ref({} as iGenMetaData)
const editMetaData = ref({} as iGenMetaData)
const mdStore = useMetadataStore()


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

const RES_KEY = 'media_entry_id'

const loadMetaData = () => {
  initMD(getEditContexts(), editMetaData.value)
  mdStore.getCachedMetaDataRelated(RES_KEY, mediaEntryId.value, true, (data) => {
  //loadResourceMetaData('media_entry_id', mediaEntryId.value, loadedMetaData.value, () => {
      console.log("got meta-data")// + JSON.stringify(loadedMetaData.value))
      loadedMetaData.value = data
      copyMDInto(loadedMetaData.value, editMetaData.value, true)
  }, (error) => timed_handle_error("Could not get meta data.", error))
}

const saveMetaData = () => {
  //const loaded = {} as iGenMetaData
  //loadResourceMetaData('media_entry_id', mediaEntryId.value, loaded, () => {
  mdStore.getCachedMetaDataRelated(RES_KEY, mediaEntryId.value, true, (loaded) => {
  
    saveResourceMetaData('media_entry_id', mediaEntryId.value,
      editMetaData.value, loaded, () => {
        console.log("finished md save")
        updateData()
      })
  }, (error) => timed_handle_error("Could not get meta data.", error))
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
              const metaData = result.data.meta_data; //['meta-data']
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
      <OkOrError :error_msg="error_msg" :ok_msg="ok_msg"/>
      <hr/>

      <div class="flex flex-wrap">
        
        <div class="col-12 lg:h-20rem sm:h-13rem sm:col-6 md:col-4 lg:col-3 border-1 surface-border border-round px-1 py-1" >
          <EntryPreview :entry_data="mediaEntryDetails" class=""/>
        </div>

        <div class="col-12 md:col-12 lg:col-9 border-1 surface-border border-round px-3 py-1">
          
          
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

              <div v-if="mediaEntryDetails.is_published != true">
                
                <h4>Unvollstängide Meta-Daten!</h4>
                <EntryPublishInfo
                    :entry_id="mediaEntryId"
                    :publish_result="publish_result"/>
                    <hr/>
              </div>


              <TemplateEntryMetaDataEdit
                resource_key="media_entry_id"
                :resource_id="mediaEntryId"
                :context_ids="getEditContexts()"
                :meta_data="editMetaData"
                :publish_result="publish_result"
                :show_descs="show_descs"
                :show_hints="show_hints"
                :show_keys="show_keys"
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