<template>
	<div id="uploadview">
		<Button @click.prevent="uploadFiles(files, collection_id, uploadedCB)"
			v-if="files.length && !files[0].mediaEntryId"
			class="upload_btn"
			label="Upload"/>
		<br/>
		<br/>
		<br/>
	
		<DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
			<label for="file-input">
				<span v-if="dropZoneActive">
					<span>Drop Them Here</span>
					<span class="smaller">to add them</span>
				</span>
				<span v-else>
					<span>Drag Your Files Here</span>
					<span class="smaller">
						or <strong><em>click here</em></strong> to select files
					</span>
				</span>

				<input type="file" id="file-input" multiple @change="onInputChange" />
			</label>
			<ul class="image-list" v-show="files.length">
				<FilePreview v-for="file of files" :key="file.id" :file="file" tag="li" @remove="removeFile" />
			</ul>
		</DropZone>
		
		<br>
		
	</div>
</template>

<script setup lang="ts">

// Components
import DropZone from './DropZone.vue'
import FilePreview from './FilePreview.vue'

// File Management
import useFileList from './compositions/file-list'
import createUploader from './compositions/file-uploader'

import { apiHelper } from '../../modules/api'
import { authHelper } from '../../modules/auth'
const { api, apiConfig } = apiHelper()
const { authParams } = authHelper()

const { files, addFiles, removeFile } = useFileList()

const props = defineProps(['collection_id'])
	
const emit = defineEmits(['change'])

const uploadedCB = (data: any) => {
	console.log("uploadedCB: " + JSON.stringify(data))
	emit('change', data)
}

const onInputChange = (e: any) => {
	addFiles(e.target.files)
	e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

// Uploader
const { uploadFiles } = createUploader(apiConfig.baseUrl+'/api/media-entry')

</script>


<style scoped lang="stylus">

.drop-area {
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	padding: 50px;
	background: #ffffff55;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	transition: .2s ease;

	&[data-active=true] {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		background: #ffffffcc;
	}
}

label {
	font-size: 36px;
	cursor: pointer;
	display: block;

	span {
		display: block;
	}

	input[type=file]:not(:focus-visible) {
		// Visually Hidden Styles taken from Bootstrap 5
		position: absolute !important;
		width: 1px !important;
		height: 1px !important;
		padding: 0 !important;
		margin: -1px !important;
		overflow: hidden !important;
		clip: rect(0, 0, 0, 0) !important;
		white-space: nowrap !important;
		border: 0 !important;
	}

	.smaller {
		font-size: 16px;
	}
}

.image-list {
	display: flex;
	list-style: none;
	flex-wrap: wrap;
	padding: 0;
}

.upload_btn {
	float: right;
}

button {
	cursor: pointer;
}
</style>
