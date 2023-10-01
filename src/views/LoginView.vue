<template>
  <div class="flex flex-wrap ">
    <div class="flex flex-row align-items-center justify-content-center gap-4 login">
      <div v-if="user && user.id">
        <h3>Du hast Dich erfolgreich angemeldet!</h3>
        <br/>
        <Button @click.prevent="doLogout()">Logout</Button>
      </div>

      <div v-else>
        
        
        <div v-if="login_mode.value === 'basic'">

          <h3>Basic Auth Login</h3>
          <form @submit.prevent="doLogin()">
          
            <label>Login:&nbsp;</label>
            <br/>
            <InputText id="input_login" type="text" v-model="login"/>
            <br/>
            <br/>
            <label for="input_pw">Password:&nbsp;</label>
            <br/>
            <InputText id="input_pw" type="password" v-model="password"/>
            <br/>
            <br/>
            <Button type="submit">Login</Button>
          </form>
        </div>

        <div v-else-if="login_mode.value === 'session'">
          <h3>Session Auth</h3>
          <Button @click.prevent="checkSession()">Check Madek Webapp Session</Button>
        </div>

        <div v-else-if="login_mode.value === 'token'">
          <h3>Token Login</h3>
          <form @submit.prevent="doTokenLogin()">
            
            <label>Login:&nbsp;</label>
            <br/>
            <InputText type="text" v-model="login"/>
            <br/>
            <br/>
            
            <label>Token:&nbsp;</label>
            <br/>
            <InputText type="password" v-model="token"/>
            <br/>
            <br/>
            <Button type="submit">Login</Button>
          </form>
        </div>
        
        <div>
          <h3>Wähle anderen Anmelde-Modus</h3>
          <SelectButton 
            v-model="login_mode"
            :options="login_mode_options"
            option-label="name"/>
        </div>

      </div>
    </div>
      
    
<!--    
   


    <h3>Authenticator Login</h3>
    <p>TODO</p>


    <p>
      <hr/>
      <span>DEBUG</span>
      <br/>
      <span>Loading: {{ loading }}</span>
      <br/>

      <span>authParams:</span>
      <br/>
      <JsonViewer :value="authParams"/>
      <br/>
      <span>Error: {{ error }}</span>
      <br/>
      <span>Login: {{ login }}</span>
      <br/>
   
      <span>State User:</span>
      <br/>
      <JsonViewer :value="user" />
      <br/>
      <span>State Person:</span>
      <br/>
      <JsonViewer :value="person" />
      <br/>
    </p>
-->
  </div>
</template>

<script  lang="ts" setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { authHelper } from '../modules/auth'
import { apiHelper } from '../modules/api'
import { iPerson, iUser } from '../api_resources'

import SelectButton from 'primevue/selectbutton'

const { 
  user, person, authParams
 } = authHelper()
 
const { api, apiLogin, apiTokenLogin,
  checkSession,
  apiLogout } = apiHelper()

interface LoginData {
  login: string
  password: string
  token: string
}

const loading = ref(false)
const error = ref()

const data = reactive<LoginData>({
  login: '',
  password: '',
  token: ''
  //token: 'VZN0Z2SNC1TV199RHT2CVW5Z9R4433N2',
  
})

const { login, password, token } = toRefs(data)

const login_mode_options = [
  { name: 'Basic Auth', value: 'basic' },
  { name: 'Session', value: 'session' },
  { name: 'Token', value: 'token' },
]
const login_mode = ref(login_mode_options[0])
const doLogin = () => {

  console.log('doLogin'
  + '\nL: ' + data.login
  + '\nP: ' + data.password)

  apiLogin(data.login, data.password, (user: iUser)=> {
    console.log("logged in: " + user.id)
  })

}

const doTokenLogin = () => {
  console.log('doTokenLogin'
    + '\nL: ' + data.login
    + '\nT: ' + data.token)

  apiTokenLogin(data.login, data.token, (user: iUser) => {
    console.log("logged in: " + user.id)
  })
}



const doLogout = () => {
  apiLogout()
}
/*
export default defineComponent({
  setup() {
    return {
      ...toRefs(data),
      login_mode,
      login_mode_options,
      user, person,
      authParams,
      
      loading,
      error,
      doLogin,
      doTokenLogin,
      doLogout,
      checkSession
    }
  }
})
*/
</script>
<style scoped>
.login {
  margin-left: auto;
  margin-right: auto;
  
}
</style>