<template>
    <div class="mde-json" v-if="meta_key?.meta_datum_object_type === 'MetaDatum::JSON'">
      <p>
        <span>Label: {{ getMLText(meta_key.labels) }}</span>
        <br/>
        <span>Description: {{ getMLText(meta_key.descriptions) }}</span>
        <br/>
        <span>Required: {{ context_key.is_required }}</span>
        <br/>
        <span>MetaDataEditJSON</span>
        <br/>
        <span>Meta-Key-Id: {{ context_key.meta_key_id }}</span>
        <br/>
        
      </p>
      <p>
        
        
        <div v-if="meta_key.text_type === 'line'">
          <p>Line Edit</p>
          <p>ML {{ context_key }} Lmax {{ context_key.length_max }}</p>
          <InputText type="text"
            
            v-model.lazy.trim="textValue"/>
          
          <Button @click="updateMetaDataText()">Update</Button>
        </div>
        <div v-else>
          <p>TextArea Edit</p>
        </div>
      </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { 
  iMetaData
} from '../../api_resources'

import { madekHelper } from '../../modules/madek'
const {
  getMLText
} = madekHelper()

export default defineComponent({
  name: 'MetaDataEditJson',
  props: {

    resource_key: { type: String, required: true},
    resource_id: { type: String, required: true},
    context_key: { type: Object, required: true},
    meta_key: { type: Object, required: true},
    meta_data: { type: Object, required: false},

  },
  components: {
  },
  computed: {
  },
  data () {
    return {
      error_msg: '' as string,
      textValue: '' as string
    }
    
  },
  mounted () {
    const _this = this
    setTimeout(() => {
      this.textValue = this.meta_data?.string
    },200)
    
  },
  methods: {
    handle_error (msg:string, error:Response) {
      const mmsg = 'ERROR: ' + msg + ' status: ' + error.status
      console.error(mmsg)
      this.error_msg = mmsg
    },
    reset_error () { this.error_msg = 'no error' },
    getMLText: getMLText,
    updateMetaDataText() {
      if (!this.meta_data) {
        console.log("Create new: No meta data yet")
      } else {
        console.log("Update meta data")
        this.meta_data.json = this.textValue
      }
      const metaData = this.meta_data || {} as iMetaData
      
      const body = {'json': metaData.json}

      const mdid = metaData.id
      const cid = metaData.collection_id
      const meid = metaData.media_entry_id
      const mkid = encodeURIComponent(metaData.meta_key_id)
      console.log("update meta data " 
        + "\nmkid: " + mkid
        + "\nmdid: " + mdid
        + "\ncid: " + cid
        + "\nmeid: " + meid
        + "\n" + JSON.stringify(body))
/*
      api.api.collectionMetaDataTextUpdate(cid, mkid ,body)
      .then(result => {
        console.log("updated meta data")
        result.json().then(json => {
          const mdnew = json['result']
          console.log("updated meta data\n json: " + JSON.stringify(mdnew))
          
          this.colMetaData.set(mdnew.id, mdnew as iMetaData)
        })
      })
      .catch(error => {
		    console.log("ERROR: " + error)
      })
      */
    }
  }
})

</script>
<style>
.mde-json {
  border: 1px solid blue;
}
  
</style>
