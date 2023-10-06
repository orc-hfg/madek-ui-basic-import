import { AppSettingsListData, KeywordsDetailData, ContextKeysDetailData, ContextsDetailData, MetaKeysDetailData, VocabulariesDetailData } from './../generated/data-contracts';

import { apiHelper } from './../modules/api';
//import { iCollection, iMetaData } from './../api_resources';
import { defineStore } from 'pinia'

const { api, authParams, user } = apiHelper()


export const useMadekStore = defineStore('madek', {

    state: () => ({
        loaded: false as boolean,
        appSettings: {} as AppSettingsListData,
        contextsMap: new Map<string, ContextsDetailData>(),

        contextKeysMap_context_id_meta_key_id: new Map<string, Map<string, ContextKeysDetailData>>(),

        publicMetaKeysMap: new Map<string, MetaKeysDetailData>(),
        publicVocabularies: new Map<string, VocabulariesDetailData>(),

        keywords: new Array<KeywordsDetailData>(),
        keywordsMap: new Map<string, KeywordsDetailData>(),
        keywordsByMetaKeyMap: new Map<string, Array<KeywordsDetailData>>(),
    
        userMetaKeysMap: new Map<string, MetaKeysDetailData>(),
        userVocabularies: new Map<string, VocabulariesDetailData>(),
    }),
    getters: {

    },
    actions: {

        reset() {
            this.loaded = false
            this.appSettings = {} as AppSettingsListData
            this.contextsMap.clear()
            this.contextKeysMap_context_id_meta_key_id.clear()
            
            this.publicMetaKeysMap.clear()
            this.publicVocabularies.clear()

            this.userMetaKeysMap.clear()
            this.userVocabularies.clear()

            this.keywords.length = 0
            this.keywordsMap.clear()
            this.keywordsByMetaKeyMap.clear()
        },
        async initPublic() {
            this.reset()
            try{
  
                this.appSettings = (await api.api.appSettingsList()).data
                
                const contexts = (await api.api.contextsList()).data
                contexts?.map((c: ContextsDetailData) => {
                    this.contextsMap.set(c.id, c)
                })
                
                const contextKeys = (await api.api.contextKeysList()).data
                contextKeys?.map((c: ContextKeysDetailData) => {
                    if (!this.contextKeysMap_context_id_meta_key_id.has(c.context_id)) {
                        this.contextKeysMap_context_id_meta_key_id.set(c.context_id, new Map<string,ContextKeysDetailData>())
                    }

                    this.contextKeysMap_context_id_meta_key_id.get(c.context_id)?.set(c.meta_key_id, c)
                })

                const pubMKeys = (await api.api.metaKeysList()).data['meta-keys']
                pubMKeys?.map((m: MetaKeysDetailData) => {
                    this.publicMetaKeysMap.set(m.id, m)
                })

                const vocabs = (await api.api.vocabulariesList({})).data.vocabularies
                vocabs?.map((v: VocabulariesDetailData) => {
                    this.publicVocabularies.set(v.id, v)
                })

                const kws = (await api.api.keywordsList()).data.keywords
                this.keywords = kws
                kws?.map((k: KeywordsDetailData) => {
                    this.keywordsMap.set(k.id, k)
                    if (!this.keywordsByMetaKeyMap.has(k.meta_key_id)) {
                        this.keywordsByMetaKeyMap.set(k.meta_key_id, new Array<KeywordsDetailData>())
                    }
                    this.keywordsByMetaKeyMap.get(k.meta_key_id)?.push(k)
                })

                this.loaded = true
            } catch(ex) {
                console.error("Could not load madek app settings." + JSON.stringify(ex))
                throw ex
            }
        },
        async initAuthed() {
            this.loaded = false

            if (!user?.value || !user.value?.id) {
                console.log("ABORT: initAuthed: invalid user")
                return
            }

            try {
                const metaKeys = (await api.api.metaKeysList({}, authParams?.value)).data['meta-keys']
                metaKeys?.map((m: MetaKeysDetailData) => {
                    this.userMetaKeysMap.set(m.id, m)
                })

                const vocabs = (await api.api.vocabulariesList({}, authParams?.value)).data.vocabularies
                vocabs?.map((v: VocabulariesDetailData) => {
                    this.userVocabularies.set(v.id, v)
                })
                this.loaded = true
            } catch(ex) {
                console.error("Could not load authed app settings." + JSON.stringify(ex))
                throw ex
            }
        
        }


    }
})

