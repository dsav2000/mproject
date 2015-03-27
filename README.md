###Introduction
Goal of this project is to create custom Collection management system based on Alfresco content-management system which would be specialized in working with museum artifact collections. It is based on Alfresco SDK, more specifically on "All-in-one" archetype. See http://docs.alfresco.com/5.0/concepts/alfresco-sdk-archetypes.html for details.

###Structure
* `collection-management-system`: contains main Maven project and child Maven project
* `collection-management-system/repo-amp`: A Repository Tier AMP project, demonstrating sample project structure and demo component loading.
* `collection-management-system/repo`: An alfresco.war Repository Extension, overlaying the Alfresco WAR with custom resources / classes and depending on the amp project
* `collection-management-system/share-amp`: A Share Tier AMP project, demonstrating sample project structure and demo component loading.
* `collection-management-system/share`: A share.war extension, overlaying the Share WAR with the custom developed share-amp
* `collection-management-system/solr`: An Alfresco alfresco-\*-\*-solr.zip overlay / customization to configure Apache Solr cores properties
* `collection-management-system/runner`: A Tomcat + H2 runner, capable of running all the aforementioned projects in embedded mode for demo / integration-testing purposes

'repo' and 'share' projects may be used to override global configuration files.
'repo-amp' and 'share-amp' are module projects and so they shouldn't contain files whose name would clash with global configuration files. Otherwise conflict would be possible between this modules and third-party modules.

Many Alfresco tutorials refer to location of configuration files in tomcat directory. Below is mapping between paths inside projects and their target destination in application server directory:
* `repo/src/main/resources/alfresco` -> 'tomcat/webapps/**repo**/WEB-INF/classes/alfresco'
* `repo-amp/src/main/amp/config/alfresco` -> 'tomcat/webapps/**repo**/WEB-INF/classes/alfresco'
* `share/src/main/resources/alfresco` -> 'tomcat/webapps/**share**/WEB-INF/classes/alfresco'
* `share-amp/src/main/amp/config/alfresco` -> 'tomcat/webapps/**share**/WEB-INF/classes/alfresco'
* `share-amp/src/main/resources` -> 'tomcat/webapps/**share**'

Description of main _share_ configuration files may be found in http://docs.alfresco.com/5.0/concepts/share-configuration-files.html

###Build prerequisites
This page lists system requirements for building project: http://docs.alfresco.com/5.0/concepts/alfresco-sdk-install.html
In short:
* JDK >= 1.7
* Maven >= 3.2.5
* Environmental variables JAVA_HOME and MAVEN_OPTS set.

###Build and run
Command line script run.bat (run.sh for Unix) may be used to build project and start it. Maven command line arguments used to build/run/package project may be found here: http://docs.alfresco.com/5.0/concepts/alfresco-sdk-usage-aio.html

###Content model deployment
Custom content model file may be added by path `collection-management-system/repo-amp/src/main/amp/config/alfresco/extension/model`. It should be then registered in Spring config file, e.g. `collection-management-system-clean/repo-amp/src/main/amp/config/alfresco/module/repo-amp/module-context.xml`. For details see https://wiki.alfresco.com/wiki/Data_Dictionary_Guide#Model_Bootstrapping