<template>
	<div id="uploadview">
		<label for="project-name">
			
		</label>
		<Button @click.prevent="uploadFilesWebApp(files, props.collection_id, uploadedCB)"
			label="Upload"
			class="upload-btn"/>
		<DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
			<label for="file-input">
				<span v-if="dropZoneActive">
					<span>Lege sie hier ab</span>
					<span class="smaller">um sie hinzuzufügen</span>
				</span>
				<span v-else>
					<span>Ziehe Deine Dateien hierher</span>
					<span class="smaller">
						oder <strong><em>klicke hier</em></strong> für die Dateiauswahl
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

const { files, addFiles, removeFile } = useFileList()

const props = defineProps(['collection_id'])

const emit = defineEmits(['change', 'selected'])

const uploadedCB = (data: any, files: any) => {
	console.log("uploadedCB: " + JSON.stringify(data) + "\n files: " + files)
	emit('change', data, files)
}

function onInputChange(e: any) {
	
	addFiles(e.target.files)
	emit('selected', files.value)
	e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}


// Uploader

//const { uploadFilesWebApp } = createUploader('https://dev.madek.hfg-karlsruhe.de/entries/')
const { uploadFilesWebApp } = createUploader('https://staging.madek.hfg-karlsruhe.de/entries/')
//const { uploadFilesWebApp } = createUploader('http://localhost:3100/entries/')

</script>

<style lang="stylus">
/*
html {
	height: 100%;
	width: 100%;
	background-color: #b6d6f5;
}

body {
	height: 100%;
	margin: 0;
	padding: 0;
}
*/
</style>

<style scoped lang="stylus">
#app {
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin: 0 auto;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.drop-area {
	float:left;
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

.upload-button {
	display: block;
	appearance: none;
	border: 0;
	border-radius: 50px;
	padding: 0.75rem 3rem;
	margin: 1rem auto;
	font-size: 1.25rem;
	font-weight: bold;
	background: #369;
	color: #fff;
	text-transform: uppercase;
}

button {
	cursor: pointer;
}
.upload-btn {
	float: right
}

</style>
