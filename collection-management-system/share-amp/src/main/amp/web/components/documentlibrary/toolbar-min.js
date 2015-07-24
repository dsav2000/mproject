(function(){var E=YAHOO.util.Dom,C=YAHOO.util.Event,g=YAHOO.util.Element;var B=Alfresco.util.encodeHTML,w=Alfresco.util.combinePaths,u=Alfresco.util.siteURL;var a="org.alfresco.share.documentList",G=a+".hideNavBar";Alfresco.DocListToolbar=function(P,Q){Alfresco.DocListToolbar.superclass.constructor.call(this,"Alfresco.DocListToolbar",P,["button","menu","container"]);this.selectedFiles=[];this.currentFilter={};this.dynamicControls=[];this.doclistMetadata={};this.actionsView="browse";YAHOO.Bubbling.on("filterChanged",this.onFilterChanged,this);YAHOO.Bubbling.on("deactivateAllControls",this.onDeactivateAllControls,this);YAHOO.Bubbling.on("deactivateDynamicControls",this.onDeactivateDynamicControls,this);YAHOO.Bubbling.on("selectedFilesChanged",this.onSelectedFilesChanged,this);YAHOO.Bubbling.on("userAccess",this.onUserAccess,this);YAHOO.Bubbling.on("doclistMetadata",this.onDoclistMetadata,this);YAHOO.Bubbling.on("showFileUploadDialog",this.onFileUpload,this);YAHOO.Bubbling.on("dropTargetOwnerRequest",this.onDropTargetOwnerRequest,this);YAHOO.Bubbling.on("documentDragOver",this.onDocumentDragOver,this);YAHOO.Bubbling.on("documentDragOut",this.onDocumentDragOut,this);YAHOO.Bubbling.on("registerAction",this.onRegisterAction,this);return this};YAHOO.extend(Alfresco.DocListToolbar,Alfresco.component.Base);YAHOO.lang.augmentProto(Alfresco.DocListToolbar,Alfresco.doclib.Actions);YAHOO.lang.augmentObject(Alfresco.DocListToolbar.prototype,{options:{siteId:null,containerId:"documentLibrary",groupActivitiesAt:5,hideNavBar:false,repositoryBrowsing:true,useTitle:true},currentPath:"",currentFilter:null,fileUpload:null,selectedFiles:null,folderDetailsUrl:null,dynamicControls:null,doclistMetadata:null,onReady:function D(){if(E.get(this.id+"-tb-body")!=null){if(E.get(this.id+"-createContent-button")){this.widgets.createContent=Alfresco.util.createYUIButton(this,"createContent-button",this.onCreateContent,{type:"menu",menu:"createContent-menu",lazyloadmenu:false,disabled:true,value:"CreateChildren"});var S=this.widgets.createContent.getMenu(),Q=0;S.cfg.config.clicktohide.value=true;if(this.options.createContentActions.length!==0){var ag=[],R,ac,T,af,Y,Z;for(var ad=0;ad<this.options.createContentActions.length;ad++){ac=this.options.createContentActions[ad];af={parent:S};T=null;if(ac.type=="javascript"){af.onclick={fn:function(ai,ah,al){var ak=Alfresco.util.deepCopy(this.doclistMetadata.parent);var aj={nodeRef:ak.nodeRef,node:ak,jsNode:new Alfresco.util.Node(ak)};this[al.params["function"]].call(this,aj)},obj:ac,scope:this};T="#"}else{if(ac.type=="pagelink"){T=u(ac.params.page)}else{if(ac.type=="link"){T=ac.params.href}}}Y='<a href="'+T+'" rel="'+ac.permission+'"><span style="background-image:url('+Alfresco.constants.URL_RESCONTEXT+"components/images/filetypes/"+ac.icon+'-file-16.png)" class="'+ac.icon+'-file">'+this.msg(ac.label)+"</span></a>";Z=document.createElement("li");Z.innerHTML=Y;R=new YAHOO.widget.MenuItem(Z,af);ag.push(R)}S.addItems(ag,Q);Q++}if(this.options.createContentByTemplateEnabled){var Z=document.createElement("li");Z.innerHTML='<a href="#"><span>'+this.msg("menu.create-content.by-template-node")+"</span></a>";YAHOO.util.Event.addListener(Selector.query("a",Z,true),"click",function(ah){C.preventDefault(ah);C.stopEvent(ah)});var ab=document.createElement("div");ab.innerHTML='<div class="bd"><ul></ul></div>';var W=document.createElement("li");W.innerHTML='<a href="#"><span>'+this.msg("menu.create-content.by-template-folder")+"</span></a>";YAHOO.util.Event.addListener(Selector.query("a",W,true),"click",function(ah){C.preventDefault(ah);C.stopEvent(ah)});var P=document.createElement("div");P.innerHTML='<div class="bd"><ul></ul></div>';var V=new YAHOO.widget.MenuItem(Z,{parent:S,submenu:ab});var ae=new YAHOO.widget.MenuItem(W,{parent:S,submenu:P});S.addItems([V,ae],Q);Q++;var U=this.widgets.createContent.getMenu().getSubmenus(),aa=U.length>0?U[0]:null;if(aa){aa.subscribe("beforeShow",this.onCreateByTemplateNodeBeforeShow,this,true);aa.subscribe("click",this.onCreateByTemplateNodeClick,this,true)}var X=U.length>1?U[1]:null;if(X){X.subscribe("beforeShow",this.onCreateByTemplateFolderBeforeShow,this,true);X.subscribe("click",this.onCreateByTemplateFolderClick,this,true)}}S.render();this.dynamicControls.push(this.widgets.createContent)}this.widgets.newCollection=Alfresco.util.createYUIButton(this,"newCollection-button",this.onNewCollection,{disabled:true,value:"CreateChildren"});this.dynamicControls.push(this.widgets.newCollection);this.widgets.newFolder=Alfresco.util.createYUIButton(this,"newFolder-button",this.onNewFolder,{disabled:true,value:"CreateChildren"});this.dynamicControls.push(this.widgets.newFolder);this.widgets.fileUpload=Alfresco.util.createYUIButton(this,"fileUpload-button",this.onFileUpload,{disabled:true,value:"CreateChildren"});this.dynamicControls.push(this.widgets.fileUpload);this.widgets.syncToCloud=Alfresco.util.createYUIButton(this,"syncToCloud-button",this.onSyncToCloud,{disabled:true,value:"CreateChildren"});this.dynamicControls.push(this.widgets.syncToCloud);this.widgets.unsyncFromCloud=Alfresco.util.createYUIButton(this,"unsyncFromCloud-button",this.onUnsyncFromCloud,{disabled:true,value:"CreateChildren"});this.dynamicControls.push(this.widgets.unsyncFromCloud);this.widgets.selectedItems=Alfresco.util.createYUIButton(this,"selectedItems-button",this.onSelectedItems,{type:"menu",menu:"selectedItems-menu",lazyloadmenu:false,disabled:true});this.dynamicControls.push(this.widgets.selectedItems);if(E.get(this.id+"hideNavBar-button")){this.widgets.hideNavBar=Alfresco.util.createYUIButton(this,"hideNavBar-button",this.onHideNavBar,{type:"checkbox",checked:!this.options.hideNavBar});if(this.widgets.hideNavBar!==null){this.widgets.hideNavBar.set("title",this.msg(this.options.hideNavBar?"button.navbar.show":"button.navbar.hide"));this.dynamicControls.push(this.widgets.hideNavBar)}}E.setStyle(this.id+"-navBar","display",this.options.hideNavBar?"none":"block");this.widgets.rssFeed=Alfresco.util.createYUIButton(this,"rssFeed-button",null,{type:"link"});this.dynamicControls.push(this.widgets.rssFeed);this.widgets.folderUp=Alfresco.util.createYUIButton(this,"folderUp-button",this.onFolderUp,{disabled:true,title:this.msg("button.up")});this.dynamicControls.push(this.widgets.folderUp);E.setStyle(this.id+"-tb-body","visibility","visible")}this.modules.actions=new Alfresco.module.DoclibActions();this.modules.docList=Alfresco.util.ComponentManager.findFirst("Alfresco.DocumentList");this.services.preferences=new Alfresco.service.Preferences()},onCreateContent:function z(T,S,R){var Q=S[1],P=Q.element.getElementsByTagName("a")[0];if(Q.parent===this.widgets.createContent.getMenu()&&P&&P.nodeName=="A"){P.href=YAHOO.lang.substitute(P.href,{nodeRef:this.doclistMetadata.parent.nodeRef})}},onCreateByTemplateNodeBeforeShow:function F(){var P=this.widgets.createContent.getMenu().getSubmenus()[0];if(P.getItems().length==0){P.clearContent();P.addItem(this.msg("label.loading"));P.render();Alfresco.util.Ajax.jsonGet({url:Alfresco.constants.PROXY_URI+"slingshot/doclib/node-templates",successCallback:{fn:function(S,W){var R=S.json.data,V=[],T;for(var U=0,Q=R.length;U<Q;U++){node=R[U];T=B(node.name);if(node.title&&node.title!==node.name&&this.options.useTitle){T+='<span class="title">('+B(node.title)+")</span>"}V.push({text:'<span title="'+B(node.description)+'">'+T+"</span>",value:node})}if(V.length==0){V.push(this.msg("label.empty"))}P.clearContent();P.addItems(V);P.render()},scope:this}})}},onCreateByTemplateNodeClick:function J(U,T,S){var Q=T[1].value,P=this.doclistMetadata.parent.nodeRef,R=this.options.siteId;if(Q){Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"slingshot/doclib/node-templates",dataObj:{sourceNodeRef:Q.nodeRef,parentNodeRef:P},successCallback:{fn:function(V){Alfresco.Share.postActivity(R,"org.alfresco.documentlibrary.file-created","{cm:name}","document-details?nodeRef="+V.json.nodeRef,{appTool:"documentlibrary",nodeRef:V.json.nodeRef});YAHOO.Bubbling.fire("nodeCreated",{name:Q.name,parentNodeRef:P,highlightFile:V.json.name})}},successMessage:this.msg("message.create-content-by-template-node.success",Q.name),failureMessage:this.msg("message.create-content-by-template-node.failure",Q.name)})}},onCreateByTemplateFolderBeforeShow:function e(){var P=this.widgets.createContent.getMenu().getSubmenus()[1];if(P.getItems().length==0){P.clearContent();P.addItem(this.msg("label.loading"));P.render();Alfresco.util.Ajax.jsonGet({url:Alfresco.constants.PROXY_URI+"slingshot/doclib/folder-templates",successCallback:{fn:function(S,W){var R=S.json.data,V=[],T;for(var U=0,Q=R.length;U<Q;U++){node=R[U];T=B(node.name);if(node.title&&node.title!==node.name&&this.options.useTitle){T+='<span class="title">('+B(node.title)+")</span>"}V.push({text:'<span title="'+B(node.description)+'">'+T+"</span>",value:node})}if(V.length==0){V.push(this.msg("label.empty"))}P.clearContent();P.addItems(V);P.render()},scope:this}})}},onCreateByTemplateFolderClick:function K(V,U,T){var S=this.onNewFolder(null,T);S.options.doBeforeDialogShow={fn:function R(W,X){E.get(X.id+"-dialogTitle").innerHTML=this.title;E.get(X.id+"-dialogHeader").innerHTML=this.header;E.get(X.id+"_prop_cm_name").value=this.node.name;E.get(X.id+"_prop_cm_title").value=this.node.title;E.get(X.id+"_prop_cm_description").value=this.node.description},scope:{node:U[1].value,title:this.msg("label.new-folder-from-template.title"),header:this.msg("label.new-folder-from-template.header")}};S.options.successCallback={fn:function(W){YAHOO.Bubbling.fire("nodeCreated",{name:node.name,parentNodeRef:destination,highlightFile:W.json.name})}};S.options.successMessage=this.msg("message.create-content-by-template-node.success",node.name);S.options.failureMessage=this.msg("message.create-content-by-template-node.failure",node.name);S.options.doBeforeFormSubmit={fn:function P(W,X){W.attributes.action.nodeValue=Alfresco.constants.PROXY_URI+"slingshot/doclib/folder-templates"},scope:this};S.options.doBeforeAjaxRequest={fn:function Q(W,X){W.dataObj.sourceNodeRef=this.node.nodeRef;W.dataObj.parentNodeRef=this.destination;return true},scope:{node:U[1].value,destination:this.doclistMetadata.parent.nodeRef}}},onNewFolder:function x(T,W){var V=this.doclistMetadata.parent.nodeRef;var X=function R(Y,Z){E.get(Z.id+"-dialogTitle").innerHTML=this.msg("label.new-folder.title");E.get(Z.id+"-dialogHeader").innerHTML=this.msg("label.new-folder.header")};var P=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",{itemKind:"type",itemId:"cm:folder",destination:V,mode:"create",submitType:"json",formId:"doclib-common"});var S=new Alfresco.module.SimpleDialog(this.id+"-createFolder");S.setOptions({width:"33em",templateUrl:P,actionUrl:null,destroyOnHide:true,doBeforeDialogShow:{fn:X,scope:this},onSuccess:{fn:function U(Z){var aa;var ab=Z.config.dataObj.prop_cm_name;var Y=Z.json.persistedObject;aa={fileName:ab,nodeRef:Y,path:this.currentPath+(this.currentPath!=="/"?"/":"")+ab};this.modules.actions.postActivity(this.options.siteId,"folder-added","documentlibrary",aa);YAHOO.Bubbling.fire("folderCreated",{name:ab,parentNodeRef:V});Alfresco.util.PopupManager.displayMessage({text:this.msg("message.new-folder.success",ab)})},scope:this},onFailure:{fn:function Q(Y){if(Y){var Z=Y.config.dataObj.prop_cm_name;Alfresco.util.PopupManager.displayMessage({text:this.msg("message.new-folder.failure",Z)})}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.failure")})}S.widgets.cancelButton.set("disabled",false)},scope:this}});S.show();return S},onNewCollection:function v(R,U){var T=this.doclistMetadata.parent.nodeRef;Alfresco.util.PopupManager.displayMessage({text:this.msg("onNewCollection!",T)});var W=function X(Y,Z){E.get(Z.id+"-dialogTitle").innerHTML=this.msg("label.new-collection.title");E.get(Z.id+"-dialogHeader").innerHTML=this.msg("label.new-collection.header")};var P=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",{itemKind:"type",itemId:"ucm:collection",destination:T,mode:"create",submitType:"json",formId:"doclib-common"});Alfresco.util.PopupManager.displayMessage({text:this.msg(P)});var V=new Alfresco.module.SimpleDialog(this.id+"-createCollection");V.setOptions({width:"33em",templateUrl:P,actionUrl:null,destroyOnHide:true,doBeforeDialogShow:{fn:W,scope:this},onSuccess:{fn:function S(Z){var aa;var ab=Z.config.dataObj.prop_cm_name;var Y=Z.json.persistedObject;aa={fileName:ab,nodeRef:Y,path:this.currentPath+(this.currentPath!=="/"?"/":"")+ab};this.modules.actions.postActivity(this.options.siteId,"folder-added","documentlibrary",aa);YAHOO.Bubbling.fire("CollectionCreated",{name:ab,parentNodeRef:T});Alfresco.util.PopupManager.displayMessage({text:this.msg("message.new-folder.success",ab)})},scope:this},onFailure:{fn:function Q(Y){if(Y){var Z=Y.config.dataObj.prop_cm_name;Alfresco.util.PopupManager.displayMessage({text:this.msg("message.new-folder.failure",Z)})}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.failure")})}createFolder.widgets.cancelButton.set("disabled",false)},scope:this}});V.show();return V},onSyncToCloud:function p(S,T){var P=new Object();var Q=this.doclistMetadata.parent;P.displayName=Q.properties["cm:name"];P.nodeRef=Q.nodeRef;var R=new Object();R.isContainer=Q.isContainer;P.jsNode=R;this.onActionCloudSync(P)},onUnsyncFromCloud:function t(T,U){var P=new Object();var R=this.doclistMetadata.parent;var S=new Object();S.isContainer=R.isContainer;P.jsNode=S;var Q=new Object();Q.uri=R.nodeRef.replace(":/","");S.nodeRef=Q;P.displayName=R.properties["cm:name"];this.onActionCloudUnsync(P)},onFileUpload:function q(R,S){if(this.fileUpload===null){this.fileUpload=Alfresco.getFileUploadInstance()}var P={siteId:this.options.siteId,containerId:this.options.containerId,uploadDirectory:this.currentPath,filter:[],mode:this.fileUpload.MODE_MULTI_UPLOAD,thumbnails:"doclib",onFileUploadComplete:{fn:this.onFileUploadComplete,scope:this}};this.fileUpload.show(P);if(YAHOO.lang.isArray(S)&&S[1].tooltip){var Q=Alfresco.util.createBalloon(this.fileUpload.uploader.id+"-dialog",{html:S[1].tooltip,width:"30em"});Q.show();this.fileUpload.uploader.widgets.panel.hideEvent.subscribe(function(){Q.hide()})}},onFileUploadWithTooltip:function M(P,Q){this.onFileUpload(P,Q)},onFileUploadComplete:function A(P){var T=P.successful.length,Q,S;if(T>0){if(T<(this.options.groupActivitiesAt||5)){for(var R=0;R<T;R++){S=P.successful[R];Q={fileName:S.fileName,nodeRef:S.nodeRef};this.modules.actions.postActivity(this.options.siteId,"file-added","document-details",Q)}}else{Q={fileCount:T,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};this.modules.actions.postActivity(this.options.siteId,"files-added","documentlibrary",Q)}}},onSelectedItems:function r(U,T,S){var Q=T[0],R=T[1];if(this.modules.docList){var P=Alfresco.util.findEventClass(R);if(P&&(typeof this[P]=="function")){this[P].call(this,this.modules.docList.getSelectedFiles())}}C.preventDefault(Q)},onActionDelete:function s(P){var U=this,Q=[];if(typeof P.length==="undefined"){P=[P]}for(var T=0,R=P.length;T<R;T++){Q.push('<span class="'+(P[T].jsNode.isContainer?"folder":"document")+'">'+B(P[T].displayName)+"</span>")}var X=this.msg("title.multiple-delete.confirm"),S=this.msg("message.multiple-delete.confirm",P.length);S+='<div class="toolbar-file-list">'+Q.join("")+"</div>";Alfresco.util.PopupManager.displayPrompt({title:X,text:S,noEscape:true,modal:true,buttons:[{text:this.msg("button.delete"),handler:function W(){this.destroy();U._onActionDeleteConfirm.call(U,P)}},{text:this.msg("button.cancel"),handler:function V(){this.destroy()},isDefault:true}]})},_onActionDeleteConfirm:function l(P){var U=[],Q,T;for(Q=0,T=P.length;Q<T;Q++){U.push(P[Q].jsNode.nodeRef.nodeRef)}var S=function R(ab,W){var V;var aa=0;var Y=0;if(!ab.json.overallSuccess){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.multiple-delete.failure")});return}this.modules.docList.totalRecords-=ab.json.totalResults;YAHOO.Bubbling.fire("filesDeleted");for(Q=0,T=ab.json.totalResults;Q<T;Q++){V=ab.json.results[Q];if(V.success){if(V.type=="folder"){Y++}else{aa++}YAHOO.Bubbling.fire(V.type=="folder"?"folderDeleted":"fileDeleted",{multiple:true,nodeRef:V.nodeRef})}}var Z=Y+aa;if(Alfresco.util.isValueSet(this.options.siteId)){var X;if(Z>0){if(Z<this.options.groupActivitiesAt){for(Q=0;Q<Z;Q++){X={fileName:ab.json.results[Q].id,nodeRef:ab.json.results[Q].nodeRef,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};if(ab.json.results[Q].type=="folder"){this.modules.actions.postActivity(this.options.siteId,"folder-deleted","documentlibrary",X)}else{this.modules.actions.postActivity(this.options.siteId,"file-deleted","documentlibrary",X)}}}else{if(aa>0){X={fileCount:aa,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};this.modules.actions.postActivity(this.options.siteId,"files-deleted","documentlibrary",X)}if(Y>0){X={fileCount:Y,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};this.modules.actions.postActivity(this.options.siteId,"folders-deleted","documentlibrary",X)}}}}Alfresco.util.PopupManager.displayMessage({text:this.msg("message.multiple-delete.success",Z)})};this.modules.actions.genericAction({success:{callback:{fn:S,scope:this,obj:P}},failure:{message:this.msg("message.multiple-delete.failure")},webscript:{method:Alfresco.util.Ajax.DELETE,name:"files"},wait:{message:this.msg("message.multiple-delete.please-wait")},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{nodeRefs:U}}})},onActionDeselectAll:function N(){if(this.modules.docList){this.modules.docList.selectFiles("selectNone")}},onHideNavBar:function O(P,Q){this.options.hideNavBar=!this.widgets.hideNavBar.get("checked");this.widgets.hideNavBar.set("title",this.msg(this.options.hideNavBar?"button.navbar.show":"button.navbar.hide"));E.setStyle(this.id+"-navBar","display",this.options.hideNavBar?"none":"block");this.services.preferences.set(G,this.options.hideNavBar);if(P){C.preventDefault(P)}},onFolderUp:function i(R,S){var Q=this.currentPath.substring(0,this.currentPath.lastIndexOf("/")),P=this.currentFilter;P.filterData=Q;YAHOO.Bubbling.fire("changeFilter",P);C.preventDefault(R)},onFilterChanged:function H(T,U){this._handleSyncButtons();var R=U[1];if(R&&(typeof R.filterId!=="undefined")){R.filterOwner=R.filterOwner||Alfresco.util.FilterManager.getOwner(R.filterId);if(R.filterOwner){if(this.currentFilter.filterOwner!=R.filterOwner||this.currentFilter.filterId!=R.filterId){var Y=R.filterOwner.split(".")[1],X=Y+"_"+R.filterId;var V=YAHOO.util.Selector.query("div.hideable",E.get(this.id)),P;for(var S=0,Q=V.length;S<Q;S++){P=V[S];if(E.hasClass(P,Y)||E.hasClass(P,X)){E.removeClass(P,"toolbar-hidden")}else{E.addClass(P,"toolbar-hidden")}}}}Alfresco.logger.debug("DLTB_onFilterChanged","Old Filter",this.currentFilter);this.currentFilter=Alfresco.util.cleanBubblingObject(R);Alfresco.logger.debug("DLTB_onFilterChanged","New Filter",this.currentFilter);if(this.currentFilter.filterId=="path"||this.currentFilter.filterId=="category"){this.currentPath=w("/",this.currentFilter.filterData);this._generateBreadcrumb();var W=this.currentPath.split("/");if(this.currentPath==="/"){W=["/"]}if(this.widgets.folderUp){this.widgets.folderUp.set("disabled",W.length<2)}}else{this._generateDescription()}this._generateRSSFeedUrl()}},_handleSyncButtons:function h(){var P=E.get(this.id+"-syncToCloud-button");var T=E.get(this.id+"-unsyncFromCloud-button");var R=this.doclistMetadata.parent;if(R){var S=R.aspects;if(S){if(Alfresco.util.arrayContains(S,"sync:syncSetMemberNode")){E.removeClass(T,"hidden");E.addClass(P,"hidden")}else{E.removeClass(P,"hidden");E.addClass(T,"hidden")}}var Q=R.properties;if(Q&&(Q["cm:name"]==="documentLibrary"||Q["sync:directSync"]==="false")||this.options.syncMode!=="ON_PREMISE"){E.addClass(T,"hidden");E.addClass(P,"hidden")}}},onDeactivateAllControls:function m(R,Q){var P,S=Alfresco.util.disableYUIButton;for(P in this.widgets){if(this.widgets.hasOwnProperty(P)){S(this.widgets[P])}}},onDeactivateDynamicControls:function L(R,Q){var P,S=Alfresco.util.disableYUIButton;for(P in this.dynamicControls){if(this.dynamicControls.hasOwnProperty(P)){S(this.dynamicControls[P])}}},onUserAccess:function b(V,X){var Q=function Y(ak,aa){var aj,ao,am,ab,an,af,ai=false,Z,ad,ah;if(ak instanceof YAHOO.widget.MenuItem&&ak.element.firstChild){ai=true;aj=ak.element.firstChild.rel;Z=Alfresco.util.bind(ak.cfg.setProperty,ak.cfg,"className","");ad=Alfresco.util.bind(ak.cfg.setProperty,ak.cfg,"className","hidden")}else{aj=ak.get("value");Z=Alfresco.util.bind(ak.set,ak,"disabled",false);ad=Alfresco.util.bind(ak.set,ak,"disabled",true)}Z();if(typeof aj=="string"&&aj!==""){ao=aj.split(",");for(var ae=0,al=ao.length;ae<al;ae++){if(ao[ae].indexOf("|")!==-1){af=false;am=ao[ae].split("|");for(var ac=0,ag=am.length;ac<ag;ac++){ab=am[ac].split(":");an=ab[0];ah=ab.length==2?ab[1]=="true":true;if((aa[an]&&ah)||(!aa[an]&&!ah)){af=true;if(!ai){ak.set("activePermission",am[ac],true)}break}}if(!af){ad();break}}else{ab=ao[ae].split(":");an=ab[0];ah=ab.length==2?ab[1]=="true":true;if((aa[an]&&!ah)||(!aa[an]&&ah)){ad();break}}}}};var S=X[1];if(S&&S.userAccess){var T,W,P;for(W in this.widgets){if(this.widgets.hasOwnProperty(W)){T=this.widgets[W];if(T&&T.get("srcelement").className!="no-access-check"&&(!(T._button!=null&&T._button.className=="no-access-check"))){Q(T,S.userAccess);if(T.getMenu()!==null){P=T.getMenu().getItems();for(var R=0,U=P.length;R<U;R++){Q(P[R],S.userAccess)}}}}}}},onSelectedFilesChanged:function I(al,S){if(this.modules.docList){var W=this.modules.docList.getSelectedFiles(),R=[],ai,T,aj={},ah,X,am=this.widgets.selectedItems==null?null:this.widgets.selectedItems.getMenu().getItems(),V,Q,Z,ac,U,Y=[],ak=[],ae,aa,ad,ag;var af=function af(an){return(an.node.isContainer?"folder":"document")};for(ae=0,aa=W.length;ae<aa;ae++){ai=W[ae];ah=ai.node.permissions.user;for(X in ah){if(ah.hasOwnProperty(X)){aj[X]=(aj[X]===undefined?ah[X]:aj[X]&&ah[X])}}T=af(ai);if(!(T in R)){R[T]=true;R.push(T)}if(ae===0){Y=Alfresco.util.deepCopy(ai.node.aspects)}else{for(ad=0,ag=Y.length;ad<ag;ad++){if(!Alfresco.util.arrayContains(ai.node.aspects,Y[ad])){Alfresco.util.arrayRemove(Y,Y[ad])}}}for(ad=0,ag=ai.node.aspects.length;ad<ag;ad++){if(!Alfresco.util.arrayContains(ak,ai.node.aspects[ad])){ak.push(ai.node.aspects[ad])}}}for(X in am){if(am.hasOwnProperty(X)){V=am[X];U=false;if(V.element.firstChild){if(V.element.firstChild.rel&&V.element.firstChild.rel!==""){Q=V.element.firstChild.rel.split(",");for(ae=0,aa=Q.length;ae<aa;ae++){if(!aj[Q[ae]]){U=true;break}}}var P=E.getAttribute(V.element.firstChild,"data-has-aspects");if(P&&P!==""){P=P.split(",");for(ae=0,aa=P.length;ae<aa;ae++){if(!Alfresco.util.arrayContains(Y,P[ae])){U=true;break}}}var ab=E.getAttribute(V.element.firstChild,"data-not-aspects");if(ab&&ab!==""){ab=ab.split(",");for(ae=0,aa=ab.length;ae<aa;ae++){if(Alfresco.util.arrayContains(ak,ab[ae])){U=true;break}}}if(!U){if(V.element.firstChild.type&&V.element.firstChild.type!==""){Z=V.element.firstChild.type.split("|");for(ae=0;ae<Z.length;ae++){ac=Alfresco.util.arrayToObject(Z[ae].split(","));for(ad=0,ag=R.length;ad<ag;ad++){if(!(R[ad] in ac)){Z.splice(ae,1);--ae;break}}}U=(Z.length===0)}}V.cfg.setProperty("disabled",U)}}}if(this.widgets.selectedItems!=null){this.widgets.selectedItems.set("disabled",(W.length===0))}}},onDoclistMetadata:function y(Q,P){var R=P[1];this.folderDetailsUrl=null;if(R&&R.metadata){this.doclistMetadata=Alfresco.util.deepCopy(R.metadata);if(R.metadata.parent&&R.metadata.parent.nodeRef){this.folderDetailsUrl=u("folder-details?nodeRef="+R.metadata.parent.nodeRef)}}},onDropTargetOwnerRequest:function d(T,U){if(U&&U[1]&&U[1].elementId){var W=E.get(U[1].elementId);var P=E.get(this.id+"-breadcrumb");if(E.isAncestor(P,W)){var Q="";var X=this.currentPath.split("/");for(var S=0,R=P.children.length;S<R;S++){if(S%2==0){Q=Q+"/"+X[S/2]}if(W==P.children[S]){break}}var V=this.doclistMetadata.container+Q;U[1].callback.call(U[1].scope,V,Q)}}},onDocumentDragOver:function c(S,R){if(R&&R[1]&&R[1].elementId){var Q=E.get(R[1].elementId);var P=E.get(this.id+"-breadcrumb");if(E.isAncestor(P,Q)){E.addClass(Q,"documentDragOverHighlight");var U=E.getFirstChild(Q);if(U!=null&&U.tagName!="SPAN"){var T=document.createElement("span");E.addClass(T,"documentDragOverArrow");E.insertBefore(T,U)}}}},onDocumentDragOut:function n(S,R){if(R&&R[1]&&R[1].elementId){var Q=E.get(R[1].elementId);var P=E.get(this.id+"-breadcrumb");if(E.isAncestor(P,Q)){E.removeClass(Q,"documentDragOverHighlight");var T=E.getFirstChild(Q);if(T!=null&&T.tagName=="SPAN"){Q.removeChild(T)}}}},_generateBreadcrumb:function o(){var W=E.get(this.id+"-breadcrumb");if(W===null){return}W.innerHTML="";var ae=this.currentPath.split("/");if(this.currentPath==="/"){ae=["/"]}var X=this,Z=ae.concat();Z[0]=Alfresco.util.message("node.root",this.currentFilter.filterOwner);var Y=function Q(ah,ag){E.addClass(ah.target.parentNode,"highlighted");C.stopEvent(ah)};var af=function T(ai,ah){var ag=X.currentFilter;ag.filterData=ah;YAHOO.Bubbling.fire("changeFilter",ag);C.stopEvent(ai)};var ac=new g(W),U,V,P,ad;for(var S=0,R=ae.length;S<R;++S){U=ae.slice(0,S+1).join("/");V=new g(document.createElement("div"));V.addClass("crumb");V.addClass("documentDroppable");V.addClass("documentDroppableHighlights");if(S>0){P=new g(document.createElement("a"),{href:"#",innerHTML:"&nbsp;"});P.on("click",af,U);P.addClass("icon");P.addClass("filter-"+B(this.currentFilter.filterId));V.appendChild(P)}if(R-S<2){ad=new g(document.createElement("span"),{innerHTML:(this.folderDetailsUrl)?'<a href="'+this.folderDetailsUrl+'">'+B(Z[S])+"</a>":B(Z[S])});ad.addClass("label");V.appendChild(ad);ac.appendChild(V)}else{ad=new g(document.createElement("a"),{href:"",innerHTML:B(Z[S])});ad.addClass("folder");ad.on("click",af,U);V.appendChild(ad);ac.appendChild(V);ac.appendChild(new g(document.createElement("div"),{innerHTML:"&gt;",className:"separator"}))}}var ab=E.get(this.id+"-breadcrumb");var aa=E.getElementsByClassName("crumb","div",ab);for(var S=0,R=aa.length;S<R;S++){new YAHOO.util.DDTarget(aa[S])}},_generateDescription:function f(){var R,U,Q,P,S;R=E.get(this.id+"-description");if(R===null){return}while(R.hasChildNodes()){R.removeChild(R.lastChild)}S=typeof this.currentFilter.filterDisplay!=="undefined"?this.currentFilter.filterDisplay:(this.currentFilter.filterData||"");Q=new g(document.createElement("div"),{innerHTML:this.msg("description."+this.currentFilter.filterId,S)});Q.addClass("message");var V="description."+this.currentFilter.filterId+".more",T=V+".filterDisplay";if(S!==""&&this.msg(T)!==T){V=T}P=new g(document.createElement("span"),{innerHTML:this.msg(V,B(S))});P.addClass("more");Q.appendChild(P);U=new g(R);U.appendChild(Q)},_getRssFeedUrl:function k(){var P=YAHOO.lang.substitute("{type}/site/{site}/{container}",{type:this.modules.docList.options.showFolders?"all":"documents",site:encodeURIComponent(this.options.siteId),container:encodeURIComponent(this.options.containerId)});P+="?filter="+encodeURIComponent(this.currentFilter.filterId);if(this.currentFilter.filterData){P+="&filterData="+encodeURIComponent(this.currentFilter.filterData)}P+="&format=rss";return Alfresco.constants.URL_FEEDSERVICECONTEXT+"components/documentlibrary/feed/"+P},_generateRSSFeedUrl:function j(){if(this.widgets.rssFeed&&this.modules.docList){var P=this._getRssFeedUrl();this.widgets.rssFeed.set("href",P);Alfresco.util.enableYUIButton(this.widgets.rssFeed)}}},true)})();