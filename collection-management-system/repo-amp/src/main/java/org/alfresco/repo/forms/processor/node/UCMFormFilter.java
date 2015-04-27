package org.alfresco.repo.forms.processor.node;

import static org.alfresco.repo.forms.processor.node.FormFieldConstants.DATA_KEY_SEPARATOR;
import static org.alfresco.repo.forms.processor.node.FormFieldConstants.PROP_DATA_PREFIX;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.forms.Form;
import org.alfresco.repo.forms.FormData;
import org.alfresco.repo.forms.FormData.FieldData;
import org.alfresco.repo.forms.FormException;
import org.alfresco.repo.forms.processor.AbstractFilter;
import org.alfresco.repo.forms.processor.AbstractFormProcessor;
import org.alfresco.service.cmr.dictionary.DataTypeDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.dictionary.PropertyDefinition;
import org.alfresco.service.cmr.dictionary.TypeDefinition;
import org.alfresco.service.cmr.repository.ContentData;
import org.alfresco.service.cmr.repository.ContentService;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.namespace.QName;
import org.springframework.util.StringUtils;

/**
 * Form fields of type "file" are currently ignored in
 * {@link org.alfresco.repo.forms.processor.node.ContentModelFormProcessor
 * FormProcessor's}
 * {@link org.alfresco.repo.forms.processor.node.ContentModelFormProcessor#persistNode(NodeRef, FormData)
 * persistNode} method. This form filter is used to force persisting of
 * "cm:content" field content as a node property. It is placed it this package
 * in order to get access to protected fields of
 * {@link org.alfresco.repo.forms.processor.node.ContentModelFormProcessor form
 * processor class}.
 */
public class UCMFormFilter extends AbstractFilter<TypeDefinition, NodeRef> {
	protected static final String CONTENT_PROP_DATA = PROP_DATA_PREFIX + "cm" + DATA_KEY_SEPARATOR
			+ ContentModel.PROP_CONTENT.getLocalName();
	protected static final String NAME_PROP_DATA = PROP_DATA_PREFIX + "cm" + DATA_KEY_SEPARATOR
			+ ContentModel.PROP_NAME.getLocalName();
	public static final String DEFAULT_CONTENT_MIMETYPE = "image/jpeg";

	private NodeService nodeService;
	private ContentService contentService;
	private DictionaryService dictionaryService;
	private TypeFormProcessor formProcessor;

	@Override
	public void beforeGenerate(TypeDefinition item, List<String> fields, List<String> forcedFields, Form form,
			Map<String, Object> context) {
		// Do nothing
	}

	@Override
	public void afterGenerate(TypeDefinition item, List<String> fields, List<String> forcedFields, Form form,
			Map<String, Object> context) {
		// Do nothing
	}

	/**
	 * Fill file name field. Handle possible file name collisions.
	 */
	@Override
	public void beforePersist(TypeDefinition item, FormData data) {
		String filename = "";

		// If there is field for property "cm:name" use it as new content name
		FieldData nameField = data.getFieldData(NAME_PROP_DATA);
		if (nameField != null && !StringUtils.isEmpty(nameField.getValue())) {
			filename = nameField.getValue().toString();
		} else {
			// If "cm:content" property is undefined value of property
			// "cm:content" is used instead. It contains name of file uploaded
			// by user.
			FieldData contentField = data.getFieldData(CONTENT_PROP_DATA);
			if (contentField != null && contentField.isFile() && !StringUtils.isEmpty(contentField.getValue())) {
				filename = contentField.getValue().toString();
			}
		}

		// firstly, ensure we have a destination to create the node in
		NodeRef parentRef = null;
		FieldData destination = data.getFieldData(AbstractFormProcessor.DESTINATION);
		if (destination == null) {
			throw new FormException("Failed to persist form for '" + item.getName() + "' as '"
					+ AbstractFormProcessor.DESTINATION + "' data was not provided.");
		}

		// create the parent NodeRef
		parentRef = new NodeRef((String) destination.getValue());

		String tmpFilename = filename;
		int counter = 1;
		while (null != childByNamePath(parentRef, tmpFilename)) {
			tmpFilename = generateFilenameWithIndex(filename, counter);
			++counter;
		}

		// Use name of uploaded file as new content name
		data.addFieldData(NAME_PROP_DATA, nameField.getValue(), true);
	}

	private NodeRef childByNamePath(NodeRef parent, String filename) {
		return nodeService.getChildByName(parent, ContentModel.ASSOC_CONTAINS, filename);
	}

	private static String generateFilenameWithIndex(String oldFilename, int index) {
		String result = null;
		int dotIndex = oldFilename.lastIndexOf(".");
		if (dotIndex == 0) {
			// File didn't have a proper 'name' instead it had just a suffix and
			// started with a ".", create "1.txt"
			result = index + oldFilename;
		} else if (dotIndex > 0) {
			// Filename contained ".", create "filename-1.txt"
			result = oldFilename.substring(0, dotIndex) + "-" + index + oldFilename.substring(dotIndex);
		} else {
			// Filename didn't contain a dot at all, create "filename-1"
			result = oldFilename + "-" + index;
		}
		return result;
	}

	/**
	 * Add ignored "cm:content" property.<br/>
	 * See
	 * {@link org.alfresco.repo.forms.processor.node.ContentModelFormProcessor#persistNode(NodeRef, FormData)
	 * persistNode},
	 * {@link org.alfresco.repo.forms.processor.node.ContentModelFormProcessor#processPropertyPersist(NodeRef, Map,FieldData, Map, FormData)
	 * processPropertyPersist},
	 * {@link org.alfresco.repo.forms.processor.node.ContentModelFormProcessor#processContentPropertyPersist(NodeRef, FieldData, Map, FormData)
	 * processContentPropertyPersist} and <a href=
	 * "https://forums.alfresco.com/forum/developer-discussions/alfresco-share-development/file-upload-create-content-06282010-2333"
	 * >discussion thread</a>
	 */
	@Override
	public void afterPersist(TypeDefinition item, FormData data, NodeRef persistedObject) {
		// get the property definitions for the type of node being persisted
		QName type = this.nodeService.getType(persistedObject);
		TypeDefinition typeDef = this.dictionaryService.getAnonymousType(type,
				this.nodeService.getAspects(persistedObject));
		Map<QName, PropertyDefinition> propDefs = typeDef.getProperties();
		Map<QName, Serializable> propsToPersist = new HashMap<QName, Serializable>();

		FieldData contentField = data.getFieldData(CONTENT_PROP_DATA);
		if (contentField != null && contentField.isFile()) {
			// ensure that the property being persisted is defined in the model
			PropertyDefinition propDef = propDefs.get(ContentModel.PROP_CONTENT);

			// if we have a property definition attempt the persist
			if (propDef != null && propDef.getDataType().getName().equals(DataTypeDefinition.CONTENT)) {
				ContentWriter writer = this.contentService.getWriter(persistedObject, ContentModel.PROP_CONTENT, true);
				if (writer != null) {
					// write the content
					writer.putContent(contentField.getInputStream());

					// content data has not been persisted yet so get it from
					// the node
					ContentData contentData = (ContentData) this.nodeService.getProperty(persistedObject,
							ContentModel.PROP_CONTENT);
					if (contentData != null) {
						contentData = ContentData.setMimetype(contentData, determineDefaultMimetype(data));
						propsToPersist.put(ContentModel.PROP_CONTENT, contentData);
					}
				}
			}
		}

		this.nodeService.addProperties(persistedObject, propsToPersist);
	}

	/**
	 * Looks through the form data for the 'mimetype' transient field and
	 * returns it's value if found, otherwise the default 'text/plain' is
	 * returned
	 * 
	 * @param data
	 *            Form data being persisted
	 * @return The default mimetype
	 */
	protected String determineDefaultMimetype(FormData data) {
		String mimetype = DEFAULT_CONTENT_MIMETYPE;

		if (data != null) {
			FieldData mimetypeField = data.getFieldData(PROP_DATA_PREFIX + MimetypeFieldProcessor.KEY);
			if (mimetypeField != null) {
				String mimetypeFieldValue = (String) mimetypeField.getValue();
				if (mimetypeFieldValue != null && mimetypeFieldValue.length() > 0) {
					mimetype = mimetypeFieldValue;
				}
			}
		}

		return mimetype;
	}

	public NodeService getNodeService() {
		return nodeService;
	}

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}

	public DictionaryService getDictionaryService() {
		return dictionaryService;
	}

	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	public TypeFormProcessor getFormProcessor() {
		return formProcessor;
	}

	public void setFormProcessor(TypeFormProcessor formProcessor) {
		this.formProcessor = formProcessor;
	}

	public ContentService getContentService() {
		return contentService;
	}

	public void setContentService(ContentService contentService) {
		this.contentService = contentService;
	}
}
