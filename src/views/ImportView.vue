<template>
  <div class="import_hub">
    <h3>Starte den Import Wizard</h3>

    <OkOrError :error_msg="error_msg" :ok_msg="ok_msg" class="messages" />

    <Button
      label="Basis Import"
      icon="pi pi-external-link"
      @click="startBasicImport()"
      size="large"
    />
    <br/>
    <br/>
    <hr/>
    <Message severity="info">
    Allgemeine Metadaten können bei jedem Import automatisch an alle Medieneinträge vergeben werden. Du kannst Deine Medieneinträge später individuell anpassen.
    </Message>

    <br />
    <Button
      label="Setze Allgemeine Meta-Daten"
      icon="pi pi-save"
      @click.prevent="showDefaultsEdit = !showDefaultsEdit"
      size="large"
    />
    <br/>
    <Message severity="warn">
      Hinweis: die allgemeinen Metadaten werden in Deinem Browser-Cookie gespeichert. Wenn Du Deine Cookies löschst, gehen die Einstellungen verloren.
    </Message>
    <p></p>

    <Dialog 
      header="Setze die allgemeinen Metadaten:"
      modal
      v-model:visible="showDefaultsEdit" 
      class="dialogEditClientDefaults">
      
      <TemplateEntryMetaDataEdit 

        :template="{}"
        :meta_data="mdUserDefaults"
        :context_ids="getContexts()"
        :show_keys="false"
        
        />
      <br/>

      <Button
        icon="pi pi-save"
        style="float: right;"
        label="Allgemeine Metadaten speichern"
        @click="onSaveMDDefaults()"/>

      <br/>
    </Dialog>

    <Dialog v-model:visible="showCollectionList"
      header="Wähle ein Set"
      modal>
      
      <CollectionSelect :collection_list="collectionList" @selected-collection-id="selectCollection"/>
    </Dialog>


    <Dialog v-model:visible="showEditEntry"
      modal
      header="Metadaten bearbeiten">

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
            :hide_meta_keys="hide_meta_keys_map"
          />

      </div>
        
    </Dialog>


    <Dialog 
      v-model:visible="showBasicImport"
      maximizable modal 
      class="basicImporterDialog" style="width: 85vw;"
      :header="'Basis Import - Schritt ' + showStep + ' / 4'">
      
      <div class="importMain">
        <OkOrError :error_msg="error_msg" :ok_msg="ok_msg"/>
        <div class="flex flex-row flex-wrap gap-2 importNav">
          <Button @click="selectStep(1)" :disabled="!isEnabledStep(1)">
            <Badge value="1 " />
            &nbsp;
            <span>Dateiauswahl</span>
          </Button>

          <Button @click="selectStep(2)" :disabled="!isEnabledStep(2)">
            <Badge value="2 " />
            &nbsp;
            <span>Defaults</span>
          </Button>

          <Button @click="selectStep(3)" :disabled="!isEnabledStep(3)">
            <Badge value="3 " />
            &nbsp;
            <span>Meta-Daten</span>
          </Button>

          <Button @click="selectStep(4)" :disabled="!isEnabledStep(4)">
            <Badge value="4 " />
            &nbsp;
            <span>Projekt / Set</span>
          </Button>
          
          <Button @click="selectStep(5)" :disabled="!isEnabledStep(5)">
            <Badge value="5 " />
            &nbsp;
            <span>Fertig</span>
          </Button>
          
        </div>

        <div class="importView">
          <div v-if="showStep == 1">
            <div>
              <!--  IAU {{ isAllUploaded() }}-->
              <Button v-if="uploadedEntries.length > 0"
                icon="pi pi-caret-right"
                style="float: right;"
                @click="showStep = 2" />
              <h4>Wähle Dateien für den Import aus</h4>
              <p>
                <!--
                 <UploadView
                  @change="onUploadChanged" />    
                 -->
                <UploadViewWebApp
                  @change="onUploadChanged"
                  @selected="onSelectedFiles"/>
              </p>
            </div>
          </div>
          <div v-if="showStep == 2">
            <div>
              
              <Button
                  severity="primary"
                  @click="selectStep(3)"
                  style="float: right;" >
                  individuelle Metadaten...
                  <i class="pi pi-caret-right"/>
              </Button>
              
              <Button label="Apply Defaults to all"
                severity="secondary"
                style="float: right;"
                v-if="uploadedEntries.length !== 0"
                
                @click.prevent="clickedApplyDefaultsAll()">

                Allgemeine Metadaten zuweisen...
                <i class="pi pi-caret-right"/>
              </Button>

              <h4>Lege die Import-Default-Werte fest:</h4>
              <Message severity="info">
                Du kannst allgemeine Metadaten für diesen Import anpassen, die allen, oder auch einzelnen Medieneinträgen zugewiesen werden können.
                Du kann den Titel durch die importierten Dateinamen setzen lassen, oder einen gemeinsamen für alle Import-Elemente definieren.
              </Message>

              <div class="py-2">
                

                <Button
                  v-if="hide_meta_keys_map[MKEY_TITLE] != true"
                  @click.prevent="hide_meta_keys_map[MKEY_TITLE] = true">
                  Titel aus Dateinamen
                </Button>
                <Button
                  v-if="hide_meta_keys_map[MKEY_TITLE] == true"
                  @click.prevent="hide_meta_keys_map[MKEY_TITLE] = false">
                  Titel vergeben
                </Button>
              </div>
              
                
               
                <TemplateEntryMetaDataEdit 
                  :meta_data="mdImportDefaults"
                  :context_ids="getContexts()"
                  :hide_meta_keys="hide_meta_keys_map"
                  />
              </div>
          </div>
          <div v-else-if="showStep == 3">
            <div class="flex flex-wrap">
              <h4>Importierte Medieneinträge:</h4>
            </div>
            <Message severity="info">
              Gezeigt werden Deine importierten Medieneinträge mit den zugewiesenen Metadaten.
              Einzelne Einträge können individuell angepasst werden,
              oder mit den zuvor definierten Default-Werten überschrieben werden.
            </Message>

            <div class="flex flex-wrap justify-content-end py-2">
              
              &nbsp;
                <Button
                  icon="pi pi-caret-right"
                  severity="primary"
                  @click="selectStep(4)"
                  style="float: right;" />
            </div>

            <EntriesGrid
            v-if="uploadedEntriesShow"
              :entriesList="uploadedEntries"
              :error_map="uploadedEntriesErrorMap"
              :show_actions="true"
              :show_action_list="['edit', 'save']"
              :force-reload="true"
              :show_preview="true"
                @clickedEdit="clickedEdit"
                @clickedSave="clickedApplyDefaults"
              />


          </div>
       
          <div v-else-if="showStep == 4">

            <div v-if="!collection_id"
              class="flex flex-column">
              <div class="flex flex-column">
                <h4>Neues Projekt erstellen</h4>
                <Message severity="info">
                  Du kannst ein neues Projekt für diesen Import anlegen. Dadurch wird ein neues Set erstellt und kann mit Deinen hochgeladenen Dateien verknüpft werden.
                </Message>
              </div>

              <div class="flex flex-row">
                <div class="flex py-0">
                  <InputText v-model="newColTitle"
                    placeholder="Name des Projekts"/>
                </div>
                <div class="flex px-2">
                  <Button
                    v-if="newColTitle && newColTitle.length != 0"
                    label="Neues Projekt anlegen" 
                    @click.prevent="clickedCreateCollection(newColTitle)" />
                </div>
              </div>

              <div class="flex flex-column">
                <h4>Vorhandenes Set wählen</h4>
                <Message severity="info">
                  Alternativ kannst Du ein vorhandenes Set auswählen. Deine hochgeladenen Dateien können dann mit diesem Set verknüpft werden.
                </Message>
                <div class="">
                  <Button label="Set auswählen..." @click.prevent="clickedShowCollectionList()"/>
                </div>
              </div>

            </div>
            
            
            <div v-if="collection_id"
              class="flex flex-column">
              <div class="flex flex-column">
                <h4>Gewähltes Set:</h4>
              </div>
              <div class="flex flex-row py-1 gap-3">

                <div class="py-2"><span>Titel:</span>&nbsp;<Chip class="col-chip">{{collectionTitle}} </Chip></div>
                <div class="py-2"><span>ID:</span>&nbsp;<Chip class="col-chip">{{collection_id }} </Chip></div>
                <div class="py-0">
                  <Button label="Andere Auswahl..." @click.prevent="collection_id = ''"/>
                </div>
                <div class="py-0">
                  <Button 
                    style="float: right;"
                    severity="secondary"
                    v-if="collection_id && uploadedEntries.length !== 0"
                    
                    @click.prevent="clickedAddToCollectionAll()">
                    Zum Set Hinzufügen

                    <!--<i class="pi pi-caret-right"/>-->
                  </Button>
                </div>
              </div>
              
            </div>

<!--
            <Button
              v-if="collection_id"
              label="Speichere die Meta-Daten für das Set"
              @click="saveCollectionMD()"/>
-->

            <h3>Vollständige Einträge:</h3>
            <Message severity="info">
            Nur vollständige Medieneinträge können zu einem Set hinzugefügt werden.
            </Message>


            <EntriesGrid
              v-if="uploadedEntriesShow"
              :entriesList="uploadedEntries"
              :error_map="uploadedEntriesErrorMap"
              :show_published="true"
              :show_actions="false"
              :show_preview="true"
              force-reload="true"
                @clickedDelete="resultClickedDelete"
                @clickedEdit="resultClickedEdit"
                @clickedView="resultClickedView"
              />

              <br/>
            <hr/>
           
            <br/>
            
            
          

          </div>
          <div v-else-if="showStep == 5">
            <h4>Fertig</h4>
            <div class="flex flex-column gap-3">
              <div class="flex flex-wrap">
                <Button @click.prevent="gotoUserEntries()">
                  <i class="pi pi-eye"/>
                  &nbsp;
                  Fertig, gehe zur Liste Deiner Medieneinträge für weitere Aktionen.
                  &nbsp;
                  <i class="pi pi-caret-right"/>
                </Button>
              </div>
              <div class="flex flex-wrap">
                <Button @click.prevent="gotoCollectionEntries(collection_id)">
                  <i class="pi pi-eye"/>
                  &nbsp;
                  Fertig, oder gehe zum Set mit den importierten Medieneinträgen...
                  &nbsp;
                  <i class="pi pi-caret-right"/>
                </Button>
              </div>
            </div>
            <hr/>
            <br/>


            <div v-if="collection_id"
              class="flex flex-column justify-content-between">
              <div class="flex flex-wrap">
                <h4>Medieneinträge im Set:</h4>
              </div>
              <div class="flex flex-row justify-content-start gap-3 py-3">
                <div class="py-4">Title:</div>
                <Chip class="col-chip">{{  collectionTitle }}</Chip>
                <div class="py-4">ID:</div>
                <Chip class="col-chip">{{ collection_id }}</Chip>
              </div>
              
            </div>

            <CollectionEntriesGrid
              v-if="collection_id && uploadedEntriesShow == true"
              :show_actions="false"
              :show_preview="true"
              :collection_id="collection_id"/>
          </div>
          <!--<div v-else>Invalid importer state. {{ showStep }}</div>-->
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { useRouter } from 'vue-router'

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Chip from "primevue/chip";
import Badge from "primevue/badge";
import OkOrError from "../components/OkOrError.vue";
import Message from "primevue/message";


import { apiHelper } from "../modules/api";
import { errorHelper } from "../modules/error";
import { iGenMetaData, madekHelper } from "../modules/madek";
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
import { useMetadataStore } from "../stores/metadata_store";

const router = useRouter()
const { error_msg, ok_msg, reset_error, timed_handle_ok, timed_handle_error } = errorHelper()

const { api, authParams, user } = apiHelper()

const madek_store = useMadekStore()
const { 

  MKEY_TITLE,

  getCollectionTitle,

  storeMDDefaults,
  getStoredMDDefaults,
  copyMDInto,
  initMD,

  saveResourceMetaData,
  loadResourceMetaData,

  createMetaDataText,
  
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

const defaults_meta_data = ref({} as iGenMetaData)

const mdUserDefaults = ref({} as iGenMetaData)
const mdImportDefaults = ref({} as iGenMetaData)
const mdEditEntry = ref({} as iGenMetaData)

const edit_entry_id = ref('' as string)

const uploadedEntries = ref(new Array<iMediaEntry>())
const uploadedEntriesMD = ref({} as object)

const uploadedMDShowMode = ref('showCore' as string)

const hide_meta_keys_map = ref({})


const getContexts = () => {
  return madek_store.appSettings.contexts_for_entry_validation
}


//TODO loaded and uploaded entries MD
const clickedApplyDefaults = (me_id:string) => {
  reset_error()

  const upme = uploadedEntries.value.find( (me) => { return me.id === me_id })

  if (!upme || !upme.id || !upme.media_file || !upme.media_file.filename) {
    console.error("mediaEntryApplyDefaultsAndSave: invalid upload")
    return
  }
  mediaEntryApplyDefaultsAndSave(upme)
 
}

const clickedEdit = (me_id:string) => {
  reset_error()
  
  const upme = uploadedEntries.value.find( (me) => { return me.id === me_id })

  if (!upme || !upme.id || !upme.media_file || !upme.media_file.filename) {
    console.error("clickedEdit: invalid upload media entry")
    return
  }

  showEditEntry.value = true

  edit_entry_id.value = me_id;

  mdEditEntry.value = {} as iGenMetaData
  copyMDInto(uploadedEntriesMD.value[me_id], mdEditEntry.value)
  if (!mdEditEntry.value[MKEY_TITLE]
    || !mdEditEntry.value[MKEY_TITLE].string
    || mdEditEntry.value[MKEY_TITLE].string.length == 0) {

    copyMDInto(mdImportDefaults.value, mdEditEntry.value)
    mdEditEntry.value[MKEY_TITLE].string = upme.media_file.filename
  }
  
  
  //uploadedEntriesMD.value[me_id] = mdEditEntry.value

  console.log("applied import defaults resource md: " + JSON.stringify(mdEditEntry.value))
  
}

const uploadedEntriesShow = ref(true as boolean)
const mdStore = useMetadataStore()

const uploadedEntriesReload = () => {
  reset_error()
  uploadedEntriesShow.value = false
  setTimeout( () => {
    uploadedEntriesShow.value = true
  }, 100)
}

const onClickedEditEntrySave = () => {
  reset_error()
  console.log("onClickedEditEntrySave: ")


  
  const resKey = 'media_entry_id'
  const resId = edit_entry_id.value
  const meta_data = mdEditEntry.value//me_meta_data.value
  
  
  mdStore.getCachedMetaDataRelated(resKey, resId, true, (data) => {
    const loadedMD = data
    console.log("loaded before save resource md: " + JSON.stringify(loadedMD))
    debugger
    saveResourceMetaData(resKey, resId, meta_data, loadedMD, () => {
      debugger
      console.log("saved meta data")

      uploadedEntriesErrorMap.value[resId] = "saved"
      timed_handle_ok("Metadaten gespeichert.")
          
      edit_entry_id.value = ''
      showEditEntry.value = false

      tryPublish(resId, (result) => {
        console.log("tried publish MD: " + JSON.stringify(result))
        uploadedEntriesErrorMap.value[resId] = "vollständig"
      })
            
      uploadedEntriesReload()
    })
  }, (error) => timed_handle_error("could not get cached meta data.",error))
/*
  loadResourceMetaData(resKey, resId, loadedMD, () => {
    debugger
      console.log("loaded before save resource md: " + JSON.stringify(loadedMD))
      saveResourceMetaData(resKey, resId, meta_data, loadedMD, () => {
          console.log("saved meta data")
          debugger
          uploadedEntriesErrorMap.value[resId] = "saved"
          timed_handle_ok("Metadaten gespeichert.")
          
          edit_entry_id.value = ''
          showEditEntry.value = false

          tryPublish(resId, (result) => {
            console.log("tried publish MD: " + JSON.stringify(result))
            uploadedEntriesErrorMap.value[resId] = "vollständig"
            const loadedMD = {}
            loadResourceMetaData(resKey, resId, loadedMD, () => {
              console.log("reloaded resource md: " + JSON.stringify(loadedMD))
              uploadedEntriesMD.value[resId] = loadedMD
            })
            
            uploadedEntriesReload()  
          })
          
      })
  })
  */

}
/*
const saveCollectionMD = () => {
  reset_error()
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
*/

const mediaEntrySaveMetaData = (meId: string, meta_data: any, cbOK:any) => {
  reset_error()
  
  
  mdStore.getCachedMetaDataRelated(resKey, resId, true, (loadedMD) => {
    console.log("loaded resource md: " + JSON.stringify(loadedMD))
    saveResourceMetaData('media_entry_id', meId, meta_data, loadedMD, () => {
      console.log("saved resource md: " + meId)
      uploadedMDShowMode.value = 'showCore'
      if (cbOK) cbOK(meId)
    })
  }, (error) => timed_handle_error("could not get cached meta data", error))
  /*
  loadResourceMetaData('media_entry_id', meId, loadedMD, () => {
    console.log("loaded resource md: " + JSON.stringify(loadedMD))

    saveResourceMetaData('media_entry_id', meId, meta_data, loadedMD, () => {
      
      console.log("saved resource md: " + meId)
      uploadedMDShowMode.value = 'showCore'
    
      if (cbOK) cbOK(meId)


    })
  })
  */  
}

const tryPublish = (me_id: string, cbOK: any) => {
  reset_error()
  api.api.mediaEntryPublishUpdate(me_id, authParams?.value)
      .then(resp => {
          console.log("publish result: " + me_id + "\n data:\n " + JSON.stringify(resp.data))
          
          if (cbOK) cbOK(resp.data)
          
      })
}
const mediaEntryApplyDefaultsAndSave = (upme:any) => {
  reset_error()
  
  if (!upme || !upme.id || !upme.media_file || !upme.media_file.filename) {
    console.error("mediaEntryApplyDefaultsAndSave: invalid upload")
    return
  }

// TODO use already loaded or edited md as base

  const meta_data = {}
  copyMDInto(mdImportDefaults.value, meta_data)

  const me_id = upme.id

  if (hide_meta_keys_map.value[MKEY_TITLE] == true) {
    console.error("assign title from filename")
    meta_data[MKEY_TITLE].string = upme.media_file.filename
  }

  mediaEntrySaveMetaData(me_id, meta_data, () => {
    console.log("save MD")
    uploadedEntriesErrorMap.value[me_id] = "saved"

    tryPublish(me_id, (result) => {
      console.log("tried publish MD")
      uploadedEntriesErrorMap.value[me_id] = "vollständig"
      /*
      const loadedMD = {}
      loadResourceMetaData('media_entry_id', me_id, loadedMD, () => {
        console.log("reloaded resource md: " + JSON.stringify(loadedMD))
        uploadedEntriesMD.value[me_id] = loadedMD
      })
      */
      uploadedEntriesReload()
    })
    
  })
}


const clickedAddToCollectionAll = () => {
  reset_error()
  uploadedEntries.value.forEach((me) => {
    const me_id = me.id
    addToCollection(collection_id.value, me_id)
  })
}

const clickedApplyDefaultsAll = () => {
  reset_error()
  uploadedEntries.value.forEach((me) => {
    mediaEntryApplyDefaultsAndSave(me)
  })
  showStep.value = 3
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
    timed_handle_error("Could not add to collection : "  , error.error.message)
		//console.error("Could not add media entry " + me_id + " to collection: " + collectionId + " error: " + JSON.stringify(error))
	})
}

const selectedFilesStatus = ref([] as any[])

const isAllUploaded = () => {
  let result = true
  if (!!selectedFilesStatus.value) {
    
    const found = selectedFilesStatus.value.find(file => { 
      console.log("file status: " + file.status)
      return !file.status
        || file.status == undefined
        || file.status == null
        || file.status === 'loading'
        
         //file.status === 'Error' || file.status === true
    })
    
    if (found) result = false
  }
  
  console.log("isAllUploaded: " + result)
  return result
}
const onUploadChanged = (entryId: string, files:any) => {
  console.log("onUploadChanged: " + entryId + ":" + files)

  reset_error()

  selectedFilesStatus.value = files
  isAllUploaded()

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
    /*
  const loadedMD = {}
  loadResourceMetaData('media_entry_id', me_id, loadedMD, () => {
    console.log("loaded resource: " + me_id + " md: " + JSON.stringify(loadedMD))
    uploadedEntriesMD.value[me_id] = loadedMD
  })*/
}

const onSelectedFiles = (files: any) => {
  reset_error()
  console.log("onSelectedFiles: " + JSON.stringify(files))
  selectedFilesStatus.value = files
}
const updateCollectionTitle = () => {
  getCollectionTitle(collection_id.value, (title:string) => {
    collectionTitle.value = title;

    //mdUserDefaults.value[MKEY_TITLE]['string'] = title
    
  })
}

const selectStep = (n: number) => {
  reset_error()
  showStep.value = n
  
}


const clickedCreateCollection = (newTitle: string) => {
  reset_error()
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
          timed_handle_error("Could not apply new collection title: ", error)
        })
    })
}

const collectionList = ref([] as iCollection[])

const updateCollectionList = () => {
    //reset_error()
    const query = {
      full_data: true,
      me_edit_metadata_and_relations: true,
      creator_id: user?.id
    }
    
    api.api.collectionsList(query, authParams?.value)
    .then(result =>{
      collectionList.value = result.data.collections;
    })
}

const clickedShowCollectionList = () => {
  reset_error()
  updateCollectionList()
  showCollectionList.value = true
}

const selectCollection = (colId: string) => {
  reset_error()
  console.log("selectCollection: " + colId)
  collection_id.value = colId
  updateCollectionTitle()
  showCollectionList.value = false
}


const onSaveMDDefaults = () => {
  reset_error()
  storeMDDefaults(mdUserDefaults.value)
  showDefaultsEdit.value = false
  timed_handle_ok("Defaults gespeichert.")
  
}    

const gotoCollectionEntries = (colId:string) => {
  router.push({ path: `/collection/entryList/${colId}`})
}
const gotoUserEntries = () => {
  router.push({ path: '/mediaEntry/userList'})
}
const startBasicImport = () => {
  reset_error()
  showBasicImport.value = true
  copyMDInto(mdUserDefaults.value, mdImportDefaults.value, true)
}

const isEnabledStep = (step:number) => {
  
  if (step == showStep.value) {
    return false
  }
  if (isAllUploaded() !== true) {
    return false
  }
  if (step > 1) {
    if (uploadedEntries.value.length == 0) {
      return false
    }
  }
  switch (step) {
    case 1:
      return true
    case 2:
      return true
    case 3:
      return true
    case 4:
      return true
    case 5:
      return true
    default:
      return true;
  }
}
onMounted(() => {

  defaults_meta_data.value = getStoredMDDefaults()
  initMD(getContexts(), mdUserDefaults.value)
  copyMDInto(defaults_meta_data.value, mdUserDefaults.value)

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
.messages {
  position: fixed;
  bottom: 0.5rem;
  right: 2rem;
  z-index: 300;
}
</style>
