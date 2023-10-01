<template>
    <div class="mde-text-date" v-if="isMetaKeyObjectType(context_key.meta_key_id, 'MetaDatum::TextDate')">

        <SelectButton 
          v-model="show_mode"
          :options="show_mode_options"
          option-label="name"/>

        <br/>
        <div v-if="show_mode.value == 'span'">
          Begin:
          &nbsp;
          <InputText type="date"
            v-model.lazy.trim="textValueStart"/>
          &nbsp;
          Ende:
          &nbsp;
          <InputText type="date"
            v-model.lazy.trim="textValueEnd"/>
          &nbsp;
          <Button @click="textValue = textValueStart + ' - ' + textValueEnd" label="Fertig"/>
            
        </div>
        <div v-else>
          <InputText type="date"
            v-model.lazy.trim="textValue"/>
        
        </div>

        <br/>
        Ergebnis:
          <InputText type="text"
            v-model.lazy.trim="textValue"/>
        
        <br/>
        <br/>
        <Button v-if="meta_data?.meta_key_id" @click="update()">Update</Button>
        <Button v-else @click="update()">Create</Button>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { 
  iMetaData,
  iMLObj
} from '../../api_resources'
import { madekHelper } from '../../modules/madek'
import { apiHelper } from '../../modules/api'
import { errorHelper } from '../../modules/error'
import SelectButton from 'primevue/selectbutton'
const { api, authParams } = apiHelper()
const { error_msg, handle_error, reset_error} = errorHelper()

const {
  getMLText,
  createMetaDataTextDate,
  updateMetaDataTextDate,
  isMetaKeyObjectType
} = madekHelper()

export default defineComponent({
  name: 'MetaDataEditTextDate',
  props: {

    resource_key: { type: String, required: true},
    resource_id: { type: String, required: true},
    context_key: { type: Object, required: true},
    meta_key: { type: Object, required: true},
    meta_data: { type: Object, required: false},
    
  },
  components: {
    SelectButton: SelectButton
  },
  
  emits: ['hasChanged'],
  data () {
    return {
      error_msg: '' as string,
      textValue: '' as string,
      textValueStart: '' as string,
      textValueEnd: '' as string,
      show_mode: 'stamp' as string,
      show_mode_options: [
        { name: 'Zeitpunkt', value: 'stamp' },
        { name: 'Zeitspanne', value: 'span' },
        
      ]
    }
    
  },
  mounted () {
    const _this = this
    _this.textValue = _this.meta_data?.string
    this.$watch('meta_data', (changed) => {
      _this.textValue = _this.meta_data?.string
      //console.log("meta-data changed: " + this.textValue)
    })
  },
  methods: {
    handle_error: handle_error,
    reset_error: reset_error,
    getMLText: getMLText,
    isMetaKeyObjectType: isMetaKeyObjectType,
    createMetaData() {
      const meta_key_id = this.context_key.meta_key_id
      const onCreated = (json:any) => {
        const mdnew = json['result']
        console.log("created meta data\n json: " + JSON.stringify(mdnew))
        this.$emit("hasChanged", meta_key_id)
      }
      createMetaDataTextDate(this.resource_key, this.resource_id,
        meta_key_id, this.textValue, onCreated)

},
updateMetaData() {
  const meta_key_id = this.context_key.meta_key_id

  const onUpdated = (json:any) => {
    
    const mdnew = json['result']
    console.log("updated meta data\n json: " + JSON.stringify(mdnew))
    this.$emit("hasChanged", meta_key_id)
  }
  updateMetaDataTextDate(this.resource_key, this.resource_id,
      meta_key_id, this.textValue, onUpdated)

   
  
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
.mde-text-date {
  
}
  
</style>
