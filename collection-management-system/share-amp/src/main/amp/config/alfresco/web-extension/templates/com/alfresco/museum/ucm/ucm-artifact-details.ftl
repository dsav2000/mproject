<#include "../../../../org/alfresco/include/alfresco-template.ftl" />
<@templateHeader>
   <@script type="text/javascript" src="${url.context}/res/modules/documentlibrary/doclib-actions.js" group="document-details"/>
   <@templateHtmlEditorAssets />
</@>

<@templateBody>
   <@markup id="alf-hd">
   <div id="alf-hd">
      <@region id="mobile-app" scope="template"/>
      <@region scope="global" id="share-header" chromeless="true"/>
   </div>
   </@>
   <@markup id="bd">
   <div id="bd">
      <@region id="actions-common" scope="template"/>
      <@region id="actions" scope="template"/>
      <@region id="node-header" scope="template"/>

      <div id="ucm-horizontal-splitter" class="yui-gc" style="width: 1100px;">
     	<div id="ucm-vertical-splitter" class="yui-u first" style="width: 510px;">
            <#if (config.scoped['DocumentDetails']['document-details'].getChildValue('display-web-preview') == "true")>
			   <div id="ucm-artifact-image" style="border:2px solid black; width:500px; height:auto;">
			   	  <@region id="web-preview" scope="template"/>
			   </div>
			   <script type="text/javascript">
			      require(['jquery'], function() {
			         jQuery = $;
			         require(["${url.context}/res/js/jquery.elevatezoom.js"], function() {
			            var image = $('#ucm-artifact-image').find('img');
			            image.attr( {'data-zoom-image': image.attr('src')} );
			            image.elevateZoom( {zoomType: 'inner', cursor: 'crosshair', scrollZoom : true} );
			         });
			      });
			   </script>
            </#if>
			<div id="ucm-left-bottom">
				<@region id="ucm-media-files" scope="template"/>
				<@region id="comments" scope="template"/>
			</div>
         </div>

         <div id="ucm-metadata" class="yui-u" style="width: 550px; margin-left: 20px;">
            <@region id="document-links" scope="template"/>
            <@markup id="bd">
			    <div id="bd">
			       <div class="share-form" style="border:1px solid black">
			          <@region id="edit-metadata-mgr" scope="template" />
			          <@region id="edit-metadata" scope="template" />
			       </div>
			    </div>
		    </@>
            <@region id="document-actions" scope="template"/>
            <@region id="document-tags" scope="template"/>
            <@region id="document-metadata" scope="template"/>
            <@region id="document-sync" scope="template"/>
            <@region id="document-permissions" scope="template"/>
            <@region id="document-workflows" scope="template"/>
            <@region id="document-versions" scope="template"/>
			<@region id="document-attachments" scope="template"/>
         </div>
      </div>

      <@region id="html-upload" scope="template"/>
      <@region id="flash-upload" scope="template"/>
      <@region id="file-upload" scope="template"/>
      <@region id="dnd-upload" scope="template"/>
   </div>
   <@region id="doclib-custom" scope="template"/>
   </@>
</@>

<@templateFooter>
   <@markup id="alf-ft">
   <div id="alf-ft">
      <@region id="footer" scope="global"/>
   </div>
   </@>
</@> 