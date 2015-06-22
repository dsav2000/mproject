function ucmShowDialog(url, wdth, hght, tltl) {
	var $dialog = $('<div/>', {
		class : 'ucm-media-dialog'
	}).html('<iframe class="ucm-media-frame" src="' + url + '"/>').dialog({
		autoOpen : false,
		modal : false,
		height : wdth,
		width : hght,
		title : tltl
	});
	$dialog.dialog('open');
}

function ucmShowVideo(url, wdth, hght, tltl) {
	// TODO: may width be in percents? autoplay?
	var video = $(
			'<video controls width="' + (wdth - 35)
					+ '">Your browser does not support HTML5 video.</video>')
			.append($('<source/>', {
				src : url,
				type : 'video/mp4'
			}));
	var $dialog = $('<div class="ucm-media-dialog"/>')
	// .html('<iframe class="ucm-media-frame" src="' + url + '"/>')
	.html(video).dialog({
		autoOpen : false,
		modal : false,
		height : wdth,
		width : hght,
		title : tltl,
		beforeClose : function(event, ui) {
			// stops video
			$dialog.dialog('destroy').remove();
		}
	});
	$dialog.dialog('open');
}

function ucmCreateMediaFile(mediaFile) {
	var url = appContext + "/proxy/alfresco/ucm/media";
	if (Alfresco.util.CSRFPolicy && Alfresco.util.CSRFPolicy.isFilterEnabled()) {
		url += "?" + Alfresco.util.CSRFPolicy.getParameter() + "="
				+ encodeURIComponent(Alfresco.util.CSRFPolicy.getToken());
	}
	var wrapper = $('<div class="ucm-media-wrapper"/>');

	var name = mediaFile.title || mediaFile.name

	var contentLink = appContext + '/proxy/alfresco/api/node' + mediaFile.link
			+ '/content';
	switch (mediaFile.type) {
	case 'audio/mpeg':
	case 'audio/mp3':
		wrapper.append(name);
		wrapper.append('<audio src="' + contentLink
				+ '" class="ucm-media-audio" preload="none" controls/>');
		break;
	case 'application/pdf':
		var link = $('<a/>', {
			href : contentLink,
			'class' : 'ucm-media-pdf'
		}).html(name).click(function(e) {
			e.preventDefault();
			ucmShowDialog(contentLink, 600, 600, name);
		});
		wrapper.append(link);
		break;
	case 'video/mp4':
		var link = $('<a/>', {
			href: contentLink,
			'class': 'ucm-media-video'
		}).html(name).click(function(e) {
			e.preventDefault();
			ucmShowVideo(contentLink, 600, 600, name);
		});
		wrapper.append(link);
		break;
	default: //TODO: let user save content instead of showing dialog?
		var link = $('<a/>', {
			href : contentLink,
			'class' : 'ucm-media-other'
		}).html(name).click(function(e) {
			e.preventDefault();
			ucmShowDialog(contentLink, 600, 600, name);
		});
		wrapper.append(link);
		break;
	}

	wrapper.append($('<button />', {
		text : '[x]',
		class : 'ucm-media-file-delete-button'
	}).click(function() {
		ucmDeleteFile(mediaFile.nodeRef, wrapper);
	}));

	return wrapper;
}

function ucmDeleteFile(nodeRef, element) {
	require(
			[ "jquery" ],
			function($) {
				jQuery = $;
				var deleteUrl = appContext
						+ "/proxy/alfresco/slingshot/doclib/action/files?alf_method=delete";
				var headers = {};
				headers[Alfresco.util.CSRFPolicy.getParameter()] = Alfresco.util.CSRFPolicy
						.getToken();

				var request = $.ajax({
					url : deleteUrl,
					method : 'POST',
					contentType : 'application/json',
					headers : headers,
					data : JSON.stringify({
						nodeRefs : [ nodeRef ]
					}),
					dataType : 'json'
				});

				request.done(function(msg) {
					element.remove();
				});
			});
}

function ucmRefreshMediaFileList(containerSelector, mediaFiles) {
	require([ "jquery" ], function($) {
		jQuery = $;
		var container = $(containerSelector);
		container.empty()
		if (mediaFiles && mediaFiles.length) {
			for (var i = 0; i < mediaFiles.length; ++i) {
				ucmCreateMediaFile(mediaFiles[i]).appendTo(container);
			}
		}
	});
}

function ucmCreateMediaFileUploader(elementIdPrefix, nodeRef) {
	var url = appContext + "/proxy/alfresco/ucm/media";
	if (Alfresco.util.CSRFPolicy && Alfresco.util.CSRFPolicy.isFilterEnabled()) {
		url += "?" + Alfresco.util.CSRFPolicy.getParameter() + "="
				+ encodeURIComponent(Alfresco.util.CSRFPolicy.getToken());
	}
	require([ "jquery" ], function($) {
		jQuery = $;
		require([ appContext + "/res/js/formstone/core.js" ], function() {
			require([ appContext + "/res/js/formstone/upload.js" ], function() {
				$("#" + elementIdPrefix + "-upload-target").upload({
					action : url,
					postKey : "prop_cm_content",
					maxQueue : 1,
					maxSize : 200 * 1024 * 1024,
					postData : {
						nodeRef : nodeRef
					}
				}).on("start.upload", onStart)
						.on("complete.upload", onComplete).on(
								"filestart.upload", onFileStart).on(
								"fileprogress.upload", onFileProgress).on(
								"filecomplete.upload", onFileComplete).on(
								"fileerror.upload", onFileError);

				function onStart(e, files) {
					console.log("Start");
				}
				function onComplete(e) {
					console.log("Complete");
				}
				function onFileStart(e, file) {
					console.log("File Start");
				}
				function onFileProgress(e, file, percent) {
					console.log("File Progress");
				}
				function onFileComplete(e, file, response) {
					console.log("File Complete");
					var containerSelector = '#' + elementIdPrefix
							+ "-body.document-ucm-media-files";
					ucmRefreshMediaFileList(containerSelector,
							response.mediaFiles);
				}
				function onFileError(e, file, error) {
					console.error("File Error: " + error);
				}
			});
		});
	});
}