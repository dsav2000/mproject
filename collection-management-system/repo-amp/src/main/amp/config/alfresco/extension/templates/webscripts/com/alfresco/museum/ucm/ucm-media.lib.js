function getArtifactFolder(artifactRef) {
	var result = null;
	if (artifactRef != null) {
		var node = search.findNode(artifactRef);
		if (node != null) {
				if (mediaFolder != null && mediaFolder.isContainer) {
					result = mediaFolder;
				}
			}
		}
	}
	return result;
}

function getMediaFiles(artifactRef) 
{
	var mediaFiles = [];
	var mediaFolder = getArtifactFolder(artifactRef);
	if (mediaFolder != null) {
		var files = mediaFolder.children;
		if (files != null) {
			for (var i = 0; i < files.length; ++i) {
				var file = files[i];
				mediaFiles.push({
					type : file.mimetype,
					size : file.size,
					permission : "",
					language : (file.properties["ucm:attached_file_language"]) ? file.properties["ucm:attached_file_language"] : "",
					description : (file.properties["cm:description"]) ? file.properties["cm:description"] : ""
				});
			}
		}
	}
	return mediaFiles;
}
