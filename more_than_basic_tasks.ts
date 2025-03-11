
// get public data
const initAppData = () => {


    this.appSettings = (await api.api.appSettingsList()).data
                
    const contexts = (await api.api.contextsList()).data
    contexts?.map((c: ContextsDetailData) => {
        this.contextsMap.set(c.id, c)
    })

    const contextKeys = (await api.api.contextKeysList()).data
    contextKeys?.map((c: ContextKeysDetailData) => {
        // build Map by context_id by meta_key_id
        if (!this.contextKeysMap_context_id_meta_key_id.has(c.context_id)) {
            this.contextKeysMap_context_id_meta_key_id.set(c.context_id, new Map<string,ContextKeysDetailData>())
        }

        this.contextKeysMap_context_id_meta_key_id.get(c.context_id)?.set(c.meta_key_id, c)
    })

    const kws = (await api.api.keywordsList({page: 1, size2: 10000})).data.keywords
    this.keywords = kws
    // build keyword maps
    kws?.map((k: KeywordsDetailData) => {
        // one by keyword_id
        this.keywordsMap.set(k.id, k)
        // map my meta_key_id and keyword_id
        if (!this.keywordsByMetaKeyMap.has(k.meta_key_id)) {
            this.keywordsByMetaKeyMap.set(k.meta_key_id, new Array<KeywordsDetailData>())
        }
    }

    // people or users have to be queried on demand

    if (!user?.value || !user.value?.id) {
        console.log("ABORT: initAuthed: invalid user" + JSON.stringify(user))
        return
    }

    const metaKeys = (await api.api.metaKeysList({}, authParams?.value)).data['meta-keys']
    metaKeys?.map((m: MetaKeysDetailData) => {
        this.userMetaKeysMap.set(m.id, m)
    })

    const vocabs = (await api.api.vocabulariesList({}, authParams?.value)).data.vocabularies
    vocabs?.map((v: VocabulariesDetailData) => {
        this.userVocabularies.set(v.id, v)
    })

}


// get user auth
// TODO response sig


// get entries for user:
import { iMediaEntriesQuery } from './src/api_resources';

const get_users_entries = (show_published: boolean) => {

    const iquery : iMediaEntriesQuery = {
        
        filter_by_data: {
            media_entry: {
                creator_id: user?.value?.id,
                // alternative suche
                //responsible_user_id: user?.value?.id,
                is_published: show_published ? true : false
            }, // as iMediaEntriesQueryFilterByMediaEntry
        }, // as iMediaEntriesQueryFilterBy,
        order: 'desc' //,
        // collection_id: 'uuid----uuid"

    }
    if (props.show_paging == true) {
        iquery.page = paging.value.page -1
        iquery.size = paging.value.count
    }
    buildMEQuery(iquery)
    console.log("transformed query")
    console.dir(iquery)
    
    api.api.mediaEntriesList(iquery, authParams?.value)
        .then(resp => {
            const melist = resp.data.media_entries as iMediaEntry[]
            melist.forEach(entry => {
                console.log(" get media file for " + entry.id);
            });
        })
        .catch(error => handle_error("get mediaEntriesList: ", error));
}




// read meta-data

const getApiMetaDataRelated = (resKey: string, resId: string, cbOk:any, cbError: any) => {
    //this.checkResourceId(resId) // not null
    //this.checkResourceKey(resKey) // col or entry

    switch(resKey) {
        case RKEY_COLLECTION:
            api.api.collectionMetaDataRelatedDetail(resId, {}, authParams?.value)
            .then(resp => {
                cbOk(resp.data)
            })
            .catch(error => {
                handle_error('getMetaData:', error)
                cbError(error)
            })
            break;
        case RKEY_ENTRY:
            api.api.mediaEntryMetaDataRelatedDetail(resId, {}, authParams?.value)
            .then(resp => {
                console.log("got entry md " + JSON.stringify(resp.data))
                cbOk(resp.data)
            })
            .catch(error => {
                handle_error('getMetaData:', error)
                cbError(error)
            })
            break;
    }
}



// store meta-data

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
          console.log("saveAll: meta-key-id: " + meta_key_id 
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
                    loading++
                    api.api.mediaEntryMetaDatumDelete(resId, meta_key_id, authParams?.value)
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
                    loading++
                    api.api.mediaEntryMetaDatumDelete(resId, meta_key_id, authParams?.value)
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
                deleteMDKeyword(resKey, resId, meta_key_id, kwid, onOk, onError)
            })
            
            toAdd.forEach( (kwid) => {
                loading++
                createMDKeyword(resKey, resId, meta_key_id, kwid, onOk, onError)
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


const createMDKeyword = (resource_key: string, resourceId: string,
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

const deleteMDKeyword = (resource_key: string, resourceId: string,
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

const get_set() => {
    const query = {
        full_data: true,
        creator_id: user.id,
        me_edit_metadata_and_relations: true,
      }
      
      api.api.collectionsList(query, authParams?.value)
        .then(resp => {
          this.collectionList = resp.data.collections
        })
        .catch(error => handle_error('api collectionsList:', error))
        
      }      
}

// init empty meta-data map

const initMD = (context_ids: string[], meta_data: iGenMetaData) => {
    if (!context_ids) {
        console.error("initMD: ABORT: invalid context ids")
        return
    }
    context_ids.forEach(cid => {
      getContextKeysForContext(cid as string).forEach((context_key:ContextKeysDetailData) => {

        const meta_key_id = context_key.meta_key_id
        const meta_key = getMetaKey(meta_key_id)
        if (!meta_key || !meta_key.id) {
            console.error("Hidden or invalid meta key: " + meta_key_id)
        }
        else {
            const new_meta_datum = {
                meta_key_id: meta_key_id,
                type: meta_key?.meta_datum_object_type,
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