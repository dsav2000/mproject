<import resource="classpath:alfresco/extension/templates/webscripts/com/alfresco/museum/ucm/ucm-media.lib.js">
<!-- Based on alfresco/templates/webscripts/org/alfresco/repository/forms/form.post.js -- >
function main()
{
    model.persistedObject = persistedObject.toString();
    model.message = "Successfully persisted form for item [" + itemKind + "]" + itemId;
}

main();