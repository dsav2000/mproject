<#include "../../../../org/alfresco/include/alfresco-template.ftl" />
<@templateHeader/>

<@templateBody>
   <@markup id="alf-hd">
   <div id="alf-hd">
      <@region scope="global" id="share-header" chromeless="true"/>
   </div>
   </@>
   <@markup id="bd">
   <div id="bd">
      <div id="create-content-form" class="share-form">
         <@region id="create-content-mgr" scope="template" />
         <@region id="create-content" scope="template" />
         <!-- Customized version of components/create-content/create-content-mgr.js:CreateContentMgr__navigateForward -->
         <script type="text/javascript">
            var contentMgr = Alfresco.util.ComponentManager.findFirst("Alfresco.CreateContentMgr");
            contentMgr._navigateForward = function UCM__navigateForward(nodeRef)
           </script>
      </div>
   </div>
   </@>
</@>

<@templateFooter>
   <@markup id="alf-ft">
   <div id="alf-ft">
      <@region id="footer" scope="global" />
   </div>
   </@>
</@>
