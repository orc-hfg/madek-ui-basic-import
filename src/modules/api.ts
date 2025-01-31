
import { RequestParams } from '../generated/API_fetch_xeio';
import { iPerson, iUser } from '../api_resources'
import { reactive, ref, toRefs, watch } from 'vue'
import { authHelper } from './auth';
import { Api } from '../generated/API_fetch_xeio'




export const apiHelper = (baseUrl?: string) => {
    const { 
        authInfo,
        user, 
        person, 
        //hash, token,
        authParams,
        setUser, logout
    } = authHelper()

    
    const apiConfig = {
        baseUrl: baseUrl || 'https://staging.madek.hfg-karlsruhe.de'
        //baseUrl: baseUrl || 'https://dev.madek.hfg-karlsruhe.de'
        //baseUrl: baseUrl || 'http://localhost:8080'
        //baseUrl: baseUrl || 'http://localhost:3104'
    }

    const basicAuthHash = (login:string, password:string) => {
        return btoa(login + ":" + password)
    }
    const basicAuthParams = (login:string, password:string) => {
        
        const result = {
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Basic ' + basicAuthHash(login, password)
            }
        } as RequestParams
        return result
    }

    const tokenAuthParams = (login:string, token:string) => {
        return {
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'token ' + token
            }
        } as RequestParams
    }

    const api = new Api(apiConfig)

    const sessionAuthParams = () => {
        let rq : RequestParams = {
            headers: {
                'Content-Type':'application/json',
                //'Authorization': ''
            },
            credentials: 'include',
            //mode: 'cors'
        }
        return rq
    }
    const checkSession = () => {
        if (authInfo?.value && authInfo.value.id) {
            console.debug("checkSession: already has auth info user id")
            return
        }

        const params = sessionAuthParams()

        api.api.authInfoList(params)
            .then(response => response.json())
            .then(json => {
                
                console.log("checkSession: Auth info: " + JSON.stringify(json))
                
                if (!json || !json.id) {
                    console.error("ABORT: checkSession: auth info without id")
                    debugger
                    return
                }

                if (!json['authentication-method'] || json['authentication-method'] !== 'Session') {
                    console.error("ABORT: checkSession: not in session auth mode")
                    return
                }

                 
                authInfo.value = json
                setUser(
                    //json.user, json.person, 
                    json, json,
                    undefined,
                    undefined,
                    params)
              /*   const userId = json.id

                api.api.usersDetail(userId, params)
                    .then(resp => {
                        //console.log("full user: " + JSON.stringify(json))
                        const user = resp.data
                        const pid = user.person_id
                        console.log("User is person: " + pid)

                        api.api.peopleDetail(pid, params)
                        .then(resp => {
                            //console.log("full person: " + JSON.stringify(json))
                            const person = resp.data

                            setUser(
                                user, person, 
                                undefined,
                                undefined,
                                //MS_cookie,
                                params)
                        })
                    }) */

            })
  
    }

    checkSession()

    const apiLogin = (login: string, password: string, cb: any) => {
     
        const params = basicAuthParams(login, password);
        
        api.api.authInfoList(params)
            .then(response => response.json())
            .then(json => {
                console.log("Auth info: " + JSON.stringify(json))
                
                if (!json.id) {
                    console.error("ABORT: apiLogin: auth info without id")
                    return
                }

                authInfo.value = json
                
                //const userId = authInfo?.value?.id
                const user = authInfo?.value
                const person = authInfo?.value

                setUser(
                    user, person, 
                    basicAuthHash(login,password),
                    undefined,
                    params)

                /* api.api.usersDetail(userId, params).then(uresp =>
                    {
                        const user = uresp.data
                        console.log("full user: " + JSON.stringify(user))
                        const pid = user.person_id
                        console.log("User is person: " + pid)

                        api.api.peopleDetail(pid, params).then(resp =>
                            {
                                const person = resp.data
                                console.log("full person: " + JSON.stringify(person))

                                setUser(
                                    user, person, 
                                    basicAuthHash(login,password),
                                    undefined,
                                    params)
                            })
                        }) */
                
                
                
            }).catch(error => {
                console.error(JSON.stringify(error))
                //state.error = error
            })
    }


    const apiTokenLogin = (login: string, token: string, cb: any) => {
     
        const params = tokenAuthParams(login, token);
        
        console.log("call Auth info with: " + JSON.stringify(params))

        api.api.authInfoList(params)
            .then(response => response.json())
            .then(json => {
                console.log("Auth info response: " + JSON.stringify(json))
                
                if (!json.id) {
                    console.error("ABORT: apiLogin: auth info without id")
                    return
                }
                authInfo.value = json

                //const userId = authInfo?.value?.id
                const user = authInfo?.value
                const person = authInfo?.value

                setUser(
                    user, person, 
                    undefined,
                    token,
                    params)
                
                
            }).catch(error => {
                console.error(JSON.stringify(error))
                //state.error = error
            })
    }


    const apiLogout = () => {
        logout()
    }


    return {
        apiConfig,
        user, person, authParams,       
        api,
        apiLogin,
        apiTokenLogin,
        apiLogout,

        checkSession
        
    }
}