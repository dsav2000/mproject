package org.alfresco.repo.forms.processor.node;

import static org.alfresco.museum.ucm.UCMConstants.CONTENT_PROP_DATA;
import static org.alfresco.museum.ucm.UCMConstants.DEFAULT_CONTENT_MIMETYPE;
import static org.alfresco.museum.ucm.UCMConstants.NAME_PROP_DATA;
import static org.alfresco.repo.forms.processor.node.FormFieldConstants.PROP_DATA_PREFIX;

import java.io.InputStream;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.forms.FormData;
import org.alfresco.repo.forms.FormException;
import org.alfresco.repo.forms.FormData.FieldData;
import org.alfresco.repo.forms.processor.AbstractFilter;
import org.alfresco.repo.forms.processor.AbstractFormProcessor;
import org.alfresco.service.cmr.dictionary.DataTypeDefinition;
import org.alfresco.service.cmr.dictionary.DictionaryService;
import org.alfresco.service.cmr.dictionary.PropertyDefinition;
import org.alfresco.service.cmr.dictionary.TypeDefinition;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.repository.ContentData;
import org.alfresco.service.cmr.repository.ContentService;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.MimetypeService;
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
public abstract class UCMGenericFilter<T> extends AbstractFilter<T, NodeRef> {
	private NodeService nodeService;
	private ContentService contentService;
	private DictionaryService dictionaryService;
	private FileFolderService fileFolderService;
	private MimetypeService mimetypeService;

	protected String getFilename(FormData data) {
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

		return filename;
	}

	protected String findFreeFilename(NodeRef parentDirectory, String originalFilename) {
		String tmpFilename = originalFilename;
		int counter = 1;
		while (null != childByNamePath(parentDirectory, tmpFilename)) {
			tmpFilename = generateFilenameWithIndex(originalFilename, counter);
			++counter;
		}
		return tmpFilename;
	}

	private NodeRef childByNamePath(NodeRef parent, String filename) {
		return getNodeService().getChildByName(parent, ContentModel.ASSOC_CONTAINS, filename);
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

	protected NodeRef getOrCreateFolder(NodeRef parentRef, String name, boolean isHidden) {
		NodeRef result = this.getFileFolderService().searchSimple(parentRef, name);
		if (result == null) {
			result = this.getFileFolderService().create(parentRef, name, ContentModel.TYPE_FOLDER).getNodeRef();
			if (isHidden) {
				Map<QName, Serializable> aspectHiddenProperties = new HashMap<QName, Serializable>(1);
				// aspectHiddenProperties.put(ContentModel.PROP_VISIBILITY_MASK,
				// true);
				this.getNodeService().addAspect(result, ContentModel.ASPECT_HIDDEN, aspectHiddenProperties);
				if (isHidden) {
					this.getNodeService().addAspect(result, ContentModel.ASPECT_HIDDEN, aspectHiddenProperties);
				}
			}
		}
		return result;
	}

	protected void writeContent(TypeDefinition item, FormData data, NodeRef persistedObject) {
		FieldData contentField = data.getFieldData(CONTENT_PROP_DATA);
		if (contentField != null && contentField.isFile()) {
			// if we have a property definition attempt the persist
			PropertyDefinition propDef = item.getProperties().get(ContentModel.PROP_CONTENT);
			if (propDef != null && propDef.getDataType().getName().equals(DataTypeDefinition.CONTENT)) {
				ContentWriter writer = this.getContentService().getWriter(persistedObject, ContentModel.PROP_CONTENT,
						true);
				if (writer != null) {
					// write the content
					writer.putContent(contentField.getInputStream());

					// content data has not been persisted yet so get it from
					// the node
					ContentData contentData = (ContentData) this.getNodeService().getProperty(persistedObject,
							ContentModel.PROP_CONTENT);
					if (contentData != null) {
						contentData = ContentData.setMimetype(contentData, determineDefaultMimetype(data));
						Map<QName, Serializable> propsToPersist = new HashMap<QName, Serializable>();
						propsToPersist.put(ContentModel.PROP_CONTENT, contentData);
						this.getNodeService().addProperties(persistedObject, propsToPersist);
					}
				}
			}
		}
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
			} else {
				FieldData contentField = data.getFieldData(CONTENT_PROP_DATA);
				if (contentField != null) {
					String fileName = contentField.getValue().toString();
					InputStream inputStream = contentField.getInputStream();
					mimetype = getMimetypeService().guessMimetype(fileName, inputStream);
				}
			}
		}

		return mimetype;
	}

	protected void resolvePossibleFilenameConflict(TypeDefinition item, FormData data) {
		// firstly, ensure we have a destination to create the node in
		NodeRef parentRef = null;
		FieldData destination = data.getFieldData(AbstractFormProcessor.DESTINATION);
		if (destination == null) {
			throw new FormException("Failed to persist form for '" + item.getName() + "' as '"
					+ AbstractFormProcessor.DESTINATION + "' data was not provided.");
		}
		// create the parent NodeRef
		parentRef = new NodeRef((String) destination.getValue());

		String originalFilename = getFilename(data);
		String validFilename = findFreeFilename(parentRef, originalFilename);
		// Use name of uploaded file as new content name
		data.addFieldData(NAME_PROP_DATA, validFilename, true);
	}

	/*
	 * Fills properties of "to" node with values of "from" node. To be updated property should:
	 * 1. be defined in child node type description in types model file;
	 * 2. be set in parent node. 
	 */
	protected void inheritProperties(TypeDefinition toType, NodeRef fromNode, NodeRef toNode) {
		Set<QName> propsSet = toType.getProperties().keySet();
		for (QName property : propsSet) {
			Serializable value = this.getNodeService().getProperty(fromNode, property);
			if (value != null) {
				this.getNodeService().setProperty(toNode, property, value);
			}
		}
	}

	/*
	 * Fills properties of node with values of it's primary parent node. To be updated property should:
	 * 1. be defined in child node type description in types model file;
	 * 2. be set in parent node. 
	 */
	protected void inheritPropertiesFromParent(TypeDefinition nodeType, NodeRef node) {
		NodeRef parent = this.getNodeService().getPrimaryParent(node).getParentRef();
		inheritProperties(nodeType, parent, node);
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

	public ContentService getContentService() {
		return contentService;
	}

	public void setContentService(ContentService contentService) {
		this.contentService = contentService;
	}

	public FileFolderService getFileFolderService() {
		return fileFolderService;
	}

	public void setFileFolderService(FileFolderService fileFolderService) {
		this.fileFolderService = fileFolderService;
	}

	public MimetypeService getMimetypeService() {
		return mimetypeService;
	}

	public void setMimetypeService(MimetypeService mimetypeService) {
		this.mimetypeService = mimetypeService;
	}
}
