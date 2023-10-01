<template>
    <div class="mde-text" v-if="meta_key?.meta_datum_object_type === 'MetaDatum::Text'">
      <p>
        
        <div v-if="meta_key.text_type === 'line'">
          <InputText type="text" style="width:100%"
              v-model.lazy.trim="textValue"/>
        </div>
        <div v-else>
          <TextArea v-model="textValue" rows="7" style="width:100%"/>  
        </div>
        <br/>

        <Button v-if="meta_data?.meta_key_id" @click="update()">Update</Button>
        <Button v-else @click="update()">Create</Button>
      </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TextArea from 'primevue/textarea'
import InputText from 'primevue/inputtext'

import { 
  iMetaData
} from '../../api_resources'

import { errorHelper } from '../../modules/error'
import { madekHelper } from '../../modules/madek'
import { apiHelper } from '../../modules/api'

const { api, authParams } = apiHelper()
const { error_msg, handle_error, reset_error} = errorHelper()

const {
  getMLText,
  createMetaDataText,
  updateMetaDataText,
} = madekHelper()

export default defineComponent({
  name: 'MetaDataEditText',
  props: {
    resource_key: { type: String, required: true},
    resource_id: { type: String, required: true}, 
    context_key: { type: Object, required: true},
    //meta_key_id: { type: String, required: true},
    meta_key: { type: Object, required: true},
    meta_data: { type: Object, required: false},
    
  },
  components: {
    InputText: InputText,
    TextArea: TextArea,
  },

  emits: ['hasChanged'],
  data () {
    return {
      error_msg: error_msg, //'' as string,

      textValue: '' as string
    }
    
  },
  mounted () {
    const _this = this

    _this.textValue = _this.meta_data?.string

    this.$watch('meta_data', (changed) => {
      _this.textValue = _this.meta_data?.string
      console.log("meta-data changed: " + this.textValue)
      //console.log("meta-data changed: " + this.meta_data?.string)
    })

  },
  methods: {
    handle_error: handle_error,
    reset_error: reset_error,

    getMLText: getMLText,
    createMetaData() {
    
      const onCreatedMD = (json:any) => {
        console.log("Created: " + JSON.stringify(json))
        this.$emit("hasChanged", this.context_key.meta_key_id)
      }

      createMetaDataText(this.resource_key, this.resource_id,
        this.context_key.meta_key_id, this.textValue, onCreatedMD)

    },
    updateMetaData() {
      const metaData = this.meta_data || {} as iMetaData
      
      const body = {'string': this.textValue }

      const meta_key_id = this.context_key.meta_key_id
      //const mdid = metaData.id
      //const cid = metaData.collection_id
      //const meid = metaData.media_entry_id
      const mkid = encodeURIComponent(metaData.meta_key_id)
      console.log("updateMetaData: " 
        + "\nmeta data : " + JSON.stringify(metaData)
        //+ "\nmdid: " + mdid
        //+ "\ncid: " + cid
        //+ "\nmeid: " + meid
        + "\n" + JSON.stringify(body))

      const onUpdated = (json: any) => {
        console.log("updated meta data")
        const mdnew = json['result']
        console.log("updated meta data\n json: " + JSON.stringify(mdnew))
        this.$emit("hasChanged", meta_key_id)
      }


     updateMetaDataText(this.resource_key, this.resource_id,
      meta_key_id, this.textValue,  onUpdated)
    },
    update() {
      if (!this.meta_data) {
        console.log("Create new: No meta data yet")
        this.createMetaData()
      } else {
        console.log("Update meta data")
        this.updateMetaData()
      }
    }
  }
})

</script>
<style>
.mde-text {
  
}
  
</style>
