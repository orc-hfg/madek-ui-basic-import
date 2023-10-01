<template>
    <div class="mde-keywords" 
      v-if="isMDKeyword()">
      <div v-if="isReady()">
        <p>
          <Button 
            :disabled="!hasChanged()"
            @click.prevent="doUpdate()"
            label="Update"/>
        </p>
        <p>
          <h5>Ausgewählte Schlagwörter:</h5>
          <br/>

          <span v-for="kw in selectedList" class="chipItem">
            <Button
                severity="secondary"
                :label="kw.term"
                icon="pi pi-trash"
                rounded 
                size="small"
                @click.prevent="removeKeyword(kw.id)"/>

          </span>
          <br/>
          
          <hr/>

          <h5>Verfügbare Schlagwörter:</h5>
          
          <br/>

          <span v-for="kw in getMetaKeyKeywords(meta_key_id)" class="chipItem">
            <Button
              v-if="!isKeywordSelected(kw.id)" 
              icon="pi pi-plus"
              :label="kw.term"
                rounded
                size="small"
                @click.prevent="addKeyword(kw)"/>
              
          </span>
        </p>

      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Chip from 'primevue/chip'

import { iKeyword } from '../../api_resources'
import { madekHelper } from '../../modules/madek'

import { apiHelper } from '../../modules/api'
import { errorHelper } from '../../modules/error'

const { error_msg, handle_error, reset_error} = errorHelper()
const { api, authParams } = apiHelper()
const {
  MD_TYPE_KEYWORDS,
  MD_KEYWORDS,
  MD_KEYWORDS_DATA,
  getMetaKeyKeywords,
  getMLText,
  getMetaDataExtended,
  createMDKeywords,
  deleteMDKeywords,
  isMetaKeyObjectType
} = madekHelper()


export default defineComponent({
  name: 'MetaDataEditKeywords',
  props: {

    resource_key: { type: String, required: true},
    resource_id: { type: String, required: true},
    meta_key_id: { type: String, required: true},
    context_key: { type: Object, required: true},
    meta_key: { type: Object, required: true},
    
  },
  components: {
    Chip: Chip
  },

  data () {
    return {
      error_msg: '' as string,
      selectedList: new Array<iKeyword>(),
      metaDataExtended: {} as object,
      changed: false as boolean
    }
  },
  
  mounted () {
    const _this = this
    
    _this.getMDKeywords();

    this.$watch('resource_id', (data) => {
      console.log("resource_id changed: " + this.resource_id)
      _this.getMDKeywords();
    })
  },
  methods: {
    isReady() {
      /*
      if (!this.keywords) {
        return false
      }
      */
      return true
    },
    handle_error: handle_error,
    reset_error: reset_error,
    getMLText: getMLText,
    getMetaKeyKeywords: getMetaKeyKeywords,

    isMDKeyword() {
      if (!this.meta_key_id || this.meta_key_id === undefined) {
        console.log("ABORT: no meta key yet")
        return false
      }
      return isMetaKeyObjectType(this.meta_key_id, MD_TYPE_KEYWORDS)
    },

    getMDKeywords() {
      this.reset_error()
      

      if (!this.isMDKeyword()) {
          console.log("getMDKeywords: wrong md type.")
          return
      }
      const mkid = encodeURIComponent(this.meta_key_id)

      const onMDEx = (json:any) => {
        this.metaDataExtended = json
        this.selectedList = new Array<iKeyword>()
        this.metaDataExtended[MD_KEYWORDS].forEach(kw => {
          this.selectedList.push(kw)
        })
      }
      getMetaDataExtended(this.resource_key, this.resource_id, this.meta_key_id, onMDEx)

    },
    hasChanged() {
      const count = this.metaDataExtended
        && this.metaDataExtended[MD_KEYWORDS]
        && this.metaDataExtended[MD_KEYWORDS].length || 0

      if (count != this.selectedList.length) {
          return true
        }
        return this.changed
    },
    isKeywordSelected(kwid: string) {
      const found = this.selectedList.find(kw => {
        return kw.id == kwid
      })
      if (found && found.id) return true
      return false
    },
    removeKeyword(kwid: string) {
      this.selectedList = this.selectedList.filter(kw => {
        return kw.id !== kwid
      })
      this.changed = true
    },
    addKeyword(kw: iKeyword) {
      this.selectedList.push(kw)
      this.changed = true
    },
    onCreateOk(result: string) {
      console.log("create md keyword")
      this.getMDKeywords()
    },
    onCreateError(error:string) {
      console.error("Could not create md keyword")
    },
    doUpdate() {
      
      if (!this.metaDataExtended
        || !this.metaDataExtended[MD_KEYWORDS_DATA]) {
          console.log("doUpdate: do create meta data ")

          
          this.selectedList.forEach((kw:iKeyword) => {

            createMDKeywords(this.resource_key, this.resource_id,
              this.meta_key_id, kw.id, this.onCreateOk,this.onCreateError)
          })
        }
      else {
        const kws = this.getMetaKeyKeywords(this.meta_key_id)
        const kws_before = this.metaDataExtended[MD_KEYWORDS_DATA] as iKeyword[]
        const kws_after = this.selectedList
        const toDelete = new Array<iKeyword>()
        const toAdd = new Array<iKeyword>()


        kws_after.forEach((kwa:iKeyword) => {
            const hadkw = kws_before.find(kw => { return kw.id === kwa.id})
            if (!hadkw || !hadkw.id) {
              toAdd.push(kwa)
            }
        })

        kws_before.forEach((kwb:iKeyword) => {
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

        
        
        toAdd.forEach((kw:iKeyword) => {
          createMDKeywords(this.resource_key, this.resource_id,
            this.meta_key_id, kw.id, this.onCreateOk, this.onCreateError)
        })
        
        toDelete.forEach((kw:iKeyword) => {
          deleteMDKeywords(this.resource_key, this.resource_id,
            this.meta_key_id, kw.id, this.getMDKeywords)
        })      

        
      }
    }
  }
})

</script>
<style>
.mde-keywords {
  /*border: 1px solid gray;*/
}
.chipItem {
  padding-right: 1em;
}  
</style>
