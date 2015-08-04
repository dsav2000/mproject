package org.alfresco.repo.forms.processor.node;

import static org.alfresco.museum.ucm.UCMConstants.*;

import java.util.List;
import java.util.Map;

import org.alfresco.museum.ucm.UCMConstants;
import org.alfresco.repo.forms.Form;
import org.alfresco.repo.forms.FormData;
import org.alfresco.service.cmr.dictionary.TypeDefinition;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.namespace.QName;
import org.springframework.util.StringUtils;

/**
 * Handle artist update operation. Image selected by user should update artist artifact object instead of artist itself.
 */
public class UCMEditArtist extends UCMGenericFilter<NodeRef> {
	
	@Override
	public void beforeGenerate(NodeRef item, List<String> fields, List<String> forcedFields, Form form,
			Map<String, Object> context) {
		
	}
	
	@Override
	public void afterGenerate(NodeRef item, List<String> fields, List<String> forcedFields, Form form,
			Map<String, Object> context) {
	}
	
	
	@Override
	public void beforePersist(NodeRef item, FormData data) {
	}

	/**
	 * Store "cm:content" property value, which is ignored by default handler.<br/>
	 */
	@Override
	public void afterPersist(NodeRef item, FormData data, NodeRef persistedObject) {
		QName nodeType = this.getNodeService().getType(item);
		boolean isArtist = nodeType.equals(TYPE_UCM_ARTIST_QNAME);
		if (isArtist) {
			Object artistArtifactValue = this.getNodeService().getProperty(persistedObject, UCMConstants.PROP_UCM_ARTIST_ARTIFACT_QNAME);
			if (!StringUtils.isEmpty(artistArtifactValue)) {
				String artistArtifactString = artistArtifactValue.toString();
				NodeRef artistArtifactRef = new NodeRef(artistArtifactString);
				TypeDefinition artistArtifactType = this.getDictionaryService().getType(
						UCMConstants.TYPE_UCM_ARTIST_ARTIFACT_QNAME);
				writeContent(artistArtifactType, data, artistArtifactRef);
			}
		}
		else {
			boolean isArtistArtifact = nodeType.equals(TYPE_UCM_ARTIST_ARTIFACT_QNAME);
			if (isArtistArtifact) {
				TypeDefinition artistArtifactType = this.getDictionaryService().getType(
						UCMConstants.TYPE_UCM_ARTIST_ARTIFACT_QNAME);
				writeContent(artistArtifactType, data, persistedObject);
			}
		}
	}

}
