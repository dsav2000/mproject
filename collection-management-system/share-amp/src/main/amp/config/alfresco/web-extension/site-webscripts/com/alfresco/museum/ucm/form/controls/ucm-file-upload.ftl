<#-- Image uploading preview  -->
<@link rel="stylesheet" type="text/css" href="${url.context}/res/css/simple-file-preview.css"/>

<div id="${fieldHtmlId}" class="form-field">
	<label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
	<input type="file" id="${fieldHtmlId}-input" name="${field.name}"/>
</div>
<script type="text/javascript">
	(function() {
		require(["jquery"], function($) {
			jQuery = $;
			require(["${url.context}/res/js/jquery.simple-file-preview.js"], function() {
				if (typeof SoftwareLoop == 'undefined') {
					$("#${fieldHtmlId}-input").simpleFilePreview();
				}
				else {
					$("#${fieldHtmlId}").remove();
				}
			});
		});
	})();
</script>