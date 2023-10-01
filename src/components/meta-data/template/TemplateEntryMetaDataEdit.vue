<script lang="ts" setup>
import { ref, onMounted, watch, PropType, getTransitionRawChildren } from 'vue'

import Chip from 'primevue/chip';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import { apiHelper } from '../../../modules/api';
import { madekHelper, GenMetaData, GenMetaDatum } from '../../../modules/madek';
import { errorHelper } from '../../../modules/error'

import { 
  iContextKey,
  iKeyword,
  iPerson,
} from '../../../api_resources'
import { PeopleListData } from '../../../generated/data-contracts';
import { PeopleListParamsSubtypeEnum } from '../../../generated/API_fetch_xeio';

const { api } = apiHelper()
const { error_msg, handle_error, reset_error} = errorHelper()

const { 
  madekLoading,
    MKEY_TITLE,
    MD_TYPE_KEYWORDS,
    MD_TYPE_PEOPLE,
    MD_TYPE_ROLES,
    MD_TYPE_JSON,
    MD_TYPE_TEXT,
    MD_TYPE_TEXT_DATE,
    
    getContextKeysForContext,
    getMetaKeyKeywords,
    checkAllLoaded,
    getMetaKey,
    isMetaKeyObjectType,

    getContextML,
    getMetaKeyML,

    initMD,
    copyMDInto,

} = madekHelper()

const props = defineProps(
  {
    //input_meta_data: { type: Object as PropType<GenMetaData>, default: {}, required: true},
    meta_data:  { type: Object as PropType<GenMetaData>, default: {}, required: true},    
    //result_meta_data:  { type: Object as PropType<GenMetaData>, default: {}, required: true},
    context_ids: { type: Array<String>, required: true},
    resource_id: { type: String, required: false },
    resource_key: { type: String, required: false },
    publish_result: { type: Boolean, required: false, default: true },
    show_descs: { type: Boolean, required: false, default: true },
    show_hints: { type: Boolean, required: false, default: true }
  }
)

//meta_data:  { type: Object as PropType<GenMetaData>, default: {}, required: true},
//const meta_data = ref({} as GenMetaData)

const buildMetaData = () => {
  //copyMDInto(meta_data.value, props.result_meta_data, true)
}
const peopleList = ref([] as iPerson[])
const peopleSearch = ref('' as string)

const getPeople = () => {
  api.api.peopleList({
    subtype: //'Person', 
      PeopleListParamsSubtypeEnum.Person,
    searchable: peopleSearch.value,
    full_data: true
  }).then(resp => {
    peopleList.value = resp.data.people
  })
}

const updatedContextsKeyMap =() => {
  if (checkAllLoaded() != true) {
    console.error("ABORT: not loaded yet.")
    return
  }

  props.context_ids.forEach(cid => {
    const cks = getContextKeysForContext(cid)
    cks.forEach(ckey => {
      const mkey = getMetaKey(ckey.meta_key_id)
      if (!mkey?.id) {
        console.log("unknown or hidden meta key: " + ckey.meta_key_id)
      }
      else {
        if (!contextKeysMap.value.has(cid)) {
          contextKeysMap.value.set(cid, [] as iContextKey[])
        }
        //contextKeysMap.value.set(mkey.id, )
        contextKeysMap.value.get(cid).push(ckey)
      }

    })
  })

}

watch([peopleSearch], (val) => {
  getPeople()
})

const contextKeysMap = ref(new Map<string, iContextKey[]>())

onMounted(() => {
  updatedContextsKeyMap()

})

const isMissingKey = (meta_key_id: string) => {
  let result = false
  props.publish_result?.failedKeys?.find(key => { 
    result = meta_key_id == key
    return meta_key_id == key
  })
  return result
}

const kwsearch = ref('')

const isKeywordSelected = (meta_key_id: string, kwid: string) => {
      const found = props.meta_data[meta_key_id]?.selectedKeywords.find(kw => {
        return kw.id == kwid
      })
      if (found && found.id) return true
      return false
    }

const addKeyword = (meta_key_id: string, kw: iKeyword) => {
  if (!props.meta_data[meta_key_id].selectedKeywords) {
    props.meta_data[meta_key_id].selectedKeywords = [] as iKeyword[]
  }
  props.meta_data[meta_key_id].selectedKeywords.push(kw)
  buildMetaData()
}

const removeKeyword = (meta_key_id: string, kwid: string) => {
  props.meta_data[meta_key_id].selectedKeywords = 
    props.meta_data[meta_key_id].selectedKeywords.filter( (kw:iKeyword) => { return kw.id !== kwid})
  buildMetaData()
}

const getMetaKeyFilteredKeywords = (meta_key_id: string, search: string) => {
  if (search.length > 0) {
    return getMetaKeyKeywords(meta_key_id)?.filter( (kw: iKeyword) => { return kw.term.indexOf(search) > 0})  
  }
  return getMetaKeyKeywords(meta_key_id);
}
const addPerson = (meta_key_id: string, person: iPerson) => {
  if (!props.meta_data[meta_key_id].selectedPeople) {
    props.meta_data[meta_key_id].selectedPeople = [] as iPerson[]
  }
  props.meta_data[meta_key_id].selectedPeople.push(person)
  buildMetaData()
}

const removePerson = (meta_key_id: string, pid: string) => {
  props.meta_data[meta_key_id].selectedPeople = 
    props.meta_data[meta_key_id].selectedPeople.filter( (p:iPerson) => { return p.id !== pid})
  buildMetaData()  
}

</script>

<template>
  <div class="mde-entry">
    
      
            <div>
         
              <TabView :scrollable="true">
                <TabPanel
                  v-for="context_id in context_ids"
                  style="padding: 0px;"
                  class="">
                  <template #header>
                    <span>{{ getContextML(context_id, 'labels') || context_id }}</span>
                  </template>

                  <p v-if="show_descs && getContextML(context_id, 'descriptions')">
                    <span>{{ getContextML(context_id, 'descriptions') }}</span>
                  </p>

                  <div v-for="contextKey in contextKeysMap.get(context_id)"
                    class="border-1 surface-border pb-1">
<!--
                  <Accordion>
                    <AccordionTab
                    v-for="contextKey in contextKeysMap.get(context_id)">

    
                      v-if="!!meta_data[contextKey.meta_key_id]"
                      v-for="metaKeyId in Object.keys(template)"></AccordionTab>
                      
                      v-if="getMetaKey(contextKey.meta_key_id)">
-->
                      <div class="border-1 surface-border px-3 py-2 meta-header">
                        <span>{{ getMetaKeyML( contextKey.meta_key_id, 'labels') }}</span>
                        &nbsp;
                        
                        &nbsp;
                        <span>[{{ contextKey.meta_key_id }}]</span>
                        &nbsp;
                        <span>{{ contextKey.is_required && 'Required!' || '' }}</span>

                        &nbsp;
                        <span>{{ isMissingKey(contextKey.meta_key_id) && 'Missing!' || '' }}</span>
                        
                      </div>

                      <div class="px-3 py-1 meta-desc"
                        v-if="show_descs && getMetaKeyML( contextKey.meta_key_id, 'descriptions')">
                        <span>{{ getMetaKeyML( contextKey.meta_key_id, 'descriptions') }}</span>
                      </div>
                      <div class="px-3 py-1 meta-hint"
                        v-if="show_hints && getMetaKeyML( contextKey.meta_key_id, 'hints')">
                        <span>{{ getMetaKeyML( contextKey.meta_key_id, 'hints') }}</span>
                      </div>

                      <div class="mde-text" v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_TEXT)">

                        <div v-if="getMetaKey(contextKey.meta_key_id).text_type === 'line'">
                          <InputText type="text" style="width:100%"
                              @change="buildMetaData()"
                              v-model.lazy.trim="meta_data[contextKey.meta_key_id].string"/>
                        </div>

                        <div v-else>
                          <TextArea v-model="meta_data[contextKey.meta_key_id].string"
                            @change="buildMetaData()"
                            rows="7" style="width:100%"/>  
                        </div>

                        <br/>
                    </div>

                    <div class="mde-text" v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_TEXT_DATE)">
                        <p>
                        <!--
                          Text Date Edit Template
                          {{ meta_data[contextKey.meta_key_id] }}
-->
                          <InputText type="date" style="width:100%"
                            @change="buildMetaData()"
                            v-model.lazy.trim="meta_data[contextKey.meta_key_id].string"/>
                      
                        <br/>
                        
                      </p>
                    </div>

                    <div class="mde-text" v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_JSON)">
                        <p>
                        <!--
                          JSON Edit Template
                          {{ template[contextKey.meta_key_id] }}
                          -->
                        
                          <TextArea v-model="meta_data[contextKey.meta_key_id].json" 
                            @change="buildMetaData()"
                            rows="7" style="width:100%"/>  
                        
                        <br/>
                      </p>
                    </div>

                    <div class="mde-text" v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_PEOPLE)">
                      <p>
                        Selected People:
                      </p>
                      <br/>
                        <span v-for="person in meta_data[contextKey.meta_key_id].selectedPeople" class="chipItem">
                          <Chip>
                            {{ person.first_name }}
                            {{ person.last_name }}
                            &nbsp;
                            <Button
                              icon="pi pi-times"
                              rounded outlined
                              size="small"
                              @click.prevent="removePerson(contextKey.meta_key_id, person.id)"/>
                          </Chip>
                        </span>
                        <br/>
                        
                        <hr/>

                        <p>
                        Available People:
                        </p>
                        <br/>
                        <br/>
                        <InputText v-model.trim="peopleSearch" />
                        <div >
                          <Chip v-for="person in peopleList">
                            {{ person.first_name }}
                            {{ person.last_name }}
                            &nbsp;
                            <Button
                              icon="pi pi-plus"
                              @click.prevent="addPerson(contextKey.meta_key_id, person)" />
                          </Chip>
                        </div>
                        <br/>
                    </div>


                    <div class="mde-text" v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_KEYWORDS)">
                      <div class="bg:surface-200 px-3 py-1 meta-desc">
                          Auswahl:
                        </div>
                        
                        <div class="flex flex-wrap px-3 py-3 meta-hint">
                          <div class="flex flex-wrap px-1 py-1"
                             v-for="kw in meta_data[contextKey.meta_key_id].selectedKeywords" >
                              
                              <Button
                              
                              severity="secondary"    
                                
                                rounded 
                                size="small"
                                @click.prevent="removeKeyword(contextKey.meta_key_id, kw.id)">
                                
                                
                                <span>{{ kw.term }}</span>
                                &nbsp;
                                <i class="pi pi-times" />
                              </Button>
                            
                          </div>
                        </div>
                        
                        
                        <hr/>

                        <div class="bg:surface-200 px-3 py-1 meta-desc">
                          Verfügbar:
                          <InputText v-model.lazy.trim="kwsearch"/>
                        </div>

                        <div class="flex flex-wrap px-3 py-3 meta-hint">
                        
                          <div class="flex flex-wrap px-1 py-1"
                            v-for="kw in getMetaKeyFilteredKeywords(contextKey.meta_key_id, kwsearch)">
                            <Button
                              v-if="!isKeywordSelected(contextKey.meta_key_id, kw.id)"
                              icon="pi pi-plus"
                              :label="kw.term"
                                rounded
                                size="small"
                                @click.prevent="addKeyword(contextKey.meta_key_id, kw)"/>
                              
                          </div>
                        </div>
<!--
                        <MultiSelect
                            v-model="meta_data[contextKey.meta_key_id].selectedKeywords"
                            :options="getMetaKeyKeywords(contextKey.meta_key_id)"
                            optionLabel="term"
                            @change="buildMetaData()"
                            
                            :filter="true"
                            placeholder="Select Keyword" />
-->

                    </div>

                  </div>
<!--
                    </AccordionTab>
                  </Accordion>    
                  -->
                </TabPanel>
              </TabView>
              
        </div>

    <br/>
    <br/>
  </div>
</template>


<style>
.p-chip .p-button {
  height: 1rem;
  width: 1rem;
}

.p-button.p-button-icon-only.p-button-rounded {
  height: 1rem;
}
.ui-tabs .ui-tabs-panel {
  padding: 0px;
}
.p-tabview .p-tabview-panels {
  padding: 0px !important;
}
.mde-text {

}
.meta-header {
  background-color: var(--primary-100);
}
.meta-desc {
  background-color: var(--surface-300);
}
.meta-hint {
  background-color: var(--surface-200);
}

</style>
