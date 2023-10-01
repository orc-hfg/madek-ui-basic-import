<template>
    <div class="mde-people" v-if="isMDPeople()">
      <div v-if="isReady()">
        <p>
          <Button 
            :disabled="!hasChanged()"
            @click.prevent="doUpdate()"
            label="Update"/>
        </p>
        <p>
          Selected People:
          <br/>

          <span v-for="person in selectedList" class="chipItem">
            <Chip>
              
              {{ person.first_name }}
              {{ person.last_name }}
              &nbsp;
              <Button
                
                icon="pi pi-times"
                rounded outlined
                size="small"
                @click.prevent="removePerson(person.id)"/>
            </Chip>
          </span>
          <br/>
          
          <hr/>

          <Button @click="showPersonSearch = !showPersonSearch" label="Person hinzufügen"/>
          &nbsp;
          <Button @click="showGroupSearch = !showGroupSearch" label="Gruppe hinzufügen"/>
          <br/>
     
        </p>

      </div>

      <Dialog v-model:visible="showPersonSearch" >
        <PeopleSearch
          @selectedPerson="selectedPerson"
          :subtype="'Person'"/>
      </Dialog>
      <Dialog v-model:visible="showGroupSearch" >
        <PeopleSearch
          @selectedPerson="selectedGroup"
          :subtype="'PeopleGroup'"/>
      </Dialog>
      
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Chips from 'primevue/chips'
import Chip from 'primevue/chip'
import MultiSelect from 'primevue/multiselect'
import PeopleSearch from '../people/PeopleSearch.vue'
import Dialog from 'primevue/dialog'
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

import { madekHelper } from '../../modules/madek'
import { errorHelper } from '../../modules/error'
import { apiHelper } from '../../modules/api'

const {
  MD_TYPE_PEOPLE,
  MD_PEOPLE,
  MD_PEOPLE_DATA,
  
  metaKeysMapByMetaKey,
  createMDPeople,
  deleteMDPeople,
  getMLText,
  isMetaKeyObjectType,
  getMetaDataExtended
  
} = madekHelper()

const { api, authParams } = apiHelper()
const { error_msg, handle_error, reset_error} = errorHelper()


export default defineComponent({
  name: 'MetaDataEditPeople',
  props: {

    resource_key: { type: String, required: true},
    resource_id: { type: String, required: true},
    meta_key_id: { type: String, required: true},
    
  },
  components: {
    Chip: Chip,
    Chips: Chips,
    MultiSelect: MultiSelect,
    PeopleSearch: PeopleSearch,
    Dialog: Dialog
  },
  emits: ['hasChanged'],
  data () {
    return {
      error_msg: '' as string,
      selectedIds: [] as string[],
      selectedList: new Array<iPerson>(),
      metaDataExtended: {} as Object,
      metaKeys: metaKeysMapByMetaKey,
      showPersonSearch: false as boolean,
      showGroupSearch: false as boolean,

    }
  },
  
  mounted () {
    const _this = this
    _this.getMDPeople();

    this.$watch('resource_id', (data) => {
      console.log("resource_id changed: " + this.resource_id)
      _this.getMDPeople();
    })

    this.$watch('meta_key_id', (data) => {
      console.log("meta_key_id changed: " + this.meta_key_id)
      _this.getMDPeople();
    })
    
  },
  methods: {
    handle_error: handle_error,
    reset_error: reset_error,

    getMLText: getMLText,
    isMetaKeyObjectType: isMetaKeyObjectType,
    isReady() {
      return true
    },
    
    
    
    isMDPeople() {
      if (!this.meta_key_id || this.meta_key_id === undefined) {
        console.log("getMDPeople: No meta key id. abort.")
        return false
      }
      return isMetaKeyObjectType(this.meta_key_id, MD_TYPE_PEOPLE)
    },
    selectedPerson(person: iPerson) {
      this.selectedList.push(person)
      this.showPersonSearch = false
    },

    selectedGroup(person: iPerson) {
      
      this.selectedList.push(person)
      this.showGroupSearch = false
    },

    getMDPeople() {
      this.reset_error()
      
      if (!this.isMDPeople()) {
        //console.log("getMDPeople: Not MD people. abort.")
        return
      }
      
      const onJsonMetaDataExtended = (json: any) => {
        this.metaDataExtended = json
        
        this.selectedList = new Array<iPerson>()
        this.metaDataExtended[MD_PEOPLE].forEach((kw:iPerson) => {
          this.selectedList.push(kw)
        })
      }
      getMetaDataExtended(this.resource_key, this.resource_id,
        this.meta_key_id, onJsonMetaDataExtended)

      
    },
    hasChanged() {
      const count = this.metaDataExtended
        && this.metaDataExtended[MD_PEOPLE]
        && this.metaDataExtended[MD_PEOPLE].length || 0

      if (count != this.selectedList.length) {
          return true
        }
        return false
    },
    removePerson(pid: string) {
      this.selectedList = this.selectedList.filter(person => {
        return person.id !== pid
      })
    },
    addPerson(person: iPerson) {
      this.selectedList.push(person)
    },

    onOk(result:any){
      console.log("onOk: " + JSON.stringify(result))
    },
    onCreateError(result:any) {
      console.error("Could not create md people")
    },
    doUpdate() {
      
      if (!this.metaDataExtended
        || !this.metaDataExtended[MD_PEOPLE]) {
          console.log("doUpdate: do create meta data ")

          this.selectedList.forEach((person:iPerson) => {
            createMDPeople(this.resource_key, this.resource_id, this.meta_key_id, person.id, this.onOk, 
              this.onCreateError)
            
         })
      }
      else {
        console.log("doUpdate: do update meta data ")

        const kws_before = this.metaDataExtended[MD_PEOPLE] as iPerson[]
        const kws_after = this.selectedList
        const toDelete = new Array<iPerson>()
        const toAdd = new Array<iPerson>()

        kws_after.forEach((kwa:iPerson) => {
            const hadkw = kws_before.find(kw => { return kw.id === kwa.id})
            if (!hadkw || !hadkw.id) {
              toAdd.push(kwa)
            }
        })

        kws_before.forEach((kwb:iPerson) => {
            const hadkw = kws_after.find(kw => { return kw.id === kwb.id})
            if (!hadkw || !hadkw.id) {
              toDelete.push(kwb)
            }
        })

        console.log("doUpdate: \n"
        + "\nBefore:\n" + JSON.stringify(kws_before) 
        + "\nAfter:\n" + JSON.stringify(kws_after) 
        + "\nAdd:\n" + JSON.stringify(toAdd) 
        + "\nDelete:\n" + JSON.stringify(toDelete))
        
        toAdd.forEach((p:iPerson) => {
          createMDPeople(this.resource_key, this.resource_id, this.meta_key_id, p.id,this.onOk, () => {
              console.error("Could not create md people")
            })
        })
        toDelete.forEach((p:iPerson) => {
          deleteMDPeople(this.resource_key, this.resource_id, this.meta_key_id, p.id,this.onOk)
        })

      }
    },

  }
})

</script>
<style>
.mde-people {
  
}
  
</style>
