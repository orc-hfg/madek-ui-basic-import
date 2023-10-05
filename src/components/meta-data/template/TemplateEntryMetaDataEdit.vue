<script lang="ts" setup>
import { ref, onMounted, watch, PropType, getTransitionRawChildren } from 'vue'

import Chip from 'primevue/chip';

import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';
import PeopleSearch from '../../people/PeopleSearch.vue';
import GroupSearch from '../../people/GroupSearch.vue';
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
import OkOrError from '../../OkOrError.vue';

const { api } = apiHelper()
const { error_msg, ok_msg, timed_handle_ok, timed_handle_error } = errorHelper()

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

    createMDKeywords,
    createMDPeople,
    deleteMDKeywords,
    deleteMDPeople,

    initMD,
    copyMDInto,

} = madekHelper()

const props = defineProps(
  {
    meta_data:  { type: Object as PropType<GenMetaData>, default: {}, required: true},
    context_ids: { type: Array<String>, required: true},
    resource_id: { type: String, required: false },
    resource_key: { type: String, required: false },
    publish_result: { type: Boolean, required: false, default: true },
    show_descs: { type: Boolean, required: false, default: true },
    show_hints: { type: Boolean, required: false, default: true },
    show_keys: { type: Boolean, required: false, default: true },
    hide_meta_keys: { type: Map<String,Boolean>, required: false, default: {} }
  }
)

//meta_data:  { type: Object as PropType<GenMetaData>, default: {}, required: true},
//const meta_data = ref({} as GenMetaData)

const buildMetaData = () => {
  //copyMDInto(meta_data.value, props.result_meta_data, true)
}

const showGroupSearch = ref(false)
const showPersonSearch = ref(false)
interface iShowModeOptions {
  name: string,
  value: string
}
const text_date_show_mode_options = [
  { name: 'Freitext', value: 'free' },
  { name: 'Zeitpunkt', value: 'stamp' },
  { name: 'Zeitspanne', value: 'span' }
]
const text_date_show_mode = ref({})


//const peopleList = ref([] as iPerson[])
//const peopleSearch = ref('' as string)
/*
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
*/
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
        text_date_show_mode.value[mkey.id] = text_date_show_mode_options[0]

        if (!contextKeysMap.value.has(cid)) {
          contextKeysMap.value.set(cid, [] as iContextKey[])
        }
        //contextKeysMap.value.set(mkey.id, )
        contextKeysMap.value.get(cid).push(ckey)
      }

    })
  })

}

const getSelectedPeople = (meta_key_id:string) => {
  const result = props.meta_data[meta_key_id].selectedPeople
  return result
}

const getSelectedKeywords = (meta_key_id:string) => {
  const result = props.meta_data[meta_key_id]?.selectedKeywords
  return result
}
const selectingPeopleMetaKeyId = ref('')
const clickedSelectPersonShow = (meta_key_id:string) => {
  selectingPeopleMetaKeyId.value = meta_key_id
  showPersonSearch.value = true
}
const clickedSelectGroupShow = (meta_key_id:string) => {
  selectingPeopleMetaKeyId.value = meta_key_id
  showGroupSearch.value = true
}

const saveSelectedPerson = (mkid: string, person: iPerson) => {
  createMDPeople(props.resource_key, props.resource_id,
    mkid, person.id, () => {
      console.log("Created MD people.")
      timed_handle_ok("Meta-Datum Person angelegt.")
    }, (error:any) => {
      console.error("Could not create MD people: " + JSON.stringify(error))
      timed_handle_error("Meta-Datum Person konnte nicht angelegt werden.",error)
    })
}
const selectedPerson = (person: iPerson) => {
  const mkid = selectingPeopleMetaKeyId.value
  props.meta_data[mkid].selectedPeople.push(person)
  saveSelectedPerson(mkid, person)
  showPersonSearch.value = false
}
const selectedGroup = (person: iPerson) => {
  const mkid = selectingPeopleMetaKeyId.value
  props.meta_data[mkid].selectedPeople.push(person)
  saveSelectedPerson(mkid, person)
  showGroupSearch.value = false
}
const isPeopleAllowedPerson = (meta_key_id: string) => {
  const mk = getMetaKey(meta_key_id)
  const result = !!mk?.allowed_people_subtypes?.find((val) => { return val === 'Person'})
  //console.log("Person? subtypes "  + mk?.allowed_people_subtypes + ":" + result)
  return result
}
const isPeopleAllowedGroup = (meta_key_id: string) => {
  const mk = getMetaKey(meta_key_id)
  const result = !!mk?.allowed_people_subtypes?.find((val) => { return val === 'PeopleGroup'})
  //console.log("Group? subtypes "  + mk?.allowed_people_subtypes + ":" + result)
  return result
}
/*
watch([peopleSearch], (val) => {
  getPeople()
})
*/

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
  createMDKeywords(props.resource_key, props.resource_id, meta_key_id, kw.id, () => {
    console.log("created md keyword")
    timed_handle_ok("Keyword Meta-Daten angelegt.")
    
  }, (error:any) => {
    console.error("Could not create md keyword: " + JSON.stringify(error))
    timed_handle_error("Keyword konnte nicht angelegt werden.", error)
  })
  buildMetaData()
}

const removeKeyword = (meta_key_id: string, kwid: string) => {
  props.meta_data[meta_key_id].selectedKeywords =
    props.meta_data[meta_key_id].selectedKeywords.filter( (kw:iKeyword) => { return kw.id !== kwid})
  deleteMDKeywords(props.resource_key, props.resource_id,meta_key_id, kwid, () => {
    console.log("deleted md kw")
    timed_handle_ok("Keyword Meta-Daten gelöscht.")
  }, (error:any) => {
    console.error("Could not delete md keyword: " + JSON.stringify(error))
    timed_handle_error("Keyword konnte nicht gelöscht werden.", error)
  })
  buildMetaData()
}

const getMetaKeyFilteredKeywords = (meta_key_id: string, search: string) => {
  if (search.length > 0) {
    return getMetaKeyKeywords(meta_key_id)?.filter( (kw: iKeyword) => { return kw.term.indexOf(search) > 0})
  }
  return getMetaKeyKeywords(meta_key_id);
}
/*
const addPerson = (meta_key_id: string, person: iPerson) => {
  if (!props.meta_data[meta_key_id].selectedPeople) {
    props.meta_data[meta_key_id].selectedPeople = [] as iPerson[]
  }
  props.meta_data[meta_key_id].selectedPeople.push(person)
  buildMetaData()
}*/

const removePerson = (meta_key_id: string, pid: string) => {
  props.meta_data[meta_key_id].selectedPeople =
    props.meta_data[meta_key_id].selectedPeople.filter( (p:iPerson) => { return p.id !== pid})
    deleteMDPeople(props.resource_key, props.resource_id,
      meta_key_id, pid, () => {
        console.log("removed md people")
        timed_handle_ok("Meta-Datum People gelöscht.")
      }, (error:any) => {
        console.error("Could not delete md people: " + JSON.stringify(error))
        timed_handle_error("Could not delete md people", error)
      })
  buildMetaData()
}
</script>

<template>
  <div class="mde-entry">
    <OkOrError :error_msg="error_msg" :ok_msg="ok_msg" class="messages"/>
    <div>
      <TabView :scrollable="true">
        <TabPanel v-for="context_id in context_ids">
          <template #header>
            <span>{{ getContextML(context_id, "labels") || context_id }}</span>
            <span v-if="show_keys">[{{ context_id }}]</span>
          </template>

          <p v-if="show_descs && getContextML(context_id, 'descriptions')">
            <span>{{ getContextML(context_id, "descriptions") }}</span>
          </p>

          <div
            v-for="contextKey in contextKeysMap.get(context_id)"
            class="border-1 surface-border pb-1"
            
          >
            <div v-if="hide_meta_keys && hide_meta_keys[contextKey.meta_key_id]
              && hide_meta_keys[contextKey.meta_key_id] == true"></div>
            <div v-else>
            <div
              
              class="border-1 surface-border px-3 py-2 meta-header"
              :class="{ missing: isMissingKey(contextKey.meta_key_id) }"
            >
              <span>{{
                getMetaKeyML(contextKey.meta_key_id, "labels") || contextKey.meta_key_id
              }}</span>

              <span class="" v-if="contextKey.is_required">*</span>

              <i
                class="pi pi-question"
                title="Fehlende Meta-Daten!"
                v-if="isMissingKey(contextKey.meta_key_id)"
              />

              <span v-if="show_keys">[{{ context_id }}]</span>
              <!--<span>{{ isMissingKey(contextKey.meta_key_id) && 'Missing!' || '' }}</span>-->
            </div>

            <div
              class="px-3 py-1 meta-desc"
              v-if="show_descs && getMetaKeyML(contextKey.meta_key_id, 'descriptions')"
            >
              <span>{{ getMetaKeyML(contextKey.meta_key_id, "descriptions") }}</span>
            </div>

            <div
              class="px-3 py-1 meta-hint"
              v-if="show_hints && getMetaKeyML(contextKey.meta_key_id, 'hints')"
            >
              <span>{{ getMetaKeyML(contextKey.meta_key_id, "hints") }}</span>
            </div>

            <div
              class="mde-text"
              v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_TEXT)"
            >
              <div v-if="getMetaKey(contextKey.meta_key_id).text_type === 'line'">
                <InputText
                  type="text"
                  style="width: 100%"
                  @change="buildMetaData()"
                  v-model.lazy.trim="meta_data[contextKey.meta_key_id].string"
                />
              </div>

              <div v-else>
                <TextArea
                  v-model="meta_data[contextKey.meta_key_id].string"
                  @change="buildMetaData()"
                  rows="7"
                  style="width: 100%"
                />
              </div>

              <br />
            </div>

            <div
              class="mde-text"
              v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_TEXT_DATE)"
              >
              <div class="bg:surface-200 px-3 py-2 gap-2 meta-desc flex flex-row">
                <div class="py-2">Eingabe:</div>
                <div>
                  <SelectButton 
                    v-model="text_date_show_mode[contextKey.meta_key_id]"
                    :options="text_date_show_mode_options"
                    option-label="name"/>
                </div>
              </div>

              <div class="flex flex-row gap-2 px-3 py-2"
                v-if="text_date_show_mode[contextKey.meta_key_id].value == 'span'">
                  <div class="flex flex-row gap-1">
                    <div class="py-2">
                      Begin:
                    </div>
                    <InputText type="date"
                      v-model.lazy.trim="textValueStart"/>
                  </div>

                  <div class="flex flex-row gap-1">
                    <div class="py-2">
                      Ende:
                    </div>
                    <InputText type="date"
                      v-model.lazy.trim="textValueEnd"/>
                  </div>

                  <Button @click="meta_data[contextKey.meta_key_id].string = textValueStart + ' - ' + textValueEnd" label="Fertig"/>
              </div>
              <div class="flex flex-row gap-2 px-3 py-2"
                v-else-if="text_date_show_mode[contextKey.meta_key_id].value == 'stamp'">
                <InputText type="date"
                  v-model.lazy.trim="meta_data[contextKey.meta_key_id].string"/>
              </div>

              <div v-else>
                <InputText type="text"
                  v-model.lazy.trim="meta_data[contextKey.meta_key_id].string"/>
              </div>

              <div class="bg:surface-200 px-3 py-2 gap-2 meta-desc flex flex-row">
                <div class="py-2">Ergebnis:</div>
                <InputText type="text"
                v-model.lazy.trim="meta_data[contextKey.meta_key_id].string"/>
              </div>
              
                
              

        
<!--
              <p>
               <InputText
                  type="date"
                  style="width: 100%"
                  @change="buildMetaData()"
                  v-model.lazy.trim="meta_data[contextKey.meta_key_id].string"
                />
             <br />
              </p>
-->
            </div>

            <div
              class="mde-text"
              v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_JSON)"
              >
              <p>
              <TextArea
                  v-model="meta_data[contextKey.meta_key_id].json"
                  @change="buildMetaData()"
                  rows="7"
                  style="width: 100%"
                />

                <br />
              </p>
            </div>

            <div
              class="mde-text"
              v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_PEOPLE)"
            >
              <div class="bg:surface-200 px-3 py-1 meta-desc">Auswahl:</div>

              <div class="flex flex-wrap px-3 py-3 meta-hint">
                <div
                  class="flex flex-wrap px-1 py-1"
                  v-for="person in getSelectedPeople(contextKey.meta_key_id)"
                
                  >
                  <Button
                    severity="secondary"
                    rounded
                    size="small"
                    @click.prevent="removePerson(contextKey.meta_key_id, person.id)"
                  >
                  <span>
                  {{ person.first_name }}
                  {{ person.last_name }}
                  </span>
                  &nbsp;
                    <i class="pi pi-times" />
                  </Button>
  
                </div>
              </div>
              

              <hr />

              <div class="bg:surface-200 px-3 py-2 meta-desc flex flex-row gap-3">
                <div class="py-2">Hinzufügen:</div>
                <div v-if="isPeopleAllowedPerson(contextKey.meta_key_id)">
                  <Button
                    @click="clickedSelectPersonShow(contextKey.meta_key_id)"
                    label="Person hinzufügen"
                  />
                </div>

                <div v-if="isPeopleAllowedGroup(contextKey.meta_key_id)">
                  <Button
                    @click="clickedSelectGroupShow(contextKey.meta_key_id)"
                    label="Gruppe hinzufügen"
                  />
                </div>
              
              </div>

            </div>

            <div
              class="mde-text"
              v-if="isMetaKeyObjectType(contextKey.meta_key_id, MD_TYPE_KEYWORDS)"
            >
              <div class="bg:surface-200 px-3 py-1 meta-desc">Auswahl:</div>

              <div class="flex flex-wrap px-3 py-3 meta-hint">
                <div
                  class="flex flex-wrap px-1 py-1"
                  v-for="kw in getSelectedKeywords(contextKey.meta_key_id)"
                >
                  <Button
                    severity="secondary"
                    rounded
                    size="small"
                    @click.prevent="removeKeyword(contextKey.meta_key_id, kw.id)"
                  >
                    <span>{{ kw.term }}</span>
                    &nbsp;
                    <i class="pi pi-times" />
                  </Button>
                </div>
              </div>

              <hr />

              <div class="bg:surface-200 px-3 py-1 meta-desc">
                Verfügbar:
                <InputText v-model.lazy.trim="kwsearch" />
              </div>

              <div class="flex flex-wrap px-2 gap-2 py-3 meta-hint meta-kw-search">
                <div
                  class="flex flex-wrap px-1 h-2rem"
                  v-for="kw in getMetaKeyFilteredKeywords(
                    contextKey.meta_key_id,
                    kwsearch
                  )"
                >
                  <Button
                    v-if="!isKeywordSelected(contextKey.meta_key_id, kw.id)"
                    icon="pi pi-plus"
                    :label="kw.term"
                    rounded
                    size="small"
                    @click.prevent="addKeyword(contextKey.meta_key_id, kw)"
                  />
                </div>
              </div>
              
            </div>

            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <br />
    <br />
    <Dialog v-model:visible="showPersonSearch" class="people-search">
      <PeopleSearch @selectedPerson="selectedPerson" :subtype="'Person'" />
    </Dialog>
    <Dialog v-model:visible="showGroupSearch" class="people-search">
      <PeopleSearch @selectedPerson="selectedGroup" :subtype="'PeopleGroup'" />
    </Dialog>
    <!--
      <Dialog v-model:visible="showKeywordSearch" >
        <PeopleSearch
          @selectedPerson="selectedGroup"
          :subtype="'PeopleGroup'"/>
      </Dialog>
      -->
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
.pi.pi-question {
  font-size: 0.8rem !important;
}
.meta-header.missing {
  background-color: var(--pink-400);
}
.meta-desc {
  background-color: var(--surface-300);
}
.meta-hint {
  background-color: var(--surface-200);
}
.people-search {
  width: 70vw;
}
.meta-kw-search {
  max-height: 10rem;
  overflow-y: auto;
}
.messages {
  position: fixed;
  bottom: 0.5rem;
  right: 2rem;
  
  
  z-index: 300;
  

}
</style>
