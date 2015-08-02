package org.alfresco.repo.forms.processor.node;

import static org.alfresco.museum.ucm.UCMConstants.TYPE_UCM_ARTIST_QNAME;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.alfresco.museum.ucm.UCMConstants;
import org.alfresco.repo.forms.Form;
import org.alfresco.repo.forms.FormData;
import org.alfresco.repo.forms.FormData.FieldData;
import org.alfresco.service.cmr.dictionary.TypeDefinition;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.NodeRef;
import org.springframework.util.StringUtils;

/**
 * Handle custom operations during artist creation. Such as creating 'about'
 * folder and artist artifact, which contains image of artist. Artist artifact
 * extends ucm:artifact and thus is cm:content. Artist node contains reference
 * to artist artifact. This is necessary because artist artifact's thumbnail is
 * used also as thumbnail for artist node.
 */
public class UCMCreateArtist extends UCMGenericFilter<TypeDefinition> {

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
	 * Fill artist name field. Handle possible file name collisions.
	 */
	@Override
	public void beforePersist(TypeDefinition item, FormData data) {
		resolvePossibleFilenameConflict(item, data);
	}
	
	/**
	 * Store "cm:content" property value, which is ignored by default handler.<br/>
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
		boolean isArtist = item.getName().equals(TYPE_UCM_ARTIST_QNAME);
		if (isArtist) {
			Serializable artistNameValue = this.getNodeService().getProperty(persistedObject, UCMConstants.PROP_UCM_ARTIST_QNAME);
			if (!StringUtils.isEmpty(artistNameValue)) {
				String artistName = artistNameValue.toString();
				
				NodeRef artistArtifact = createArtistArtifact(data, persistedObject, artistName);
				
				if (artistArtifact != null) {
					// save reference to artist artifact in artist property
					this.getNodeService().setProperty(persistedObject, UCMConstants.PROP_UCM_ARTIST_ARTIFACT_QNAME, artistArtifact);
				}
			}
		}
	}

	// <artist>/"About " + artistName
	protected NodeRef createArtistArtifact(FormData data, NodeRef artistFolder, String artistName) {
		// TODO: LOG
		NodeRef artistArtifactRef = null;

		String artistArtifactFilename = "About " + artistName;
		if (artistFolder != null && !StringUtils.isEmpty(artistArtifactFilename)) {
			FileInfo artistImageFile = this.getFileFolderService().create(artistFolder, artistArtifactFilename,
					UCMConstants.TYPE_UCM_ARTIST_ARTIFACT_QNAME);

			artistArtifactRef = artistImageFile.getNodeRef();
			

			TypeDefinition artistArtifactType = this.getDictionaryService().getType(
					UCMConstants.TYPE_UCM_ARTIST_ARTIFACT_QNAME);
			inheritProperties(artistArtifactType, artistFolder, artistArtifactRef);
			writeContent(artistArtifactType, data, artistArtifactRef);
		}
		return artistArtifactRef;
	}
}
