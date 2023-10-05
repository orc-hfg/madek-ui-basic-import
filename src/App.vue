<script lang="ts" setup>

import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { errorHelper } from './modules/error'
import { authHelper } from './modules/auth'

import { useMadekStore } from './stores/madek_store'
import { madekHelper } from './modules/madek'
import OkOrError from './components/OkOrError.vue'

const { error_msg, ok_msg, handleError } = errorHelper()

const { initMadek, checkAllLoaded } = madekHelper()
const { user } = authHelper()

const store = useMadekStore()
/*
store.initPublic()
if (user?.value && user.value.id) {
  store.initAuthed()
}
*/

const appDataLoaded = ref(false as boolean)

initMadek().then(() => {
    console.log("madek loaded")
    appDataLoaded.value = true
  })

const login = () => {
    const router = useRouter()
    router.push({name: 'login'})
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
    </div>
    <div v-else-if="appDataLoaded == true">
      <router-view/>
    </div>
  </div>
  
</template>

<style >
#app {
  padding: 0px;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;

}
/*
.nav-left {
  position: fixed;
  padding: 1rem;
  left: 0px;
  top: 0px;
  height: 100vh;
  width: 15vw;
  border: 1px solid gray;
}
*/
.nav-top {
 
  width: 100vw;
  background-color: var(--surface-200);
  z-index: 1000;
}
.nav-top-left {
  
  
}
.nav-top-right {
  float: right;
  
}
.router-view {
  position:relative;
  
  left: 0px;
  top: 0px;
  height: 90vh;
  overflow-y: auto;
  /*right: 0px;
  height: 100vh;
  border: 1px solid gray;
  
*/
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
