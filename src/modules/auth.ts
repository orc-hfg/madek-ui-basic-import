import { ref, reactive, toRefs } from 'vue'
import { iPerson, iUser } from '../api_resources'
import { RequestParams } from './../generated/API_fetch_xeio';

const AUTH_KEY = "madek_api_demo_auth"

export interface iLoginState {
    loading: boolean;
    error?: Error;
    authInfo?: iUser, // TODO own schema, access auth method
    user?: iUser;
    person?: iPerson;
    hash?: string;
    token?: string;
    cookie?: string;
    authParams?: RequestParams;
}


const state = reactive<iLoginState>({
    loading: false,
    error: undefined,
    authInfo: undefined,
    user: undefined,
    person: undefined,
    hash: undefined,
    token: undefined,
    cookie: undefined,
    authParams: undefined
})



export const authHelper = () => {

    const check_stored_creds = () => {

        if (state.authInfo && state.user) {
            //console.debug("check_stored_cred: ABORT: already has user")
            return
        }
        try {
    
            const stored = window.localStorage.getItem(AUTH_KEY)
            const parsedStored = JSON.parse(stored || '')
            if (parsedStored && parsedStored.user) {
                console.log("has user:\n" + JSON.stringify(parsedStored))
                if (parsedStored.hash) {
                    console.log("has user: basic auth")
                    state.authInfo = parsedStored.authInfo
                    state.user = parsedStored.user
                    state.person = parsedStored.person
                    state.hash = parsedStored.hash
                    state.authParams = parsedStored.authParams
                } else if (parsedStored.token) {
                    console.log("has user: token auth")
            
                    state.authInfo = parsedStored.authInfo
                    state.user = parsedStored.user
                    state.person = parsedStored.person
                    state.token = parsedStored.token
                    state.authParams = parsedStored.authParams
                } else {
                    console.log("has user: session auth")
            
                    state.authInfo = parsedStored.authInfo
                    state.user = parsedStored.user
                    state.person = parsedStored.person
                    //state.cookie = parsedStored.cookie
                    state.authParams = parsedStored.authParams
                }
            }
        } catch(error) {
            console.error("Could not read stored credentials:\n" + JSON.stringify(error))
        }
    }
    
    check_stored_creds()

    const setUser = (user: iUser, person: iPerson,
        hash:string|undefined,
        token: string|undefined,
        authParams: RequestParams):void => {
        state.user = user
        state.person = person
        state.hash = hash    
        state.token = token
        //state.cookie = cookie
        state.authParams = authParams
        state.error = undefined
        state.loading = false
        const json = JSON.stringify( state)

        window.localStorage.setItem(AUTH_KEY, json)
    }
    
    const logout = (): Promise<void> => {
        state.authInfo = undefined
        state.user = undefined
        state.person = undefined
        state.hash = undefined
        state.token = undefined
        
        window.localStorage.removeItem(AUTH_KEY)
        return Promise.resolve(state.user = undefined)
    }
    return {
        check_stored_creds,
        setUser,       
        logout,
        ...toRefs(state),
    }
}