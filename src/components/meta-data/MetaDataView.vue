<template>
  <div class="metaDataView">
<!--  
    <div v-if="!checkLoaded()">
      <p>Loading...</p>
    </div>
    <div v-if="checkLoaded()">
-->
      <div v-if="mode === 'showAll'">
        <div v-for="context_id in getAllContexts()" class="context_panel allPanel">
          
            <div class="context_header">
              <span>{{ getContextML(context_id, LABELS) || context_id }}</span>
              <!--
              &nbsp;
              <span style="float:right">[{{ context_id }}]</span>-->
            </div>

            <div class="context_desc" v-if="getContextML(context_id, DESCR)">
              <span>{{ getContextML(context_id, DESCR) }}</span>
            </div>

            <div style="border: 1px solid grey;">
              <div class="meta_panel"
                v-for="contextKey in getContextKeysForContext(context_id)" >

                <div class="meta_header">
                  <span>{{ getMetaKeyML( contextKey.meta_key_id, LABELS) || contextKey.meta_key_id }}</span>
                  <span>{{ contextKey.is_required && '*' || '' }}</span>
                  &nbsp;
                  <!--
                  <span style="float:right">[{{ contextKey.meta_key_id }}]</span>-->
                  <br/>
                  
                </div>

                <div class="meta_desc" v-if="showMetaDesc && getMetaKeyML( contextKey.meta_key_id, DESCR)">{{ getMetaKeyML( contextKey.meta_key_id, DESCR) }}</div>
                <div class="meta_hints" v-if="showMetaHints && getMetaKeyML( contextKey.meta_key_id, HINTS)">{{ getMetaKeyML( contextKey.meta_key_id, HINTS) }}</div>

                <div class="meta_data">
                  <div v-if="metaDataMap[contextKey.meta_key_id]">
                    <MetaDatumView
                      :meta-key="getMetaKey(contextKey.meta_key_id)"
                      :meta-data="metaDataMap[contextKey.meta_key_id]"
                      :default_locale="getDefaultLocale()"
                      >
                    </MetaDatumView>
                  </div>

                  <div v-else>
                    <span>--</span>
                  </div>                        
                </div>

              </div>
            </div>    

        </div>


      </div>            
      <div v-else-if="mode === 'showSummary'">

        <div v-for="context_id in getAllContexts()" class="summaryPanel" style="">
          
            <Panel class="px-2 py-2"
              :header="getContextML(context_id, LABELS) || context_id"
              toggleable>

              <div v-for="contextKey in getContextKeysForContext(context_id)" >

                <div v-if="metaDataMap[contextKey.meta_key_id]">
                  <div class="meta_header">
                    <span>{{ getMetaKeyML( contextKey.meta_key_id, LABELS) }}</span>
                    <span>{{ contextKey.is_required && '*' || '' }}</span>
                    &nbsp;
                  </div>
                  <MetaDatumView class="meta_data"
                    :meta-data="metaDataMap[contextKey.meta_key_id]"
                    :meta-key="getMetaKey(contextKey.meta_key_id)"
                    :default_locale="getDefaultLocale()"
                    >
                  </MetaDatumView>

                </div>
              </div>
            </Panel>
        </div>
       
      </div>
      <div v-else-if="mode === 'showCore'">
          <div v-for="context_id in getCoreContexts()">
            <div v-for="contextKey in getContextKeysForContext(context_id)" >

                <div v-if="metaDataMap[contextKey.meta_key_id]">
                  <p>
                    <span>{{ getMetaKeyML( contextKey.meta_key_id, LABELS) ||contextKey.meta_key_id }}:</span>
                    &nbsp;

                    <MetaDatumView class="meta_data"
                      :meta-data="metaDataMap[contextKey.meta_key_id]"
                      :meta-key="getMetaKey(contextKey.meta_key_id)"
                      :default_locale="getDefaultLocale()"
                      />

                  </p>
                </div>
            </div>
          </div>
      </div>
      <div v-else-if="mode === 'showTitle'">
        <p>
            <span>{{ getMetaKeyML( 'madek_core:title', LABELS) || 'madek_core:title' }}:</span>
            &nbsp;
            <MetaDatumView
              :meta-data="metaDataMap[contextKey.meta_key_id]['madek_core:title']"
              :meta-key="getMetaKey('madek_core:title')"
              :default_locale="getDefaultLocale()"
              />
        </p>
        
      </div>
      <div v-else>
        Invalid show mode!!
      </div>
    <!--</div>-->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue'
import { apiHelper  } from '../../modules/api'
import { errorHelper } from '../../modules/error'
import { MLType, madekHelper } from '../../modules/madek'
import { iGenMetaData } from '../../modules/madek'
import { 
  iMetaData,
  
} from '../../api_resources'


import MetaDatumView from './MetaDatumView.vue'
import Panel from 'primevue/panel'
import { useMadekStore } from '../../stores/madek_store'
import { useMetadataStore } from '../../stores/metadata_store'
import { MediaEntryMetaDataRelatedDetailData, MetaDataDetailData } from '../../generated/data-contracts'


const { api, authParams } = apiHelper()
const { error_msg, handle_error, reset_error} = errorHelper()


const {
    MD_KEYWORDS,
    MD_PEOPLE,
    MD_TYPE_KEYWORDS,
    MD_TYPE_PEOPLE,

    madekLoading,
    
    getContextKeysForContext,
    checkAllLoaded,
    getDefaultLocale,
    
    getContextML,
    getMetaKeyML,
    getMetaKey,

  } = madekHelper()

const props = defineProps({
  collectionId: { type: String, required: false},
  entryId: { type: String, required: false},
  mode: { type: String, default: 'showCore', required: false},
  showMetaDesc: {type: Boolean, default: true},
  showMetaHints: {type: Boolean, default: true},
  forceReload: {type: Boolean, default: false}
})

//const metaDataMap = ref(new Map<string, iMetaData>())
  const metaDataMap = ref({} as iGenMetaData)
const metaDataExtendedMap= ref(new Map<string, {}>())
const LABELS = MLType.labels
const DESCR = MLType.descriptions
const HINTS = MLType.hints

const madekStore = useMadekStore()

const mdStore = useMetadataStore()

const checkLoaded = () => {
  let result = true;
  result = checkAllLoaded()
  return result;
}

const getAllContexts = () => {
    if (props.collectionId) {
      return madekStore.appSettings.contexts_for_collection_edit
    } else if (props.entryId) {
      return madekStore.appSettings.contexts_for_entry_edit
   }
}

const getCoreContexts = () => {
    if (props.collectionId) {
      return [ madekStore.appSettings.context_for_collection_summary ]
    } else if (props.entryId) {
      return [ madekStore.appSettings.context_for_entry_summary ]
    }
}
/*
const onError = (error:any) => {
  console.error("got error: " + JSON.stringify(error))
}
const onMetaData = (resp: MediaEntryMetaDataRelatedDetailData) => {
  resp.forEach((elem: any) => {
    
    const md = elem.meta_data
    metaDataMap.value.set(md.meta_key_id,md)
    metaDataExtendedMap.value.set(md.meta_key_id, elem)
    if (isMetaKeyObjectType(md.meta_key_id, MD_TYPE_PEOPLE)) {
    } else if (isMetaKeyObjectType(md.meta_key_id, MD_TYPE_KEYWORDS)) {
    } else {
      //TODO roles
    }
  })
}
*/
const updateData =() => {
  metaDataMap.value = {} as iGenMetaData
 
  //metaDataExtendedMap.value.clear()
  let resKey = ''
  let resId = ''
  if (props.collectionId) {
    resKey = 'collection_id'
    resId = props.collectionId
  } else if (props.entryId) {
    resKey = 'media_entry_id'
    resId = props.entryId
  } else {
    console.error("MetaDataView: ABORT: invalid entry or collection id.")
    return
  }
  if (props.forceReload == true) {

  }
 
  //getMetaDataRelated(resKey, resId , onMetaData, onError)
 
  mdStore.getCachedMetaDataRelated(resKey, resId, props.forceReload, (data) => {
    console.log("got CachedMetaDataRelated: ")
    metaDataMap.value = data
  }, (error) => {
    console.error("ERROR: getCachedMetaDataRelated: " + JSON.stringify(error))
  })
}

watch(props, () => {
    //console.log("MetaDataView: changed props: ")
    updateData()
})

onMounted(() => {
    //console.log("MetaDataView: onMounted: ")
    updateData()
})

</script>
<style>
.metaDataView {
  min-width: 10rem;
  overflow-y: auto;
  /*border: 1px solid gray;
  padding: 1rem;*/
}
.context_panel {
  background-color: var(--surface-100);
  
}
.p-panel .p-panel-header {
  background-color: var(--primary-300);
}
.context_header {
  background-color: var(--primary-300);
  padding: 0.5em;
  /*padding-left: 1.5em;
  padding-right: 1.5em;
  font-size: 1.25em;
  */
  font-size: 1.125rem;
  font-weight: bolder;
  
}
.context_desc {
  background-color: var(--surface-200);
  padding: 0.5em;
  padding-left: 2em;
  padding-right: 1.5em;
}
.meta_panel {
  background-color: var(--surface-100);
  
  
}
.meta_header {
  background-color: var(--primary-200);
  padding: 0.5rem;
  padding-left: 2rem;
  font-weight: bolder;
}
.meta_desc {
  padding-left: 2rem;

}
.meta_data {
  padding: 0.25rem;
  padding-left: 2rem;

}
.summaryPanel {
  float: left;
  width: 35rem;
}
.allPanel {
  float: left;
  width: 35rem;
  border: 1px solid #e6e6e6;
margin: 1rem;
}
</style>
