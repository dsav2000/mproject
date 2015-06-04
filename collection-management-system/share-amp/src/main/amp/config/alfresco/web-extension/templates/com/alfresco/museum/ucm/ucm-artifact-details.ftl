<#include "../../../../org/alfresco/include/alfresco-template.ftl" />
<@templateHeader>
   <@script type="text/javascript" src="${url.context}/res/modules/documentlibrary/doclib-actions.js" group="document-details"/>
<#--
	<@script type="text/javascript" src="${url.context}/res/js/jquery.js"  group="document-details"/>
	<@script type="text/javascript" src="${url.context}/res/js/jquery-ui.js"  group="document-details"/>
-->

  <@script type="text/javascript" src="${url.context}/res/js/lib/jquery-1.11.1/jquery.js" group="document-details"/>
	<@script type="text/javascript" src="${url.context}/res/js/jquery.layout.js"  group="document-details"/>
  <@script type="text/javascript" src="${url.context}/res/js/jquery.loupe.min.js"  group="document-details"/>

   <@link rel="stylesheet" type="text/css" href="${url.context}/res/css/artifact-preview.css"/>

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

      <div id="ucm-horizontal-splitter" class="yui-gc">
     	<div id="ucm-vertical-splitter" class="yui-u first">
            <#if (config.scoped['DocumentDetails']['document-details'].getChildValue('display-web-preview') == "true")>
			   <div id="ucm-artifact-image" class="artifact-preview">
			   	  <@region id="web-preview" scope="template"/>
			   	  <script type="text/javascript">
                $("img").loupe({
                      width: 250, // width of magnifier
                      height: 250, // height of magnifier
                      loupe: 'loupe' // css class for magnifier 
                    });
            </script>
			   </div>
            </#if>
			<div id="ucm-referenced-files">
				<@region id="comments" scope="template"/>
			</div>
         </div>

         <div id="ucm-metadata" class="yui-u">
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
			<#-- TODO: -->
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