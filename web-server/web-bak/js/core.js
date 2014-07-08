Jx().$package("CsTank",function(J) {
	var $D = J.dom,
		$E = J.event,
		bg,
		player,
		cg=J.cnGame,
		config=CsTank.config,
		srcObj=config.srcObj,
		Sp=cg.Sprite,
		SL=cg.SpriteList,
		input=cg.input,
		loadedImgs=cg.loader.loadedImgs,
		collision=CsTank.collision,
		Gun=CsTank.class.Gun,
		Bullet=CsTank.class.Bullet,
		Tank=CsTank.class.Tank,
		Player=CsTank.class.Player,
		main=CsTank.main,
		mapManager=main.mapManager,
		inputManager=main.inputManager,
		gunListManager=main.gunListManager,
		stageManager=main.stageManager,
		viewManager=main.viewManager,
		explodeControler=main.explodeControler;

	//初始化框架
	J.cnGame.init("canvas", { size:[window.innerWidth,600],/*bgImageSrc:srcObj.ground,*/isScaleBg:false,fps:60,tps:60});

	var isPlayer=function(s){
		return s===player;
	}
	var isTank=function(s){
		return (s instanceof Tank)&&(!s.isExplode)&&!s.isQuickMoving;
	}
	var isBullet=function(s){
		return (s instanceof Bullet)&&(!s.isExplode);
	}

	var TimeChecker={
		checkDuration:2000,
		check:function(){
			var now=Date.now();
			this.lastTime=this.lastTime||now;
			if(now-this.lastTime>this.checkDuration){
				ws.send({"type":"move","sender":player.name,"stype":"correctTime","sendTime":now});
				this.lastTime=now;
			}
		}
	}

	
	var gameObj={
		initialize:function(){
			var self=this;
			//精灵列表
			this.spriteList=new SL();
			//背景大图
			this.bg = bg = loadedImgs[srcObj.ground];

			var newPos=new Vector2(80+Math.random()*200,80+Math.random()*800);
			//玩家对象
			player = new Player({
				energy:100,
				// size:[122,81],
				size:[80,60],
				//pos:new Vector2(90,850),
				pos:newPos,
				a:[Vector2.zero,0],
				speed:[Vector2.zero,0],
				moveSpeed:config.tankMoveSpeed,
				turnSpeed:config.tankTurnSpeed,
				src:srcObj.body,
				angle:Math.PI/2
			});
			player.setGunList(["gun0","gun1","gun2","gun3","gun4"]);//领取武器
			player.setGun(2);//选用武器
			this.player=player;

		

			//敌人对象
			/*var enemy=new Tank({
				energy:100,
				size:[122,81],
				pos:new Vector2(300,850),
				a:[Vector2.zero,0],
				speed:[Vector2.zero,0],
				moveSpeed:config.tankMoveSpeed,
				turnSpeed:config.tankTurnSpeed,
				src:srcObj.body,
				angle:Math.PI/2
			});

			enemy.setGunList(["gun0","gun1","gun2"]);//领取武器
			enemy.setGun(0);//选用武器
			this.spriteList.add(enemy);
			this.enemy=enemy;*/

			

			//主程序初始化
			main.init();

			//this.enemy.move("right");

			//地图获取
			//this.map=mapManager.get("example");
			//explodeControler.setExplode({count:30,src:srcObj.exSheet,pos:new Vector2(90,850)});
		},

		update:function(duration){

			var spriteList=this.spriteList;
			//var map=this.map;
			//map.update(duration);
			var view=cg.view;
			//精灵更新
			spriteList.update(duration);
			//键盘交互
			//this.player.stop();
			inputManager.keyObserve();

			viewManager.update(duration);

			//碰撞检测
			var list=spriteList.get();
			for(var i=0,len=list.length;i<len;i++){
				var s=list[i];
				var block;
				if(s.isExplode){
					continue;
				}
				if(isBullet(s)){
					
				}
				//和障碍物碰撞
				if(block=CsTank.collision.blockCol(s,stageManager.stage)){
					if(isBullet(s)) $E.notifyObservers(block,"hitByBullet",s.power);
					else if(!isTank(s)) continue;

					$E.notifyObservers(s,"blockCollision");
				}
				//和墙壁碰撞
				if(CsTank.collision.wallCol(s,bg)){
					$E.notifyObservers(s,"wallCollision");
				}
				for(var j=i+1;j<len;j++){
					var s1=list[j];
					var t,b;
					if(s1.isExplode){
						continue;
					}
					if(isBullet(s)&&isTank(s1)){
						b=s;
						t=s1;
					}
					else if(isBullet(s1)&&isTank(s)){
						b=s1;
						t=s;
					}
					else if(isTank(s)&&isTank(s1)&&CsTank.collision.tankCol(s,s1)){
						$E.notifyObservers(s,"tankCollision");
						$E.notifyObservers(s1,"tankCollision");
					}

					if(b&&t&&collision.bulletHitCol(b,t)){//alert("0");
						$E.notifyObservers(t,"hitByBullet",b.power);
						$E.notifyObservers(b,"bulletHit");
					}
					b=t=null;
				}


			}

			// var viewRange=200;
			// var mouseX=cg.input.mouse.x,mouseY=cg.input.mouse.y;
			// var mousePosToCenter=new Vector2(mouseX-cg.size[0]/2,mouseY-cg.size[1]/2);
			// var range=Math.min(viewRange,mousePosToCenter.length());
			// mousePosToCenter=mousePosToCenter.normalize().multiply(range);

			// var targetViewPos=this.player.pos.add(mousePosToCenter);

	

			//视图更新，跟随player的视野
			// view.translate(targetViewPos);
			// innerBackGround(view,bg);
			//this.enemy&&!this.enemy.isExplode&&this.enemy.fire();
			
			explodeControler.update(duration);

			$D.id("fps").innerHTML="FPS:"+cg.loop.avgFPS;

			if(this.player.name) TimeChecker.check();

		},
		draw:function(){
			//绘制
			//this.map&&this.map.draw();
			stageManager.draw();
			this.spriteList.draw();
			explodeControler.draw();
			
			//this.minMap.draw();
		}
	}
	this.gameObj=gameObj;
	//资源加载
	cg.loader.start(gameObj, { 
		srcArray: srcObj
	});
});