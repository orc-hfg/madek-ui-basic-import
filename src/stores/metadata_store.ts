import { iGenMetaData } from './../modules/madek';
import { apiHelper } from './../modules/api';
import { iCollection, iMediaFile, iMetaData, iPreview } from './../api_resources';
import { defineStore } from 'pinia'
import { madekHelper } from '../modules/madek';
import { errorHelper } from '../modules/error';
import { CollectionMetaDataDetailData } from '../generated/data-contracts';

const META_DATA = 'meta_data'
const { api, authParams, user } = apiHelper()
const {
    RKEY_ENTRY, RKEY_COLLECTION,
    MD_TYPE_KEYWORDS,
    MD_TYPE_PEOPLE,

    MD_KEYWORDS,
    MD_PEOPLE,

    isMetaKeyObjectType,
} = madekHelper()
const { handle_error } = errorHelper()

export interface iMetaDataMap {
    [key: string]: iGenMetaData,
}
export interface iResourceMetaDataMap {
    [key: string]: iMetaDataMap,
}
export interface iFileMap {
    [key: string]: iMediaFile,
}
export interface iPreviewMap {
    [key: string]: iPreview,
}
export interface iResourcePreviewMap {
    [key: string]: iPreviewMap,
}


export const useMetadataStore = defineStore('metadata', {

    state: () => ({
        metaDataMap: {} as iResourceMetaDataMap,
        metaDataRMap: {} as iResourceMetaDataMap,
        
        fileMap: {} as iFileMap,
        previewMap: {} as iResourcePreviewMap,


    }),
    getters: {},
    actions: {
        reset() {

        },
      
       
        checkResourceId(resId: string) {
            if (!resId) {
                const msg = `ERROR: invalid resource id [${resId}]`
                console.error(msg)
                throw msg
            }
        },
        checkResourceKey(resKey:string) {
            switch(resKey) {
                case RKEY_COLLECTION:
                case RKEY_ENTRY:
                    return
                default:
                    const msg = `ERROR: invalid resource key [${resKey}]`
                console.error(msg)
                throw msg
            }

            if (resKey != RKEY_COLLECTION || resKey != RKEY_ENTRY) {
            }

        },
        getApiMetaData(resKey: string, resId: string, cbOk:any, cbError: any) {
            this.checkResourceId(resId)
            this.checkResourceKey(resKey)

            switch(resKey) {
                case RKEY_COLLECTION:
                    api.api.collectionMetaDataDetail(resId, {}, authParams?.value)
                    .then(resp => {
                        cbOk(resp.data[META_DATA])
                    })
                    .catch(error => {
                        handle_error('getMetaData:', error)
                        cbError(error)
                    })
                    break;
                case RKEY_ENTRY:
                    api.api.mediaEntryMetaDataDetail(resId, {}, authParams?.value)
                    .then(resp => {
                        cbOk(resp.data[META_DATA])
                    })
                    .catch(error => {
                        handle_error('getMetaData:', error)
                        cbError(error)
                    })
                    break;
            }
        },
        getCachedMetaData(resKey: string, resId: string, cbOk:any, cbError:any) {
            
            if (!this.metaDataMap[resKey]) {
                this.metaDataMap[resKey] = {} as iMetaDataMap
            }
            if (!this.metaDataMap[resKey][resId]) {
                this.metaDataMap[resKey][resId] = {} as iGenMetaData
                this.getApiMetaData(resKey, resId, (data) => {

                    data.forEach((md:iGenMetaData) => {
                        this.metaDataMap[resKey][resId][md.meta_key_id] = md
                    })
                    cbOk(this.metaDataMap[resKey][resId])
                    
                }, (error) => {
                    cbError(error)
                })
            }
            else {
                console.log(`already cached meta data: ${resKey} / ${resId} `)
                cbOk(this.metaDataMap[resKey][resId])
            }
        },

        getApiMetaDataRelated(resKey: string, resId: string, cbOk:any, cbError: any) {
            this.checkResourceId(resId)
            this.checkResourceKey(resKey)

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
        },
        getCachedMetaDataRelated(resKey: string, resId: string, force: boolean, cbOk:any, cbError:any) {
            
            if (!this.metaDataRMap[resKey]) {
                this.metaDataRMap[resKey] = {} as iMetaDataMap
            }
            if (!this.metaDataRMap[resKey][resId] || force) {
                this.metaDataRMap[resKey][resId] = {} as iGenMetaData
                this.getApiMetaDataRelated(resKey, resId, (data) => {

                    data.forEach(mdMap => {
                        const md = mdMap[META_DATA]
                        this.metaDataRMap[resKey][resId][md.meta_key_id] = md

                        
                        if (isMetaKeyObjectType( md.meta_key_id, MD_TYPE_PEOPLE)) {
                            this.metaDataRMap[resKey][resId][md.meta_key_id].selectedPeople = mdMap[MD_PEOPLE]
                        }
                        else if (isMetaKeyObjectType( md.meta_key_id, MD_TYPE_KEYWORDS)) {

                            this.metaDataRMap[resKey][resId][md.meta_key_id].selectedKeywords = mdMap[MD_KEYWORDS]
                        }
                        // TODO roles
                    });
                    
                    cbOk(this.metaDataRMap[resKey][resId])
                    
                }, (error) => {
                    cbError(error)
                })
            }
            else {
                console.log(`already cached meta data: ${resKey} / ${resId} : ${JSON.stringify(this.metaDataRMap[resKey][resId])}`)
                cbOk(this.metaDataRMap[resKey][resId])
            }
        },


    }

})