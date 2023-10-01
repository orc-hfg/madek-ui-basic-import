<template>
  <div class="mde-collection">
    <div v-if="checkLoaded()">
      
            

              <TabView :scrollable="true">
                <TabPanel
                  v-for="context_id in getAllContexts()">
                  <template #header>
                    
                    <span>{{ getContextML(context_id, 'labels') }}</span>
                    &nbsp;
                    <span>({{ context_id }})</span>
                  </template>

                  <p>
                    <span>{{ getContextML(context_id, 'descriptions') }}</span>
                  </p>


                  <Accordion>
                    <AccordionTab
                      v-for="contextKey in getContextKeysForContext(context_id)">
                      <template #header>
                        <span>{{ getMetaKeyML( contextKey.meta_key_id, 'labels') }}</span>
                        &nbsp;
                        <span>{{ contextKey.is_required && 'Required!' || '' }}</span>
                        &nbsp;
                        <span>(&nbsp;{{ contextKey.meta_key_id }}&nbsp;)</span>
                      </template>


                      <p>
                        <span>{{ getMetaKeyML( contextKey.meta_key_id, 'descriptions') }}</span>
                      </p>
                      
<!--
  <JsonViewer :value="metaDataMap.get(contextKey.meta_key_id)"/>
                      <p>
                        <div v-if="metaDataMap.get(contextKey.meta_key_id)">
                          <p>Has meta data</p>
                        </div>
                        <div v-else>
                          <p>No meta data yet</p>
                        </div>                        
                      </p>
-->
                      <MetaDataEditText
                        :resource_key="'collection_id'"
                        :resource_id="collectionId"
                        
                        :context_key="contextKey"
                        :meta_key="getMetaKey(contextKey.meta_key_id)"
                        :meta_data="metaDataMap.get(contextKey.meta_key_id)"
                        v-on:has-changed="mdChanged"
                        />
                      

                      <MetaDataEditTextDate
                        :resource_key="'collection_id'"
                        :resource_id="collectionId"
                        :context_key="contextKey"
                        :meta_key="getMetaKey(contextKey.meta_key_id)"
                        :meta_data="metaDataMap.get(contextKey.meta_key_id)"
                        v-on:has-changed="mdChanged"
                        />
                      

                      <MetaDataEditJson
                        :resource_key="'collection_id'"
                        :resource_id="collectionId"
                        :context_key="contextKey"
                        :meta_key="getMetaKey(contextKey.meta_key_id)"
                        :meta_data="metaDataMap.get(contextKey.meta_key_id)"
                        >
                      </MetaDataEditJson>

                      <MetaDataEditPeople
                        :resource_key="'collection_id'"
                        :resource_id="collectionId"
                        :meta_key_id="contextKey.meta_key_id"
                        >

                      </MetaDataEditPeople>
                      
                      <MetaDataEditKeywords
                        :resource_key="'collection_id'"
                        :resource_id="collectionId"
                        :meta_key_id="contextKey.meta_key_id"
                      
                        :context_key="contextKey"
                        :meta_key="getMetaKey(contextKey.meta_key_id)"
                        />
                      



                    </AccordionTab>
                  </Accordion>

                </TabPanel>
              </TabView>
              
              <!--
                      <div v-if="metaKeysMap.get(contextKey.meta_key_id).meta_datum_object_type === 'MetaDatum::Text'">
                      </div>

                      <div v-else-if="metaKeysMap.get(contextKey.meta_key_id).meta_datum_object_type === 'MetaDatum::TextDate'">
                      </div>
                      
                      <div v-else-if="metaKeysMap.get(contextKey.meta_key_id).meta_datum_object_type === 'MetaDatum::JSON'">
                      </div>

                      
                      <div v-else-if="metaKeysMap.get(contextKey.meta_key_id).meta_datum_object_type === 'MetaDatum::People'">
                      </div>

                      <div v-else-if="metaKeysMap.get(contextKey.meta_key_id).meta_datum_object_type === 'MetaDatum::Keywords'">
                      </div>

                      <div v-else-if="metaKeysMap.get(contextKey.meta_key_id).meta_datum_object_type === 'MetaDatum::Roles'">
                        <p>TODO Roles edit</p>
                      </div>

                      <div v-else>
                        Unknown Meta-Data type
                      </div>
              -->

        
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { hasOwn } from '@vue/shared'

import { 
  iAppSettings,
  iCollection,
  iContext,
  iContextKey,
  iKeyword,
  iMetaData,
  iMetaKey,
  iPerson,
  iVocabulary,
  iMLObj
} from '../../api_resources'

import { apiHelper } from '../../modules/api';
import { madekHelper } from '../../modules/madek';


import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import MetaDataEditKeywords from './MetaDataEditKeywords.vue'
import MetaDataEditPeople from './MetaDataEditPeople.vue'
import MetaDataEditText from './MetaDataEditText.vue'
import MetaDataEditTextDate from './MetaDataEditTextDate.vue'
import MetaDataEditJson from './MetaDataEditJson.vue'
import { useMadekStore } from '../../stores/madek_store';

const { api, authParams } = apiHelper()
const { 
    
    getContextKeysForContext,
    getMetaKeyKeywords,
    getMetaKey,
    checkAllLoaded,
    
    getMLText,
    getContextML,
    getMetaKeyML,
    
} = madekHelper()

export default defineComponent({
  name: 'CollectionMetaDataEdit',
  props: {
    collectionId: { type: String, required: true},
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
    MetaDataEditJson: MetaDataEditJson
  },
  computed: {
    
  },
  data () {
    return {
      error_msg: '' as string,

      ready: false as boolean,

      metaDataMap: new Map<string, iMetaData>,
      //metaDataExtendedMap: new Map<string, {}>,
    }
    
  },
  mounted () {
    const _this = this
    setTimeout(() => {
      
    },200)
    
    this.getCollectionMetaData()
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
      
      this.getCollectionMetaData()  
    },

    getMLText: getMLText,
    getAllContexts () {
      const madek = useMadekStore()
      return madek.appSettings.contexts_for_collection_edit
    },

    getContextML: getContextML,
    getMetaKeyML: getMetaKeyML,
    getContextKeysForContext: getContextKeysForContext,
    getMetaKeyKeywords: getMetaKeyKeywords,
    getMetaKey: getMetaKey,

    getCollectionMetaData() {
        this.reset_error()
        api.api.collectionMetaDataDetail(this.collectionId,{}, authParams?.value)
        .then(resp => {
          const metaData = resp.data['meta-data']
          this.metaDataMap.clear()
          metaData.map(md => {
            this.metaDataMap.set(md.meta_key_id, md)
          })
        })
        .catch(error => this.handle_error('get collectionMetaData: ', error))
    },

    checkLoaded() {
      let result = true;
    
      result = checkAllLoaded()
      this.ready = result
      return result;

    }
  }
})

</script>
<style>
.mde-collection {
  
}
  
</style>
