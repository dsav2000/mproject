<#import "/org/alfresco/components/form/form.lib.ftl" as formLib />
<@link rel="stylesheet" type="text/css" href="${url.context}/res/css/jquery-ui.css"/>
<@link rel="stylesheet" type="text/css" href="${url.context}/res/css/smoothness/jquery-ui.css"/>
<!-- Fix form width -->
<style type="text/css">
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

<script type="text/javascript">
	function ucmFormLoaded() {
		<!-- Accordion -->
		require(["jqueryui"], function() {
			$(".accordion-wrapper").accordion({collapsible: true, heightStyle: "content"});
		});

		<!-- JQuery splitter -->
		//require(["jqueryui", "${url.context}/res/js/jquery.splitter.js"], function() {});
		
		<!-- Association picker customization -->
		require(["jquery"], function() {
			var picker = Alfresco.util.ComponentManager.findFirst("Alfresco.ObjectFinder");
			if (picker) {
				var mediaFolderRef = $("input[name=prop_ucm_artifact_attachments_folder]").val();
				if (mediaFolderRef) {
					picker.setOptions({ startLocation : mediaFolderRef });
				}
			}
		});
	}
</script>

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

      <#if form.mode == "create" && form.destination?? && form.destination?length &gt; 0>
         <input id="${formId}-destination" name="alf_destination" type="hidden" value="${form.destination?html}" />
      </#if>
		
      <#if form.mode != "view" && form.redirect?? && form.redirect?length &gt; 0>
         <input id="${formId}-redirect" name="alf_redirect" type="hidden" value="${form.redirect?html}" />
      </#if>

      <#--if form.mode == "create">
         <input id="${formId}-ucm-assoc-type" name="assoc_type" type="hidden" value="{http://www.alfresco.org/museum/ucm/1.0}artifact_contains"/>		
      </#if-->
      
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
   <script type="text/javascript">(function(){ucmFormLoaded();})();</script>
</#if>

<#macro renderSet set>
   <#if set.appearance?exists>
      <#if set.appearance == "fieldset">
         <fieldset><legend>${set.label}</legend>
      <#elseif set.appearance == "panel">
         <div class="form-panel">
            <div class="form-panel-heading">${set.label}</div>
            <div class="form-panel-body">
      <#elseif set.appearance == "accordion-element">
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
      <#elseif set.appearance == "accordion-element">
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
      <#elseif set.appearance == "accordion-wrapper">
         <div class="form-panel-body accordion-wrapper">
      </#if>
   </#if>
   
   <#list set.children as item>
      <#if item.kind == "set">
         <@renderSet set=item />
      <#else>
         <@formLib.renderField field=form.fields[item.id]></@>
      </#if>
   </#list>
   
   <#if set.appearance?exists>
      <#if set.appearance == "fieldset">
         </fieldset>
      <#elseif set.appearance == "panel">
            </div>
         </div>
      <#elseif set.appearance == "accordion-wrapper">
         </div>
      </#if>
   </#if>
</#macro>
