<script lang="ts" setup>

import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { errorHelper } from './modules/error'
import { apiHelper } from './modules/api'
import { authHelper } from './modules/auth'
import Chip from 'primevue/chip'
import { useMadekStore } from './stores/madek_store'
import { madekHelper } from './modules/madek'
//const { api, apiLogin, apiLogout } = apiHelper()

const { initMadek, checkAllLoaded } = madekHelper()
const { user } = authHelper()

const store = useMadekStore()

store.initPublic()
if (user?.value && user.value.id) {
  store.initAuthed()
}

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
})

const appDataLoaded = ref(false as boolean)

onMounted(() => {
  
  initMadek().then(() => {
    console.log("madek loaded")
    appDataLoaded.value = true
  })
})
</script>
<template>

  <div class="nav-top">
    <div class="nav-top-left">
      <router-link to="/">
        <Button text raised label="Start" icon="pi pi-home" />
      </router-link>
      &nbsp;
      <router-link to="/import" v-if="user?.id">
        <Button text raised label="Import" icon="pi pi-upload" />
      </router-link>
      &nbsp;
      <router-link to="/collection/userList" v-if="user?.id">
        <Button text raised label="Deine Sets" />
      </router-link> 
      &nbsp;
      <router-link to="/mediaEntry/userList" v-if="user?.id">
        <Button text raised label="Deine Einträge" />
      </router-link>
      
      
    </div>
    <div class="nav-top-right">
      <LoginInfo />
    </div>
    
  </div>
  <div class="router-view">
    <div v-if="appDataLoaded == false">
      Lade Madek Anwendungsdaten...
    </div>
    <div v-else-if="appDataLoaded == true">
      <router-view/>
    </div>
  </div>
  
</template>

<style scoped>
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
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  
  background-color: #f6f6f6;
  z-index: 1;
}
.nav-top-left {
  padding: 1rem;
  float: left;
  background-color: #e6e6e6;
}
.nav-top-right {
  padding: 1rem;
  float: right;
}
.router-view {
  position:relative;
  padding: 1rem;
  left: 0px;
  top: 5rem;
  /*right: 0px;
  height: 100vh;
  border: 1px solid gray;
  overflow-y: scroll;
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
