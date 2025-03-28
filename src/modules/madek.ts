//import { MetaDataDetailData } from './../generated/API_fetch_xpbr';
   

import { ref, reactive, toRefs } from 'vue'


import { 
    iAppSettings,
    iContext,
    iContextKey,
    iMetaKey,
    iMetaData,
    iKeyword,
    iPerson,
    iPublishableResult,
    iUser,
    iVocabulary,
    iMLObj
 } from '../api_resources'

import { authHelper } from './auth';
import { apiHelper } from './api';
import { errorHelper } from './error';
import { 
    AppSettingsListData,
    ContextsDetailData,
    ContextKeysDetailData,
    MetaKeysDetailData, 
    KeywordsDetailData,
    PeopleDetailData,
    MetaDataRoleDetailData,
    MediaEntryMetaDatumPeopleDetailData} from '../generated/data-contracts';
import { useMadekStore } from '../stores/madek_store';
import { useMetadataStore } from '../stores/metadata_store';

export enum MLType {
    labels = 'labels',
    descriptions = 'descriptions',
    hints = 'hints'
}

      
export interface iGenMetaData {
    [meta_key_id: string]: iGenMetaDatum,
}
export interface iGenMetaDatum {
    meta_key_id: string,
    type: string,
    "string": string,
    "json": string,
    selectedKeywords: Array<KeywordsDetailData>,
    selectedPeople: Array<PeopleDetailData>,
    selectedRoles: Array<MetaDataRoleDetailData>,
}


export interface iMadekState {
    madekLoading: boolean;
   
    imgCache: Map<string, string>;
    previewCache: Map<string, Map<string, string>>;

    userCache: Map<string, iUser>;
    peopleCache: Map<string, iPerson>;
}

const state = reactive<iMadekState>({
    madekLoading: true,
   
    imgCache: new Map<string, string>(),
    previewCache: new Map<string, Map<string, string>>(),

    userCache: new Map<string, iUser>(),
    peopleCache: new Map<string, iPerson>(),
})




export const madekHelper = () => {

    const RKEY_ENTRY = 'media_entry_id'
    const RKEY_COLLECTION = 'collection_id'

    const MKEY_TITLE = 'madek_core:title'
    const MKEY_AUTHORS = 'madek_core:authors'

    const MD_TYPE_KEYWORDS = 'MetaDatum::Keywords'
    const MD_TYPE_PEOPLE = 'MetaDatum::People'
    const MD_TYPE_ROLES = 'MetaDatum::Roles'
    const MD_TYPE_TEXT = 'MetaDatum::Text'
    const MD_TYPE_TEXT_DATE = 'MetaDatum::TextDate'
    const MD_TYPE_JSON = 'MetaDatum::JSON'

    
    const MD_KEYWORDS = 'keywords'
    const MD_PEOPLE = 'people'

    const MD_KEYWORDS_DATA = 'md_keywords'
    const MD_PEOPLE_DATA = 'md_people'

    const META_DATA = 'meta-data'

    const { api, apiConfig } = apiHelper()
    const { user, person, authParams} = authHelper()

    const { handle_error } = errorHelper()

    const initMadek = async () => {

        const madek_store = useMadekStore()
        try {
            await madek_store.initPublic()
            await madek_store.initAuthed()
        }
        catch(ex) {
            console.error("Could not load app settings")
            handle_error("Could not load app settings",ex)
        }
    }

    const getContext = (context_id: string) => {
        const madek = useMadekStore()
        return madek.contextsMap.get(context_id)
        //const result = state.contextsMap.get(context_id)
        //console.log("getContext: " + JSON.stringify(result))
        //return result
    }


    const getContextKeysForContext = (context_id:string) => {
        const madek = useMadekStore()
        const result = new Array<ContextKeysDetailData>()
        const cks = madek.contextKeysMap_context_id_meta_key_id.get(context_id)?.forEach(ck => {
            result.push(ck)
        })
        const sorted = result.sort((a,b) => {
            return a.position - b.position
        })
        
        return sorted
        /*const result = state.contextKeys?.
          filter(ck => {
            return ck.context_id === context_id
          }).
          sort((a,b) => {
            return a.position - b.position
          })
        return result
        */
    }

    const getMetaKey = (meta_key_id: string):MetaKeysDetailData|undefined => {
        const madek = useMadekStore()
        if (user?.value && user.value.id) {
            const result = madek.userMetaKeysMap.get(meta_key_id)
            //console.log("user got mk: " + meta_key_id + ":" + JSON.stringify(result))
            return result
        }
        const result = madek.publicMetaKeysMap.get(meta_key_id)
        //console.log("public got mk: " + meta_key_id + ":" + JSON.stringify(result))
        return result
    }

    const checkAllLoaded = () => {
        let result = true;
        
        const madek = useMadekStore()
     

        if (!madek.appSettings.default_locale) {
          result = false
        }
        
        if (madek.contextsMap.size == 0) {
          result = false
        }
        if (madek.keywordsMap.size == 0) {
            return false
        }
        if (madek.publicMetaKeysMap.size == 0) {
            result = false
        }
        if (user?.value && user.value.id) {

            if (madek.userMetaKeysMap.size == 0) {
                result = false
            }   
        }

        /*
           
        if (state.contextKeysMapByMetaKey.size == 0) {
          result = false
        }
        if (state.metaKeysMapByMetaKey.size == 0) {
          result = false
        }
        if (state.keywords.length == 0) {
          result = false
        }
   */
        state.madekLoading = !result
        return result;
    }

    const DEFAULT_LOCALE = 'de'
    enum ML_LOCS {
        de = 'de',
        en = 'en'
    }
    const getDefaultLocale = (): string => {
        const madek = useMadekStore()
        return madek.appSettings.default_locale || DEFAULT_LOCALE
    }

    

    const getMLValue = (data: object, type: MLType) : string|undefined =>{
        const loc = getDefaultLocale()
        if (!data
            || !data[type]
            || !data[type][loc]) {
                console.debug('getMLValue: no value for ' + type + ' and locale: ' + loc)
                return undefined
        }
        return data[type][loc]
    }
    const getContextML = (context_id: string, type: MLType): string|undefined => {
        const madek = useMadekStore()
        
        const context = madek.contextsMap.get(context_id)
        if (!context || !context.id) {
            console.error("No such context: " + context_id )
            return context_id
        }
        return getMLValue(context, type)
    }
/*
    const getMLObj = (data: object, type: string) :iMLObj|undefined => {

        if (type === 'labels') {
            return data.labels as iMLObj
        } else if (type === 'descriptions') {
            return data.descriptions as iMLObj
        } else {
            console.error('invalid/unknnown ML type')
            return undefined
        }
    }*/

    const getMetaKeyML = (meta_key_id: string, type: MLType): string|undefined => {
        const mk = getMetaKey(meta_key_id)
        if (!mk || !mk.id) {
            console.error("No such meta-key: " + meta_key_id )
            return undefined
        }
        return getMLValue(mk, type)
    }
    
    const getMetaKeyKeywords = (meta_key_id: string) => {
        const madek = useMadekStore()
        return madek.keywordsByMetaKeyMap.get(meta_key_id)
        /*
        const filtered = state.keywords.filter(kw => {
          return meta_key_id === kw.meta_key_id
        })
        return filtered
        */
    }

    const checkPublishableMetaData = (metaDataMap: Map<string, iMetaData>): iPublishableResult => {
        const MD = 'checkPublishableMetaData: '
        const madek = useMadekStore()
        const contexts = madek.appSettings.contexts_for_entry_validation
        if (!contexts || !contexts.length) {
            throw Error('empty validation contexts')
        }
        const failedKeys = new Array<string>()
        let failed = false

        contexts?.forEach(contextId => {
            //console.log(MD + 'check context id: ' + contextId)

            const conKeys = getContextKeysForContext(contextId)
            conKeys?.forEach(conKey => {
                const mk_id = conKey.meta_key_id
                //console.log(MD + '\ncheck context id: ' + contextId + '\ncheck key: ' + mk_id)

                if (metaDataMap.has(mk_id)) {
                    //console.log(MD + 'OK!! \ncheck context id: ' + contextId + '\ncheck key: ' + mk_id)
                } else {
                    //console.log(MD + 'Failed!! \ncheck context id: ' + contextId + '\ncheck key: ' + mk_id)
                    failedKeys.push(mk_id)
                    failed = true
                }
            })
        });

        
        const result = {
            failed: failed,
            failedKeys: failedKeys,
            publishable: !failed
        } as iPublishableResult

        //console.log(MD + '\nresult:\n' + JSON.stringify(result))

        return result
    }
    
    const checkPublishable = (e_id:string, cbOK: any) => {
        const MD = 'checkPublishable: ' + e_id + ': '

        api.api.mediaEntryMetaDataDetail(e_id, {}, authParams?.value)
            .then(resp => {
                
                const metaData = resp.data.meta_data //['meta-data'] as iMetaData[]
                const metaDataMap = new Map<string, iMetaData>()
                metaData.map(md => {
                    metaDataMap.set(md.meta_key_id, md)
                })
                const result = checkPublishableMetaData(metaDataMap)
                //console.log(MD + ' result: ' + JSON.stringify(result))
                cbOK(result)

            })
            .catch(error => handle_error('get mediaEntryMetaDataDetail', error))    
    }

    const getMetaData = (resKey: string, resId: string, cbOk:any, cbError: any) => {
        if (!resId) {
            console.log("ABORT: invalid resource id.")
            cbOk(null)
            return
        }
        if (resKey === 'collection_id') {
            api.api.collectionMetaDataDetail(resId, {}, authParams?.value)
            .then(resp => cbOk(resp.data))
            .catch(error => {
                handle_error('getMetaData:', error)
                cbError(error)
            })
        }
        else if (resKey === 'media_entry_id') {
            api.api.mediaEntryMetaDataDetail(resId, {}, authParams?.value)
            .then(resp => cbOk(resp.data))
            .catch(error => {
                handle_error('getMetaData:', error)
                cbError(error)
            })
        }
        else {
            console.error("getMetaData: unsupported resource key.")
        }
    }

    const getMetaDataRelated = (resKey: string, resId: string, cbOk:any, cbError: any) => {
        if (!resId) {
            console.log("getMetaDataRelated: ABORT: invalid resource id.")
            cbOk(null)
            return
        }
        if (resKey === 'collection_id') {
            api.api.collectionMetaDataRelatedDetail(resId, {}, authParams?.value)
            .then(resp => cbOk(resp.data))
            .catch(error => {
                handle_error('getMetaDataRelated:', error)
                cbError(error)
            })
        }
        else if (resKey === 'media_entry_id') {
            api.api.mediaEntryMetaDataRelatedDetail(resId, {}, authParams?.value)
            .then(resp => cbOk(resp.data))
            .catch(error => {
                handle_error('getMetaDataRelated:', error)
                cbError(error)
            })
        }
        else {
            console.error("getMetaDataRelated: unsupported resource key.")
        }
    }
    const getCollectionMetaDataText = (col_id: string, meta_key_id: string, cbOK: any) => {
        const mkid = encodeURIComponent(meta_key_id)
        api.api.collectionMetaDatumDetail(col_id, mkid, authParams?.value)
            .then(resp => {
                const val = resp.data[META_DATA].string
                cbOK(val)
            })
            .catch(error => handle_error('getCollectionMetaDataText', error))
    }


    const getEntryMetaDataText = (e_id: string, meta_key_id: string, cbOK: any) => {
        const mkid = encodeURIComponent(meta_key_id)
        api.api.mediaEntryMetaDatumDetail(e_id, mkid, authParams?.value)
            .then(resp => {
                const val = resp.data[META_DATA].string
                cbOK(val)
            })
            .catch(error => handle_error('getEntryMetaDataText', error))
    }

    const getMetaDataText = (resourceKey: string, resourceId: string, meta_key_id:string, cbOk:any) => {
        const mkid = encodeURIComponent(meta_key_id)
        if (resourceKey === 'collection_id') {
            api.api.collectionMetaDatumDetail(resourceId, mkid, authParams?.value)
            .then(resp => cbOk(resp.data))
            .catch(error => handle_error('getMetaDataText', error))
        }
        else if (resourceKey === 'media_entry_id') {
            api.api.mediaEntryMetaDatumDetail(resourceId, mkid, authParams?.value)
            .then(resp => cbOk(resp.data))
            .catch(error => handle_error('getMetaDataText', error))
        }
        else {
            console.error("getMetaDataText: unsupported resource key.")
        }
    }

    


    const getCollectionTitle =(col_id: string, cbOK: any) => {
        getCollectionMetaDataText(col_id, MKEY_TITLE, cbOK)
    }
    const getEntryTitle = (id: string, cbOK: any) => {
        getEntryMetaDataText(id, MKEY_TITLE, cbOK)
    }

    const getMetaKeyObjectType = (meta_key_id: string) => {
        const metaKey = getMetaKey(meta_key_id)
        if (metaKey && metaKey.meta_datum_object_type) {
              return metaKey.meta_datum_object_type
        }
        return undefined
    }
    const isMetaKeyObjectType = (meta_key_id: string, type: string) => {
        const metaKey = getMetaKey(meta_key_id)
        if (metaKey && metaKey.meta_datum_object_type &&
            metaKey.meta_datum_object_type === type) {
              return true
        }
        return false;
    }


    const createMetaDataText = (
        resource_key: string,
        resource_id: string,
        meta_key_id: string,
        value: string,
        cbOK: any, cbError: any) => {

        const body = { 'string': value}
        const mkid = encodeURIComponent(meta_key_id)  

        const onError = (error:any) => {
            cbError(error)
            handle_error("Could not create meta data text ", error)
        }

        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumTextCreate(resource_id, mkid,body, authParams?.value)
            .then(resp => cbOK(resp.data))
            .catch(error => onError(error))
        }
        else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumTextCreate(resource_id, mkid,body, authParams?.value)
            .then(resp => cbOK(resp.data))
            .catch(error => onError(error))
        }
        else {
            console.error("Unsupported resource type")
        }
    }

    const updateMetaDataText = (
        resource_key: string,
        resource_id: string,
        meta_key_id: string,
        value: string,
        //json: string,
        cbOK: any,
        onError: any) => {

        const body = { 'string': value }
        const mkid = encodeURIComponent(meta_key_id)

        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumTextUpdate(resource_id, mkid ,body, authParams?.value)
              .then(resp => cbOK(resp.data))
              .catch(error => onError(error))
          }
          else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumTextUpdate(resource_id, mkid ,body, authParams?.value)
              .then(resp => cbOK(resp.data))
              .catch(error => onError(error))
          }
          else {
            console.error("Unsupported resource type")
          }
    }



    const createMetaDataTextDate = (
        resource_key: string,
        resource_id: string,
        meta_key_id: string,
        value: string,
        cbOK: any,
        onError: any) => {

        const body = { 'string': value}
        const mkid = encodeURIComponent(meta_key_id)  

        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumTextDateCreate(resource_id, mkid,body, authParams?.value)
            .then(resp => cbOK(resp.data))
            .catch(error => onError(error))
        }
        else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumTextDateCreate(resource_id, mkid,body, authParams?.value)
            .then(resp => cbOK(resp.data))
            .catch(error => onError(error))
        }
        else {
            console.error("Unsupported resource type")
        }
    }

    const updateMetaDataTextDate = (
        resource_key: string,
        resource_id: string,
        meta_key_id: string,
        value: string,
        //json: string,
        cbOK: any,
        onError: any) => {

        const body = { 'string': value }
        const mkid = encodeURIComponent(meta_key_id)

        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumTextDateUpdate(resource_id, mkid ,body, authParams?.value)
              .then(resp => cbOK(resp.data))
              .catch(error => {
                if (onError) onError(error) 
            })
          }
          else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumTextDateUpdate(resource_id, mkid ,body, authParams?.value)
              .then(resp => cbOK(resp.data))
              .catch(error => {
                if (onError) onError(error) 
            })
          }
          else {
            console.error("Unsupported resource type")
          }
    }

    const getMetaDataExtended = (resourceKey: string, resourceId: string,
        metaKeyId: string, cbOk:any, onError: any) => {

        const mkid = encodeURIComponent(metaKeyId)

        if (resourceKey === 'collection_id') {
            api.api.collectionMetaDatumDetail(resourceId, mkid, authParams?.value)
                .then(resp => cbOk(resp.data))
                .catch(error => {
                    if (onError) onError(error) 
                })
        }
        else if (resourceKey === 'media_entry_id') {
            api.api.mediaEntryMetaDatumDetail(resourceId, mkid, authParams?.value)
                .then(resp => cbOk(resp.data))
                .catch(error => {
                    if (onError) onError(error) 
                })
        }
        else {
            console.error("Invalid resource key")
        }

    }  

    const createMDPeople = (resource_key: string, resourceId: string,
        meta_key_id: string, personId: string, onOk: any, cbError: any) => {

        const mkid = encodeURIComponent(meta_key_id)
        const onError = (error:any) => {
            cbError(error)
            handle_error("Could not create MD people", error)
        }
        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumPeopleCreate(
                resourceId, mkid, personId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumPeopleCreate(
                resourceId, mkid, personId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else {
            console.error("Invalid resource key")
        }
    }

    const deleteMDPeople = (resource_key: string, resourceId: string,
        meta_key_id: string, personId: string, onOk: any, onError: any) => {

        const mkid = encodeURIComponent(meta_key_id)
        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumPeopleDelete(
                resourceId, mkid, personId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumPeopleDelete(
                resourceId, mkid, personId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else {
            console.error("Invalid resource key")
        }    
    }

    const createMDKeywords = (resource_key: string, resourceId: string,
        metaKeyId: string, keywordId: string, onOk: any, cbError: any) => {

        const onError = (error:any) => {
            cbError(error)
            handle_error("Could not create MD keyword", error)
        }
        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumKeywordCreate(
                resourceId, metaKeyId, keywordId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumKeywordCreate(
                resourceId, metaKeyId, keywordId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else {
            console.error("Invalid resource key")
        }    
    }

    const deleteMDKeywords = (resource_key: string, resourceId: string,
        metaKeyId: string, keywordId: string, onOk: any, onError: any) => {
            
        if (resource_key === 'collection_id') {
            api.api.collectionMetaDatumKeywordDelete(
                resourceId, metaKeyId, keywordId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else if (resource_key === 'media_entry_id') {
            api.api.mediaEntryMetaDatumKeywordDelete(
                resourceId, metaKeyId, keywordId, authParams?.value)
                .then(resp => onOk(resp.data))
                .catch(error => onError(error))
        }
        else {
            console.error("Invalid resource key")
        }    
    }

    const saveResourceMetaData = (resKey:string, resId:string, meta_data: object, old_meta_data: object, cbFinished: any) => {
        const getIdDiffs = (kws_before: any[], kws_after: any[]) => {

            const toDelete = new Array<string>()
            const toAdd = new Array<string>()
    
            kws_after.forEach((kwa:iPerson|iKeyword) => {
                const hadkw = kws_before.find(kw => { return kw.id === kwa.id})
                if (!hadkw || !hadkw.id) {
                  toAdd.push(kwa.id)
                }
            })
    
            kws_before.forEach((kwb:iPerson|iKeyword) => {
                const hadkw = kws_after.find(kw => { return kw.id === kwb.id})
                if (!hadkw || !hadkw.id) {
                  toDelete.push(kwb.id)
                }
            })
            return [ toDelete, toAdd ]
        }
        
        let loading = 0
        
        const onFinished = (loading:number) => {
            console.log("finished: " + loading)

            if (loading == 0) {
                console.log("finished: All" + loading)
                if (cbFinished) cbFinished()
            }
        }

        const onOk = (json:any) => {
            onFinished(--loading)
        }

        const onError = (json:any) => {
            onFinished(--loading)
        }
      
        if (!resKey || !resId) {
              console.log("ABORT: saveAll: no resource_key or resource_id.")
              return
        }
      
        for (var meta_key_id in meta_data) {
              const data = meta_data[meta_key_id]
              const oldData = old_meta_data[meta_key_id]
              console.log("saveAll: mk-id: " + meta_key_id 
              + "\n type: " + getMetaKeyObjectType(meta_key_id)
              + "\n old data: " + JSON.stringify(oldData)
              + "\n new data: " + JSON.stringify(data)
                )
      
              if (isMetaKeyObjectType(meta_key_id, MD_TYPE_TEXT)) {
                  
                  if ((!oldData) && data?.string && data?.string.length !== 0) {
                    loading++
                    createMetaDataText(resKey, resId, meta_key_id, data.string, onOk, onError)
                  }
                  else if (!!oldData && oldData.string === data.string) {
                    console.log("nothing changed for: " + meta_key_id)
                  } 
                  else if (data.string){
                    if (data.string.length == 0) {
                        console.log(" string empty TODO delete md ")
                        //TODO
                        //loading++
                        //api.api.mediaEntryMetaDatumDelete(resId, meta_key_id, authParams?.value)
                    } else {
                        loading++
                        updateMetaDataText(resKey, resId, meta_key_id, data.string, onOk, onError)
                    }
                    
                  }
              }
              else if (isMetaKeyObjectType(meta_key_id, MD_TYPE_TEXT_DATE)) {
      
                  if ((!oldData) && data.string) {
                    loading++
                    createMetaDataTextDate(resKey, resId, meta_key_id, data.string, onOk, onError)
                  }
                  else if (!!oldData && oldData.string === data.string) {
                    console.log("nothing changed for: " + meta_key_id)
                  } 
                  else if (data.string){
                    if (data.string.length == 0) {
                        console.log(" string empty TODO delete md ")
                        //TODO
                        //loading++
                        //api.api.mediaEntryMetaDatumDelete(resId, meta_key_id, authParams?.value)
                    } else {
                        loading++
                        updateMetaDataTextDate(resKey, resId, meta_key_id, data.string, onOk, onError)
                    }
                    
                  }
                  
              }
              else if (isMetaKeyObjectType(meta_key_id, MD_TYPE_JSON)) {
                // TODO md json
              }
              else if (isMetaKeyObjectType(meta_key_id, MD_TYPE_KEYWORDS)) {
                
                const oldIds = oldData?.selectedKeywords || []
                const newIds = data?.selectedKeywords || []
                const [ toDelete, toAdd ] = getIdDiffs(oldIds, newIds)

                console.log("doUpdate: \n"
                + "\nAdd:\n" + JSON.stringify(toAdd) 
                + "\nDelete:\n" + JSON.stringify(toDelete))

                toDelete.forEach( (kwid) => {
                    loading++
                    deleteMDKeywords(resKey, resId, meta_key_id, kwid, onOk, onError)
                })
                
                toAdd.forEach( (kwid) => {
                    loading++
                    createMDKeywords(resKey, resId, meta_key_id, kwid, onOk, onError)
                })
                  
              }
              else if (isMetaKeyObjectType(meta_key_id, MD_TYPE_PEOPLE)) {
                
                const oldIds = oldData?.selectedPeople || []
                const newIds = data?.selectedPeople || []
                const [ toDelete, toAdd ] = getIdDiffs(oldIds, newIds)

                console.log("doUpdate: \n"
                + "\nAdd:\n" + JSON.stringify(toAdd) 
                + "\nDelete:\n" + JSON.stringify(toDelete))

                toDelete.forEach( (pid) => {
                    loading++
                    deleteMDPeople(resKey, resId, meta_key_id, pid, onOk, onError)
                })
                toAdd.forEach( (pid) => {
                    loading++
                    createMDPeople(resKey, resId, meta_key_id, pid, onOk, onError)
                })
                  
              }
              // TODO md roles
              else {
                console.log("unsupported md type: " + getMetaKeyObjectType(meta_key_id))
            }


        }
        onFinished(loading)
    }

    

    const loadResourceMetaData = (resKey:string, resId:string, into_meta_data: any, cbFinished:any) => {
        /*
        mdStore.getCachedMetaDataRelated(resKey, resId, true, (data) => {
            console.log("got meta data related: " + JSON.stringify(data))
            data.forEach(md => {
                into_meta_data[md.meta_key_id] = md
            })
            debugger
        }, (error) => {
            console.error("Could not get meta data related: " + JSON.stringify(error))
        })
        */
        getMetaDataRelated(resKey, resId, (json) => {
            console.log("got meta data related: " + JSON.stringify(json))
            
            json.forEach(mdMap => {
                const md = mdMap.meta_data
                into_meta_data[md.meta_key_id] = md
                if (isMetaKeyObjectType( md.meta_key_id, MD_TYPE_PEOPLE)) {
                    const mdpeople = mdMap[MD_PEOPLE]
                    into_meta_data[md.meta_key_id].selectedPeople = mdpeople
                }
                else if (isMetaKeyObjectType( md.meta_key_id, MD_TYPE_KEYWORDS)) {
                    const mdkws = mdMap[MD_KEYWORDS]
                    into_meta_data[md.meta_key_id].selectedKeywords = mdkws
                }
                // TODO roles
            });
            console.log("got meta data related: into: " + JSON.stringify(into_meta_data))
            if (cbFinished) cbFinished()
        }, (error:any) => {
            console.error("Could not get meta data related: " + JSON.stringify(error))
        })
        
    }
   
    const createiGenMetaData = () => {
        const md : iGenMetaData = {
           //data: new Map<string, iGenMetaDatum>()
        }
        return md
    }
          
    const DEFAULTS_ENTRY_MD_KEY = 'ENTRY_MD_DEFAULTS'

    const getStoredMDDefaults = () => {
        const stored = window.localStorage.getItem(DEFAULTS_ENTRY_MD_KEY)
        try {
            const parsedStored = JSON.parse(stored || '')
            return parsedStored
        } catch(error) {
            console.error("Could not read stored defaults:\n" + JSON.stringify(error))
        }
        console.log("getStoredMDDefaults: nothing stored: use app defaults")
        const appDefaults = initEntryMetaDataDefaults(createiGenMetaData())
        return appDefaults
    }

    const storeMDDefaults = (defaults_meta_data: object) => {
        window.localStorage.setItem(DEFAULTS_ENTRY_MD_KEY, JSON.stringify(defaults_meta_data))
    }
       
    const initEntryMetaDataDefaults = (defaults_meta_data: iGenMetaData) => {
        // call initMadek to get appSettings before
        const madek = useMadekStore()

        if (!madek.appSettings.default_locale) {
            console.error("ABORT: initEntryMetaDataDefaults: no appSettings yet")
            return defaults_meta_data
        }
        // TODO or force 
        
        if (defaults_meta_data[MKEY_TITLE]) {
            console.log("ABORT: initEntryMetaDataDefaults: already has meta data title")
            return defaults_meta_data
        }

        // set default title
        defaults_meta_data[MKEY_TITLE] = {
            "meta_key_id": MKEY_TITLE,
            "string": "imported_" + Date.now() + ".bin"
        } as iGenMetaDatum
    
        const kw_license_id = madek.appSettings.media_entry_default_license_id
        const mkey_license = madek.appSettings.media_entry_default_license_meta_key
        if (!!kw_license_id && !!mkey_license) {
            const kw_license = madek.keywordsMap.get(kw_license_id)

            defaults_meta_data[mkey_license] = {
                "meta_key_id": mkey_license,
                "selectedKeywords": [ kw_license]
            } as iGenMetaDatum
            
        }
        
        const mkey_usage = madek.appSettings.media_entry_default_license_usage_meta_key
        if (!!mkey_usage) {
            defaults_meta_data[mkey_usage] =
            {
                "meta_key_id": mkey_usage,
                "string": madek.appSettings.media_entry_default_license_usage_text
            } as iGenMetaDatum
        }


        console.log("initEntryMetaDataDefaults: " + JSON.stringify(defaults_meta_data))

        return defaults_meta_data
    }


    const initMD = (context_ids: string[], meta_data: iGenMetaData) => {
        if (!context_ids) {
            console.error("initMD: ABORT: invalid context ids")
            return
        }
        context_ids.forEach(cid => {
          getContextKeysForContext(cid as string).forEach((ck:ContextKeysDetailData) => {
  
            const meta_key_id = ck.meta_key_id
            const mk = getMetaKey(meta_key_id)
            if (!mk || !mk.id) {
                console.error("Hidden or invalid meta key: " + meta_key_id)
            }
            else {
                const new_meta_datum = {
                    meta_key_id: meta_key_id,
                    type: mk?.meta_datum_object_type,
                    string: "",
                    json: "",
    
                } as iGenMetaDatum
                if (isMetaKeyObjectType(meta_key_id, MD_TYPE_KEYWORDS)) {
                    new_meta_datum.selectedKeywords = new Array<KeywordsDetailData>()
                }
                if (isMetaKeyObjectType(meta_key_id, MD_TYPE_PEOPLE)) {
                    new_meta_datum.selectedPeople = new Array<PeopleDetailData>()
                }
                if (isMetaKeyObjectType(meta_key_id, MD_TYPE_ROLES)) {
                    //new_meta_datum.selectedRoles = new Array<MetaDataRoleDetailData>()
                }
                meta_data[meta_key_id] = new_meta_datum
    
            }
            
          })
        })

    }

    const copyMDInto = (meta_data:iGenMetaData , result_meta_data: iGenMetaData, overwrite?: boolean|false) => {
        for (var meta_key_id in meta_data) {
            const data = meta_data[meta_key_id]
            const result_data = result_meta_data[meta_key_id]
            //console.log("copyMDInto: " + meta_key_id + " data: " + JSON.stringify(data))
    
            let cstring = ''


            if (result_meta_data[meta_key_id] && result_meta_data[meta_key_id]?.string)
            {
                cstring = result_meta_data[meta_key_id]?.string || ''
            }
            else if (overwrite == true && meta_data[meta_key_id] && meta_data[meta_key_id]?.string)
            {
                cstring = meta_data[meta_key_id]?.string || ''
            }
            
            let cjson = ''
            if (result_meta_data[meta_key_id] && result_meta_data[meta_key_id]?.json)
            {
                cjson = result_meta_data[meta_key_id]?.json || ''
            }
            else if (overwrite == true && meta_data[meta_key_id] && meta_data[meta_key_id]?.json)
            {
                cjson = meta_data[meta_key_id]?.json || ''
            }
            
            result_meta_data[meta_key_id] = 
            {
                meta_key_id: meta_key_id,
                type: getMetaKeyObjectType(meta_key_id),
                string: data?.string || cstring,
                json: data?.json || cjson,

            } as iGenMetaDatum

            
            if (result_data?.selectedPeople && result_data.selectedPeople.length !== 0) {
                    
            } else if (overwrite == true && data?.selectedPeople && data.selectedPeople.length !== 0) {
                //console.log("metaDataCopyInto: " + meta_key_id + " clone people")
                const nar = new Array()
                data.selectedPeople.forEach(elem => nar.push(elem))
                result_meta_data[meta_key_id].selectedPeople = nar
            }


            if (result_data?.selectedKeywords && result_data.selectedKeywords.length !== 0) {
                    
            } else if (data?.selectedKeywords && data.selectedKeywords.length !== 0) {
                //console.log("metaDataCopyInto: " + meta_key_id + " clone keywords")
                const nar = new Array()
                data.selectedKeywords.forEach(elem => nar.push(elem))
                result_meta_data[meta_key_id].selectedKeywords = nar
                    
            }

            //TODO roles
            
        }
    }
      
    const getMLText = (obj: iMLObj) => {
        return obj[getDefaultLocale()]
    }

    const asyncApplyPreviewData = (entryId:string, cb:any, size?: string|'small') => {

        size = size || 'small'
        if (state.previewCache.has(entryId)
            && state.previewCache.get(entryId)?.has(size)) {
            
                console.log("Preview for " + entryId + " size: " + size + " already cached")
                const imgData = state.previewCache.get(entryId)?.get(size)
                cb(imgData)
                return
        }
        if (!state.previewCache.has(entryId)) {
            state.previewCache.set(entryId, new Map<string,string>())
        }
        
        api.api.mediaEntryPreviewDataStreamDetail(entryId, { size: size }, authParams?.value)
            .then(resp => resp.blob())
            .then(blob => {
                console.log("Preview for " + entryId + " size: " + size + "got blob")
                const imgData = URL.createObjectURL(blob)

                state.previewCache.get(entryId)?.set(size, imgData)
                //state.imgCache.set(entryId, imgData)
                //console.log("assigned loaded image for " + entryId)
                cb(imgData)
            })
            .catch(error => {
                //state.previewCache.get(entryId)?.set(size, undefined)
                console.log("Preview for " + entryId + " size: " + size + "got blob")
                cb(undefined)
            })
          
    }


    const getUser = (userId: string, cb:any) => {
        if (!userId) {
            console.log("ABORT: no userId")
            cb(null)
            return
        }
        if (state.userCache.has(userId)) {
            cb(state.userCache.get(userId))
        } else {
            api.api.usersDetail(userId, authParams?.value)
                .then(resp => {
                    
                    state.userCache.set(userId, resp.data)
                    cb(resp.data)
                })
        }
    }

    const getUserPerson = (userId: string, cb: any) => {
        if (!userId) {
            console.log("ABORT: invalid user id.")
            //cb(null)
            return
        }
        getUser(userId, ((user:iUser) => {
            const pId = user.person_id
            if (state.peopleCache.has(pId)) {
                cb(state.peopleCache.get(pId))
            } else {
                api.api.peopleDetail(pId, authParams?.value)
                .then(resp => {
                    state.peopleCache.set(pId, resp.data)
                    cb(resp.data)
                })
            }
            
        }))
    }

    return {
        DEFAULT_LOCALE,
        ML_LOCS,
        MLType,

        RKEY_ENTRY,
        RKEY_COLLECTION,

        MKEY_TITLE,
        MKEY_AUTHORS,

        MD_TYPE_PEOPLE,
        MD_TYPE_KEYWORDS,
        MD_TYPE_ROLES,
        MD_TYPE_TEXT,
        MD_TYPE_TEXT_DATE,
        MD_TYPE_JSON,

        MD_PEOPLE,
        MD_KEYWORDS,

        MD_PEOPLE_DATA,
        MD_KEYWORDS_DATA,
        

        initMadek,
        getContextKeysForContext,
        checkAllLoaded,

        getUser,
        getUserPerson,

        getDefaultLocale,
        getContext,
        
        
        getMetaKeyKeywords,
        getMLText,
        getContextML,
        getMetaKeyML,
        getMetaKeyObjectType,
        isMetaKeyObjectType,
        getMetaKey,

        getCollectionMetaDataText,
        getEntryMetaDataText,

        getMetaData,
        getMetaDataRelated,
        getMetaDataExtended,

        getMetaDataText,
        
        getCollectionTitle,
        getEntryTitle,

        createMetaDataText,
        updateMetaDataText,

        createMetaDataTextDate,
        updateMetaDataTextDate,

        createMDPeople,
        deleteMDPeople,

        createMDKeywords,
        deleteMDKeywords,

        checkPublishable,
        checkPublishableMetaData,

        initEntryMetaDataDefaults,
        saveResourceMetaData,
        loadResourceMetaData,

        createiGenMetaData,
        getStoredMDDefaults,
        storeMDDefaults,
        initMD,
        copyMDInto,

        asyncApplyPreviewData,

        ...toRefs(state),
    }
}