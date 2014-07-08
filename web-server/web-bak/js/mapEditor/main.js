Jx().$package("mapEditor.main",function(J) {

	var TRANSPARENT_BG="style/map/trans_bg.png";
	var $D = J.dom,
	$E = J.event;
	//初始化
	this.init=function(){
		createWinManager.init();
		layerManager.init();
		zoomManager.init();
		stage.init();

		imgsManager.init();
		imgsManager.show();
		blockSelectedManager.init();
		codeManager.init();
		newAndSaveManager.init();

	}

	//代码生成管理
	var codeManager={
		init:function(){
			var self=this;
			this.area=$D.id("code");
			this.win=$D.id("codeWinWrap");
			this.closeBtn=$D.tagName("a",this.win)[0];
			this.createBtn=$D.id("create");
		
			$E.addOriginalEventListener(this.closeBtn,"click",function(){
				self.close();
			})
			$E.addOriginalEventListener(this.createBtn,"click",function(){
				self.create();
			})
		},
		create:function(){
			var arr=$D.tagName("li",layerManager.area);
			$E.notifyObservers(layerManager,"updateLayerOrder",arr);

			var layersObj=stage.getLayers();
			var layers = this.parseLayers(layersObj);//生成的layer数组
			this.show(layers);
		},
		parseLayers:function(lo){
			var list=[];
			
			for(var name in lo){
				if(lo.hasOwnProperty(name)&&lo[name]){
					
					var l=lo[name];
					var newLayerObj={};
					var seo=l.getStageElements();
					newLayerObj.layerElementsArr=this.parseStageElements(seo);
					var i=0;
					for(var n in seo){
						if(seo.hasOwnProperty(n)&&seo[n]){
							var s=seo[n];
							var br=s.getBlockRanges();
							newLayerObj.layerElementsArr[i].blockRangesArr=this.parseBlockRanges(br);
							i++;
						}
					}

					newLayerObj.size=[l.getWidth(),l.getHeight()];
					newLayerObj.zIndex=l.area.getAttribute("oriZ");
					
					list.push(newLayerObj);
				}
				
			}
			return list;
		},
		show:function(layers){
			this.area.innerHTML=JSON.stringify(layers,null,2);
			$D.setStyle(this.win,"display","block");
		},
		close:function(){
			$D.setStyle(this.win,"display","none");
		},
		parseStageElements:function(seo){
			var list=[];
			for(var name in seo){	
				if(seo.hasOwnProperty(name)&&seo[name]){
					var se=seo[name];
					var newSeObj={};
					var src=se.src;
					newSeObj.pos=[se.getX(),se.getY()];
					newSeObj.size=[se.getWidth(),se.getHeight()];
					newSeObj.src=src.slice(src.indexOf("style"));
					list.push(newSeObj);
				}
			}	
			return list;	
		},	
		parseBlockRanges:function(bro){
			var list=[];
			for(var name in bro){	
				if(bro.hasOwnProperty(name)&&bro[name]){
					var se=bro[name];
					var newSeObj={};
					newSeObj.pos=[se.getX(),se.getY()];
					newSeObj.size=[se.getWidth(),se.getHeight()];
					list.push(newSeObj);
				}
			}	
			return list;	
		}			
	};

	//新建 保存
	var newAndSaveManager={
		init:function(){
			var self=this;
			this.saveWin=$D.id("saveWinWrap");
			this.openWin=$D.id("openWinWrap");

			this.openBtn=$D.id("openBtn");
			this.closeOpenBtn=$D.tagName("a",this.openWin)[0];
			this.openConfirmBtn=$D.id("openConfirmBtn");

			this.saveBtn=$D.id("saveBtn");
			this.closeSaveBtn=$D.tagName("a",this.saveWin)[0];
			this.saveConfirmBtn=$D.id("saveConfirmBtn");


			$E.addOriginalEventListener(this.saveBtn,"click",function(){
				self.showWin(self.saveWin);
			});

			$E.addOriginalEventListener(this.closeSaveBtn,"click",function(){
				self.closeWin(self.saveWin);
			});

			$E.addOriginalEventListener(this.saveConfirmBtn,"click",function(){
				self.confirmSave();
			});

			$E.addOriginalEventListener(this.openBtn,"click",function(){
				self.initOpenSelector();
				self.showWin(self.openWin);
			});

			$E.addOriginalEventListener(this.closeOpenBtn,"click",function(){
				self.closeWin(self.openWin);
			});

			$E.addOriginalEventListener(this.openConfirmBtn,"click",function(){
				self.confirmOpen();
			});
		},
		initOpenSelector:function(){
			var selector=$D.id("mapSelector");
			selector.innerHTML="";
			for(var i=0,l=window.localStorage.length;i<l;i++){
				var k=window.localStorage.key(i);
				var option=$D.node("option");
				option.innerHTML=k;
				selector.appendChild(option);
			}	
		},
		confirmSave:function(){
			var saveObj={};
	
			var mn=$D.id("mapName").value;
			
			saveObj.stageAreaHTML=stage.area.innerHTML;
			saveObj.zoom=stage.zoom;
			saveObj.layerId=layerManager.layerId;
			saveObj.layerManagerAreaHTML=layerManager.area.innerHTML;
			saveObj.currentLayerId=stage.currentLayerId;
			saveObj.sumWv=zoomManager.sumWv;
			saveObj.layerWidth=layerManager.layerWidth;
			saveObj.layerHeight=layerManager.layerHeight;

			
			J.localStorage.setItem(mn,JSON.stringify(saveObj));
			this.closeWin(this.saveWin);
		},
		confirmOpen:function(){
			var selector=$D.id("mapSelector");
			var selectedMap=selector.value;
			var saveObj=JSON.parse(J.localStorage.getItem(selectedMap)); 
			
			stage.area.innerHTML=saveObj.stageAreaHTML;
			
			layerManager.area.innerHTML=saveObj.layerManagerAreaHTML;

			//layerManager.init();
			layerManager.recoverLayers();

			//stage.init();
			stage.layersObj={};
			stage.zoom=saveObj.zoom;
			stage.recoverLayers();
			stage.currentLayerId=saveObj.currentLayerId;
			layerManager.layerId=saveObj.layerId;
			layerManager.selectLayer(saveObj.currentLayerId);
			layerManager.layerHeight=saveObj.layerHeight;
			layerManager.layerWidth=saveObj.layerWidth;
			zoomManager.sumWv=saveObj.sumWv;
			
			//stage.onZoomChanged();

			this.closeWin(this.openWin);
		},
		showWin:function(win){
			$D.setStyle(win,"display","block");
		},
		closeWin:function(win){
			$D.setStyle(win,"display","none");
		}
	}

	//障碍物勾选
	var blockSelectedManager={
		init:function(){
			var self=this;
			this.elem=$D.id("blockSelect");
			this.isSelected=false;
			$E.addOriginalEventListener(this.elem,"click",function(){
				if(!self.isSelected){
					self.onSelected();
				}
				else{
					self.onCanceled();
				}
			})
		},
		onSelected:function(){
			this.isSelected=true;
			this.elem.innerHTML="取消勾选";
		},
		onCanceled:function(){
			this.isSelected=false;
			this.elem.innerHTML="勾选障碍区域";
		}



	}

	//窗体管理
	var createWinManager={
		init:function(){
			var self=this;
			this.win=$D.id("newWinWrap");
			this.widthInput=$D.id("width");
			this.heightInput=$D.id("height");
			this.confirmBtn=$D.id("confirm");
			this.closeBtn=$D.tagName("a",this.win)[0];
			$E.addOriginalEventListener(this.confirmBtn,"click",function(){
				self.confirm();
			});
			$E.addOriginalEventListener(this.closeBtn,"click",function(){
				self.close();
			});
		},
		close:function(){
			$D.setStyle(this.win,"display","none");
		},
		show:function(){
			$D.setStyle(this.win,"display","block");
		},
		confirm:function(){
			this.hide();
			$E.notifyObservers(this,"layerSizeConfirm",{
				width:widthInput.value,
				height:heightInput.value
			});
		},
		hide:function(){
			$D.setStyle(this.win,"display","none");
		}
	}


	var DragObj=J.Class({
		init:function(options){
			var elem=options.elem;
			this.elem=elem; 
		},
		//拖动事件处理程序
		onStartDrag:function(e){
			var mouseX=e.x,mouseY=e.y;
			
			this.preX=this.getX();
			this.preY=this.getY();
	
			this.mouseToElX = mouseX-this.getX();
			this.mouseToElY = mouseY-this.getY();
			this.updatePos(mouseX,mouseY);	
		},
		updatePos:function(mx,my){
			var el=this.elem;

			this.setX(mx-this.mouseToElX);
			this.setY(my-this.mouseToElY);

		},
		onDragging:function(e){
			var mouseX=e.x,mouseY=e.y;
			var elem=this.elem;
			$D.setStyle(elem,"position","absolute");
			this.updatePos(mouseX,mouseY);

		},
		onEndDrag:function(e){

		},
		setWidth:function(w){
			w=w||0;
			$D.setStyle(this.elem,"width",w+"px");
		},
		setHeight:function(h){
			h=h||0;
			$D.setStyle(this.elem,"height",h+"px");
		},
		getWidth:function(){
			return parseInt(this.elem.clientWidth);
		},
		getHeight:function(){
			return parseInt(this.elem.clientHeight);
		},
		getX:function(){
			return parseInt(this.elem.style.left);
			//var pos=this.elem.getBoundingClientRect();
			//return parseInt(pos.left);
		},
		getY:function(){
			return parseInt(this.elem.style.top);
		},
		setX:function(x){
			$D.setStyle(this.elem,"left",x + "px");
		},
		setY:function(y){
			$D.setStyle(this.elem,"top",y +"px");
		},
		recover:function(){
			this.setX(this.preX);
			this.setY(this.preY);
		},
		getParent:function(){
			return this.elem.parentNode;
		}	
	});
	var ScaleDragObj=J.Class({extend:DragObj},{
		init:function(options){
			ScaleDragObj.superClass.init.call(this,options);
		},
		onStartDrag:function(e){
			var mouseX=e.x,mouseY=e.y;
			var elem=this.elem;
			var zoom=stage.zoom;
			this.preX=this.getX();
			this.preY=this.getY();
			
			$D.setStyle(elem,"position","absolute");
			this.mouseToElX = mouseX/zoom-this.getX();
			this.mouseToElY = mouseY/zoom-this.getY();
			this.updatePos(mouseX,mouseY);	
		},
		updatePos:function(mx,my){
			var el=this.elem;
			var zoom=stage.zoom;
			this.setX(mx/zoom-this.mouseToElX);
			this.setY(my/zoom-this.mouseToElY);

		}


	});


	var BlockRange=J.Class({extend:DragObj},{
		init:function(options){
			var self=this;
			var zoom=stage.zoom;
			var x=options.x,y=options.y,brId=options.brId;
			BlockRange.superClass.init.call(this,options);
			if(!this.elem)
				this.elem=$D.node("div",{brId:brId,style:"left:"+x+"px;"+"top:"+y+"px;"+"position:absolute;background:green;opacity:0.6;"});

			this.brId=brId;
			$E.addObserver(this,"resize",function(e){
				self.onResize(e);
			})
		},
		onResize:function(e){
			var x=this.getX(),y=this.getY();
			this.setWidth(e.x-x);
			this.setHeight(e.y-y);
		}


	});
	//判断是否在改变某个舞台元素上的障碍区域
	var isChangeOnElement=function(changingRange,stageElement){
		return changingRange&&changingRange.elem.parentNode==stageElement.elem;
	};
	var changingRange;//正在resize的blockRange
	//舞台元素
	var StageElement=J.Class({extend:ScaleDragObj},{
		init:function(options){
			var self=this;
			StageElement.superClass.init.call(this,options);
			this.brId=0;
			this.blockObj={};
			this.layer=options.layer;
			this.src=options.src;

			this.elem.setAttribute("imgSrc",this.src);//保存背景图片src用于恢复

			//障碍物的删除按钮
			var removeBtn=$D.node("a",{href:"javascript:"});
			removeBtn.innerHTML="X";
			this.elem.appendChild(removeBtn);
			$E.addOriginalEventListener(removeBtn,"click",function(e){
				self.onRemove();
				e.stopPropagation();
			});
			$E.addOriginalEventListener(this.elem,"mouseover",function(){
				$D.setStyle(removeBtn,"display","block");
			});
			$E.addOriginalEventListener(this.elem,"mouseout",function(){
				$D.setStyle(removeBtn,"display","none");
			});

			$E.addObserver(this,"selected",function(){
				self.onSelected();
			});

			$E.addObserver(this,"removeSelected",function(){
				self.onRemoveSelected();
			});

			$E.addOriginalEventListener(this.elem,"mousedown",function(e){

				if(blockSelectedManager.isSelected){
					self.createRange(e);
					e.stopPropagation();
				}
				e.preventDefault();
				
			});
			$E.addOriginalEventListener(document,"mousemove",function(e){
				if(blockSelectedManager.isSelected&&isChangeOnElement(changingRange,self)){
					self.changeRange(e);
					//e.stopPropagation();
				}	
			});	
			$E.addOriginalEventListener(document,"mouseup",function(e){
				if(blockSelectedManager.isSelected&&isChangeOnElement(changingRange,self)){
					//self.finishRange(e);
					changingRange=null;
				}	
			
			});
		},
		recoverBlockRanges:function(){
			var brs=$D.tagName("div",this.elem);
		
			for(var i=0,l=brs.length;i<l;i++){
				var br=brs[i];
				if(br.parentNode!=this.elem) continue;
				brId=br.getAttribute("brId");

				var brObj=new BlockRange({brId:brId,elem:br});
				this.blockObj[brId]=brObj;
			}
			this.brId=brs.length;
		},
		getBlockRanges:function(){
			return this.blockObj;
		},
		onRemove:function(){
			var id=this.elem.getAttribute("seId");
			$E.notifyObservers(this.layer,"elementRemoved",id);
		},
		onSelected:function(){
			//$D.setStyle(this.elem,"border","1px #000 solid");
			$D.addClass(this.elem,"selected");
		},
		onRemoveSelected:function(){
			$D.removeClass(this.elem,"selected");
			//$D.setStyle(this.elem,"border","none");
		},
		createRange:function(e){
			var zoom=stage.zoom;

			var x=(e.x-stage.getLayerX())/zoom-this.getX(),y=(e.y-stage.getLayerY())/zoom-this.getY();//range相对于障碍物图片位置
			console.log(stage.getLayerY());
			var r=new BlockRange({x:x,y:y,brId:this.brId});
			this.blockObj[this.brId]=r;
			changingRange=r;
			this.brId++;
			this.elem.appendChild(r.elem);
		},
		changeRange:function(e){
			var zoom=stage.zoom;
			var x=(e.x-stage.getLayerX())/zoom-this.getX(),y=(e.y-stage.getLayerY())/zoom-this.getY();//range相对于障碍物图片位置
			$E.notifyObservers(changingRange,"resize",{x:x,y:y});
		},
		//修复障碍物尺寸
		finishRange:function(e){
			var el=changingRange;
			var ex=el.getX();
			var ey=el.getY();
			var ew=el.getWidth();
			var eh=el.getHeight();
			var w=this.getWidth();
			var h=this.getHeight();
			if(ex+ew>w) el.setWidth(w-ex);
			if(ey+eh>h) el.setHeight(h-ey);
		},
		destory:function(){

		},
		clone:function(){
			var newEl=this.elem.cloneNode();
			var nse=new StageElement({elem:newEl,layer:this.layer,src:this.src});
			//复制障碍物区域
			var brArr=$D.tagName("div",this.elem);
			for(var i=0;i<brArr.length;i++){
				newEl.appendChild(brArr[i].cloneNode());
			}
			
			nse.blockObj=this.blockObj;
			nse.brId=this.brId;
			nse.setX(this.getX()+20);
			nse.setY(this.getY()+20);
			return nse;
		}

	});
	var dragingLayerNode;
	var SelectLayer=J.Class({extend:DragObj},{
		init:function(options){
			this.layerId=options.layerId;
			var area=options.area;
			var self=this;
			if(!options.elem){//没有传入则创建
				var newLayerNode=$D.node("li",{layerId:this.layerId});
				newLayerNode.innerHTML="图层:"+this.layerId
					   			   +"<a href='javascript:' class='close'>x</a>";
				area.appendChild(newLayerNode);
				options.elem=newLayerNode;
			}

			SelectLayer.superClass.init.call(this,options);


		},
		updatePos:function(mx,my){
			var el=this.elem;
			this.setY(my-this.mouseToElY);

		},
		onEndDrag:function(e){
			
			var arr=$D.tagName("li",layerManager.area);
			var elem=this.elem;
			var area=layerManager.area;
			var ulHead=18;
			var top=this.getY();
			var h=this.getHeight();

			
			//位置超过第一个layer
			if(top<ulHead){
				area.insertBefore(elem,arr[0]);
			}
			//位置低于最后一个layer
			else if(top>h*(arr.length-1)+ulHead){
				area.appendChild(elem);
			}
			else{
				for(var i=0;i<arr.length;i++){
					var el=arr[i];
					if(el==elem) continue;
					if(el.offsetTop<top&&el.offsetTop+h>top){
						//移动到某元素上半区
						if(top-el.offsetTop<h/2){
							area.insertBefore(elem,el);
						}
						//移动到某元素下半区
						else{
							area.insertBefore(elem,arr[i+1]);

						}
					}
				}
			}
			$D.setStyle(this.elem,"position","static");
			$E.notifyObservers(layerManager,"updateLayerOrder",arr);
		}
	});



	//图层管理器
	var layerManager={
		init:function(options){
			var self=this;
			options=options||{};
			this.layerNodeArr=options.layerNodeArr||[];
			this.layerId=options.layerId||1;
			this.area=$D.id("layersArea");
			this.addBtn=$D.id("addLayerBtn");

			$E.addOriginalEventListener(this.addBtn,"click",function(e){
				if(!self.layerNodeArr.length){
					createWinManager.show();
					return;
				} 
				self.addLayer();
				e.stopPropagation();
			});
			$E.addOriginalEventListener(this.area,"click",function(e){
				var target=e.target||e.srcElement;
				var parent=target.parentNode;
				if(target.tagName=="A"&&parent.tagName=="LI"){
					var id=parent.getAttribute("layerId");
					self.removeLayer(id);
				}
			});
			$E.addOriginalEventListener(this.area,"click",function(e){
				var target=e.target||e.srcElement;
				if(target.tagName=="LI"){
					var id=target.getAttribute("layerId");
					self.selectLayer(id);
				}
			});
			$E.addOriginalEventListener(this.area,"mousedown",function(e){
				var target=e.target||e.srcElement;
				if(target.tagName=="LI"){
					var id=target.getAttribute("layerId");
					dragingLayerNode=self.getLayerNode(id);
					self.selectLayer(id);

					var el=dragingLayerNode.elem;
					$D.setStyle(el,"left",el.offsetLeft +"px");
					$D.setStyle(el,"top",el.offsetTop +"px");
					dragingLayerNode.onStartDrag(e);
				}
				e.preventDefault();
				e.stopPropagation();
			});
			$E.addOriginalEventListener(document,"mousemove",function(e){
				if(dragingLayerNode){
					dragingLayerNode.onDragging(e);
				}
				e.stopPropagation();
			});		
			$E.addOriginalEventListener(document,"mouseup",function(e){
				if(dragingLayerNode){
					dragingLayerNode.onEndDrag(e);
					//self.selectLayer(dragingLayerNode.layerId);
				}
				dragingLayerNode=null;
				e.stopPropagation();
			});	
			$E.addObserver(createWinManager,"layerSizeConfirm",function(e){
				var width=e.width;
				var height=e.height;
				self.layerWidth=width;
				self.layerHeight=height;
				self.addLayer("style/map/trans_bg.png");
			})				
		},
		clone:function(){
			var newStage={};
			for(var name in this){
				if(this.hasOwnProperty(name)){
					newStage[name]=this[name];
				}
			}
			return newStage;
		},
		getLayerNode:function(id){
			var list=this.layerNodeArr;
			for(var i=0,l=list.length;i<l;i++){
				if(list[i].layerId==id){
					return list[i];
				}
			}
		},
		removeLayerNode:function(id){
			var list=this.layerNodeArr;
			for(var i=0,l=list.length;i<l;i++){
				if(list[i].layerId==id){
					list.splice(i,1);
					return;
				}
			}
		},
		getLastLayerId:function(){
			var list=$D.tagName("li",this.area);
			var lastElem=list[list.length-1];
			if(lastElem)
				return lastElem.getAttribute("layerId");
			return null;

		},
		removeLayer:function(id){

			var l=this.getLayerNode(id);
			this.area.removeChild(l.elem);
			this.removeLayerNode(id);
			$E.notifyObservers(this,"layerRemoved",id);
			var lastId=this.getLastLayerId();
			if(lastId) this.selectLayer(lastId);
		},
		recoverLayers:function(){
			var area=this.area;
			var layers=$D.tagName("li",area);
			for(var i=0,l=layers.length;i<l;i++){
				var layerId=layers[i].getAttribute("layerId");
				var newLayer=new SelectLayer({layerId:layerId,area:this.area,elem:layers[i]});
				this.layerNodeArr.push(newLayer);
			}
		},
		addLayer:function(bg){
			
			var newLayer=new SelectLayer({layerId:this.layerId,area:this.area});
			this.layerNodeArr.push(newLayer);
			
			$E.notifyObservers(this,"layerAdded",{
				id:this.layerId,
				bg:bg,
				width:this.layerWidth,
				height:this.layerHeight
			});
			
			this.selectLayer(this.layerId);
			this.layerId++;
		},
		selectLayer:function(id){
			var sl=this.getLayerNode(this.selectedLayerId);///上次选择的图层
			var l=this.getLayerNode(id);
			if(!l||(sl&&sl==l)) return;
		
			if(sl) {
				var slId=sl.layerId;
				$D.removeClass(sl.elem,"selected");
				$E.notifyObservers(this,"cancelLayerSelected",slId);
			}
			
			this.selectedLayerId=l.layerId;
			$D.addClass(l.elem,"selected");
			$E.notifyObservers(this,"layerSelected",{id:id,z:99});///选中层的zIndex设置为下一layerId的值
				
		}
	}

	var keyNameObj={
		"67":"c",
		"86":"v"
	}
	//舞台对象
	var stage={
		init:function(){
			var self=this;
			this.area=$D.id("elStage");
			this.zoom=1;
			this.layersObj={};
		
		
			$E.addObserver(this,"zoomChanged",function(wv){
				self.onZoomChanged(wv);
			});
			$E.addObserver(layerManager,"updateLayerOrder",function(arr){
				self.onUpdateLayerOrder(arr);
			});		
			$E.addObserver(layerManager,"layerAdded",function(options){
				var id=options.id;
				var bg=options.bg;
				var w=options.width;
				var h=options.height;
				self.onAddLayer(id,bg,w,h);
			});	
			$E.addObserver(layerManager,"layerRemoved",function(id){
				self.onRemoveLayer(id);
			});
			$E.addObserver(layerManager,"layerSelected",function(options){
				self.onSelectLayer(options);
			});
			$E.addObserver(layerManager,"cancelLayerSelected",function(id){
				self.onCancelLayerSelected(id);
			});

			$E.addOriginalEventListener(this.area,"click",function(){
				if(!stage.getCurrentLayer()){
					//createWinManager.show();
				}
			});
			$E.addOriginalEventListener(document,"keydown",function(e){
				var kn = keyNameObj[e.keyCode];
				if(e.ctrlKey&&kn=="c"){
					self.cloneSE=self.getCurrentLayer().getCurrentSelectedElement();
				}
				if(e.ctrlKey&&kn=="v"){
					if(!self.cloneSE) return;
					var cSe=self.cloneSE.clone();
					var l=self.getCurrentLayer();
					var preSe=l.getCurrentSelectedElement();
					if(preSe)
						$E.notifyObservers(preSe,"removeSelected");
					$E.notifyObservers(cSe,"selected");
					l.preSelectedSe=cSe;
					l.add(cSe);
				}
			})	
		},
		clone:function(){
			var newStage={};
			for(var name in this){
				if(this.hasOwnProperty(name)){
					newStage[name]=this[name];
				}
			}
			return newStage;
		},
		getLayers:function(){
			return this.layersObj;
		},
		isLayerSelected:function(l){
			return l.area.style.zIndex == 99;
		},
		onUpdateLayerOrder:function(arr){
			for(var i=0;i<arr.length;i++){
				var l=this.getLayer(arr[i].getAttribute("layerId"));
				i==0?l.setTransparentBackground(TRANSPARENT_BG):l.setTransparentBackground("");//第一层具有透明背景图案

				if(!this.isLayerSelected(l)){
					$D.setStyle(l.area,"zIndex",i);
				}
				l.area.setAttribute("oriZ",i);
			}

		},
		recoverLayers:function(){
			var layers=$D.tagName("div",this.area);

			for(var i=0,l=layers.length;i<l;i++){
				if(layers[i].parentNode!=stage.area) continue;
				var layerId=layers[i].getAttribute("layerId");
				var newLayer=new StageLayer({area:layers[i],layerId:layerId});
				newLayer.recoverStageElements();
				newLayer.setZoom(stage.zoom);
				this.layersObj[layerId]=newLayer;
			
			}
		},
		onSelectLayer:function(options){
			var id=options.id;
			var z=options.z;
			var l=this.layersObj[id];
			//删除之前选择的层里的所有障碍物元素的选择
			if(this.currentLayerId){
				var currentLayer=this.getLayer(this.currentLayerId);
				if(currentLayer){
					$E.notifyObservers(currentLayer,"removeAllSelected");
				}
			}
			$D.setStyle(l.area,"zIndex",z);
			this.currentLayerId=l.layerId;			
		},
		onCancelLayerSelected:function(id){
			var l=this.layersObj[id];
			$D.setStyle(l.area,"zIndex",id);	
		},
		onRemoveLayer:function(id){
			var l=this.layersObj[id];
			this.area.removeChild(l.area);
			this.layersObj[id]=null;
		},
		onAddLayer:function(id,bg,w,h){
			//if(!this.getCurrentLayer()) this.area.innerHTML="";
			
			var newNode=$D.node("div",{
				layerId:id,
				isLayer:true,
				style:"z-index:"+id+";"
					  +"width:"+w+"px;"
					  +"height:"+h+"px;"
					  +"position:absolute;"
					  +"left:50%;"
					  +"top:50%;"
					  +"margin-top:"+(-h/2)+"px;"
					  +"margin-left:"+(-w/2)+"px;"
			});
			//if(bg) $D.setStyle(newNode,"background","url('"+bg+"')");


			var nl=new StageLayer({area:newNode,layerId:id});
			nl.setZoom(stage.zoom);
			this.layersObj[id]=nl;
			this.area.appendChild(newNode);

			var arr=$D.tagName("li",layerManager.area);
			$E.notifyObservers(layerManager,"updateLayerOrder",arr);

			return nl;
		},
		getLayer:function(layerId){
			return this.layersObj[layerId];
		},
		getLayerX:function(){
			var l=this.getCurrentLayer();
			return l&&l.getX();
		},
		getLayerY:function(){
			var l=this.getCurrentLayer();
			return l&&l.getY();
		},
		isInnerLayer:function(elem){
			var l=this.getCurrentLayer(); 
			return l&&l.isInnerLayer(elem);
		},
		onZoomChanged:function(wheelValue){
			var zoom=1+0.05*wheelValue;
			this.zoom=zoom;	
		},
		getCurrentLayer:function(){
			var currentLayer=this.getLayer(this.currentLayerId);
			return currentLayer;
		}
	};
	var StageLayer=J.Class({
		init:function(options){
			var self=this;
			this.seId=0;
			this.area=options.area;
			this.layerId=options.layerId;

			var pos=this.area.getBoundingClientRect();//对象相对于window位置对象
			this.x = pos.left;
			this.y = pos.top; 

			this.stageElementObj={};

			$E.addObserver(this,"elementAdd",function(dragingEl){
				var se=new StageElement({elem:dragingEl.elem,layer:self,src:dragingEl.src});
				this.add(se);
			});
			$E.addObserver(this,"elementRemoved",function(id){
				self.onRemoveElement(id);
			});	
			$E.addObserver(stage,"zoomChanged",function(){
				self.onZoomChanged();
			});

			$E.addOriginalEventListener(this.area,"mousedown",function(e){
				var target=e.target||e.srcElement;
			
				if(isBlockEl(target)||isBlockEl(target=target.parentNode)){
					var seId=target.getAttribute("seId");
					var se=self.get(seId);	
					se.onStartDrag(e);
					dragingEl=se;	
					e.preventDefault();		
				}
			});
			$E.addOriginalEventListener(document,"mousemove",function(e){
				if(dragingEl){
					dragingEl.onDragging(e);
				}
			});	
			$E.addOriginalEventListener(this.area,"mouseup",function(e){
				if(dragingEl){
					dragingEl.onEndDrag(e);
					if(!stage.isInnerLayer(dragingEl)){
						dragingEl.recover();
					}
				}
				dragingEl=null;
				//e.stopPropagation();

			});
			$E.addOriginalEventListener(this.area,"click",function(e){
				var target=e.target||e.srcElement;
				if(isBlockEl(target)||isBlockEl(target=target.parentNode)){
					var se=self.get(target.getAttribute("seId"));
					if(!se) return;
					if(self.preSelectedSe){
						$E.notifyObservers(self.preSelectedSe,"removeSelected");
					}
					$E.notifyObservers(se,"selected");
					self.preSelectedSe=se;
				}
			});	
			$E.addObserver(this,"removeAllSelected",function(){
				self.onRemoveAllSelected();
			})		
		},
		setTransparentBackground:function(url){
			$D.setStyle(this.area,"background","url('"+url+"')");
		},
		recoverStageElements:function(){
			var seArr=$D.tagName("div",this.area);
			for(var i=0,l=seArr.length;i<l;i++){
				var se=seArr[i];
				if(se.parentNode!=this.area) continue;
				var seId=se.getAttribute("seId");
				//删除删除按钮 避免重复生成
				var closeBtn=$D.tagName("a",se)[0];
				if(closeBtn) se.removeChild(closeBtn);

				var src=se.getAttribute("imgSrc");
			
				var newSe=new StageElement({elem:se,layer:this,src:src});
				newSe.recoverBlockRanges();
				this.stageElementObj[seId]=newSe;
				this.seId++;
			}
			
		},
		onRemoveAllSelected:function(){
			var obj=this.stageElementObj;
			for(var name in obj){
				if(obj.hasOwnProperty(name)&&obj[name]){
					$E.notifyObservers(obj[name],"removeSelected");
				}
			}
		},
		onRemoveElement:function(id){

			this.area.removeChild(this.stageElementObj[id].elem);
			this.stageElementObj[id]=null;
		},
		getCurrentSelectedElement:function(){
			return this.preSelectedSe;
		},
		setZoom:function(zoom){
			this.area.style["-webkit-transform"]="scale("+zoom+","+zoom+")";
		},
		onZoomChanged:function(){
			var zoom=stage.zoom;
			this.setZoom(zoom);
		},
		getX:function(){//考虑到缩放，这里必须实时取
			var pos=this.area.getBoundingClientRect();//对象相对于window位置对象
			this.x=pos.left;
			return this.x;
		},
		getY:function(){
			var pos=this.area.getBoundingClientRect();//对象相对于window位置对象
			this.y=pos.top;
			return this.y;
		},
		getZ:function(){
			return this.area.style.zIndex;
		},
		get:function(seId){
			return this.stageElementObj[seId];
		},
		getStageElements:function(){
			return this.stageElementObj;
		},
		add:function(se){
			var areaX=0;
			var areaY=0;
			var pa=se.elem.parentNode;
			debugger;
			se.elem.setAttribute("seId",this.seId);
			this.stageElementObj[this.seId]=se;
			this.seId++;
			if(pa&&pa!=this.area){
				areaX=this.getX();
				areaY=this.getY();
			}

			var x=se.getX();
			var y=se.getY();
			se.setX(x-areaX)+"px";
			se.setY(y-areaY)+"px";
			this.area.appendChild(se.elem);
		},
		isInnerLayer:function(elem){
			/*var w=this.area.clientWidth;
			var h=this.area.clientHeight;
			
			var x;
			var y;
			if(elem.getParent()==this.area){//相对于stage定位
				x=0;
				y=0;
			}
			else{//相对于document定位
				x=this.getX();
				y=this.getY();
			}
			var ex=elem.getX();
			var ey=elem.getY();
			var ew=elem.getWidth();
			var eh=elem.getHeight();

			//if(ex<x||ex>x+w-ew) return false; 
			//if(ey<y||ey>y+h-eh) return false;
			if(ex<x||ex>x+w)return false;
			if(ey<y||ey>y+w)return false;*/
			return true;
		},
		getWidth:function(){
			return this.area.clientWidth;
		},
		getHeight:function(){
			return this.area.clientHeight;
		}



	});

	var DragImage=J.Class({extend:DragObj},{
		init:function(options){
			 DragImage.superClass.init.call(this,options);
			 this.src=options.src;
			 document.body.appendChild(this.elem);
		}

	});
	var isImg=function(el){
		return el.tagName=="IMG";
	}
	var isBlockEl=function(el){
		return el.getAttribute("isBlockEl");
	}

	//缩放控制管理

	var zoomManager={
		init:function(){
			var self=this;
			this.sumWv=0;
			$E.addOriginalEventListener(window,"mousewheel",function(e){
				self.onMouseWheel(e);
				e.preventDefault();
			});
		},
		onMouseWheel:function(e){
			e = e||event;
			var wv=e.wheelDelta ? e.wheelDelta/120 : -( e.detail%3 == 0 ? e.detail : e.detail/3 );
			this.sumWv=Math.min(Math.max(this.sumWv+wv,-10),10);
			$E.notifyObservers(stage,"zoomChanged",this.sumWv);
		}

	}


	var imgsSrcObj={
		tree:"style/map/tree.png",
		house:"style/map/house.png",
		ground:"style/map/ground1.jpg"
	};
	//正在拖动的元素
	var dragingEl;
	//图片管理对象
	var imgsManager={
		//初始化
		init:function(options){
			var self=this;
			this.area=$D.id("imgsArea");
			this.defaultWidth=100;
			this.imgsList=[];
		
			$E.addOriginalEventListener(this.area,"mousedown",function(e){
				var target=e.target||e.srcElement;
				if(isImg(target)){
					var p=target.getBoundingClientRect();
					var newNode=$D.node("div",{
						isBlockEl:true,
						style:"left:"+p.left+"px;"
							 +"top:"+p.top+"px;"
							 +"position:absolute;"
							 +"background:"+"url('"+target.src+"');"
							 +"width:"+target.getAttribute("oriWidth")+"px;"
							 +"height:"+target.getAttribute("oriHeight")+"px;"
							 +"z-index:999;"
					});
					var dragImage=new DragImage({elem:newNode,src:target.src});
					dragImage.onStartDrag(e);
					dragingEl=dragImage;
				}
				e.preventDefault();
			});
			$E.addOriginalEventListener(document,"mousemove",function(e){
				if(dragingEl)
					dragingEl.onDragging(e);
			});	
			$E.addOriginalEventListener(document,"mouseup",function(e){
					
				if(dragingEl){
					var target=e.target||e.srcElement;
					dragingEl.onEndDrag(e);

					if(stage.isInnerLayer(dragingEl)){
						var layer=stage.getCurrentLayer();
						$E.notifyObservers(layer,"elementAdd",dragingEl);
					}
					else{
						document.body.removeChild(dragingEl.elem);
					}
				}
			
				dragingEl=null;
				
			})
		},
		//获取并添加图片
		show:function(){
			var self=this;
			var area=this.area;
			for(var name in imgsSrcObj){
				if(imgsSrcObj.hasOwnProperty(name)){
					var src=imgsSrcObj[name];
					var img=new Image();

					img.onload=function(){
						
						this.setAttribute("oriWidth",this.naturalWidth);
						this.setAttribute("oriHeight",this.naturalHeight);
						this.width=self.defaultWidth;
					}
					img.src=src;
					area.appendChild(img);
					this.imgsList.push(img);
				}
			}
		}
	}
});