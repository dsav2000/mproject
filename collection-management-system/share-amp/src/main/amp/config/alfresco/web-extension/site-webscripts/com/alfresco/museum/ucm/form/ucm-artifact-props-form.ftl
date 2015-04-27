<#import "/org/alfresco/components/form/form.lib.ftl" as formLib />

<!-- Dependency files for Accordion Appearance -->
<link rel="stylesheet" type="text/css" href="${url.context}/yui/container/assets/skins/sam/container.css" />
<link rel="stylesheet" type="text/css" href="${url.context}/js/bubbling-2.1/accordion/assets/accordion.css" />
<style type="text/css">
	.myAccordion {
	  float: left;
	  margin-right: 15px;
	}
	
	.myAccordion .yui-cms-accordion .yui-cms-item {
	  width: 200px;
	}
	
	.share-form .form-container .form-fields {
		width: 500px !important;
	}
	.share-form .form-container .caption {
		width: 520px !important;
	}
	
	.share-form .form-manager {
		width: 527px !important;
	}
</style>
<script type="text/javascript" src="${url.context}/yui/utilities/utilities.js"></script>
<script type="text/javascript" src="${url.context}/js/bubbling.v2.1-min.js"></script>
<script type="text/javascript" src="${url.context}/js/bubbling-2.1/accordion/accordion.js"></script>

<#if error?exists>
   <div class="error">${error}</div>
<#elseif form?exists>

   <#assign formId=args.htmlid + "-form">
   <#assign formUI><#if args.formUI??>${args.formUI}<#else>true</#if></#assign>

   <#if formUI == "true">
      <@formLib.renderFormsRuntime formId=formId />
   </#if>
   
   <div id="${formId}-container" class="form-container">
      
      <#if form.showCaption?exists && form.showCaption>
         <div id="${formId}-caption" class="caption"><span class="mandatory-indicator">*</span>${msg("form.required.fields")}</div>
      </#if>
         
      <#if form.mode != "view">
         <form id="${formId}" method="${form.method}" accept-charset="utf-8" enctype="${form.enctype}" action="${form.submissionUrl}">
      </#if>
      
      <div id="${formId}-fields" class="form-fields"> 
		<div class="yui-content">
			<#list form.structure as item>
				<#if item.kind == "set">
			   		<@renderSetWithoutColumns set=item />
						</#if>
			 </#list>
				<#list form.structure as item>
					<#if item.kind != "set">
					   	<@formLib.renderField field=form.fields[item.id] />
					</#if>
				 </#list>
		</div> 
      </div>
         
      <#if form.mode != "view">
         <@formLib.renderFormButtons formId=formId />
         </form>
      </#if>

   </div>
</#if>

<#macro renderSet set>
   <#if set.appearance?exists>
      <#if set.appearance == "fieldset">
         <fieldset><legend>${set.label}</legend>
      <#elseif set.appearance == "panel">
         <div class="form-panel">
            <div class="form-panel-heading">${set.label}</div>
            <div class="form-panel-body">
      <#elseif set.appearance == "accordion">
      <div class="yui-skin-sam">
      	<div class="yui-cms-accordion multiple fade fixIE">	  
	  	    <div class="yui-cms-item yui-panel">
	              <div class="hd">${set.label}</div>
	              <div class="bd">
	                <div class="fixed">
      </#if>
   </#if>
   
   <#list set.children as item>
      <#if item.kind == "set">
         <@renderSet set=item />
      <#else>
         <@formLib.renderField field=form.fields[item.id] />
      </#if>
   </#list>
   
   <#if set.appearance?exists>
      <#if set.appearance == "fieldset">
         </fieldset>
      <#elseif set.appearance == "panel">
            </div>
         </div>
      <#elseif set.appearance == "accordion">
					</div>
            	</div>
            <div class="actions">
		      <a href="#" class="accordionToggleItem">&nbsp;</a>
		    </div>
		 </div>
       </div>
       </div>
      </#if>
   </#if>
</#macro>

<#macro renderSetWithoutColumns set>
   <#if set.appearance?exists>
      <#if set.appearance == "fieldset">
         <fieldset><legend>${set.label}</legend>
      <#elseif set.appearance == "panel">
         <div class="form-panel">
            <div class="form-panel-body">
      </#if>
   </#if>
   
   <#list set.children as item>
      <#if item.kind == "set">
         <@renderSet set=item />
      <#else>
         <@formLib.renderField field=form.fields[item.id] />
      </#if>
   </#list>
   
   <#if set.appearance?exists>
      <#if set.appearance == "fieldset">
         </fieldset>
      <#elseif set.appearance == "panel">
            </div>
         </div>
      </#if>
   </#if>
</#macro>
