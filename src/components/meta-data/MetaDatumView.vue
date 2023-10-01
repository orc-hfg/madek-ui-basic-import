<template>
  <div class="metaDatumView">
    <div v-if="isMetaKeyObjectType('MetaDatum::Text')">
      <span>{{ getMetaDataValueText() }}</span>
    </div>

    <div v-else-if="isMetaKeyObjectType('MetaDatum::TextDate')">
      <span>{{ getMetaDataValueText() }}</span>
    </div>

    <div v-else-if="isMetaKeyObjectType('MetaDatum::JSON')">
      <JsonViewer :value="getMetaDataValueJson()" />
      <br />
      <span>{{ getMetaDataValueJson() }}</span>
    </div>

    <div v-else-if="isMetaKeyObjectType('MetaDatum::People')">
      <Chip v-for="person in getMetaDataPeopleData()">
        <span>{{ person.first_name }}</span>
        &nbsp;
        <span>{{ person.last_name }}</span>
      </Chip>
      &nbsp;
    </div>

    <div v-else-if="isMetaKeyObjectType('MetaDatum::Keywords')">
      <Chip v-for="kw in getMetaDataKeywordData()">
        <span>{{ kw.term }}</span>
      </Chip>
    </div>

    <div v-else-if="isMetaKeyObjectType('MetaDatum::Roles')">
      <p>TODO Roles view</p>
    </div>

    <div v-else>Unknown Meta-Data type</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { hasOwn } from "@vue/shared";
import { iMLObj } from "../../api_resources";
import Chip from "primevue/chip";

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
</script>
<style scoped>
.metaDatumView {
  padding: 0.25em;
  font-weight: bolder;
}
</style>
