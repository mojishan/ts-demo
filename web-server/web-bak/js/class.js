Jx().$package("CsTank.class",function(J) {
	var cg=J.cnGame,
	input=cg.input,
	$D = J.dom,
	$E = J.event,
	config=CsTank.config,
	srcObj=config.srcObj,
	SpriteSheet=cg.SpriteSheet;

	var restrict360=function(angle){
		angle=angle%(Math.PI*2);
		if(angle<0){
			angle+=Math.PI*2;
		}
		return angle;
	}
	var minTurnAngle=function(angle){
		if(angle>Math.PI){
			angle=angle-Math.PI*2;
		}
		else if(angle<-Math.PI){
			angle=angle+Math.PI*2;
		}
		return angle;
	}
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
    //alert(bezier([[0,0],[100,100]],0.5)[0]);


	var turnControl=function(angle,distin){
	
		angle=restrict360(angle);
		var da=minTurnAngle(distin-angle);
		var dirObj={};

		var backAngle=restrict360(angle-Math.PI);//尾部朝向
		var da2=minTurnAngle(distin-backAngle);

		if(Math.abs(da)<=Math.abs(da2)){
			dirObj.angle=da;
			dirObj.isMoveReverse=false;
		}
		else{
			dirObj.angle=da2;
			dirObj.isMoveReverse=true;
		}
		return dirObj;
	}



	//迷你地图
	var MinMap=new J.Class({
		init:function(options){
			this.elem=options.elem;
			this.player=options.player;
			this.blocks=options.map;
			this.wholeMap=options.wholeMap;
			this.ctx=this.elem.getContext('2d');
			this.size=options.size;
			this.elem.width=this.size[0];
			this.elem.height=this.size[1];
		},
		draw:function(){
			var wm=this.wholeMap;
			this.ctx.drawImage(wm,0,0,wm.width,wm.height,0,0,this.size[0],this.size[1]);
		}
	});

	var ExplodeSheet=new J.Class({extend:cg.Sprite},{
		init:function(options){
			ExplodeSheet.superClass.init.call(this,options);
			this.z=options.z;
			this.speedZ=options.speedZ||0;
			this.speed=options.speed||Vector2.zero;
			this.ori_x=this.pos.x;//z为0的时候的坐标
			this.ori_y=this.pos.y;
			this.center=options.center;
			this.za=options.za;
			this.size=[this.image.width,this.image.height];
		},
		update:function(duration){
			var za=this.za;
			var center=this.center;
			var scale=(center.x+this.z)/center.x;
			this.scale=scale;
		
			if(this.scale*15<1) {
				this.disappear();
				return;
			}	
			if(this.speedZ>0){
				za*=2;
			}
			else if(this.speedZ<0){
				za*=0.5;
			}
			
			this.speedZ=this.speedZ+za*duration;
			this.z+=this.speedZ*this.scale*duration;
			ExplodeSheet.superClass.update.call(this,duration);

			
		},
		draw:function(){
			var w=this.size[0],h=this.size[1],center=this.center,scale=this.scale,x=this.pos.x,y=this.pos.y;

			var x=(x - center.x) * scale + center.x;
			var y=(y - center.y) * scale + center.y;
			var s=[ w * scale , h * scale ];
			var img=this.image;
			var ctx=cg.context;
			ctx.save();
			cg.view.apply(ctx);
			ctx.translate(x,y);
			ctx.rotate(this.angle*-1);
			ctx.drawImage(img,0,0,img.width,img.height,-s[0]/2,-s[1]/2,s[0],s[1]);
			ctx.restore();

		},
		disappear:function(){
			this.isDisappear=true;
		}

	});



	var Block=new J.Class({extend : cg.LayerElement},{
		init:function(options){
			options.energy=options.energy||30;
			options.canHurt=options.canHurt||false;
			Block.superClass.init.call(this,options);

			var self=this;
			var explodeAnimation=new SpriteSheet({
				id:"explode",
				size:[184,46],
				frameSize:[46,46],
				src:srcObj.explode,
				onFinish:function(){
					self.disappear();
				}
			});
			this.addAnimation(explodeAnimation);
			$E.addObserver(this, "hitByBullet", function(energy){
				self.canHurt&&self.hurt(energy);
			});
			$E.addObserver(this, "dead", function(){
				self.explode();
			});
		},
		hurt:function(energy){
			this.energy-=energy;
			if(this.energy<0){
				$E.notifyObservers(this,"dead");
			}
		},
		explode:function(){
			var x=this.pos.x,y=this.pos.y;
			var w=this.size[0],h=this.size[1];
			
			this.disappear();
			CsTank.main.explodeControler.setExplode({
				count:20,
				src:srcObj.exSheet,
				pos:this.pos.copy(),
				speed:[400,400,100,Math.PI],
				za:-100
			});
			CsTank.main.audioManager.playSound("explodeSound",this);
		},
		disappear:function(){
			CsTank.main.stageManager.removeBlock(this);
		}	
	});

	var Bullet= new J.Class({extend : J.cnGame.Sprite},{
		init:function(options){
		
			options=cg.core.extend({
				flyTime:0,			 //飞行时间
				sumSpeedUpDuation:1, //加速时间	
				maxBulletSpeed:config.bulletMoveSpeed,//最大速度
				initialSpeed:config.bulletMoveSpeed,  //初始速度
				controlPoints:[]//速度变化控制点
			},options,true);
			
			Bullet.superClass.init.call(this,options);
			var self=this;
			var speed=this.initialSpeed;
			var angle=this.angle;
			$E.addObserver(this, "blockCollision", function(){
				self.explode();
			});
			$E.addObserver(this, "bulletHit", function(){
				self.explode();
			});
			this.speed=[new Vector2(speed*Math.cos(angle),-speed*Math.sin(angle)),0];
			
			var explodeAnimation=new SpriteSheet({
				id:"explode",
				size:[184,46],
				frameSize:[46,46],
				src:srcObj.explode,
				onFinish:function(){
					self.disappear();
				}
			});
			this.addAnimation(explodeAnimation);

			var controlPoints=this.controlPoints;
			var maxBulletSpeed=this.maxBulletSpeed;
			var sumSpeedUpDuation=this.sumSpeedUpDuation;
			var initialSpeed=this.initialSpeed;

			for(var i=0,len=controlPoints.length;i<len;i++){
				controlPoints[i][0]*=sumSpeedUpDuation;
				controlPoints[i][1]*=maxBulletSpeed;
			}
			controlPoints.unshift([0,initialSpeed]);
			controlPoints.push([sumSpeedUpDuation,maxBulletSpeed]);
			this.controlPoints=controlPoints;
		
		},
		explode:function(){
			if(this.isExplode) return;
			this.isExplode=true;
			this.stop();
			this.setCurrentAnimation("explode");
			CsTank.main.audioManager.playSound("explodeSound",this);
		},
		disappear:function(){
			CsTank.gameObj.spriteList.remove(this);
		},
		update:function(duration){
			if(this.isExplode) this.stop();

			this.flyTime+=duration;

			var sumSpeedUpDuation=this.sumSpeedUpDuation;
			var flyTime=this.flyTime;
			var sumSpeedUpDuation=this.sumSpeedUpDuation;
			var maxBulletSpeed=this.maxBulletSpeed;
			var flySpeed=this.speed[0].length();
			var controlPoints=this.controlPoints;

			
			
			if(flyTime<sumSpeedUpDuation){
				var s=bezier(controlPoints,flyTime/sumSpeedUpDuation)[1];	
				this.speed[0]=new Vector2(Math.cos(this.angle)*s,-Math.sin(this.angle)*s);
		
			}

			Bullet.superClass.update.call(this,duration);
		}
	});

	var Gun = new J.Class({extend : J.cnGame.Sprite},{
		init:function(options){
			Gun.superClass.init.call(this,options);
		},
		getTargetHeading:function(){
			if(!input.mouse.x&&!input.mouse.y) return;
			var view=cg.view;
			var mx=input.mouse.x+view.pos.x-cg.width/2;
			var my=input.mouse.y+view.pos.y-cg.height/2;
			//转换为canvas中点为原点的坐标系s
			var x=mx-this.pos.x;
			var y=this.pos.y-my;
			return Math.atan2(y,x);
		},
		update:function(duration){
			Gun.superClass.update.call(this,duration);
		},
		fire:function(){
			var now= Date.now();
			var fireDuration = this.fireDuration;
			var lastFireTime=this.lastFireTime;
			if(lastFireTime&&(now-lastFireTime)/1000<fireDuration) return;
			this.lastFireTime=now;
			
			var bulletConstructor=this.bulletConstructor;
			this.setBulletPos();
			var bulletOpt={};
			var bulletArr=[];

			for(var i=0,l = this.bulletCount;i<l;i++){
				bulletOpt.pos=this.posList[i];
				bulletOpt.angle=this.angleList[i];
				bulletOpt.gun=this;//gun引用
				var newBullet=new bulletConstructor(bulletOpt);
				CsTank.gameObj.spriteList.add(newBullet);
				bulletArr.push(newBullet);
			}
			CsTank.main.audioManager.playSound("shootSound",this);
			return bulletArr;
		},
		setBullet:function(bulletConstructor){
			this.bulletConstructor=bulletConstructor;//bullet配置
		}

	});

	var EnergyRect= new J.Class({
		init:function(options){
			var e=$D.node("span");
			$D.addClass(e,"energy-rect");
			$D.id("canvasWrap").appendChild(e);
			this.elem=e;
		},
		update:function(pos,energy){
			this.pos=pos;
			this.energy=energy;
		},
		draw:function(){
			var e=this.elem;
			var energy=this.energy;
			var pos=this.pos;
			var view=cg.view;
			var width=energy*1;
			var cssText="left:"+(pos.x-(view.pos.x-view.size[0]/2)-width/2)+"px;"+"top:"+(pos.y-(view.pos.y-view.size[1]/2)-90)+"px;"+"width:"+width+"px;";
			$D.setCssText(e,cssText);
			
		},
		hide:function(){
			$D.setStyle(this.elem,"display","none");
		}

	});
	var PlayerNameText= new J.Class({
		init:function(options){
			var e=$D.node("span");
			$D.addClass(e,"player-name-text");
			$D.id("canvasWrap").appendChild(e);
			this.elem=e;
			this.text=options.text;
			this.elem.innerHTML=this.text;
		},
		update:function(pos){
			this.pos=pos;
		},
		draw:function(){
			var e=this.elem;
			var pos=this.pos;
			var view=cg.view;
			var width=200;
			var cssText="left:"+(pos.x-(view.pos.x-view.size[0]/2)-width/2)+"px;"+"top:"+(pos.y-(view.pos.y-view.size[1]/2)-110)+"px;"+"width:"+width+"px;";
			$D.setCssText(e,cssText);
			
		},
		hide:function(){
			$D.setStyle(this.elem,"display","none");
		}

	});
	var ProxyArea= new J.Class({
		init:function(options){
			var e=$D.node("div");
			var self=this;
			$D.addClass(e,"tank-proxy-area");
			$D.id("canvasWrap").appendChild(e);
			this.elem=e;
			this.width=options.size[0];
			this.height=options.size[1];
			this.tank=options.tank;
			$E.addOriginalEventListener(this.elem,"click",function(){
				$E.notifyObservers(self.tank,"click");
			});
		},
		update:function(pos){
			this.pos=pos;
			if(!this.elem.getAttribute("tankName")){
				this.elem.setAttribute("tankName",this.tank.name);
			}
		},
		draw:function(){
			var e=this.elem;
			var pos=this.pos;
			var view=cg.view;
			var width=this.width;
			var height=this.height;
			var angle=-this.tank.angle*180/Math.PI;
		
			var cssText="left:"+(pos.x-(view.pos.x-view.size[0]/2)-width/2)+"px;"
						+"top:"+(pos.y-(view.pos.y-view.size[1]/2)-height/2)+"px;"
						+"-webkit-transform:rotate("+angle+"deg);"
						+"width:"+width+"px;"
						+"height:"+height+"px;";
			$D.setCssText(e,cssText);
			
		},
		hide:function(){
			$D.setStyle(this.elem,"display","none");
		},
		disappear:function(){

		}

	});
	
	var Tank= new J.Class({extend : J.cnGame.Sprite},{

		init:function(options){
			var gameObj=CsTank.gameObj;
			var self=this;
			
			options.energy=options.energy||100;
			options.currentSpeedLevel=0;
			Tank.superClass.init.call(this,options);
			//速度方向保存对象
			this.dirObj={
				"up":null,
				"down":null,
				"left":null,
				"right":null
			};
			//目标方向向量
			this.dirVector=Vector2.zero;

			//加速减速过程所需时间和已经过的时间
			this.moveDuration=0;
			this.stopDuration=0;
			this.seedUpDuration=2;
			this.speedDownDuration=1;

			//血条
			this.energyRect=new EnergyRect();

			//事件代理元素
			this.proxyArea=new ProxyArea({
				size:this.size,
				tank:this
			});

			//爆炸动画
			var explodeAnimation=new SpriteSheet({
				id:"explode",
				size:[184,46],
				frameSize:[46,46],
				src:srcObj.explode,
				onFinish:function(){
					self.disappear();
				}
			});		
			this.addAnimation(explodeAnimation);

			//连续发射监听
			$E.addObserver(this,"continueFire",function(){
				if(self.gun) self.gun.isContinueFiring=true;
				// if(!self.name) return;
				// self.gun.canContinue&&self.fire();
			});	
			$E.addObserver(this,"cancelContinueFire",function(){
				self.gun.isContinueFiring=false;
				// if(!self.name) return;
				// self.gun.canContinue&&self.fire();
			});	


			//碰撞监听
			$E.addObserver(this, "wallCollision", function(){
				self.onHit();
			});
			$E.addObserver(this, "blockCollision", function(){
				self.onHit();
			});
			$E.addObserver(this, "tankCollision", function(){
				self.onHit();
			});
			$E.addObserver(this, "hitByBullet", function(p){
				self.hurt(p);
			});

			//死亡监听
			$E.addObserver(this, "dead", function(){
				self.explode(); 
			});

		},
		move:function(dir){
			this.dirObj[dir]=true;
			this.isMoving=true;
		},
		stopMove:function(dir){
			this.dirObj[dir]=null;	
		},
		stopAllMove:function(){
			var stopSpeed;
			if(this.isMoving){
				this.isMoving=false;
				this.stopSpeed=this.speed[0];
				this.stop();
			}
			return stopSpeed;
		},
		isAllStop:function(){
			return !this.dirObj["left"]&&!this.dirObj["right"]&&!this.dirObj["down"]&&!this.dirObj["up"];
		},
		onHit:function(){
			this.resetPos();
		},
		hurt:function(energy){
			this.energy-=energy;
			if(this.energy<=0){
				$E.notifyObservers(this,"dead");
			}
		},
		setGun:function(gunIndex){//可传入火炮名称或索引
			var gl=this.gunList;
			var gun;
			
			if(J.isNumber(gunIndex)){
				gun=gl[gunIndex];
			}
			else if(J.isString(gunIndex)){
				for(var i=0,len=gl.length;i<len;i++){
					if(gl[i].name==gunIndex) gun=gl[i];
				}				
			}

			if(gun){
				gun.tank=this;
				this.gun=gun;
				this.currentGunIndex=gunIndex;
			}
			$E.notifyObservers(this,"setGun",gunIndex);
		},
		setGunList:function(list){
			this.gunList=[];
			var l=config.maxGunNumber;
			var gunSet=	CsTank.gunSet;
			var bulletSet=CsTank.bulletSet;
	
			for(var i=0;i<l;i++){
				//var gun=new Gun(gunSet[list[i]]);
				var gun=new gunSet[list[i]];
				var bulletConstructor = bulletSet[gun.bulletName];
				gun.setBullet(bulletConstructor);
				this.gunList.push(gun);
			}
			
		},
		setTurn:function(duration){
			var isMoveReverse;//实际移动方向是否和角度方向相反
			var turnSpeed;
			var tank=this;
			s = this.dirVector;
			if(s.isZero()) return;
			
			var distin=Math.atan2(-s.y,s.x);
			var dirObj=turnControl(tank.angle,distin);//要转的角度
			var ta=dirObj.angle;
			this.isMoveReverse=dirObj.isMoveReverse;

			if(Math.abs(ta)<Math.abs(tank.turnSpeed*duration))
				turnSpeed=ta;
			else if(ta>0){
				turnSpeed=tank.turnSpeed;
			}
			else if(ta<0){
				turnSpeed=-tank.turnSpeed;
			}
			tank.speed[1]=turnSpeed; 
		},
		speedChange:function(level){
			var l=CsTank.config.speedLevel;
			var cl=this.currentSpeedLevel;
			cl=Math.max(Math.min(2,level),0);
			this.moveSpeed=config.tankMoveSpeed * l[cl];
			this.currentSpeedLevel=cl;
			$E.notifyObservers(this,"speedChange",cl);

		},
		turnUp:function(){
			this.dirVector=this.dirVector.add(new Vector2(0,-this.moveSpeed).normalize());
		},
		turnDown:function(){
			this.dirVector=this.dirVector.add(new Vector2(0,this.moveSpeed).normalize());
		},
		turnLeft:function(){
			this.dirVector=this.dirVector.add(new Vector2(-this.moveSpeed,0)).normalize();
		},
		turnRight:function(){
			this.dirVector=this.dirVector.add(new Vector2(this.moveSpeed,0).normalize());
		},
		fire:function(target){
			return this.gun.fire(target);
		},
		updateGunHeading:function(targetGunHeading){	
			this.gun.angle=targetGunHeading;
		},
		update:function(duration){
			var gun=this.gun;
			var dirObj=this.dirObj;
			var isMoveReverse;
			var isMoving=false;

			var ms=this.speed[0];
		
			if(dirObj["left"]) {
				this.turnLeft();
				isMoving=true;
			}
			if(dirObj["right"]) {
				this.turnRight();
				isMoving=true;
			}
			if(dirObj["up"]) {
				this.turnUp();
				isMoving=true;
			}
			if(dirObj["down"]) {
				this.turnDown();
				isMoving=true;
			}
			if(!isMoving){
				this.stopAllMove();
				// if(this.stopSpeed){
				// 	this.moveDuration=0;
				// 	var stv=this.stopSpeed.length();
				// 	this.stopDuration+=duration;
				// 	var s=bezier([[0,stv],[this.speedDownDuration,0]],this.stopDuration/this.speedDownDuration)[1];
				// 	s=Math.max(s,0);
				// 	this.speed[0]=this.stopSpeed.normalize().multiply(s);	
				// }
				this.speed[0]=Vector2.zero;//test
			}
			else {
				// this.stopDuration=0;
				var isMoveReverse=this.isMoveReverse;
				var moveDir;
				isMoveReverse?moveDir=-1:moveDir=1;
				// this.moveDuration+=duration;

				// var s=bezier([[0,0],[this.seedUpDuration,this.moveSpeed]],this.moveDuration/this.seedUpDuration)[1];
				// s=Math.min(s,this.moveSpeed);
				var s=this.moveSpeed;//test
				var sx=s*Math.cos(this.angle);
				var sy=s*Math.sin(this.angle);

				this.speed[0]=new Vector2(sx*moveDir,-sy*moveDir);
			}

			this.setTurn(duration);
			
			Tank.superClass.update.call(this,duration);

			if(this.energyRect) this.energyRect.update(this.pos,this.energy);
			if(this.nameText) this.nameText.update(this.pos);
			if(this.proxyArea) this.proxyArea.update(this.pos);

			if(gun){
				gun.update(duration);
				gun.pos=this.pos;
			}
			this.dirVector=Vector2.zero;
		    this.quickMoveUpdate(duration);
			if(this.gun&&this.gun.canContinue&&this.gun.isContinueFiring){
				this.fire();
			}
			
		},
		quicklyMoveTo:function(pos,duration){
			this.quickMoveDestination=pos;
			this.quickMoveDuration=duration;
			this.posBeforeQuickMove=this.pos;
			this.quickMoveTime=0;
			this.isQuickMoving=true;
			console.log("quickMove:"+[this.posBeforeQuickMove.x,this.posBeforeQuickMove.y]+":::"+[this.quickMoveDestination.x,this.quickMoveDestination.y]+":::"+this.speed[0].y);
		},
		quickMoveUpdate:function(duration){
			if(!this.isQuickMoving) return;
			var quickMoveDestination=this.quickMoveDestination;
			var quickMoveDuration=this.quickMoveDuration;
			var posBeforeQuickMove=this.posBeforeQuickMove;
			var dt=this.quickMoveTime+=duration;
			console.log(quickMoveDuration);
			if(dt>=quickMoveDuration) {
				//alert(dt+":"+[this.pos.x,this.pos.y]);
				this.isQuickMoving=false;
				return;
			}
		
			this.pos.x=bezier([
					[0,posBeforeQuickMove.x],
					[quickMoveDuration,quickMoveDestination.x]
				],
				dt/quickMoveDuration
			)[1];
			this.pos.y=bezier([
					[0,posBeforeQuickMove.y],
					[quickMoveDuration,quickMoveDestination.y]
				],
				dt/quickMoveDuration
			)[1];
		},
		setName:function(text){
			this.nameText=new PlayerNameText({
				text:text
			});
			this.name=text;
		},
		resetPos:function(){
			Tank.superClass.resetPos.call(this);
			this.gun.resetPos();
		},
		stop:function(){
			this.gun&&this.gun.stop();
			Tank.superClass.stop.call(this);
		},
		explode:function(){
			this.isExplode=true;
			this.gun=null;
			this.setCurrentAnimation("explode");
			CsTank.main.audioManager.playSound("explodeSound",this);
		},
		draw:function(){
			Tank.superClass.draw.call(this);
			this.gun&&this.gun.draw();
			if(this.energyRect) this.energyRect.draw();
			if(this.nameText) this.nameText.draw();
			if(this.proxyArea) this.proxyArea.draw();
		},
		disappear:function(){
			CsTank.gameObj.spriteList.remove(this);
			this.nameText.hide();
			this.energyRect.hide();
			this.proxyArea.hide();
		}

	});
	var isPressed=false;
	var shiftPressed;
	
	var Player= new J.Class({extend : Tank},{
		init:function(options){
			var self=this;
			var inputManager=CsTank.main.inputManager;
			
			this.sendDirObj={};
			this.stateList=[];
			this.viewRange=200;//默认视野延伸范围

			Player.superClass.init.call(this,options);
			//火炮选择监听
			/*$E.addObserver(this, "gunSelect", function(){
				self.onGunSelect(arguments[0]);
			});*/

			//移动控制监听
			$E.addObserver(inputManager, "moveKeyPress", function(dir){
				if(!self.name) return;
				if(self.sendDirObj[dir]) return;
				self.sendDirObj[dir]=true;
				self.move(dir);
				ws.send({
					"type":"move",
					"sender":self.name,
					"stype":"move",
					"direction":dir,
					"speed":self.speed[0],
					"angle":self.angle,
					"position":self.pos,
					"sendServerTime":Date.now()-self.dt
				});

				console.log("send move "+dir);
				
			});	
			$E.addObserver(inputManager, "moveKeyUp", function(dir){
				if(!self.name) return;
				if(!self.sendDirObj[dir]) return;
				self.sendDirObj[dir]=false;
				self.stopMove(dir);
				ws.send({"type":"move","sender":self.name,"stype":"stopMove","direction":dir,"position":self.pos,"angle":self.angle});
				console.log("send stop move "+dir);
			});	


			$E.addOriginalEventListener(cg.canvas.parentNode,"mousedown",function(e){

				if(!self.name) return;

				e=e||window.event;
				var target=e.target||e.srcElement;

				self.fire(target);

				console.log("Send Fire");
				ws.send({"type":"move","sender":self.name,"stype":"fire"});
			});	

			$E.addOriginalEventListener(window,"keydown",function(e){
				if(!self.name) return;
				self.onKeyDown(e);
			});
			$E.addOriginalEventListener(window,"keyup",function(e){
				if(!self.name) return;
				self.onKeyUp(e);
				
			});	

			$E.addOriginalEventListener(cg.canvas.parentNode,"mouseup",function(e){
				if(self.currentGunIndex==1){
					$E.notifyObservers(self,"cancelContinueFire");
					ws.send({"type":"move","sender":self.name,"stype":"stopContinueFire"});
					console.log("Send stopContinueFire");
				}
			});

		},
		onKeyUp:function(e){
			
			var k=input.key[e.keyCode];
			if(k=="shift"){
				var cl=this.currentSpeedLevel;
				cl--;
				this.speedChange(cl);
				shiftPressed=false;
				ws.send({"type":"move","sender":this.name,"stype":"speedChange","currentSpeedLevel":cl});
				console.log("send speedChange");
			}
			isPressed=false;
		},
		onKeyDown:function(e){	
		
			var k=input.key[e.keyCode];
			var ktype;
			if(!isPressed){
				if(k=="f"||k=="r"||k=="shift"){
					var cl=this.currentSpeedLevel;
					if(k=="r") ktype="up";
					else if(k=="f") ktype="down";
					else if(k=="shift") {
						ktype="tup";
						e.preventDefault();
					}
					if(ktype=="up") cl++;
					if(ktype=="tup") cl++;

					else if(ktype=="down") cl--;
					isPressed=true;

					this.speedChange(cl);
					ws.send({"type":"move","sender":this.name,"stype":"speedChange","currentSpeedLevel":cl});
					console.log("send speedChange");

				}
				else if(k=="1"||k=="2"||k=="3"||k=="4"||k=="5"){
					var gunIndex=parseInt(k)-1;
					if(this.currentGunIndex==gunIndex) return;
					this.setGun(gunIndex);
					ws.send({"type":"move","sender":this.name,"stype":"setGun","gunIndex":gunIndex});
					console.log("send set gun "+gunIndex);
				}
			}
		},
		update:function(duration){
	
			var gun=this.gun;
			if(gun){
				var targetGunHeading=gun.getTargetHeading();
				if(targetGunHeading!=gun.angle&&this.name){
					this.updateGunHeading(targetGunHeading);
					var mouse=cg.input.mouse;
					var x=mouse.x,y=mouse.y;
					ws.send({"type":"move","sender":this.name,"stype":"updateGunHeading","gunAngle":targetGunHeading,"targetPos":new Vector2(x,y)});
					//console.log("send gunAngle update "+gun.angle);
				}
			}
			if(this.currentGunIndex==3){
				var mouse=cg.input.mouse;
				var targetPos=new Vector2(//鼠标位置
					mouse.x+cg.view.pos.x-cg.view.size[0]/2,
					mouse.y+cg.view.pos.y-cg.view.size[1]/2
				);
				this.gun.targetPos=targetPos;
			}

			var viewRange=this.viewRange;
			var mouseX=cg.input.mouse.x;
			var mouseY=cg.input.mouse.y;
			var mousePosToCenter=new Vector2(mouseX-cg.size[0]/2,mouseY-cg.size[1]/2);
			var range=Math.min(viewRange,mousePosToCenter.length());
			mousePosToCenter=mousePosToCenter.normalize().multiply(range);
			
			$E.notifyObservers(CsTank.main.viewManager,"positionChange",{
				x:mousePosToCenter.x,
				y:mousePosToCenter.y
			});
			
			

			Player.superClass.update.call(this,duration);
		}

	});
	this.ExplodeSheet=ExplodeSheet;
	this.Block=Block;
	this.Bullet=Bullet;
	this.Gun=Gun;
	this.Tank=Tank;
	this.Player=Player;
});