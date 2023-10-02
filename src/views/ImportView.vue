<template>
  <div class="import_hub" v-if="checkLoaded()">
    <h3>Starte den Import Wizard</h3>

    <Button
      label="Basis Import"
      icon="pi pi-external-link"
      @click="startBasicImport()"
      size="large"
    />
    <br/>
    <br/>
    <hr/>
    <br />
    <Button
      label="Setze Client-Defaults"
      icon="pi pi-save"
      @click.prevent="showDefaultsEdit = !showDefaultsEdit"
      size="large"
    />
    <br/>

    <Dialog v-model:visible="showDefaultsEdit" class="dialogEditClientDefaults">

      <h3>Setze die Meta-Daten-Defaults:</h3>
      <Button
        icon="pi pi-save"
        label="Speichere Defaults im Browser/Client"
        @click="onSaveMDDefaults()"/>
      <br/>
      <br/>

      <TemplateEntryMetaDataEdit 
        :template="{}"
        :meta_data="mdUserDefaults"
        :context_ids="getContexts()"
        />

    </Dialog>

    <Dialog v-model:visible="showCollectionList">
          <p>
            <span>Wähle ein Set:</span>
          </p>
          <CollectionSelect :collection_list="collectionList" @selected-collection-id="selectCollection"/>
    </Dialog>


    <Dialog v-model:visible="showEditEntry">

      <h4>Meta-Data</h4>
      <Button icon="pi pi-save" @click="onClickedEditEntrySave()"/>
      <p>
        Edit individual Entry: [{{ edit_entry_id }}]
      </p>
      <div>
        <EntryPreview :entry_data="{id: edit_entry_id}" size="small" style="height: 15rem;"/>


        <TemplateEntryMetaDataEdit
            :meta_data="mdEditEntry"
            :resource_key="'media_entry_id'"
            :resource_id="edit_entry_id"
            :context_ids="getContexts()"
          />

      </div>
        
    </Dialog>


    <Dialog v-model:visible="showBasicImport" class="basicImporterDialog" style="width: 85vw;">
      <h3>Basis Import - Schritt {{ showStep }} / 5</h3>
      <div class="importMain">
        <OkOrError :error_msg="error_msg" :ok_msg="ok_msg"/>
        <div class="importNav">
          <Button @click="selectStep(1)" :disabled="showStep == 1">
            <Badge value="1 " />
            &nbsp;
            <span>Defaults</span>
          </Button>
          &nbsp;

          <Button @click="selectStep(2)" :disabled="showStep == 2">
            <Badge value="2 " />
            &nbsp;
            <span>Dateiauswahl</span>
          </Button>
          &nbsp;

          <Button @click="selectStep(3)" :disabled="showStep == 3">
            <Badge value="3 " />
            &nbsp;
            <span>Meta-Daten</span>
          </Button>
          &nbsp;
<!--
          <Button @click="selectStep(4)" :disabled="showStep == 4">
            <Badge value="4 " />
            &nbsp;
            <span>Meta-Daten</span>
          </Button>
          &nbsp;
-->
          <Button @click="selectStep(4)" :disabled="showStep == 4">
            <Badge value="4 " />
            &nbsp;
            <span>Projekt</span>
          </Button>
          &nbsp;

        </div>

        <div class="importView">
          <div v-if="showStep == 1">
            <div>
              <Button
                  icon="pi pi-caret-right"
                  severity="secondary"
                  @click="selectStep(2)"
                  style="float: right;" />

              <h4>Lege die Import-Default-Werte fest:</h4>
              <p>Set defaults to be applied to all imports</p>
                
                <br/>
                <Button
                  v-if="collection_id"
                  label="Speichere die Meta-Daten für das Set"
                  @click="saveCollectionMD()"/>
                <br/>
                <br/>

                <TemplateEntryMetaDataEdit 
                  :meta_data="mdImportDefaults"
                  :context_ids="getContexts()"
                  />
              </div>
            
          </div>
          <div v-if="showStep == 2">
            <div>
              <Button v-if="uploadedEntries.length > 0"
                icon="pi pi-caret-right"
                style="float: right;"
                @click="showStep = 3" />

              <h4>Wähle Dateien aus</h4>

              <p>
                <!--
                 <UploadView
                  @change="onUploadChanged" />    
                 -->
                 
                <UploadViewWebApp
                  @change="onUploadChanged"/>
              </p>
            </div>

            
            
          </div>

          <div v-else-if="showStep == 3">
     
            <h3>Uploaded Entries:</h3>

            <Button label="Apply Defaults to all"
                severity="secondary"
                style="float:right"
                icon="pi pi-edit" 
                @click.prevent="clickedApplyDefaultsAll()"/>

            <EntriesGrid
            v-if="uploadedEntriesShow"
              :entriesList="uploadedEntries"
              :error_map="uploadedEntriesErrorMap"
              :show_actions="true"
              :show_action_list="['edit', 'save']"
              :show_preview="true"
                @clickedEdit="clickedEdit"
                @clickedSave="clickedApplyDefaults"
              />


          </div>
          <!--
          <div v-else-if="showStep == 4">

            <h4>Show Uploads</h4>
            <p>

              <Button label="Apply Defaults to all"
                severity="secondary"
                icon="pi pi-edit" 
                @click.prevent="clickedApplyDefaultsAll()"/>
                &nbsp;

              <Button label="Add all to collection"
                severity="secondary"
                v-if="collection_id"
                icon="pi pi-edit"
                @click.prevent="clickedAddToCollectionAll()"/>
              <br/>
              <br/>

              <DataTable 
                v-if="uploadedEntriesShow"
                :value="uploadedEntries"
                tableStyle="min-width: 50rem">
                <template #header>
                    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                        <span class="text-xl text-900 font-bold">New Media Entries</span>
                        
                    </div>
                </template>

                <Column header="Action">
                    <template #body="slotProps">
                        <div class="flex flex-col">

                            <Button icon="pi pi-pencil" @click.prevent="clickedEdit(slotProps.data.id)"/>
                            <Button icon="pi pi-save" @click.prevent="mediaEntryApplyDefaultsAndSave(slotProps.data)"/>

                            <Button icon="pi pi-plus"
                              v-if="collection_id"
                              @click.prevent="addToCollection(collection_id, slotProps.data.id)"/>
                        </div>
                    </template>
                </Column>

                <Column header="Entry / File">
                    <template #body="slotProps">

                      <span>Published:&nbsp;<Chip>{{ slotProps.data.is_published }}</Chip></span>
                      <br/>
                      <EntryPublishInfo
                          :entry_id="slotProps.data.id" />

                    </template>
                </Column>

                <Column header="MetaData">
                    <template #body="slotProps">

                        <MetaDataView                    
                          :entryId="slotProps.data.id"
                          :mode="uploadedMDShowMode"
                        />
                        
                    </template>
                </Column>

                <Column header="Download">
                    <template #body="slotProps">
                        <FileView :entry_data="slotProps.data"/>
                        
                    </template>
                </Column>

                <template #footer> In total there are {{ uploadedEntries ? uploadedEntries.length : 0 }} entries. </template>
                </DataTable>

              <hr/>
            
            </p>


          </div>
          -->
          <div v-else-if="showStep == 4">
            <h4>Optionales Import Projekt:</h4>
            <p>Lege ein neues Set an, dem die Uploads hinzugefügt werde.</p>
            
            <div v-if="!collection_id">
              <p>
                <span>Titel für neues Set:</span>
                &nbsp;
                <InputText v-model="newColTitle"/>
                &nbsp;
                <Button
                  label="Set anlegen" 
                  @click.prevent="clickedCreateCollection(newColTitle)" />
              </p>
              <br/>

              <p>
                <span>Oder wähle ein existierendes:</span>
                <br/>
                <br/>
                <Button label="Set auswählen..." @click.prevent="clickedShowCollectionList()"/>
              </p>
              <br/>
            </div>
            
            <div v-if="collection_id">
              <p>
                <span>Ausgewählt:</span>
                <br/>
                <span>Titel: <Chip> {{collectionTitle}} </Chip></span>
                <br/>
                <span>ID: <Chip> {{collection_id }} </Chip></span>
                <br/>
                <Button label="Reset" @click.prevent="collection_id = ''"/>
              </p>
            </div>

            <Button label="Add all to collection"
                severity="secondary"
                v-if="collection_id"
                icon="pi pi-edit"
                @click.prevent="clickedAddToCollectionAll()"/>

            <br />


            <h3>Vollständige Einträge:</h3>

            <EntriesGrid
              v-if="uploadedEntriesShow"
              :entriesList="uploadedEntries"
              :error_map="uploadedEntriesErrorMap"
              :show_published="true"
              :show_actions="false"
              :show_preview="true"
                @clickedDelete="resultClickedDelete"
                @clickedEdit="resultClickedEdit"
                @clickedView="resultClickedView"
              />

              <br/>
            <hr/>
            <div v-if="collection_id"
              class="flex flex-row justify-content-between">
              <div class="flex">
                <h3>Entries in the Collection:</h3>
              </div>
              <div class="flex justify-content-end">
                <p>Title:</p>
                <Chip>{{  collectionTitle }}</Chip>
              </div>
              <div class="flex justify-content-end">
                <p>ID:</p>
                <Chip>{{ collection_id }}</Chip>
              </div>
              <div class="flex justify-content-end">
                <Button icon="pi pi-eye" @click.prevent="gotoCollectionEntries(collection_id)" />
              </div>

            
            </div>
            <br/>
            
            
            <CollectionEntriesGrid
              v-if="collection_id && uploadedEntriesShow == true"
              :show_actions="false"
              :show_preview="true"
              :collection_id="collection_id"/>

          </div>
          <div v-else></div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, handleError } from "vue";
import { useRouter } from 'vue-router'

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Chip from "primevue/chip";
import Badge from "primevue/badge";


import { authHelper } from "../modules/auth";
import { apiHelper } from "../modules/api";
import { errorHelper } from "../modules/error";
import { GenMetaData, madekHelper } from "../modules/madek";
import UploadView from '../components/upload_simple/UploadView.vue'
import UploadViewWebApp from "../components/upload_simple/UploadViewWebApp.vue";
import EntryPreview from '../components/files/EntryPreview.vue'

import CollectionSelect from "../components/collections/CollectionSelect.vue";
import { 
  iCollection,
  iMediaEntry,

} from "../api_resources";


import TemplateEntryMetaDataEdit from "../components/meta-data/template/TemplateEntryMetaDataEdit.vue";
import EntriesGrid from "../components/entries/EntriesGrid.vue";
import CollectionEntriesGrid from "../components/collections/CollectionEntriesGrid.vue";
import MetaDataView from "../components/meta-data/MetaDataView.vue";
import EntryPublishInfo from "../components/entries/EntryPublishInfo.vue";
import EntryInfo from "../components/entries/EntryInfo.vue";

import { useMadekStore } from "../stores/madek_store";


const router = useRouter()
const { error_msg, ok_msg, handle_error } = errorHelper()

const { api, authParams } = apiHelper()

const madek_store = useMadekStore()
const { 
  
  MD_PEOPLE,
  MD_KEYWORDS,
  MD_PEOPLE_DATA,
  MD_KEYWORDS_DATA,

  MKEY_TITLE,
  MKEY_AUTHORS,

  checkAllLoaded,

  getMetaKey,
  getCollectionTitle,

  storeMDDefaults,
  getStoredMDDefaults,
  copyMDInto,
  initMD,

  saveResourceMetaData,
  loadResourceMetaData,

  getMetaDataText,
  getMetaDataExtended,
  createMetaDataText,
  createMetaDataTextDate,
  updateMetaDataText,
  updateMetaDataTextDate,
  createMDKeywords,
  createMDPeople,
  deleteMDKeywords,
  deleteMDPeople
} = madekHelper();

const showCollectionList = ref(false as boolean)


const showEditEntry = ref(false as boolean)
const showBasicImport = ref(false as boolean)
const showDefaultsEdit = ref(false as boolean)
const isImportAdvanced = ref(false as boolean)
const showStep = ref(1 as number)
const collection_id = ref('' as string)
const collectionTitle = ref('' as string)
const newColTitle = ref('' as string)

const defaults_meta_data = ref({} as GenMetaData)

const mdUserDefaults = ref({} as GenMetaData)
const mdImportDefaults = ref({} as GenMetaData)
const mdEditEntry = ref({} as GenMetaData)

const me_meta_data = ref({} as GenMetaData)
const edit_entry_id = ref('' as string)

const uploadedEntries = ref(new Array<iMediaEntry>())
const uploadedEntriesMD = ref({} as object)

const uploadedMDShowMode = ref('showCore' as string)

const getContexts = () => {
  return madek_store.appSettings.contexts_for_entry_validation
}


//TODO loaded and uploaded entries MD
const clickedApplyDefaults = (me_id:string) => {
  
  const upme = uploadedEntries.value.find( (me) => { return me.id === me_id })

  if (!upme || !upme.id || !upme.media_file || !upme.media_file.filename) {
    console.error("mediaEntryApplyDefaultsAndSave: invalid upload")
    return
  }
  mediaEntryApplyDefaultsAndSave(upme)
  /*
  copyMDInto(mdImportDefaults.value, uploadedEntriesMD.value[me_id])
  uploadedEntriesMD.value[me_id][MKEY_TITLE].string = upme.media_file.filename
  
  const resKey = 'media_entry_id'
  const resId = me_id
  const meta_data = uploadedEntriesMD.value[me_id]
  const loadedMD = {}//uploadedEntriesMD.value[resId]
  
  loadResourceMetaData(resKey, resId, loadedMD, () => {
      console.log("loaded before save resource md: " + JSON.stringify(loadedMD))
      saveResourceMetaData(resKey, resId, meta_data, loadedMD, () => {
          console.log("saved meta data")
          uploadedEntriesErrorMap.value[me_id] = "saved"
          loadResourceMetaData(resKey, resId, loadedMD, () => {
              
              console.log("reloaded resource md: " + JSON.stringify(loadedMD))
              uploadedEntriesMD.value[resId] = loadedMD
              
              uploadedEntriesReload()
              

          })
      })
  })*/
}

const clickedEdit = (me_id:string) => {
  
  const upme = uploadedEntries.value.find( (me) => { return me.id === me_id })

  if (!upme || !upme.id || !upme.media_file || !upme.media_file.filename) {
    console.error("clickedEdit: invalid upload media entry")
    return
  }

  showEditEntry.value = true

  edit_entry_id.value = me_id;

  mdEditEntry.value = {} as GenMetaData
  copyMDInto(uploadedEntriesMD.value[me_id], mdEditEntry.value)

  copyMDInto(mdImportDefaults.value, mdEditEntry.value)

  mdEditEntry.value[MKEY_TITLE].string = upme.media_file.filename
  
  //uploadedEntriesMD.value[me_id] = mdEditEntry.value

  console.log("applied import defaults resource md: " + JSON.stringify(mdEditEntry.value))
  
}

const uploadedEntriesShow = ref(true as boolean)

const uploadedEntriesReload = () => {
  uploadedEntriesShow.value = false
  setTimeout( () => {
    uploadedEntriesShow.value = true
  }, 100)
}

const onClickedEditEntrySave = () => {
  console.log("onClickedEditEntrySave: ")

  //editInterface.build()

  
  const resKey = 'media_entry_id'
  const resId = edit_entry_id.value
  const meta_data = mdEditEntry.value//me_meta_data.value
  const loadedMD = {}//uploadedEntriesMD.value[resId]
  
  loadResourceMetaData(resKey, resId, loadedMD, () => {
      console.log("loaded before save resource md: " + JSON.stringify(loadedMD))
      saveResourceMetaData(resKey, resId, meta_data, loadedMD, () => {
          console.log("saved meta data")
          uploadedEntriesErrorMap.value[resId] = "saved"

          tryPublish(resId, (result) => {
            console.log("tried publish MD: " + JSON.stringify(result))
            uploadedEntriesErrorMap.value[resId] = "vollständig"
            const loadedMD = {}
            loadResourceMetaData(resKey, resId, loadedMD, () => {
              console.log("reloaded resource md: " + JSON.stringify(loadedMD))
              uploadedEntriesMD.value[resId] = loadedMD
            })
            
            uploadedEntriesReload()
            edit_entry_id.value = ''
            showEditEntry.value = false
          })
          /*
          loadResourceMetaData(resKey, resId, loadedMD, () => {
              
              console.log("reloaded resource md: " + JSON.stringify(loadedMD))
              uploadedEntriesMD.value[resId] = loadedMD
              
              uploadedEntriesReload()
              

          })
          */
      })
  })
  

}

const saveCollectionMD = () => {
  console.log("saveCollectionMD: ")
  //TODO overwrite flag ?!?

  const resKey = 'collection_id'
  const resId = collection_id.value
  const meta_data = mdImportDefaults.value
  const loadedMD = {}
  loadResourceMetaData(resKey, resId, loadedMD, () => {
    console.log("loaded collection md: " + JSON.stringify(loadedMD))
  
    saveResourceMetaData(resKey, resId, meta_data, loadedMD, () => {
      console.log("saved collection md: " + JSON.stringify(loadedMD))
    })
  })
}


const mediaEntrySaveMetaData = (meId: string, meta_data: any, cbOK:any) => {
  const loadedMD = {}
  
  loadResourceMetaData('media_entry_id', meId, loadedMD, () => {
    console.log("loaded resource md: " + JSON.stringify(loadedMD))

    saveResourceMetaData('media_entry_id', meId, meta_data, loadedMD, () => {
      
      console.log("saved resource md: " + meId)
      uploadedMDShowMode.value = 'showCore'
    
      if (cbOK) cbOK(meId)


    })
  })  
}

const tryPublish = (me_id: string, cbOK: any) => {
  api.api.mediaEntryPublishUpdate(me_id, authParams?.value)
      .then(resp => {
          console.log("publish result: " + me_id + "\n data:\n " + JSON.stringify(resp.data))
          
          if (cbOK) cbOK(resp.data)
          
      })
}
const mediaEntryApplyDefaultsAndSave = (upme:any) => {

  
  if (!upme || !upme.id || !upme.media_file || !upme.media_file.filename) {
    console.error("mediaEntryApplyDefaultsAndSave: invalid upload")
    return
  }

// TODO use already loaded or edited md as base

  const meta_data = {}
  copyMDInto(mdImportDefaults.value, meta_data)

  const me_id = upme.id

  meta_data[MKEY_TITLE].string = upme.media_file.filename

  mediaEntrySaveMetaData(me_id, meta_data, () => {
    console.log("save MD")
    uploadedEntriesErrorMap.value[me_id] = "saved"

    tryPublish(me_id, (result) => {
      console.log("tried publish MD")
      uploadedEntriesErrorMap.value[me_id] = "vollständig"
      const loadedMD = {}
      loadResourceMetaData('media_entry_id', me_id, loadedMD, () => {
        console.log("reloaded resource md: " + JSON.stringify(loadedMD))
        uploadedEntriesMD.value[me_id] = loadedMD
      })
      
      uploadedEntriesReload()
    })
    
  })
}


const clickedPublishAll = () => {
  uploadedEntries.value.forEach((me) => {
    const me_id = me.id
    tryPublish(me_id, () => {
        uploadedMDShowMode.value = 'showCore'
        me.is_published = true
        uploadedEntriesReload()
    })
  })
}

const clickedAddToCollectionAll = () => {
  uploadedEntries.value.forEach((me) => {
    const me_id = me.id
    addToCollection(collection_id.value, me_id)
  })
}

const clickedApplyDefaultsAll = () => {
  
  uploadedEntries.value.forEach((me) => {
    mediaEntryApplyDefaultsAndSave(me)
  })
}

const uploadedEntriesErrorMap = ref({})

function addToCollection(collectionId: string, me_id:string) {
	const body = { position: 0 };
	
	api.api.collectionMediaEntryArcCreate(collectionId,
		me_id,
		body,
		authParams?.value)
	.then(resp => {
		console.log("entry added to collection" + JSON.stringify(resp.data))
    uploadedEntriesReload()
    uploadedEntriesErrorMap.value[me_id] = "Added to collection"
	}).catch(error => {
    uploadedEntriesErrorMap.value[me_id] = "Could not add to collection"
    handle_error("Could not add media entry " + me_id + " to collection: " + collectionId, error)
		//console.error("Could not add media entry " + me_id + " to collection: " + collectionId + " error: " + JSON.stringify(error))
	})
}


const onUploadChanged = (entryId: string) => {
  console.log("onUploadChanged: " + entryId)

  

  // check if it already has meta data
  const me_id = entryId
  api.api.mediaEntryDetail(me_id, authParams?.value)
    .then(eresp => {
      const entry = eresp.data
      api.api.mediaEntryMediaFileDetail(me_id, authParams?.value)
        .then(fresp => {
          const file = fresp.data
          entry.media_file = file
          uploadedEntries.value.push(entry)
        })
      
    })
  const loadedMD = {}
  loadResourceMetaData('media_entry_id', me_id, loadedMD, () => {
    console.log("loaded resource: " + me_id + " md: " + JSON.stringify(loadedMD))
    uploadedEntriesMD.value[me_id] = loadedMD
  })
}

const updateCollectionTitle = () => {
  getCollectionTitle(collection_id.value, (title:string) => {
    collectionTitle.value = title;

    mdUserDefaults.value[MKEY_TITLE]['string'] = title
    importMDDefaultsIF.import()
  })
}

const selectStep = (n: number) => {
  showStep.value = n
  
}


const clickedCreateCollection = (newTitle: string) => {
  
  api.api.collectionCreate({},authParams?.value)
    .then(resp => {
      collection_id.value = resp.data.id

      
      createMetaDataText('collection_id', collection_id.value, MKEY_TITLE, newTitle,
        (mdjson:object) => {
          console.log("Created new col title: " + mdjson)
          collectionTitle.value = newTitle
        },
        (error:any) => {
          console.error("Could not apply new collection title: " + error)
        })
    })
}

const collectionList = ref([] as iCollection[])

const updateCollectionList = () => {
    //reset_error()
    const query = {
      full_data: true,
      me_edit_metadata_and_relations: true,
    }
    
    api.api.collectionsList(query, authParams?.value)
    .then(result =>{
      collectionList.value = result.data.collections;
    })
}

const clickedShowCollectionList = () => {
  updateCollectionList()
  showCollectionList.value = true
}

const selectCollection = (colId: string) => {
  console.log("selectCollection: " + colId)
  collection_id.value = colId
  updateCollectionTitle()
  showCollectionList.value = false
}





const onSaveMDDefaults = () => {
  userMDDefaultsIF.build()
  storeMDDefaults(mdUserDefaults.value)
}    

const checkLoaded = () => {
    let result = true;
    result = checkAllLoaded()
    // create template ds
    if (result == true) {

      if (!defaults_meta_data.value[MKEY_TITLE]) {
        defaults_meta_data.value = getStoredMDDefaults()
        //initMD(getContexts(), mdUserDefaults.value)
        copyMDInto(defaults_meta_data.value, mdUserDefaults.value)
      }
      
    }
    return result
}

const gotoCollectionEntries = (colId:string) => {
  debugger
  router.push({ path: `/collection/entryList/${colId}`})
}

const startBasicImport = () => {
  showBasicImport.value = true
  copyMDInto(mdUserDefaults.value, mdImportDefaults.value, true)
  
  
}

onMounted(() => {

})


</script>
<style scoped>
.basicImporterDialog {
  width: 85vw;
}
.importMain {
  padding-left: 0.5em;
  padding-right: 0.5em;
  /*
  border: 1px solid red;
  */

  min-height: 10em;
  height: 70vh;
  width: 100%;
}
.importNav {
  position: relative;
  padding-left: 0.5em;
  padding-right: 0.5em;
  float: left;
}
.importView {
  position: relative;
  padding-left: 0.5em;
  padding-right: 0.5em;
  float: left;
  width: 100%;
  min-height: 10em;
}
.p-inputtext {
  padding: 0.7rem;
}
.p-dialog .dialogEditClientDefaults {
  width: 40rem;
}
</style>
