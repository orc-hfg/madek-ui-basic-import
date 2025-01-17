<script lang="ts" setup>

import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { errorHelper } from './modules/error'
import { authHelper } from './modules/auth'

import { useMadekStore } from './stores/madek_store'
import { madekHelper } from './modules/madek'
import OkOrError from './components/OkOrError.vue'

const { error_msg, ok_msg, reset_error } = errorHelper()

const { initMadek, checkAllLoaded } = madekHelper()
const { user } = authHelper()

const store = useMadekStore()
const router = useRouter()

const appDataLoaded = ref(false as boolean)

const initApp = () => {
  initMadek().then(() => {
    console.log("madek loaded")
    const loaded = checkAllLoaded()
    appDataLoaded.value = loaded
    if (loaded == true) {
      ok_msg.value = "Alles fertig!"
    } else {
      error_msg.value = 'Keine Verbidung zur Madek-Api. \
      Versuchen Sie es später noch einmal, oder kontaktieren sie Ihren Administrator.'
    }
      
  })

}

initApp()
const login = () => {
    const router = useRouter()
    router.push({name: 'login'})
}

const reloadApp = () => {
  reset_error()
  initApp()
  router.push({path: '/#'})
}
watch([user?.value], () => {
  console.log("APP User changed: " + JSON.stringify(user))
  debugger
  if (user?.value && user.value.id) {
    store.initAuthed()
  }
  else {
    // TODO clean priv. data
  }
})


onMounted(() => {
  
  
})
</script>
<template>

  <div class="nav-top flex flex-wrap ">
    <div class="col-12 md:col-8 flex px-3 py-2 gap-2 nav-top-left ">
      <div class="flex">
        <router-link to="/">
          <Button text raised label="Start" icon="pi pi-home" />
        </router-link>
      </div>
      <div class="flex">
        <router-link to="/import" v-if="user?.id">
          <Button text raised label="Import" icon="pi pi-upload" />
        </router-link>
      </div>
      <div class="flex">
        <router-link to="/collection/userList" v-if="user?.id">
          <Button text raised label="Deine Sets" />
        </router-link> 
      </div>
      <div class="flex">
        <router-link to="/mediaEntry/userList" v-if="user?.id">
          <Button text raised label="Deine Einträge" />
        </router-link>
      </div>
    </div>
    <LoginInfo class="col-12 md:col-4 flex justify-content-end px-3 py-2 nav-top-right"/>
  </div>

  <div class="router-view px-3 py-3">
    <div v-if="appDataLoaded == false">
      Lade Madek Anwendungsdaten...
      <OkOrError :error_msg="error_msg" :ok_msg="ok_msg"/>
      <Button v-if="error_msg" 
        label="Neu versuchen..."
        icon="pi pi-refresh"
        @click.prevent="reloadApp()"
        />
    </div>
    <div v-else-if="appDataLoaded == true">
      <router-view/>
    </div>
  </div>
  
</template>

<style>
#app {
  padding: 0px;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
}

.nav-top {
  width: 100vw;
  background-color: var(--surface-200);
  z-index: 1000;
}

.nav-top-left { }
.nav-top-right { }

.router-view {
  position:relative;
  
  left: 0px;
  top: 0px;
  height: 90vh;
  overflow-y: auto;
}

</style>
