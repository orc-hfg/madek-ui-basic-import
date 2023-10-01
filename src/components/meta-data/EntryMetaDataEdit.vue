<template>
  <div class="mde-entry">
    <div v-if="checkLoaded()">
         
      <TabView>
        <TabPanel
          v-for="context_id in getAllContexts()">
          <template #header>
            
            <span>{{ getContextML(context_id, 'labels') }}</span>
            &nbsp;
            <span>[{{ context_id }}]</span>
          </template>

          <p>
            <span>{{ getContextML(context_id, 'descriptions') }}</span>
          </p>
          <p>
            <span>{{ getContextML(context_id, 'hints') }}</span>
          </p>

          <Accordion>
            <AccordionTab
              v-for="contextKey in getContextKeysForContext(context_id)">
              <template #header>
                <span>{{ getMetaKeyML( contextKey.meta_key_id, 'labels') }}</span>
                &nbsp;
                
                &nbsp;
                <span>[{{ contextKey.meta_key_id }}]</span>
                &nbsp;
                <span>{{ contextKey.is_required && 'Required!' || '' }}</span>
              </template>

              <p>
                <span>{{ getMetaKeyML( contextKey.meta_key_id, 'descriptions') }}</span>
              </p>
              <p>
                <span>{{ getMetaKeyML( contextKey.meta_key_id, 'hints') }}</span>
              </p>
              
              <MetaDataEditText
                :resource_key="'media_entry_id'"
                :resource_id="mediaEntryId"
                :context_key="contextKey"
                :meta_key="getMetaKey(contextKey.meta_key_id)"
                :meta_data="metaDataMap.get(contextKey.meta_key_id)"
                
                v-on:has-changed="mdChanged"
                />
              

              <MetaDataEditTextDate
                :resource_key="'media_entry_id'"
                :resource_id="mediaEntryId"
                :context_key="contextKey"
                :meta_key="getMetaKey(contextKey.meta_key_id)"
                :meta_data="metaDataMap.get(contextKey.meta_key_id)"
                v-on:has-changed="mdChanged"
                >
              </MetaDataEditTextDate>

              <MetaDataEditJson
                :resource_key="'media_entry_id'"
                :resource_id="mediaEntryId"
                :context_key="contextKey"
                :meta_key="getMetaKey(contextKey.meta_key_id)"
                :meta_data="metaDataMap.get(contextKey.meta_key_id)"
                >
              </MetaDataEditJson>

              <MetaDataEditPeople
                :resource_key="'media_entry_id'"
                :resource_id="mediaEntryId"
                :meta_key_id="contextKey.meta_key_id"
                />
              
              <MetaDataEditKeywords
                :resource_key="'media_entry_id'"
                :resource_id="mediaEntryId"
                
                :meta_key_id="contextKey.meta_key_id"
                :context_key="contextKey"
                :meta_key="getMetaKey(contextKey.meta_key_id)"
                />
              
            </AccordionTab>
          </Accordion>    
        </TabPanel>
      </TabView>
          

    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { hasOwn } from '@vue/shared'

import { apiHelper } from '../../modules/api';
import { authHelper } from '../../modules/auth';
import { madekHelper } from '../../modules/madek';

import { 
  iAppSettings,
  iCollection,
  iContext,
  iContextKey,
  iKeyword,
  iMetaData,
  iPublishableResult,
  iMetaKey,
  iPerson,
  iVocabulary,
  iMLObj,
iMediaEntry
} from '../../api_resources'


import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import MetaDataEditKeywords from './MetaDataEditKeywords.vue'
import MetaDataEditPeople from './MetaDataEditPeople.vue'
import MetaDataEditText from './MetaDataEditText.vue'
import MetaDataEditTextDate from './MetaDataEditTextDate.vue'
import MetaDataEditJson from './MetaDataEditJson.vue'
import EntryPublishInfo from '../entries/EntryPublishInfo.vue';

import { useMadekStore } from '../../stores/madek_store';

const { user } = authHelper()
const { api, authParams } = apiHelper()
const { 

    getContextKeysForContext,
    getMetaKeyKeywords,
    getMetaKey,
    checkAllLoaded,
    
    getMLText,
    getContextML,
    getMetaKeyML,
    
    checkPublishableMetaData
} = madekHelper()


export default defineComponent({
  name: 'EntryMetaDataEdit',
  props: {
    mediaEntryId: { type: String, required: true},
    edit_validation: { type: Boolean, default: false, required: false}
  },
  components: {
    Accordion: Accordion,
    AccordionTab: AccordionTab,
    TabView: TabView,
    TabPanel: TabPanel,
    MetaDataEditKeywords: MetaDataEditKeywords,
    MetaDataEditPeople: MetaDataEditPeople,
    MetaDataEditText: MetaDataEditText,
    MetaDataEditTextDate: MetaDataEditTextDate,
    MetaDataEditJson: MetaDataEditJson,
    EntryPublishInfo: EntryPublishInfo
  },

  data () {
    return {
      error_msg: '' as string,

      ready: false as boolean,
      
            
      //metaKeysMap: metaKeysMapByMetaKey,

      metaDataMap: new Map<string, iMetaData>,
      publishResult: {} as iPublishableResult,
      entryData: {} as iMediaEntry
    }
    
  },
  mounted () {
    const _this = this
    setTimeout(() => {
      this.getMetaData()
    },200)

    this.getMetaData()
  },
  methods: {
    handle_error (msg:string, error:Response) {
      const mmsg = 'ERROR: ' + msg + ' status: ' + error.status
      console.error(mmsg)
      this.error_msg = mmsg
    },
    reset_error () { this.error_msg = 'no error' },


    mdChanged() {
      console.log("mdChanged")
      
      this.getMetaData()  
    },

    getMLText: getMLText,
    
    getAllContexts() {
      const madek = useMadekStore()
      if (this.edit_validation === true) {
        return madek.appSettings.contexts_for_entry_validation
      }
      return madek.appSettings.contexts_for_entry_edit
      
    },
    
    getContextML: getContextML,
    getMetaKey: getMetaKey,
    getMetaKeyML: getMetaKeyML,
    getContextKeysForContext: getContextKeysForContext,
    getMetaKeyKeywords: getMetaKeyKeywords,

    getMetaData() {
        this.reset_error()

        api.api.mediaEntryDetail(this.mediaEntryId, authParams?.value)
          .then(result => {
            this.entryData = result.data
          })
        api.api.mediaEntryMetaDataDetail(this.mediaEntryId, {}, authParams?.value)
        .then(result => {
          const metaData = result.data['meta-data'] // as iMetaData[]
  
          this.metaDataMap.clear()
          metaData.map(md => {
            this.metaDataMap.set(md.meta_key_id, md)
          })

          this.publishResult = checkPublishableMetaData(this.metaDataMap)
        })
        .catch(error => this.handle_error('get MetaData: ', error))
    },

    checkLoaded() {
      let result = true;
      result = checkAllLoaded()
      if (result == true) {
       
      }
      this.ready = result
      return result;
    }

  }
})

</script>
<style>
 
</style>
