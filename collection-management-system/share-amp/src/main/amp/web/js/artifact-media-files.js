function ucmCreateMediaFile(urlContext, mediaFile) {
   var url = urlContext + "/proxy/alfresco/ucm/media";
   if (Alfresco.util.CSRFPolicy && Alfresco.util.CSRFPolicy.isFilterEnabled())
   {
      url += "?" + Alfresco.util.CSRFPolicy.getParameter() + "=" + encodeURIComponent(Alfresco.util.CSRFPolicy.getToken());
   }
   var wrapper = $('<div class="ucm-media-wrapper" />');

   wrapper.append(mediaFile.title || mediaFile.name);
   //TODO: Other media types. CSRF?
   wrapper.append('<audio src="' + urlContext + '/proxy/alfresco/api/node' + mediaFile.link + '/content" class="ucm-media-audio" preload="none" controls />');

   wrapper.append($('<button />', {text: '[x]', class: 'ucm-media-file-delete-button'}).click(function() {
      deleteFile(urlContext, mediaFile.nodeRef, wrapper);
   }));

   return wrapper;
}

function deleteFile(urlContext, nodeRef, element) {
   var deleteUrl = urlContext + "/proxy/alfresco/slingshot/doclib/action/files?alf_method=delete";
   var headers = {};
   headers[Alfresco.util.CSRFPolicy.getParameter()] = Alfresco.util.CSRFPolicy.getToken();
   
   var request = $.ajax({
      url: deleteUrl,
      method: 'POST',
      contentType: 'application/json',
      headers: headers,
      data: JSON.stringify({ nodeRefs: [nodeRef] }),
      dataType: 'json'
   });

   request.done(function( msg ) {
      element.remove();
   });
}

function ucmRefreshMediaFileList(urlContext, container, mediaFiles) {
   container.empty();
   if (mediaFiles && mediaFiles.length) {
      for (var i = 0; i < mediaFiles.length; ++i) {
         ucmCreateMediaFile(urlContext, mediaFiles[i]).appendTo(container);
      }
   }
}

function ucmCreateMediaFileUploader(urlContext, elementIdPrefix, nodeRef) {
   var url = urlContext + "/proxy/alfresco/ucm/media";
   if (Alfresco.util.CSRFPolicy && Alfresco.util.CSRFPolicy.isFilterEnabled())
   {
      url += "?" + Alfresco.util.CSRFPolicy.getParameter() + "=" + encodeURIComponent(Alfresco.util.CSRFPolicy.getToken());
   } 
   require(["jquery"], function() {
      jQuery = $;
      require([urlContext + "/res/js/formstone/core.js"], function() {
         require([urlContext + "/res/js/formstone/upload.js"], function() {
            $("#" + elementIdPrefix + "-upload-target").upload( {
               action: url,
               postKey: "prop_cm_content",
               maxQueue: 1,
               maxSize: 200*1024*1024,
               postData: { nodeRef: nodeRef }
            }).on("start.upload", onStart)
            .on("complete.upload", onComplete)
            .on("filestart.upload", onFileStart)
            .on("fileprogress.upload", onFileProgress)
            .on("filecomplete.upload", onFileComplete)
            .on("fileerror.upload", onFileError);

            function onStart(e, files) { console.log("Start"); }
            function onComplete(e) { console.log("Complete"); }
            function onFileStart(e, file) { console.log("File Start"); }
            function onFileProgress(e, file, percent) { console.log("File Progress"); }
            function onFileComplete(e, file, response) {
               console.log("File Complete");
               var container = $("#" + elementIdPrefix + "-body.document-ucm-media-files");
               ucmRefreshMediaFileList(urlContext, container, response.mediaFiles);
            }
            function onFileError(e, file, error) { console.error("File Error: " + error); }
         });
      });
   });
}