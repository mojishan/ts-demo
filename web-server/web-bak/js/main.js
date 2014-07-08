Jx().$package("CsTank.main",function(J) {

	var $D = J.dom,
	$E = J.event,
	cg=J.cnGame,	
	input=cg.input,
	config=CsTank.config,
	srcObj=config.srcObj,
	Tank=CsTank.class.Tank,
	Block=CsTank.class.Block,
	ExplodeSheet=CsTank.class.ExplodeSheet,
	loadedImgs=cg.loader.loadedImgs,
	main=this,
	gameObj,
	player;

    function bezier(points, pos) {
        var n = points.length,
        r = [],
        i,
        j
        for (i = 0; i < n; ++i) {
            r[i] = [points[i][0], points[i][1]]
        }
        for (j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
                r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
            }
        }
        return [r[0][0], r[0][1]];
    }

	//初始化
	this.init=function(){
		gameObj=CsTank.gameObj;
		player=gameObj.player;
		//爆炸管理
		explodeControler.init({
			size:[50,50],
			pos:new Vector2(150,650)
		});
		//用户输入管理
		inputManager.init();
		//火炮列表管理
		gunListManager.init();
		//声音管理
		audioManager.init();
		//档数管理
		speedLevelManager.init();
		//地图管理
		stageManager.init({layers:stageLayers});
		//消息处理
		messageHandler.init();
		//战场管理
		battleManager.init();
		//镜头管理
		viewManager.init(cg.view);

	}

	var battleManager={
		init:function(){
			var self=this;
			var win=window;
			$E.addOriginalEventListener(window,"resize",function(e){
				self.setBattleSize(win.innerWidth,win.innerHeight);
			});
			self.setBattleSize(win.innerWidth,win.innerHeight);
		},
		setBattleSize:function(w,h){
			cg.setSize(w);
			cg.view.setSize(w);
		}
	};

	var viewManager={
		init:function(view){
			var self=this;
			this.view=view;
			this.changeDuration=0.2;

			$E.addObserver(this,"positionChange",function(e){
				self.onPositionChange(e);
			})
		},
		onPositionChange:function(e){

			if(J.isUndefined(this.preChangeTime)) this.preChangeTime=Date.now();

			if((Date.now()-this.preChangeTime)/1000<this.changeDuration){
				return;
			}
			
			//console.log(e.x+":"+e.y);
			this.moveDuration=0;
			this.dt=1;
			this.oriPos=this.view.pos;
			this.targetPos=player.pos.add(new Vector2(e.x,e.y));
			this.preChangeTime=Date.now();
			
		},
		update:function(duration){
			if(!this.targetPos) return;
			this.moveDuration+=duration;
			if((this.moveDuration)>this.dt) return;


			var dv=this.targetPos.subtract(this.oriPos);
			var sumDist=dv.length();
			var currentDist=bezier([[0,0],[0,0.67*sumDist],[0.18*dt,0.99*sumDist],[dt,sumDist]],this.moveDuration/this.dt)[1];
			var currentV=dv.normalize().multiply(currentDist);

			this.view.translate(this.oriPos.add(currentV));
			this.innerBackGround();
		},
		innerBackGround:function(){
			var view=this.view;
			var bg=cg.loader.loadedImgs[CsTank.config.srcObj.ground];
			var x=view.pos.x;
			var y=view.pos.y;
			var w=view.size[0];
			var h=view.size[1];
			if(x-w/2<0) view.pos.x=w/2;
			if(x+w/2>bg.width)	view.pos.x=bg.width-w/2;
			if(y-h/2<0) view.pos.y=h/2;
			if(y+h/2>bg.height)	view.pos.y=bg.height-h/2;			
		}

	}





	//消息处理
	var tankObj={};//坦克字典对象
	var dt;//本地时间相对于服务器时间的时差

	var getUrlParam =  function ( name , noDecode ) {
		var re = new RegExp( '(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)',  'i' ), m = re.exec( window.location.href );
		var ret = m ? m[1] : '' ;
		return !noDecode ? decodeURIComponent( ret ) : ret;
	};

	var messageHandler={
		init:function(){
			var message=this.message;
			ws.on("move",function(data){
				var stype=data.stype;
				var sender=data.sender;
				
				//确保不处理自己发送的信息
				if(sender==player.name) {
					if(stype=="correctTime") message[stype](data);
					else return;
				}
				else if(stype!="correctTime"){
					message[stype](data);
				}
	
				//message[stype](data);
				
			});	
			ws.on("connect",function(){
				console.log("connect finish!");
			});		
			ws.on("login",function(data){
				var gameObj=CsTank.gameObj;
				var player=gameObj.player;
				
				
				//player.name=uid;
				player.setName(uid);
				gameObj.spriteList.add(player);

				var pos=player.pos;
				ws.send({"type":"move","sender":uid,"stype":"initialize","pos":{x:pos.x,y:pos.y}});
				console.log("login finish!");
				//alert(uid+" login success!");

				ws.send({"type":"move","sender":uid,"stype":"correctTime","sendTime":Date.now()});//服务器校时
				//window.mm=Date.now();
			});
			//add
			this.connect();
			accessToken = getUrlParam("accessToken");
			uid = getUrlParam("uid");
			this.login(accessToken,uid);
			
		},
		connect:function(){
			ws.connect();
		},
		login:function(accessToken,uid){
			ws.send({"type":"login","accessToken":accessToken,"uid":uid});
		},
		turnDirection:function(tank,dir){
			if(dir=="left") return tank.turnLeft();
			if(dir=="right") return tank.turnRight();
			if(dir=="up") return tank.turnUp();
			if(dir=="down") return tank.turnDown();
		},
		message:{
			initialize:function(data){
				var sender=data.sender;
				if(sender==player.name) return;
				if(tankObj[sender]) return;
				var pos=data.pos;//敌人位置
				var enemy=new Tank({
					energy:100,
					size:[80,60],
					pos:new Vector2(pos.x,pos.y),
					a:[Vector2.zero,0],
					speed:[Vector2.zero,0],
					moveSpeed:config.tankMoveSpeed,
					turnSpeed:config.tankTurnSpeed,
					src:srcObj.body,
					angle:Math.PI/2
				});
				
				enemy.setGunList(["gun0","gun1","gun2","gun3","gun4"]);//领取武器
				enemy.setGun(2);//选用武器
				enemy.setName(sender);
				gameObj.spriteList.add(enemy);
				tankObj[sender]=enemy;//敌人保存在字典对象中
				var pos=player.pos;
				ws.send({"type":"move","sender":player.name,"stype":"initialize","pos":{x:pos.x,y:pos.y}});
				console.log("Send initialize");

			},
			correctTime:function(data){
				var sender=data.sender;
				if(sender!=player.name) return;//只对自己校时
				var now=Date.now();
				var sendTime=data.sendTime;
				var serverTime=data.serverTime;
				var serverCurrentTime=(now -sendTime)/2+serverTime;
				player.dt=now - serverCurrentTime;
				$D.id("ping").innerHTML="Ping:"+(now - sendTime);
				//console.log(Date.now()-window.mm);
			
			},
			fire:function(data){
				var tank;
				var sender=data.sender;
				sender==player.name?tank=player:tank=tankObj[sender];
				if(tank){
					if(tank.currentGunIndex==1) $E.notifyObservers(tank,"continueFire");
					
					tank.fire();
					console.log("receive fire");
				}
			},
			updateGunHeading:function(data){
				var tank;
				var targetPos=data.targetPos;
				var sender=data.sender;
				sender==player.name?tank=player:tank=tankObj[sender];
				if(tank){
					var gunAngle=data.gunAngle;
					tank.gun.angle=gunAngle;
					if(tank.currentGunIndex==3) {
						tank.gun.targetPos=new Vector2(targetPos.x,targetPos.y);
					}
					//console.log("receive updateGunHeading");
				}
			},
			move:function(data){
				var tank;
				var sender=data.sender;
				sender==player.name?tank=player:tank=tankObj[sender];

				//var sendTime=data.serverTime;
				var sendTime=data.sendServerTime;

				var serverCurrentTime=Date.now()-player.dt;
				var delayTime=Math.max(serverCurrentTime - sendTime,0);

				var position=data.position;
				var speed=data.speed;


				if(tank){
				 	var direction=data.direction;
				 	var dirObj=tank.dirObj;
				 	console.log("receive move "+direction);
				 	
					tank.move(direction);

					if(dirObj["left"]) {
						tank.turnLeft();
					}
					if(dirObj["right"]) {
						tank.turnRight();
					}
					if(dirObj["up"]) {
						tank.turnUp();
					}
					if(dirObj["down"]) {
						tank.turnDown();
					}

					//CsTank.main.messageHandler.turnDirection(tank,direction);
					if(tank.dirVector.isZero()) return;
					tank.speed[0]=tank.dirVector.normalize().multiply(tank.moveSpeed);

					console.log([tank.dirVector.x,tank.dirVector.y]);
					tank.quicklyMoveTo(new Vector2(position.x,position.y)
						.add(tank.speed[0].multiply(delayTime/1000+0.5)),
						0.5
					 );


					// tank.quicklyMoveTo(new Vector2(800,800),2);
					// tank.pos=new Vector2(position.x,position.y).add(tank.speed[0].multiply(delayTime/1000));

				}			
			},
			stopMove:function(data){
				var tank;
				var sender=data.sender;
				sender==player.name?tank=player:tank=tankObj[sender];
				if(tank){
					var direction=data.direction;
					console.log("receive stopMove "+direction);
					tank.stopMove(direction);
				}	

				if(tank.isAllStop()) {
					var position=data.position;
					var angle=data.angle;					
					// tank.pos.x=position.x;
					// tank.pos.y=position.y;
					tank.quicklyMoveTo(
						position,
						0.5
					);
					tank.angle=angle;
				}

			},
			speedChange:function(data){
				var tank;
				var sender=data.sender;
				sender==player.name?tank=player:tank=tankObj[sender];
				if(tank){
					console.log("receive speedChange");
					tank.speedChange(data.currentSpeedLevel);
				}	
			},
			setGun:function(data){
				var tank;
				var sender=data.sender;
				sender==player.name?tank=player:tank=tankObj[sender];
				if(tank){
					var gunIndex=data.gunIndex;
					console.log("receive set gun");
					tank.setGun(gunIndex);
				}			
			},
			stopContinueFire:function(data){
				var sender=data.sender;
				sender==player.name?tank=player:tank=tankObj[sender];
				if(tank){
					$E.notifyObservers(tank,"cancelContinueFire");
				}
			}	
		}	
	}

	//地图管理
	var stageManager={
		init:function(options){
			var layers=options.layers;
			var layersArr=[];
			var newLayer,newElement,newBlockRange;
			var stage=new cg.Stage();
			for(var i=0,l=layers.length;i<l;i++){
				var ly=layers[i];
				newLayer=new cg.Layer({
					size:ly.size,
					zIndex:ly.zIndex,
					stage:stage
				});
	
				layersArr.push(newLayer);
				var layerElementsArr=ly.layerElementsArr;
				for(var j=0,l2=layerElementsArr.length;j<l2;j++){
					var le=layerElementsArr[j];
					newElement=new Block({
						pos:new Vector2(le.pos[0]+le.size[0]/2,le.pos[1]+le.size[1]/2),
						size:le.size,
						src:le.src,
						repeat:le.repeat,
						canHurt:true
					});
					newLayer.addLayerElement(newElement);

					var blockRangesArr=le.blockRangesArr;
					for(var m=0,l3=blockRangesArr.length;m<l3;m++){
						var br=blockRangesArr[m];
						var newBr=new cg.BlockRange({
							size:br.size,
							pos:new Vector2(br.pos[0]+br.size[0]/2,br.pos[1]+br.size[1]/2),
							layerElement:newElement
						});
						newElement.addBlockRange(newBr);

					}
				}
			}
			stage.layers=layersArr;
			this.stage=stage;
		},
		removeBlock:function(bl){
			this.stage.removeLayerElement(bl,1);
		},
		draw:function(){
		
			this.stage.draw();
		}
	}

	//爆炸管理
	var explodeControler={
		init:function(options){
			this.esList=[];
		},
		setExplode:function(options){
			//[x,y,z,rotateSpeed]
			var speed=options.speed;
			var ePos=options.pos||Vector2.zero;
			var size=options.size||[32,32];
			var src=options.src;
			var za=options.za||0;
			var sheetSize=[loadedImgs[src].width,loadedImgs[src].height];
			var w=size[0],h=size[1],count=options.count,esList=this.esList;

			for(var i=0;i<count;i++){
				var speedX = (Math.random()-0.5)*speed[0];
				var speedY = (Math.random()-0.5)*speed[1];
				//var speedZ = -speed[2]*Math.random()-2;
				var speedZ = speed[2]*(Math.random()+1);
				var rSpeed = speed[3];

				var angle=Math.PI*2*Math.random();
				var p= new Vector2(w/2+(w/2-Math.random()*w),h/2+(h/2-Math.random()*h));
				var newP=ePos.add(p);
				var es=new ExplodeSheet({
					src:src,
					za:za,
					pos:newP,
					size:sheetSize,
					center:ePos,
					speed:[new Vector2(speedX,speedY),rSpeed],
					speedZ:speedZ,
					angle:angle,
					z:-200,
					minZ:-400
				});
				
				esList.push(es);
			}
		},
		update:function(duration){
			esList=this.esList;
			for(var i=0;i<esList.length;i++){
				if(!esList[i].isDisappear){
					esList[i].update(duration);
				}
				else{
					esList.splice(i,1);
					i--;
				}
			}	
		},
		draw:function(){
			esList=this.esList;
			for(var i=0;i<esList.length;i++){
				esList[i].draw();
			}			
		}
	};

	//地图管理
	/*var mapManager={
		
		init:function(name){
			//地图列表
			this.list={};
		},
		add:function(name,map){
			this.list[name]=map;
		},
		get:function(name){
			var mapSet=CsTank.mapSet;
			var mapOpt=mapSet[name];
			var blockList=mapOpt.blockList;
			var rs=mapOpt.resource;
			var map = new cg.Map2({gridSize:mapOpt.gridSize});

			for(var i=0,len=blockList.length;i<len;i++){
				var bOpt=blockList[i];
				bOpt=J.extend({},rs[bOpt.name],bOpt);
				bOpt.gridSize=mapOpt.gridSize;
				var b=new Block(bOpt);
				map.add(b);
			}
			return map;
		}

	};*/
	//声音管理
	var audioManager={
		init:function(){
			var bg=gameObj.bg;
			this.maxDistance=Math.sqrt(bg.width*bg.width+bg.height*bg.height);
		},
		playSound:function(name,tank){

			var audio=cg.loader.loadedAudios[srcObj[name]];
			var distance=player.getDistance(tank);

			if(audio){
				audio.volume=(1-distance/this.maxDistance);
				audio.currentTime=0;
				audio.play();
			}
		}
	}
	//档数管理
	var speedLevelManager={
		init:function(){
			var self=this;
			this.sum=3;
			this.elem=$D.id("speedLevel");
			$E.addObserver(player,"speedChange",function(l){
				self.onchange(l);
			});
		},
		onchange:function(l){
			this.elem.innerHTML="Speed Level:"+(l+1)+"/"+this.sum;
		}

	}
	

	//输入检测
	var inputManager={
		init:function(){

		},
		keyObserve:function(){

			if(input.isPressed("w")||input.isPressed("up")){
				$E.notifyObservers(this,"moveKeyPress","up");
			}
			else{
				$E. notifyObservers(this,"moveKeyUp","up");
			}

			if(input.isPressed("a")||input.isPressed("left")){
				$E.notifyObservers(this,"moveKeyPress","left");
			}
			else{
				$E. notifyObservers(this,"moveKeyUp","left");
			}

			if(input.isPressed("d")||input.isPressed("right")){
				$E.notifyObservers(this,"moveKeyPress","right");
			}
			else{
				$E.notifyObservers(this,"moveKeyUp","right");
			}

			if(input.isPressed("s")||input.isPressed("down")){
				$E.notifyObservers(this,"moveKeyPress","down");
			}
			else{
				$E. notifyObservers(this,"moveKeyUp","down");
			}


			/*if(input.isPressed("1")){
				$E.notifyObservers(player,"gunSelect",0);
			}
			else if(input.isPressed("2")){
				$E.notifyObservers(player,"gunSelect",1);
			}
			else if(input.isPressed("3")){
				$E.notifyObservers(player,"gunSelect",2);
			}	*/		
			if(input.mouse.left_pressed){
				$E.notifyObservers(player,"continueFire");
			}
		}

	}	
	//火炮列表管理
	var gunListManager={
		init:function(options){
			var self=this;
			this.elem=$D.id("gunList");
			this.liList=$D.tagName("li",this.elem);
			this.currentIndex=player.currentGunIndex;
			this.lastIndex=this.currentIndex;
			this.liList[this.currentIndex].style.opacity=1;

			$E.addObserver(player, "setGun", function(gunIndex){
				self.onchange(gunIndex);
			});
		},
		onchange:function(index){
			var lastIndex=this.lastIndex;
			if(index==this.currentIndex) return;

			this.liList[index].style.opacity=1;
			this.currentIndex=index;
			this.liList[lastIndex].style.opacity=0.3;
			this.lastIndex=index;
			
		}
	}
	this.tankObj=tankObj;
	this.explodeControler=explodeControler;
	//this.mapManager=mapManager;
	this.inputManager=inputManager;
	this.gunListManager=gunListManager;
	this.audioManager=audioManager;
	this.stageManager=stageManager;
	this.messageHandler=messageHandler;
	this.viewManager=viewManager;

});