<template>
  <div class="metaDatumView">
    <div v-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_TEXT)">
      <span>{{ metaData.string }}</span>
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_TEXT_DATE)">
      <span>{{ metaData.string }}</span>
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_JSON)">
      <JsonViewer :value="metaData.json" />
      <!--<br />
      <span>{{ metaData.json }}</span>-->
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_PEOPLE)">
      <Chip v-for="person in metaData.selectedPeople">
        <span>{{ person.first_name }}</span>
        &nbsp;
        <span>{{ person.last_name }}</span>
      </Chip>
      &nbsp;
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_KEYWORDS)">
      <Chip v-for="kw in metaData.selectedKeywords">
        <span>{{ kw.term }}</span>
      </Chip>
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_ROLES)">
      <p>TODO Roles view</p>
    </div>

    <div v-else>Unknown Meta-Data type</div>
  </div>
</template>

<script setup lang="ts">
import Chip from "primevue/chip";
import { madekHelper } from "../../modules/madek";
import { errorHelper } from "../../modules/error";

const {
  MD_KEYWORDS,
  MD_PEOPLE,
  
  MD_TYPE_TEXT,
  MD_TYPE_TEXT_DATE,
  MD_TYPE_JSON,
  MD_TYPE_KEYWORDS,
  MD_TYPE_PEOPLE,
  MD_TYPE_ROLES,

  isMetaKeyObjectType,

} = madekHelper()

const props = defineProps({
  default_locale: { type: String, required: true },

  metaKey: { type: Object, required: true },
  metaData: { type: Object, required: true },
  metaDataExtended: { type: Object, required: true },

  mode: { type: String, required: false },
})
/*
export default defineComponent({
  name: "MetaDatumView",
  props: {
    default_locale: { type: String, required: true },

    metaKey: { type: Object, required: true },
    metaData: { type: Object, required: true },
    metaDataExtended: { type: Object, required: true },

    mode: { type: String, required: false },
  },
  components: {
    Chip: Chip,
  },
  computed: {},
  data() {
    return {
      error_msg: "" as string,
      ready: false as boolean,
    };
  },
  mounted() {},
  methods: {
    handle_error(msg: string, error: Response) {
      const mmsg = "ERROR: " + msg + " status: " + error.status;
      console.error(mmsg);
      this.error_msg = mmsg;
    },
    reset_error() {
      this.error_msg = "no error";
    },

    getMLText(obj: iMLObj) {
      return obj[this.default_locale];
    },

    isMetaKeyObjectType(type: string) {
      if (
        this.metaKey &&
        this.metaKey.meta_datum_object_type &&
        this.metaKey.meta_datum_object_type === type
      ) {
        return true;
      }
      return false;
    },
    getMetaDataValueText() {
      if (this.metaData && this.metaData.string) {
        return this.metaData.string;
      }
      return "";
    },
    getMetaDataValueJson() {
      if (this.metaData && this.metaData.json) {
        return this.metaData.json;
      }
      return "";
    },
    getMetaDataPeopleData() {
      if (this.metaDataExtended && this.metaDataExtended["people"]) {
        return this.metaDataExtended["people"];
      }
      return [];
    },
    getMetaDataKeywordData() {
      if (this.metaDataExtended && this.metaDataExtended["keywords"]) {
        return this.metaDataExtended["keywords"];
      }
      return [];
    },
    checkLoaded() {
      let result = true;
      if (!hasOwn(this.metaData, "id")) {
        result = false;
      }
      this.ready = result;
      return result;
    },
  },
});
*/
</script>
<style scoped>
.metaDatumView {
  padding: 0.25em;
  font-weight: bolder;
}
</style>
