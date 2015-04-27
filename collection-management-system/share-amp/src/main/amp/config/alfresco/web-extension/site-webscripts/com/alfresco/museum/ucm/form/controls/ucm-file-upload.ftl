<div class="form-field">
	<label for="${fieldHtmlId}">${field.label?html}:<#if field.mandatory><span class="mandatory-indicator">${msg("form.required.fields.marker")}</span></#if></label>
	<input type="file" id="${fieldHtmlId}" name="${field.name}" />
</div>