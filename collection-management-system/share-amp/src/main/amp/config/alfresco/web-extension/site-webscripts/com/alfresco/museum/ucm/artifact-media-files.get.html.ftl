<@standalone>
   <@markup id="css" >
      <#-- CSS Dependencies -->
      <@link rel="stylesheet" type="text/css" href="${url.context}/res/css/formstone/upload.css" group="artifact" />
      <@link rel="stylesheet" type="text/css" href="${url.context}/res/css/artifact-media-files.css" group="artifact" />
   </@>

   <@markup id="js" >
      <#-- JS Dependencies -->
      <@script type="text/javascript" src="${url.context}/res/js/artifact-media-files.js" group="artifact" />
   </@>

   <#assign el=args.htmlid?html>
   <div id="${el}-heading" class="thin dark">${msg("header.media")}</div>
   
   <@markup id="${el}-upload">
      <div id="${el}-upload-target"></div>

      <script type="text/javascript">
         ucmCreateMediaFileUploader("${url.context}", "${el}", "${nodeRef}");
      </script>
   </@>
   
   <@markup id="${el}-list">
      <div id="${el}-body" class="document-ucm-media-files"></div>
      <script type="text/javascript">
         require(["jquery"], function() {
            var container = $("#${el}-body.document-ucm-media-files");
            var mediaFiles = JSON.parse("${response?js_string}").mediaFiles;
            ucmRefreshMediaFileList("${url.context}", container, mediaFiles);
         });
      </script>
   </@>
</@>