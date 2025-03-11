// TODO write as ts

import { ref } from 'vue'

export default function () {
	const files = ref([])
	const seqfiles = ref([])

	function addFiles(newFiles) {
		let newUploadableFiles = [...newFiles].map((file) => new UploadableFile(file)).filter((file) => !fileExists(file.id))
		files.value = files.value.concat(newUploadableFiles)
	}

	function fileExists(otherId) {
		return files.value.some(({ id }) => id === otherId)
	}

	function removeFile(file) {
		const index = files.value.indexOf(file)

		if (index > -1) files.value.splice(index, 1)
	}

	function addSeqFiles(newFiles) {
		let newUploadableFiles = [...newFiles].map((file) => new UploadableFile(file)).filter((file) => !seqfileExists(file.id))
		seqfiles.value = seqfiles.value.concat(newUploadableFiles)
	}
	function seqfileExists(otherId) {
		return seqfiles.value.some(({ id }) => id === otherId)
	}
	function removeSeqFile(file) {
		const index = seqfiles.value.indexOf(file)

		if (index > -1) seqfiles.value.splice(index, 1)
	}

	return { files, addFiles, removeFile, seqfiles, addSeqFiles, removeSeqFile }
}

class UploadableFile {
	constructor(file) {
		this.file = file
		this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
		this.url = URL.createObjectURL(file)
		this.status = null
	}
}
