/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AppSettingsListData,
  CollectionCollectionArcCreateData,
  CollectionCollectionArcDeleteData,
  CollectionCollectionArcDetailData,
  CollectionCollectionArcUpdateData,
  CollectionCollectionArcsDetailData,
  CollectionCollectionArcsListData,
  CollectionCollectionArcsListParams,
  CollectionCreateData,
  CollectionCreatePayload,
  CollectionCustomUrlCreateData,
  CollectionCustomUrlDeleteData,
  CollectionCustomUrlUpdateData,
  CollectionDeleteData,
  CollectionDetailData,
  CollectionEditSessionsCreateData,
  CollectionEditSessionsDetailData,
  CollectionMediaEntryArcCreateData,
  CollectionMediaEntryArcDeleteData,
  CollectionMediaEntryArcUpdateData,
  CollectionMediaEntryArcsDetail2Data,
  CollectionMediaEntryArcsDetailData,
  CollectionMediaEntryArcsListData,
  CollectionMediaEntryArcsListParams,
  CollectionMetaDataDetailData,
  CollectionMetaDataDetailParams,
  CollectionMetaDatumDeleteData,
  CollectionMetaDatumDetailData,
  CollectionMetaDatumJsonCreateData,
  CollectionMetaDatumJsonUpdateData,
  CollectionMetaDatumKeywordCreateData,
  CollectionMetaDatumKeywordDeleteData,
  CollectionMetaDatumKeywordDetailData,
  CollectionMetaDatumPeopleCreateData,
  CollectionMetaDatumPeopleDeleteData,
  CollectionMetaDatumPeopleDetailData,
  CollectionMetaDatumRoleCreateData,
  CollectionMetaDatumTextCreateData,
  CollectionMetaDatumTextDateCreateData,
  CollectionMetaDatumTextDateUpdateData,
  CollectionMetaDatumTextUpdateData,
  CollectionPermsDetailData,
  CollectionPermsGroupCreateData,
  CollectionPermsGroupCreatePayload,
  CollectionPermsGroupDeleteData,
  CollectionPermsGroupDetailData,
  CollectionPermsGroupUpdateData,
  CollectionPermsGroupUpdateParamsEnum,
  CollectionPermsGroupsDetailData,
  CollectionPermsResourceUpdateData,
  CollectionPermsResourceUpdateParamsEnum,
  CollectionPermsResourcesDetailData,
  CollectionPermsResourcesUpdateData,
  CollectionPermsResourcesUpdatePayload,
  CollectionPermsUserCreateData,
  CollectionPermsUserCreatePayload,
  CollectionPermsUserDeleteData,
  CollectionPermsUserDetailData,
  CollectionPermsUserUpdateData,
  CollectionPermsUserUpdateParamsEnum,
  CollectionPermsUsersDetailData,
  CollectionUpdateData,
  CollectionUpdatePayload,
  CollectionsListData,
  CollectionsListParams,
  ContextKeysDetailData,
  ContextKeysListData,
  ContextKeysListParams,
  ContextsDetailData,
  ContextsListData,
  CustomUrlsListParams,
  EditSessionsListParams,
  FavoriteCollectionsListData,
  FavoriteMediaEntriesListData,
  FullTextsListParams,
  GroupsDetailData,
  GroupsListData,
  GroupsListParams,
  KeywordsDetailData,
  KeywordsListData,
  KeywordsListParams,
  MediaEntriesListData,
  MediaEntriesListParams,
  MediaEntriesRelatedDataListData,
  MediaEntriesRelatedDataListParams,
  MediaEntryCreateParams,
  MediaEntryCreatePayload,
  MediaEntryCustomUrlCreateData,
  MediaEntryCustomUrlDeleteData,
  MediaEntryCustomUrlDetailData,
  MediaEntryCustomUrlUpdateData,
  MediaEntryDetailData,
  MediaEntryEditSessionsCreateData,
  MediaEntryEditSessionsDetailData,
  MediaEntryFavoriteCreateData,
  MediaEntryFavoriteDeleteData,
  MediaEntryFavoriteDetailData,
  MediaEntryMediaFileDetailData,
  MediaEntryMetaDataDetailData,
  MediaEntryMetaDataDetailParams,
  MediaEntryMetaDatumDeleteData,
  MediaEntryMetaDatumDetailData,
  MediaEntryMetaDatumJsonCreateData,
  MediaEntryMetaDatumJsonUpdateData,
  MediaEntryMetaDatumKeywordCreateData,
  MediaEntryMetaDatumKeywordDeleteData,
  MediaEntryMetaDatumKeywordDetailData,
  MediaEntryMetaDatumPeopleCreateData,
  MediaEntryMetaDatumPeopleDeleteData,
  MediaEntryMetaDatumPeopleDetailData,
  MediaEntryMetaDatumRoleCreateData,
  MediaEntryMetaDatumRoleDeleteData,
  MediaEntryMetaDatumRoleDetailData,
  MediaEntryMetaDatumTextCreateData,
  MediaEntryMetaDatumTextDateCreateData,
  MediaEntryMetaDatumTextDateUpdateData,
  MediaEntryMetaDatumTextUpdateData,
  MediaEntryPermsDetailData,
  MediaEntryPermsGroupCreateData,
  MediaEntryPermsGroupCreatePayload,
  MediaEntryPermsGroupDeleteData,
  MediaEntryPermsGroupDetailData,
  MediaEntryPermsGroupUpdateData,
  MediaEntryPermsGroupUpdateParamsEnum,
  MediaEntryPermsGroupsDetailData,
  MediaEntryPermsResourceUpdateData,
  MediaEntryPermsResourceUpdateParamsEnum,
  MediaEntryPermsResourcesDetailData,
  MediaEntryPermsResourcesUpdateData,
  MediaEntryPermsResourcesUpdatePayload,
  MediaEntryPermsUserCreateData,
  MediaEntryPermsUserCreatePayload,
  MediaEntryPermsUserDeleteData,
  MediaEntryPermsUserDetailData,
  MediaEntryPermsUserUpdateData,
  MediaEntryPermsUserUpdateParamsEnum,
  MediaEntryPermsUsersDetailData,
  MediaEntryPreviewDataStreamDetailParams,
  MediaEntryPreviewDetailParams,
  MediaEntryPublishUpdateData,
  MediaFileDetailData,
  MetaDataDetailData,
  MetaDataRoleDetailData,
  MetaKeysDetailData,
  MetaKeysListData,
  MetaKeysListParams,
  PeopleDetailData,
  PeopleListData,
  PeopleListParams,
  RolesDetailData,
  RolesListData,
  RolesListParams,
  UsageTermsDetailData,
  UsageTermsListData,
  UsageTermsListParams,
  UsersDetailData,
  UsersListData,
  UsersListParams,
  VocabulariesDetailData,
  VocabulariesListData,
  VocabulariesListParams,
  WorkflowsCreateData,
  WorkflowsCreatePayload,
  WorkflowsDeleteData,
  WorkflowsDetailData,
  WorkflowsListData,
  WorkflowsListParams,
  WorkflowsUpdateData,
  WorkflowsUpdatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AuthInfoList
   * @summary Authentication help and info.
   * @request GET:/api/auth-info
   */
  authInfoList = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/auth-info`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name AppSettingsList
   * @summary PUBLIC Context: Get App Settings.
   * @request GET:/api/app-settings
   */
  appSettingsList = (params: RequestParams = {}) =>
    this.request<AppSettingsListData, any>({
      path: `/api/app-settings`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name ContextKeysList
   * @summary PUBLIC Context: Query / List context_keys.
   * @request GET:/api/context-keys/
   */
  contextKeysList = (query: ContextKeysListParams, params: RequestParams = {}) =>
    this.request<ContextKeysListData, any>({
      path: `/api/context-keys/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name ContextKeysDetail
   * @summary PUBLIC Context: Get context_key by id.
   * @request GET:/api/context-keys/{id}
   */
  contextKeysDetail = (id: string, params: RequestParams = {}) =>
    this.request<ContextKeysDetailData, any>({
      path: `/api/context-keys/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name ContextsList
   * @summary USER Context: List contexts.
   * @request GET:/api/contexts/
   */
  contextsList = (params: RequestParams = {}) =>
    this.request<ContextsListData, any>({
      path: `/api/contexts/`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name ContextsDetail
   * @summary USER Context: Get contexts by id.
   * @request GET:/api/contexts/{id}
   */
  contextsDetail = (id: string, params: RequestParams = {}) =>
    this.request<ContextsDetailData, any>({
      path: `/api/contexts/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name KeywordsList
   * @summary PUBLIC Context: Query / list keywords.
   * @request GET:/api/keywords/
   */
  keywordsList = (query: KeywordsListParams, params: RequestParams = {}) =>
    this.request<KeywordsListData, any>({
      path: `/api/keywords/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get keyword for id. Returns 404, if no such keyword exists.
   *
   * @name KeywordsDetail
   * @summary PUBLIC Context: Get keyword for id.
   * @request GET:/api/keywords/{id}
   */
  keywordsDetail = (id: string, params: RequestParams = {}) =>
    this.request<KeywordsDetailData, any>({
      path: `/api/keywords/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get list of meta-key ids. Paging is used as you get a limit of 100 entries.
   *
   * @name MetaKeysList
   * @summary PUBLIC/USER Context: Get all meta-key ids
   * @request GET:/api/meta-keys/
   */
  metaKeysList = (query: MetaKeysListParams, params: RequestParams = {}) =>
    this.request<MetaKeysListData, any>({
      path: `/api/meta-keys/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get meta-key by id. Returns 404, if no such meta-key exists.
   *
   * @name MetaKeysDetail
   * @summary PUBLIC/USER Context: Get meta-key by id
   * @request GET:/api/meta-keys/{id}
   */
  metaKeysDetail = (id: string, params: RequestParams = {}) =>
    this.request<
      MetaKeysDetailData,
      {
        message: string;
      }
    >({
      path: `/api/meta-keys/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Query list of people only for ids or full-data. Optional Paging.
   *
   * @name PeopleList
   * @summary PUBLIC Context: Get all people ids
   * @request GET:/api/people/
   */
  peopleList = (query: PeopleListParams, params: RequestParams = {}) =>
    this.request<PeopleListData, any>({
      path: `/api/people/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get person by id. Returns 404, if no such person exists. TODO query params.
   *
   * @name PeopleDetail
   * @summary PUBLIC Context: Get person by id
   * @request GET:/api/people/{id}
   */
  peopleDetail = (id: string, params: RequestParams = {}) =>
    this.request<PeopleDetailData, string>({
      path: `/api/people/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionsList
   * @summary USER Context: Query/List collections.
   * @request GET:/api/collections
   */
  collectionsList = (query: CollectionsListParams, params: RequestParams = {}) =>
    this.request<CollectionsListData, any>({
      path: `/api/collections`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCreate
   * @summary USER Context: Create collection
   * @request POST:/api/collection
   */
  collectionCreate = (body: CollectionCreatePayload, params: RequestParams = {}) =>
    this.request<CollectionCreateData, any>({
      path: `/api/collection`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionDetail
   * @summary PUBLIC/USER Context: Get collection for id.
   * @request GET:/api/collection/{collection_id}
   */
  collectionDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionDetailData, any>({
      path: `/api/collection/${collectionId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionUpdate
   * @summary USER Context: Update collection for id.
   * @request PUT:/api/collection/{collection_id}
   */
  collectionUpdate = (collectionId: string, body: CollectionUpdatePayload, params: RequestParams = {}) =>
    this.request<CollectionUpdateData, any>({
      path: `/api/collection/${collectionId}`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionDelete
   * @summary USER Context: Delete collection for id.
   * @request DELETE:/api/collection/{collection_id}
   */
  collectionDelete = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionDeleteData, any>({
      path: `/api/collection/${collectionId}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDataDetail
   * @summary Get meta-data for collection.
   * @request GET:/api/collection/{collection_id}/meta-data
   */
  collectionMetaDataDetail = ({ collectionId, ...query }: CollectionMetaDataDetailParams, params: RequestParams = {}) =>
    this.request<CollectionMetaDataDetailData, any>({
      path: `/api/collection/${collectionId}/meta-data`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumDetail
   * @summary Get meta-data for collection and meta-key.
   * @request GET:/api/collection/{collection_id}/meta-datum/{meta_key_id}
   */
  collectionMetaDatumDetail = (collectionId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<CollectionMetaDatumDetailData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumDelete
   * @summary Delete meta-data for collection and meta-key
   * @request DELETE:/api/collection/{collection_id}/meta-datum/{meta_key_id}
   */
  collectionMetaDatumDelete = (collectionId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<CollectionMetaDatumDeleteData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumTextCreate
   * @summary Create meta-data text for collection.
   * @request POST:/api/collection/{collection_id}/meta-datum/{meta_key_id}/text
   */
  collectionMetaDatumTextCreate = (
    collectionId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumTextCreateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/text`,
      method: "POST",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumTextUpdate
   * @summary Update meta-data text for collection.
   * @request PUT:/api/collection/{collection_id}/meta-datum/{meta_key_id}/text
   */
  collectionMetaDatumTextUpdate = (
    collectionId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumTextUpdateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/text`,
      method: "PUT",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumTextDateCreate
   * @summary Create meta-data json for collection.
   * @request POST:/api/collection/{collection_id}/meta-datum/{meta_key_id}/text-date
   */
  collectionMetaDatumTextDateCreate = (
    collectionId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumTextDateCreateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/text-date`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumTextDateUpdate
   * @summary Update meta-data text-date for collection.
   * @request PUT:/api/collection/{collection_id}/meta-datum/{meta_key_id}/text-date
   */
  collectionMetaDatumTextDateUpdate = (
    collectionId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumTextDateUpdateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/text-date`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumJsonCreate
   * @summary Create meta-data json for collection.
   * @request POST:/api/collection/{collection_id}/meta-datum/{meta_key_id}/json
   */
  collectionMetaDatumJsonCreate = (
    collectionId: string,
    metaKeyId: string,
    body: {
      json: any;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumJsonCreateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/json`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumJsonUpdate
   * @summary Update meta-data json for collection.
   * @request PUT:/api/collection/{collection_id}/meta-datum/{meta_key_id}/json
   */
  collectionMetaDatumJsonUpdate = (
    collectionId: string,
    metaKeyId: string,
    body: {
      json: any;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumJsonUpdateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/json`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumKeywordDetail
   * @summary Get meta-data keywords for collection meta-key
   * @request GET:/api/collection/{collection_id}/meta-datum/{meta_key_id}/keyword
   */
  collectionMetaDatumKeywordDetail = (collectionId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<CollectionMetaDatumKeywordDetailData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/keyword`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumKeywordCreate
   * @summary Create meta-data keyword for collection.
   * @request POST:/api/collection/{collection_id}/meta-datum/{meta_key_id}/keyword/{keyword_id}
   */
  collectionMetaDatumKeywordCreate = (
    collectionId: string,
    metaKeyId: string,
    keywordId: string,
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumKeywordCreateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/keyword/${keywordId}`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumKeywordDelete
   * @summary Delete meta-data keyword for collection.
   * @request DELETE:/api/collection/{collection_id}/meta-datum/{meta_key_id}/keyword/{keyword_id}
   */
  collectionMetaDatumKeywordDelete = (
    collectionId: string,
    metaKeyId: string,
    keywordId: string,
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumKeywordDeleteData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/keyword/${keywordId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumPeopleDetail
   * @summary Get meta-data people for collection meta-key.
   * @request GET:/api/collection/{collection_id}/meta-datum/{meta_key_id}/people
   */
  collectionMetaDatumPeopleDetail = (collectionId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<CollectionMetaDatumPeopleDetailData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/people`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumPeopleCreate
   * @summary Create meta-data people for media-entry
   * @request POST:/api/collection/{collection_id}/meta-datum/{meta_key_id}/people/{person_id}
   */
  collectionMetaDatumPeopleCreate = (
    collectionId: string,
    metaKeyId: string,
    personId: string,
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumPeopleCreateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/people/${personId}`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumPeopleDelete
   * @summary Delete meta-data people for collection.
   * @request DELETE:/api/collection/{collection_id}/meta-datum/{meta_key_id}/people/{person_id}
   */
  collectionMetaDatumPeopleDelete = (
    collectionId: string,
    metaKeyId: string,
    personId: string,
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumPeopleDeleteData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/people/${personId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMetaDatumRoleCreate
   * @summary Create meta-data role for media-entry
   * @request POST:/api/collection/{collection_id}/meta-datum/{meta_key_id}/role/{role_id}
   */
  collectionMetaDatumRoleCreate = (
    mediaEntryId: string,
    metaKeyId: string,
    roleId: string,
    collectionId: string,
    params: RequestParams = {},
  ) =>
    this.request<CollectionMetaDatumRoleCreateData, any>({
      path: `/api/collection/${collectionId}/meta-datum/${metaKeyId}/role/${roleId}`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCustomUrlDetail
   * @summary Get custom_url for collection.
   * @request GET:/api/collection/{collection_id}/custom_url
   */
  collectionCustomUrlDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/custom_url`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCustomUrlCreate
   * @summary USER Context: Create custom_url for collection.
   * @request POST:/api/collection/{collection_id}/custom_url
   */
  collectionCustomUrlCreate = (
    collectionId: string,
    body: {
      id: string;
      is_primary: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionCustomUrlCreateData, any>({
      path: `/api/collection/${collectionId}/custom_url`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCustomUrlUpdate
   * @summary USER Context: Update custom_url for collection.
   * @request PUT:/api/collection/{collection_id}/custom_url
   */
  collectionCustomUrlUpdate = (
    collectionId: string,
    body: {
      id?: string;
      is_primary?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionCustomUrlUpdateData, any>({
      path: `/api/collection/${collectionId}/custom_url`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCustomUrlDelete
   * @summary TODO: Delete custom_url for collection.
   * @request DELETE:/api/collection/{collection_id}/custom_url
   */
  collectionCustomUrlDelete = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionCustomUrlDeleteData, any>({
      path: `/api/collection/${collectionId}/custom_url`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionEditSessionsDetail
   * @summary PUBLIC/USER Context: Get edit_session list for collection.
   * @request GET:/api/collection/{collection_id}/edit_sessions
   */
  collectionEditSessionsDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionEditSessionsDetailData, any>({
      path: `/api/collection/${collectionId}/edit_sessions`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionEditSessionsCreate
   * @summary USER Context: Create edit session for collection and authed user.
   * @request POST:/api/collection/{collection_id}/edit_sessions
   */
  collectionEditSessionsCreate = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionEditSessionsCreateData, any>({
      path: `/api/collection/${collectionId}/edit_sessions`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionFavoriteDetail
   * @summary USER Context: Get favorite_collection for authed user and collection id.
   * @request GET:/api/collection/{collection_id}/favorite
   */
  collectionFavoriteDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/favorite`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionFavoriteCreate
   * @summary USER Context: Create favorite_collection for authed user and collection.
   * @request POST:/api/collection/{collection_id}/favorite
   */
  collectionFavoriteCreate = (collectionId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/favorite`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionFavoriteDelete
   * @summary USER Context: Delete favorite_collection for authed user and collection id.
   * @request DELETE:/api/collection/{collection_id}/favorite
   */
  collectionFavoriteDelete = (collectionId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/favorite`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsDetail
   * @summary Query collection permissions.
   * @request GET:/api/collection/{collection_id}/perms/
   */
  collectionPermsDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsDetailData, any>({
      path: `/api/collection/${collectionId}/perms/`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsResourcesDetail
   * @summary Query collection permissions.
   * @request GET:/api/collection/{collection_id}/perms/resources
   */
  collectionPermsResourcesDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsResourcesDetailData, any>({
      path: `/api/collection/${collectionId}/perms/resources`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Valid perm_name values are["get_metadata_and_previews" "get_full_size" "edit_metadata" "edit_permissions"]
   *
   * @name CollectionPermsResourcesUpdate
   * @summary Update collection entity permissions
   * @request PUT:/api/collection/{collection_id}/perms/resources
   */
  collectionPermsResourcesUpdate = (
    collectionId: string,
    body: CollectionPermsResourcesUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.request<CollectionPermsResourcesUpdateData, any>({
      path: `/api/collection/${collectionId}/perms/resources`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Valid perm_name values are["get_metadata_and_previews" "get_full_size" "edit_metadata" "edit_permissions"]
   *
   * @name CollectionPermsResourceUpdate
   * @summary Update collection entity permissions
   * @request PUT:/api/collection/{collection_id}/perms/resource/{perm_name}/{perm_val}
   */
  collectionPermsResourceUpdate = (
    collectionId: string,
    permName: CollectionPermsResourceUpdateParamsEnum,
    permVal: boolean,
    params: RequestParams = {},
  ) =>
    this.request<CollectionPermsResourceUpdateData, any>({
      path: `/api/collection/${collectionId}/perms/resource/${permName}/${permVal}`,
      method: "PUT",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsUsersDetail
   * @summary Query collection permissions.
   * @request GET:/api/collection/{collection_id}/perms/users
   */
  collectionPermsUsersDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsUsersDetailData, any>({
      path: `/api/collection/${collectionId}/perms/users`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsUserDetail
   * @summary Get collection user permissions.
   * @request GET:/api/collection/{collection_id}/perms/user/{user_id}
   */
  collectionPermsUserDetail = (collectionId: string, userId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsUserDetailData, any>({
      path: `/api/collection/${collectionId}/perms/user/${userId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsUserCreate
   * @summary Create collection user permissions.
   * @request POST:/api/collection/{collection_id}/perms/user/{user_id}
   */
  collectionPermsUserCreate = (
    collectionId: string,
    userId: string,
    body: CollectionPermsUserCreatePayload,
    params: RequestParams = {},
  ) =>
    this.request<CollectionPermsUserCreateData, any>({
      path: `/api/collection/${collectionId}/perms/user/${userId}`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsUserDelete
   * @summary Delete collection user permissions.
   * @request DELETE:/api/collection/{collection_id}/perms/user/{user_id}
   */
  collectionPermsUserDelete = (collectionId: string, userId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsUserDeleteData, any>({
      path: `/api/collection/${collectionId}/perms/user/${userId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsUserUpdate
   * @summary Update collection user permissions
   * @request PUT:/api/collection/{collection_id}/perms/user/{user_id}/{perm_name}/{perm_val}
   */
  collectionPermsUserUpdate = (
    collectionId: string,
    userId: string,
    permName: CollectionPermsUserUpdateParamsEnum,
    permVal: boolean,
    params: RequestParams = {},
  ) =>
    this.request<CollectionPermsUserUpdateData, any>({
      path: `/api/collection/${collectionId}/perms/user/${userId}/${permName}/${permVal}`,
      method: "PUT",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsGroupsDetail
   * @summary Query collection permissions.
   * @request GET:/api/collection/{collection_id}/perms/groups
   */
  collectionPermsGroupsDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsGroupsDetailData, any>({
      path: `/api/collection/${collectionId}/perms/groups`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsGroupDetail
   * @summary Get collection group permissions.
   * @request GET:/api/collection/{collection_id}/perms/group/{group_id}
   */
  collectionPermsGroupDetail = (collectionId: string, groupId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsGroupDetailData, any>({
      path: `/api/collection/${collectionId}/perms/group/${groupId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsGroupCreate
   * @summary Create collection group permissions.
   * @request POST:/api/collection/{collection_id}/perms/group/{group_id}
   */
  collectionPermsGroupCreate = (
    collectionId: string,
    groupId: string,
    body: CollectionPermsGroupCreatePayload,
    params: RequestParams = {},
  ) =>
    this.request<CollectionPermsGroupCreateData, any>({
      path: `/api/collection/${collectionId}/perms/group/${groupId}`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionPermsGroupDelete
   * @summary Delete collection group permissions.
   * @request DELETE:/api/collection/{collection_id}/perms/group/{group_id}
   */
  collectionPermsGroupDelete = (collectionId: string, groupId: string, params: RequestParams = {}) =>
    this.request<CollectionPermsGroupDeleteData, any>({
      path: `/api/collection/${collectionId}/perms/group/${groupId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Valid perm_name values are["get_metadata_and_previews" "get_full_size" "edit_metadata" "edit_permissions"]
   *
   * @name CollectionPermsGroupUpdate
   * @summary Update collection group permissions
   * @request PUT:/api/collection/{collection_id}/perms/group/{group_id}/{perm_name}/{perm_val}
   */
  collectionPermsGroupUpdate = (
    collectionId: string,
    groupId: string,
    permName: CollectionPermsGroupUpdateParamsEnum,
    permVal: boolean,
    params: RequestParams = {},
  ) =>
    this.request<CollectionPermsGroupUpdateData, any>({
      path: `/api/collection/${collectionId}/perms/group/${groupId}/${permName}/${permVal}`,
      method: "PUT",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMediaEntryArcsDetail
   * @summary Get collection media-entry arcs.
   * @request GET:/api/collection/{collection_id}/media-entry-arcs
   */
  collectionMediaEntryArcsDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<CollectionMediaEntryArcsDetailData, any>({
      path: `/api/collection/${collectionId}/media-entry-arcs`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMediaEntryArcCreate
   * @summary USER Context: Create collection media-entry arc
   * @request POST:/api/collection/{collection_id}/media-entry-arc/{media_entry_id}
   */
  collectionMediaEntryArcCreate = (
    collectionId: string,
    mediaEntryId: string,
    body: {
      highlight?: boolean;
      cover?: boolean;
      /** @format double */
      order?: number;
      /** @format int32 */
      position?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMediaEntryArcCreateData, any>({
      path: `/api/collection/${collectionId}/media-entry-arc/${mediaEntryId}`,
      method: "POST",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMediaEntryArcUpdate
   * @summary USER Context: Update collection media-entry arc
   * @request PUT:/api/collection/{collection_id}/media-entry-arc/{media_entry_id}
   */
  collectionMediaEntryArcUpdate = (
    collectionId: string,
    mediaEntryId: string,
    body: {
      highlight?: boolean;
      cover?: boolean;
      /** @format double */
      order?: number;
      /** @format int32 */
      position?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionMediaEntryArcUpdateData, any>({
      path: `/api/collection/${collectionId}/media-entry-arc/${mediaEntryId}`,
      method: "PUT",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMediaEntryArcDelete
   * @summary USER Context: Delete collection media-entry arc
   * @request DELETE:/api/collection/{collection_id}/media-entry-arc/{media_entry_id}
   */
  collectionMediaEntryArcDelete = (collectionId: string, mediaEntryId: string, params: RequestParams = {}) =>
    this.request<CollectionMediaEntryArcDeleteData, any>({
      path: `/api/collection/${collectionId}/media-entry-arc/${mediaEntryId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCollectionArcDetail
   * @summary Get collection collection arcs.
   * @request GET:/api/collection/{parent_id}/collection-arc/{child_id}
   */
  collectionCollectionArcDetail = (parentId: string, childId: string, params: RequestParams = {}) =>
    this.request<CollectionCollectionArcDetailData, any>({
      path: `/api/collection/${parentId}/collection-arc/${childId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCollectionArcCreate
   * @summary TODO: Create collection collection arc
   * @request POST:/api/collection/{parent_id}/collection-arc/{child_id}
   */
  collectionCollectionArcCreate = (
    parentId: string,
    childId: string,
    body: {
      highlight?: boolean;
      /** @format double */
      order?: number;
      /** @format int32 */
      position?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionCollectionArcCreateData, any>({
      path: `/api/collection/${parentId}/collection-arc/${childId}`,
      method: "POST",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCollectionArcUpdate
   * @summary USER Context: Update collection collection arc
   * @request PUT:/api/collection/{parent_id}/collection-arc/{child_id}
   */
  collectionCollectionArcUpdate = (
    parentId: string,
    childId: string,
    body: {
      highlight?: boolean;
      /** @format double */
      order?: number;
      /** @format int32 */
      position?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<CollectionCollectionArcUpdateData, any>({
      path: `/api/collection/${parentId}/collection-arc/${childId}`,
      method: "PUT",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCollectionArcDelete
   * @summary USER Context: Delete collection collection arc
   * @request DELETE:/api/collection/{parent_id}/collection-arc/{child_id}
   */
  collectionCollectionArcDelete = (parentId: string, childId: string, params: RequestParams = {}) =>
    this.request<CollectionCollectionArcDeleteData, any>({
      path: `/api/collection/${parentId}/collection-arc/${childId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMediaEntryArcsList
   * @summary Query collection media-entry arcs.
   * @request GET:/api/collection-media-entry-arcs/
   */
  collectionMediaEntryArcsList = (query: CollectionMediaEntryArcsListParams, params: RequestParams = {}) =>
    this.request<CollectionMediaEntryArcsListData, any>({
      path: `/api/collection-media-entry-arcs/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionMediaEntryArcsDetail2
   * @summary Get collection media-entry arc.
   * @request GET:/api/collection-media-entry-arcs/{id}
   * @originalName collectionMediaEntryArcsDetail
   * @duplicate
   */
  collectionMediaEntryArcsDetail2 = (id: string, params: RequestParams = {}) =>
    this.request<CollectionMediaEntryArcsDetail2Data, any>({
      path: `/api/collection-media-entry-arcs/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCollectionArcsList
   * @summary Query collection collection arcs.
   * @request GET:/api/collection-collection-arcs/
   */
  collectionCollectionArcsList = (query: CollectionCollectionArcsListParams, params: RequestParams = {}) =>
    this.request<CollectionCollectionArcsListData, any>({
      path: `/api/collection-collection-arcs/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionCollectionArcsDetail
   * @summary Get collection collection arcs.
   * @request GET:/api/collection-collection-arcs/{id}
   */
  collectionCollectionArcsDetail = (id: string, params: RequestParams = {}) =>
    this.request<CollectionCollectionArcsDetailData, any>({
      path: `/api/collection-collection-arcs/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionFullTextDetail
   * @summary PUBLIC/USER Context: Get full_text.
   * @request GET:/api/collection/{collection_id}/full_text
   */
  collectionFullTextDetail = (collectionId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/full_text`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionFullTextCreate
   * @summary USER Context: Create full_text for collection
   * @request POST:/api/collection/{collection_id}/full_text
   */
  collectionFullTextCreate = (
    collectionId: string,
    body: {
      text: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/full_text`,
      method: "POST",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionFullTextUpdate
   * @summary USER Context: Update full_text for collection.
   * @request PUT:/api/collection/{collection_id}/full_text
   */
  collectionFullTextUpdate = (
    collectionId: string,
    body: {
      text: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/full_text`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CollectionFullTextDelete
   * @summary USER Context: Delete full_text.
   * @request DELETE:/api/collection/{collection_id}/full_text
   */
  collectionFullTextDelete = (collectionId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/collection/${collectionId}/full_text`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CustomUrlsList
   * @summary USER Context: Query and list custom_urls.
   * @request GET:/api/custom_urls/
   */
  customUrlsList = (query: CustomUrlsListParams, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/custom_urls/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name CustomUrlsDetail
   * @summary USER Context: Get custom_url.
   * @request GET:/api/custom_urls/{id}
   */
  customUrlsDetail = (id: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/custom_urls/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name EditSessionsList
   * @summary USER Context: List authed users edit_sessions.
   * @request GET:/api/edit_sessions/
   */
  editSessionsList = (query: EditSessionsListParams, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/edit_sessions/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name EditSessionsDetail
   * @summary USER Context: Get edit_session.
   * @request GET:/api/edit_sessions/{id}
   */
  editSessionsDetail = (id: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/edit_sessions/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name FavoriteMediaEntriesList
   * @summary USER Context: List users favorites media_entries ids.
   * @request GET:/api/favorite/media-entries
   */
  favoriteMediaEntriesList = (params: RequestParams = {}) =>
    this.request<FavoriteMediaEntriesListData, any>({
      path: `/api/favorite/media-entries`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name FavoriteCollectionsList
   * @summary USER Context: List users favorite_collections.
   * @request GET:/api/favorite/collections
   */
  favoriteCollectionsList = (params: RequestParams = {}) =>
    this.request<FavoriteCollectionsListData, any>({
      path: `/api/favorite/collections`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name FullTextsList
   * @summary USER Context: Query or list full_texts.
   * @request GET:/api/full_texts
   */
  fullTextsList = (query: FullTextsListParams, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/full_texts`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name FullTextsDetail
   * @summary USER Context: Get full_text.
   * @request GET:/api/full_texts/{media_resource_id}
   */
  fullTextsDetail = (mediaResourceId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/full_texts/${mediaResourceId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntriesList
   * @summary Query media-entries.
   * @request GET:/api/media-entries
   */
  mediaEntriesList = (query: MediaEntriesListParams, params: RequestParams = {}) =>
    this.request<MediaEntriesListData, any>({
      path: `/api/media-entries`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntriesRelatedDataList
   * @summary Query media-entries with all related data.
   * @request GET:/api/media-entries-related-data
   */
  mediaEntriesRelatedDataList = (query: MediaEntriesRelatedDataListParams, params: RequestParams = {}) =>
    this.request<MediaEntriesRelatedDataListData, any>({
      path: `/api/media-entries-related-data`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryCreate
   * @summary TODO: Create media-entry. Only for testing. Use webapp until media-encoder is ready
   * @request POST:/api/media-entry
   */
  mediaEntryCreate = (query: MediaEntryCreateParams, data: MediaEntryCreatePayload, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/media-entry`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryDetail
   * @summary Get media-entry for id.
   * @request GET:/api/media-entry/{media_entry_id}
   */
  mediaEntryDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryDelete
   * @summary Delete media-entry for id.
   * @request DELETE:/api/media-entry/{media_entry_id}
   */
  mediaEntryDelete = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPublishUpdate
   * @summary Try publish media-entry for id.
   * @request PUT:/api/media-entry/{media_entry_id}/publish
   */
  mediaEntryPublishUpdate = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<
      MediaEntryPublishUpdateData,
      {
        message: {
          is_publishable: boolean;
          /** @format uuid */
          media_entry_id: string;
          has_meta_data: Record<string, boolean>[];
        };
      }
    >({
      path: `/api/media-entry/${mediaEntryId}/publish`,
      method: "PUT",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPreviewDetail
   * @summary Get preview for media-entry id.
   * @request GET:/api/media-entry/{media_entry_id}/preview
   */
  mediaEntryPreviewDetail = ({ mediaEntryId, ...query }: MediaEntryPreviewDetailParams, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}/preview`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPreviewDataStreamDetail
   * @summary Get preview for media-entry id.
   * @request GET:/api/media-entry/{media_entry_id}/preview/data-stream
   */
  mediaEntryPreviewDataStreamDetail = (
    { mediaEntryId, ...query }: MediaEntryPreviewDataStreamDetailParams,
    params: RequestParams = {},
  ) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}/preview/data-stream`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDataDetail
   * @summary Get meta-data for media-entry.
   * @request GET:/api/media-entry/{media_entry_id}/meta-data
   */
  mediaEntryMetaDataDetail = ({ mediaEntryId, ...query }: MediaEntryMetaDataDetailParams, params: RequestParams = {}) =>
    this.request<MediaEntryMetaDataDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-data`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumDetail
   * @summary Get meta-data for media-entry and meta-key.
   * @request GET:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}
   */
  mediaEntryMetaDatumDetail = (mediaEntryId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<MediaEntryMetaDatumDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumDelete
   * @summary Delete meta-data for media-entry and meta-key
   * @request DELETE:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}
   */
  mediaEntryMetaDatumDelete = (mediaEntryId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<MediaEntryMetaDatumDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumTextCreate
   * @summary Create meta-data text for media-entry
   * @request POST:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/text
   */
  mediaEntryMetaDatumTextCreate = (
    mediaEntryId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumTextCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/text`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumTextUpdate
   * @summary Update meta-data text for media-entry
   * @request PUT:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/text
   */
  mediaEntryMetaDatumTextUpdate = (
    mediaEntryId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumTextUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/text`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumTextDateCreate
   * @summary Create meta-data text-date for media-entry
   * @request POST:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/text-date
   */
  mediaEntryMetaDatumTextDateCreate = (
    mediaEntryId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumTextDateCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/text-date`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumTextDateUpdate
   * @summary Update meta-data text-date for media-entry
   * @request PUT:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/text-date
   */
  mediaEntryMetaDatumTextDateUpdate = (
    mediaEntryId: string,
    metaKeyId: string,
    body: {
      string: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumTextDateUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/text-date`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumJsonCreate
   * @summary Create meta-data json for media-entry
   * @request POST:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/json
   */
  mediaEntryMetaDatumJsonCreate = (
    mediaEntryId: string,
    metaKeyId: string,
    body: {
      json: any;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumJsonCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/json`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumJsonUpdate
   * @summary Update meta-data json for media-entry
   * @request PUT:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/json
   */
  mediaEntryMetaDatumJsonUpdate = (
    mediaEntryId: string,
    metaKeyId: string,
    body: {
      json: any;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumJsonUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/json`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumKeywordDetail
   * @summary Get meta-data keywords for media-entries meta-key
   * @request GET:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/keyword
   */
  mediaEntryMetaDatumKeywordDetail = (mediaEntryId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<MediaEntryMetaDatumKeywordDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/keyword`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumKeywordCreate
   * @summary Create meta-data keyword for media-entry.
   * @request POST:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/keyword/{keyword_id}
   */
  mediaEntryMetaDatumKeywordCreate = (
    mediaEntryId: string,
    metaKeyId: string,
    keywordId: string,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumKeywordCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/keyword/${keywordId}`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumKeywordDelete
   * @summary Delete meta-data keyword for media-entry.
   * @request DELETE:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/keyword/{keyword_id}
   */
  mediaEntryMetaDatumKeywordDelete = (
    mediaEntryId: string,
    metaKeyId: string,
    keywordId: string,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumKeywordDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/keyword/${keywordId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumPeopleDetail
   * @summary Get meta-data people for media-entries meta-key.
   * @request GET:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/people
   */
  mediaEntryMetaDatumPeopleDetail = (mediaEntryId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<MediaEntryMetaDatumPeopleDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/people`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumPeopleCreate
   * @summary Create meta-data people for a media-entries meta-key.
   * @request POST:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/people/{person_id}
   */
  mediaEntryMetaDatumPeopleCreate = (
    mediaEntryId: string,
    metaKeyId: string,
    personId: string,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumPeopleCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/people/${personId}`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumPeopleDelete
   * @summary Delete meta-data people for media-entry
   * @request DELETE:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/people/{person_id}
   */
  mediaEntryMetaDatumPeopleDelete = (
    mediaEntryId: string,
    metaKeyId: string,
    personId: string,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumPeopleDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/people/${personId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumRoleDetail
   * @summary Get meta-data role for media-entry.
   * @request GET:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/role
   */
  mediaEntryMetaDatumRoleDetail = (mediaEntryId: string, metaKeyId: string, params: RequestParams = {}) =>
    this.request<MediaEntryMetaDatumRoleDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/role`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumRoleDelete
   * @summary Delete meta-data role for media-entry.
   * @request DELETE:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/role/{role_id}/{person_id}
   */
  mediaEntryMetaDatumRoleDelete = (
    mediaEntryId: string,
    metaKeyId: string,
    roleId: string,
    personId: string,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumRoleDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/role/${roleId}/${personId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMetaDatumRoleCreate
   * @summary Create meta-data role for media-entry.
   * @request POST:/api/media-entry/{media_entry_id}/meta-datum/{meta_key_id}/role/{role_id}/{person_id}/{position}
   */
  mediaEntryMetaDatumRoleCreate = (
    mediaEntryId: string,
    metaKeyId: string,
    roleId: string,
    personId: string,
    position: number,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryMetaDatumRoleCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/meta-datum/${metaKeyId}/role/${roleId}/${personId}/${position}`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryCustomUrlDetail
   * @summary Get custom_url for media entry.
   * @request GET:/api/media-entry/{media_entry_id}/custom_url
   */
  mediaEntryCustomUrlDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryCustomUrlDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/custom_url`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryCustomUrlCreate
   * @summary USER Context: Create custom_url for media entry.
   * @request POST:/api/media-entry/{media_entry_id}/custom_url
   */
  mediaEntryCustomUrlCreate = (
    mediaEntryId: string,
    body: {
      id: string;
      is_primary: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryCustomUrlCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/custom_url`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryCustomUrlUpdate
   * @summary USER Context: Update custom_url for media entry.
   * @request PUT:/api/media-entry/{media_entry_id}/custom_url
   */
  mediaEntryCustomUrlUpdate = (
    mediaEntryId: string,
    body: {
      id?: string;
      is_primary?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryCustomUrlUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/custom_url`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryCustomUrlDelete
   * @summary TODO: Delete custom_url for media entry.
   * @request DELETE:/api/media-entry/{media_entry_id}/custom_url
   */
  mediaEntryCustomUrlDelete = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryCustomUrlDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/custom_url`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryEditSessionsDetail
   * @summary PUBLIC/USER Context: Get edit_session list for media entry.
   * @request GET:/api/media-entry/{media_entry_id}/edit_sessions
   */
  mediaEntryEditSessionsDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryEditSessionsDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/edit_sessions`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryEditSessionsCreate
   * @summary USER Context: Create edit session for media entry and authed user.
   * @request POST:/api/media-entry/{media_entry_id}/edit_sessions
   */
  mediaEntryEditSessionsCreate = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryEditSessionsCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/edit_sessions`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryFavoriteDetail
   * @summary USER Context: Get favorite_media_entry for authed user and media-entry.
   * @request GET:/api/media-entry/{media_entry_id}/favorite
   */
  mediaEntryFavoriteDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryFavoriteDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/favorite`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryFavoriteCreate
   * @summary USER Context: Create favorite_media_entry for authed user and media-entry.
   * @request POST:/api/media-entry/{media_entry_id}/favorite
   */
  mediaEntryFavoriteCreate = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryFavoriteCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/favorite`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryFavoriteDelete
   * @summary USER Context: Delete favorite_media_entry for authed user and media-entry.
   * @request DELETE:/api/media-entry/{media_entry_id}/favorite
   */
  mediaEntryFavoriteDelete = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryFavoriteDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/favorite`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMediaFileDetail
   * @summary PUBLIC/USER Context: Get media-file for media-entry id.
   * @request GET:/api/media-entry/{media_entry_id}/media-file
   */
  mediaEntryMediaFileDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryMediaFileDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/media-file`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryMediaFileDataStreamDetail
   * @summary PUBLIC/USER Context: Get media-file data-stream for media-entry id.
   * @request GET:/api/media-entry/{media_entry_id}/media-file/data-stream
   */
  mediaEntryMediaFileDataStreamDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}/media-file/data-stream`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsDetail
   * @summary PUBLIC/USER Context: List media-entry permissions.
   * @request GET:/api/media-entry/{media_entry_id}/perms/
   */
  mediaEntryPermsDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsResourcesDetail
   * @summary Query media-entry permissions.
   * @request GET:/api/media-entry/{media_entry_id}/perms/resources
   */
  mediaEntryPermsResourcesDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsResourcesDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/resources`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Valid perm_name values are["get_metadata_and_previews" "get_full_size" "edit_metadata" "edit_permissions"]
   *
   * @name MediaEntryPermsResourcesUpdate
   * @summary Update media-entry entity permissions
   * @request PUT:/api/media-entry/{media_entry_id}/perms/resources
   */
  mediaEntryPermsResourcesUpdate = (
    mediaEntryId: string,
    body: MediaEntryPermsResourcesUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryPermsResourcesUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/resources`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Valid perm_name values are["get_metadata_and_previews" "get_full_size" "edit_metadata" "edit_permissions"]
   *
   * @name MediaEntryPermsResourceUpdate
   * @summary Update media-entry entity permissions
   * @request PUT:/api/media-entry/{media_entry_id}/perms/resource/{perm_name}/{perm_val}
   */
  mediaEntryPermsResourceUpdate = (
    mediaEntryId: string,
    permName: MediaEntryPermsResourceUpdateParamsEnum,
    permVal: boolean,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryPermsResourceUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/resource/${permName}/${permVal}`,
      method: "PUT",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsUsersDetail
   * @summary Query media-entry user permissions.
   * @request GET:/api/media-entry/{media_entry_id}/perms/users
   */
  mediaEntryPermsUsersDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsUsersDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/users`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsUserDetail
   * @summary Get media-entry user permissions.
   * @request GET:/api/media-entry/{media_entry_id}/perms/user/{user_id}
   */
  mediaEntryPermsUserDetail = (mediaEntryId: string, userId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsUserDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/user/${userId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsUserCreate
   * @summary Create media-entry user permissions.
   * @request POST:/api/media-entry/{media_entry_id}/perms/user/{user_id}
   */
  mediaEntryPermsUserCreate = (
    mediaEntryId: string,
    userId: string,
    body: MediaEntryPermsUserCreatePayload,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryPermsUserCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/user/${userId}`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsUserDelete
   * @summary Delete media-entry user permissions.
   * @request DELETE:/api/media-entry/{media_entry_id}/perms/user/{user_id}
   */
  mediaEntryPermsUserDelete = (mediaEntryId: string, userId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsUserDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/user/${userId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Valid perm_name values are["get_metadata_and_previews" "get_full_size" "edit_metadata" "edit_permissions"]
   *
   * @name MediaEntryPermsUserUpdate
   * @summary Update media-entry user permissions
   * @request PUT:/api/media-entry/{media_entry_id}/perms/user/{user_id}/{perm_name}/{perm_val}
   */
  mediaEntryPermsUserUpdate = (
    mediaEntryId: string,
    userId: string,
    permName: MediaEntryPermsUserUpdateParamsEnum,
    permVal: boolean,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryPermsUserUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/user/${userId}/${permName}/${permVal}`,
      method: "PUT",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsGroupsDetail
   * @summary Query media-entry group permissions.
   * @request GET:/api/media-entry/{media_entry_id}/perms/groups
   */
  mediaEntryPermsGroupsDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsGroupsDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/groups`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsGroupDetail
   * @summary Get media-entry group permissions.
   * @request GET:/api/media-entry/{media_entry_id}/perms/group/{group_id}
   */
  mediaEntryPermsGroupDetail = (mediaEntryId: string, groupId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsGroupDetailData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/group/${groupId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsGroupCreate
   * @summary Create media-entry group permissions.
   * @request POST:/api/media-entry/{media_entry_id}/perms/group/{group_id}
   */
  mediaEntryPermsGroupCreate = (
    mediaEntryId: string,
    groupId: string,
    body: MediaEntryPermsGroupCreatePayload,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryPermsGroupCreateData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/group/${groupId}`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryPermsGroupDelete
   * @summary Delete media-entry group permissions.
   * @request DELETE:/api/media-entry/{media_entry_id}/perms/group/{group_id}
   */
  mediaEntryPermsGroupDelete = (mediaEntryId: string, groupId: string, params: RequestParams = {}) =>
    this.request<MediaEntryPermsGroupDeleteData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/group/${groupId}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Valid perm_name values are["get_metadata_and_previews" "get_full_size" "edit_metadata" "edit_permissions"]
   *
   * @name MediaEntryPermsGroupUpdate
   * @summary Update media-entry group permissions
   * @request PUT:/api/media-entry/{media_entry_id}/perms/group/{group_id}/{perm_name}/{perm_val}
   */
  mediaEntryPermsGroupUpdate = (
    mediaEntryId: string,
    groupId: string,
    permName: MediaEntryPermsGroupUpdateParamsEnum,
    permVal: boolean,
    params: RequestParams = {},
  ) =>
    this.request<MediaEntryPermsGroupUpdateData, any>({
      path: `/api/media-entry/${mediaEntryId}/perms/group/${groupId}/${permName}/${permVal}`,
      method: "PUT",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryFullTextDetail
   * @summary PUBLIC/USER Context: Get full_text.
   * @request GET:/api/media-entry/{media_entry_id}/full_text
   */
  mediaEntryFullTextDetail = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}/full_text`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryFullTextCreate
   * @summary USER Context: Create full_text for collection
   * @request POST:/api/media-entry/{media_entry_id}/full_text
   */
  mediaEntryFullTextCreate = (
    mediaEntryId: string,
    body: {
      text: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}/full_text`,
      method: "POST",
      body: body,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryFullTextUpdate
   * @summary USER Context: Update full_text for collection.
   * @request PUT:/api/media-entry/{media_entry_id}/full_text
   */
  mediaEntryFullTextUpdate = (
    mediaEntryId: string,
    body: {
      text: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}/full_text`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaEntryFullTextDelete
   * @summary USER Context: Delete full_text.
   * @request DELETE:/api/media-entry/{media_entry_id}/full_text
   */
  mediaEntryFullTextDelete = (mediaEntryId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/media-entry/${mediaEntryId}/full_text`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaFileDetail
   * @summary PUBLIC/USER Context: Get media-file for id.
   * @request GET:/api/media-file/{media_file_id}
   */
  mediaFileDetail = (mediaFileId: string, params: RequestParams = {}) =>
    this.request<MediaFileDetailData, any>({
      path: `/api/media-file/${mediaFileId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name MediaFileDataStreamDetail
   * @summary PUBLIC/USER Context: Get media-file data-stream for id.
   * @request GET:/api/media-file/{media_file_id}/data-stream
   */
  mediaFileDataStreamDetail = (mediaFileId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/media-file/${mediaFileId}/data-stream`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get meta-data for id. TODO: should return 404, if no such meta-data role exists.
   *
   * @name MetaDataDetail
   * @summary Get meta-data for id
   * @request GET:/api/meta-data/{meta_datum_id}
   */
  metaDataDetail = (metaDatumId: string, params: RequestParams = {}) =>
    this.request<MetaDataDetailData, any>({
      path: `/api/meta-data/${metaDatumId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get meta-data data-stream.
   *
   * @name MetaDataDataStreamDetail
   * @summary Get meta-data data-stream.
   * @request GET:/api/meta-data/{meta_datum_id}/data-stream
   */
  metaDataDataStreamDetail = (metaDatumId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/meta-data/${metaDatumId}/data-stream`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get meta-data role for id. TODO: should return 404, if no such meta-data role exists.
   *
   * @name MetaDataRoleDetail
   * @summary Get meta-data role for id
   * @request GET:/api/meta-data/{meta_datum_id}/role
   */
  metaDataRoleDetail = (metaDatumId: string, params: RequestParams = {}) =>
    this.request<MetaDataRoleDetailData, any>({
      path: `/api/meta-data/${metaDatumId}/role`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name PreviewsDetail
   * @summary Get preview for id.
   * @request GET:/api/previews/{preview_id}
   */
  previewsDetail = (previewId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/previews/${previewId}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name PreviewsDataStreamDetail
   * @summary Get preview data-stream for id.
   * @request GET:/api/previews/{preview_id}/data-stream
   */
  previewsDataStreamDetail = (previewId: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/previews/${previewId}/data-stream`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get list of roles.
   *
   * @name RolesList
   * @summary Get list of roles.
   * @request GET:/api/roles/
   */
  rolesList = (query: RolesListParams, params: RequestParams = {}) =>
    this.request<RolesListData, any>({
      path: `/api/roles/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get a role by id. Returns 404, if no such role exists.
   *
   * @name RolesDetail
   * @summary Get role by id
   * @request GET:/api/roles/{id}
   */
  rolesDetail = (id: string, params: RequestParams = {}) =>
    this.request<RolesDetailData, any>({
      path: `/api/roles/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get list of users ids.
   *
   * @name UsersList
   * @summary USER Context: Get list of users ids.
   * @request GET:/api/users/
   */
  usersList = (query: UsersListParams, params: RequestParams = {}) =>
    this.request<UsersListData, any>({
      path: `/api/users/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get a user by id. Returns 404, if no such users exists.
   *
   * @name UsersDetail
   * @summary USER Context: Get user by id
   * @request GET:/api/users/{id}
   */
  usersDetail = (id: string, params: RequestParams = {}) =>
    this.request<UsersDetailData, any>({
      path: `/api/users/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get list of group ids. Paging is used as you get a limit of 100 entries.
   *
   * @name GroupsList
   * @summary Get all group ids
   * @request GET:/api/groups/
   */
  groupsList = (query: GroupsListParams, params: RequestParams = {}) =>
    this.request<GroupsListData, any>({
      path: `/api/groups/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get group by id. Returns 404, if no such group exists.
   *
   * @name GroupsDetail
   * @summary Get group by id
   * @request GET:/api/groups/{id}
   */
  groupsDetail = (id: string, params: RequestParams = {}) =>
    this.request<GroupsDetailData, string>({
      path: `/api/groups/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name UsageTermsList
   * @summary PUBLIC Context: List usage_terms.
   * @request GET:/api/usage-terms/
   */
  usageTermsList = (query: UsageTermsListParams, params: RequestParams = {}) =>
    this.request<UsageTermsListData, any>({
      path: `/api/usage-terms/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name UsageTermsDetail
   * @summary PUBLIC Context: Get usage_terms by id.
   * @request GET:/api/usage-terms/{id}
   */
  usageTermsDetail = (id: string, params: RequestParams = {}) =>
    this.request<UsageTermsDetailData, any>({
      path: `/api/usage-terms/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get list of vocabularies ids.
   *
   * @name VocabulariesList
   * @summary Get list of vocabularies ids.
   * @request GET:/api/vocabularies/
   */
  vocabulariesList = (query: VocabulariesListParams, params: RequestParams = {}) =>
    this.request<VocabulariesListData, any>({
      path: `/api/vocabularies/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Get a vocabulary by id. Returns 404, if no such vocabulary exists.
   *
   * @name VocabulariesDetail
   * @summary Get vocabulary by id.
   * @request GET:/api/vocabularies/{id}
   */
  vocabulariesDetail = (id: string, params: RequestParams = {}) =>
    this.request<VocabulariesDetailData, any>({
      path: `/api/vocabularies/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name WorkflowsList
   * @summary ADMIN Context: List workflows.
   * @request GET:/api/workflows/
   */
  workflowsList = (query: WorkflowsListParams, params: RequestParams = {}) =>
    this.request<WorkflowsListData, any>({
      path: `/api/workflows/`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name WorkflowsCreate
   * @summary ADMIN Context: Create workflow.
   * @request POST:/api/workflows/
   */
  workflowsCreate = (body: WorkflowsCreatePayload, params: RequestParams = {}) =>
    this.request<WorkflowsCreateData, any>({
      path: `/api/workflows/`,
      method: "POST",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name WorkflowsDetail
   * @summary ADMIN Context: Get workflow by id.
   * @request GET:/api/workflows/{id}
   */
  workflowsDetail = (id: string, params: RequestParams = {}) =>
    this.request<WorkflowsDetailData, any>({
      path: `/api/workflows/${id}`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name WorkflowsUpdate
   * @summary ADMIN Context: Update workflow with id.
   * @request PUT:/api/workflows/{id}
   */
  workflowsUpdate = (id: string, body: WorkflowsUpdatePayload, params: RequestParams = {}) =>
    this.request<WorkflowsUpdateData, any>({
      path: `/api/workflows/${id}`,
      method: "PUT",
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name WorkflowsDelete
   * @summary ADMIN Context: Delete workflow by id.
   * @request DELETE:/api/workflows/{id}
   */
  workflowsDelete = (id: string, params: RequestParams = {}) =>
    this.request<WorkflowsDeleteData, any>({
      path: `/api/workflows/${id}`,
      method: "DELETE",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name ManagementStatusList
   * @request GET:/api/management/status
   */
  managementStatusList = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/management/status`,
      method: "GET",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name ManagementShutdownCreate
   * @request POST:/api/management/shutdown
   */
  managementShutdownCreate = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/management/shutdown`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
}
