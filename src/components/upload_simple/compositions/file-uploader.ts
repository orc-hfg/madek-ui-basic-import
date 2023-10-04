// TODO write as ts

import { apiHelper  } from '../../../modules/api'
import { authHelper } from '../../../modules/auth'

const { api, apiConfig } = apiHelper()
const { authParams } = authHelper()


function uploadApi(file:any, url:string, collectionId:string, formData: any, cb:any) {
	//const query = {'collection_id': collectionId}
	const mheaders = {
		//'Content-Type': 'multipart/form-data',
		//'Content-Type':'application/json',

		'Authorization': authParams?.value?.headers['Authorization'],
	}

	fetch(url //+queryS
		, {
		method: 'POST',
		headers: mheaders,
		body: formData,
		mode: "cors",

	 })
	.then(response => {

			file.status = response.ok
			file.mediaEntry = null
			file.mediaEntryId = null
			file.mediaFileId = null
		
			response.json().then(json => {

				const jsonRes = JSON.stringify(json)
				console.log('got json result: ' + jsonRes)
				file.mediaEntry = json.media_entry
				file.mediaEntryId = json.media_entry.id
				file.mediaFileId = json.media_entry.media_file.id
				file.serverurl = apiConfig.baseUrl + '/api/media-entry/' + file.mediaEntryId + '/media-file/data-stream'

				cb(json.media_entry)
		
			  })
		})

}

//import Cookies from 'universal-cookie';
//const cookies = new Cookies();

function uploadWebApp(file:any, url:string, collectionId:string, formData: FormData, cb: any, files: any) {
	
	function getheaders(set_cookie=false) {
		let headers = {
		  	'Accept':       'application/json',
		  	//'Content-Type': 'application/json',
		  	//'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
	  	};
	  	if (set_cookie) {
			
	  	}
	  	return headers;
	}


	fetch(url //+queryS
		, {
		method: 'POST',
		headers: getheaders(true),
		credentials: 'include',
		body: formData,
	 })
	.then(response => {
			//debugger
			file.status = response.ok
			file.mediaEntry = null
			file.mediaEntryId = null
			file.mediaFileId = null
		
			response.json().then(json => {

				const jsonRes = JSON.stringify(json)
				console.log('got json result: ' + jsonRes)
				file.mediaEntryId = json.uuid
				file.mediaEntry = {id: file.mediaEntryId }
				
				file.mediaFileId = json.media_file.uuid
				file.serverurl = apiConfig.baseUrl + '/api/media-entry/' + file.mediaEntryId + '/media-file/data-stream'

				cb(file.mediaEntryId, files)
			})
			
	})
	.catch(error =>  {
		file.status = "Error"
		//TODO handle error
		console.error("got error uploading: " + JSON.stringify((error)))
	})

}
export async function uploadFile (file:any, url:string, collectionId:string, cb:any) {
	// set up the request data
	let formData = new FormData()
	formData.append('file', file.file)
	
	console.log("uploadFile " + file + " url ")
	// track status and upload file
	file.status = 'loading'


	uploadApi(file, url, collectionId, formData, cb)
	
	//return response
}

export async function uploadFileWebApp (file:any, url:string, collectionId:string, cb: any, files: any) {
	// set up the request data
	let formData = new FormData()
	formData.append('media_entry[media_file]', file.file)

	console.log("uploadFile " + file + " url ")
	// track status and upload file
	file.status = 'loading'

	uploadWebApp(file, url, collectionId, formData, cb, files)
	
	//return response
}

export function uploadFiles(files:[], url:string, collectionId:string, cb:any) {
	return Promise.all(files.map((file) => uploadFile(file, url, collectionId, cb)))
}

export function uploadFilesWebApp(files:[], url:string, collectionId:string, cb: any) {
	return Promise.all(files.map((file) => uploadFileWebApp(file, url, collectionId, cb, files)))
}

export default function createUploader(url:string) {
	return {
		uploadFile: function (file:any, collectionId:string, cb: any) {
			return uploadFile(file, url, collectionId, cb)
		},
		uploadFiles: function (files:[], collectionId:string, cb:any) {
			return uploadFiles(files, url, collectionId, cb)
		},
		uploadFileWebApp: function (file:any, collectionId:string, cb: any) {
			return uploadFileWebApp(file, url, collectionId, cb)
		},
		uploadFilesWebApp: function (files:[], collectionId:string, cb: any) {
			return uploadFilesWebApp(files, url, collectionId, cb)
		},
	}
}
