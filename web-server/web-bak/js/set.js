Jx().$package("CsTank",function(J) {
	var config=CsTank.config,
	srcObj=config.srcObj,
	cg=J.cnGame,
	Gun=CsTank.class.Gun,
	Bullet=CsTank.class.Bullet,
	loadedImgs=cg.loader.loadedImgs;

	var trackPoint=function(bullet,targetPos){
		var speedToTarget=targetPos.subtract(bullet.pos).normalize().multiply(80);
		bullet.speed[0]=bullet.speed[0].add(speedToTarget).normalize().multiply(bullet.moveSpeed);
		bullet.angle=Math.atan2(-bullet.speed[0].y,bullet.speed[0].x);
	};

	var mapSet={
		"example":{
			gridSize:[40,40],
			resource:{
				"tree":{
					src:srcObj.tree,
					cols:3,
					rows:3,
					isBlock:true,	
					energy:10,
					canHurt:true				
				},
				"house":{
					src:srcObj.house,
					cols:7,
					rows:5,
					isBlock:true	
				}
			},
			blockList:[
				{
					name:"house",
					coor:[10,7],
	
				},
				{
					name:"tree",
					coor:[10,13],

				},
				{
					name:"tree",
					coor:[10,17],

				},
				{
					name:"tree",
					coor:[27,7],
				},
				{
					name:"tree",
					coor:[27,10],
				}
			]
		}
	};

	var bulletSet={
		"bullet0":new J.Class({extend :Bullet},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					src:srcObj.bullet,
					size:[30,10],
					power:5,
					initialSpeed:500,
					maxBulletSpeed:3000,
					sumSpeedUpDuation:1,
					controlPoints:[[0,0.95],[0.22,1]]
				});
				bulletSet["bullet0"].superClass.init.call(this,options);

			}
		}),
		"bullet1":new J.Class({extend :Bullet},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					src:srcObj.bullet1,
					size:[30,6],
					power:0.5,
					moveSpeed:config.bulletMoveSpeed
				});
				bulletSet["bullet1"].superClass.init.call(this,options);

			}
		}),
		"bullet2":new J.Class({extend :Bullet},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					src:srcObj.bullet,
					size:[30,10],
					power:5,
					moveSpeed:config.bulletMoveSpeed
				});
				bulletSet["bullet2"].superClass.init.call(this,options);

			}
		}),
		"bullet3":new J.Class({extend :Bullet},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					src:srcObj.bullet,
					size:[30,10],
					power:5,
					moveSpeed:300
				});
				bulletSet["bullet3"].superClass.init.call(this,options);

			},
			update:function(duration){
				
				
				var minDist=20;
				// var mouse=cg.input.mouse;
				// var targetPos=new Vector2(//鼠标位置
				// 	mouse.x+cg.view.pos.x-cg.view.size[0]/2,
				// 	mouse.y+cg.view.pos.y-cg.view.size[1]/2
				// );
				var targetPos=this.gun.targetPos;
				if(targetPos){
					var dist=this.pos.subtract(targetPos).length();//距离目的地距离
					if(dist>minDist&&!this.hasGetTarget){
						trackPoint(this,targetPos);
						this.getTarget=true;
					}
					else{
						this.hasGetTarget=true;
					}	
				}
				
				bulletSet["bullet3"].superClass.update.call(this,duration);
			}
		}),
		"bullet4":new J.Class({extend :Bullet},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					src:srcObj.bullet,
					size:[30,10],
					power:5,
					moveSpeed:300
				});
				bulletSet["bullet4"].superClass.init.call(this,options);

			},
			update:function(duration){
				
		
				if(this.target){
					var minDist=20;
					var targetPos=this.target.pos;//目标坦克位置位置
					var dist=this.pos.subtract(targetPos).length();//距离目的地距离

					if(dist>minDist&&!this.hasGetTarget){
						trackPoint(this,targetPos);
						this.getTarget=true;
					}
					else{
						this.hasGetTarget=true;
					}	
				}
				bulletSet["bullet4"].superClass.update.call(this,duration);
			}
		})
	}

	// var gunSet={
	// 	"gun0":{
	// 		name:"gun0",
	// 		size:[190,50],
	// 		angle:Math.PI/2,
	// 		src:srcObj.gun,
	// 		bulletName:"bullet0",
	// 		fireDuration:1,//秒
	// 		bulletCount:1,
	// 		setBulletPos:function(){//自定义炮弹发出位置
	// 			var angle=this.angle;
	// 			var pos=this.pos;
	// 			this.posList=[new Vector2(pos.x+120*Math.cos(angle),pos.y-120*Math.sin(angle))];
	// 			this.angleList=[angle];
	// 		}			

	// 	},
	// 	"gun1":{
	// 		name:"gun1",
	// 		size:[190,50],
	// 		angle:0,
	// 		src:srcObj.gun1,
	// 		bulletName:"bullet1",
	// 		bulletCount:1,
	// 		fireDuration:0.1,
	// 		canContinue:true,
	// 		setBulletPos:function(){//自定义炮弹发出位置
	// 			var angle=this.angle;
	// 			var pos=this.pos;
	// 			this.posList=[new Vector2(pos.x+120*Math.cos(angle),pos.y-120*Math.sin(angle))];
	// 			this.angleList=[angle];
	
	// 		}
	// 	},
	// 	"gun2":{
	// 		name:"gun2",
	// 		size:[190,50],
	// 		angle:Math.PI,
	// 		src:srcObj.gun2,
	// 		bulletName:"bullet2",
	// 		bulletCount:2,
	// 		fireDuration:0.5,
	// 		setBulletPos:function(){//自定义炮弹发出位置
	// 			var angle=this.angle;
	// 			var pos=this.pos;
	// 			var n=new Vector2(Math.cos(angle),-Math.sin(angle));
			
	// 			var pos1=pos.add(n.multiply(120).add(new Vector2(-n.y,n.x).multiply(15)));
	// 			var pos2=pos.add(n.multiply(120).add(new Vector2(n.y,-n.x).multiply(15)));
	
	// 			this.posList=[pos1,pos2];
	// 			this.angleList=[angle,angle];

	// 		}			
	// 	},
	// 	"gun3":{
	// 		name:"gun3",
	// 		size:[190,50],
	// 		angle:Math.PI/2,
	// 		src:srcObj.gun,
	// 		bulletName:"bullet3",
	// 		fireDuration:0.5,//秒
	// 		bulletCount:1,
	// 		setBulletPos:function(){//自定义炮弹发出位置
	// 			var angle=this.angle;
	// 			var pos=this.pos;
	// 			this.posList=[new Vector2(pos.x+120*Math.cos(angle),pos.y-120*Math.sin(angle))];
	// 			this.angleList=[angle];
	// 		}			

	// 	}
	// }

	var gunSet={
		"gun0":new J.Class({extend :Gun},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					name:"gun0",
					size:[120,30],
					angle:Math.PI/2,
					src:srcObj.gun,
					bulletName:"bullet0",
					fireDuration:1,//秒
					bulletCount:1
				});
				gunSet["gun0"].superClass.init.call(this,options);
			},
			setBulletPos:function(){//自定义炮弹发出位置
				var angle=this.angle;
				var pos=this.pos;
				this.posList=[new Vector2(pos.x+60*Math.cos(angle),pos.y-60*Math.sin(angle))];
				this.angleList=[angle];
			}			

		}),
		"gun1":new J.Class({extend :Gun},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					name:"gun1",
					size:[120,30],
					angle:0,
					src:srcObj.gun1,
					bulletName:"bullet1",
					bulletCount:1,
					fireDuration:0.1,
					canContinue:true
				});
				gunSet["gun1"].superClass.init.call(this,options);
			},
			setBulletPos:function(){//自定义炮弹发出位置
				var angle=this.angle;
				var pos=this.pos;
				this.posList=[new Vector2(pos.x+70*Math.cos(angle),pos.y-70*Math.sin(angle))];
				this.angleList=[angle];
			}			

		}),
		"gun2":new J.Class({extend :Gun},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					name:"gun2",
					size:[120,30],
					angle:Math.PI,
					src:srcObj.gun2,
					bulletName:"bullet2",
					bulletCount:2,
					fireDuration:0.5
				});
				gunSet["gun2"].superClass.init.call(this,options);
			},
			setBulletPos:function(){//自定义炮弹发出位置
				var angle=this.angle;
				var pos=this.pos;
				var n=new Vector2(Math.cos(angle),-Math.sin(angle));
			
				var pos1=pos.add(n.multiply(70).add(new Vector2(-n.y,n.x).multiply(8)));
				var pos2=pos.add(n.multiply(70).add(new Vector2(n.y,-n.x).multiply(8)));
	
				this.posList=[pos1,pos2];
				this.angleList=[angle,angle];
			}			

		}),
		"gun3":new J.Class({extend :Gun},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					name:"gun3",
					size:[120,30],
					angle:Math.PI/2,
					src:srcObj.gun,
					bulletName:"bullet3",
					fireDuration:0.5,//秒
					bulletCount:1
				});
				gunSet["gun3"].superClass.init.call(this,options);
			},
			setBulletPos:function(){//自定义炮弹发出位置
				var angle=this.angle;
				var pos=this.pos;
				this.posList=[new Vector2(pos.x+60*Math.cos(angle),pos.y-60*Math.sin(angle))];
				this.angleList=[angle];
			}
	

		}),
		"gun4":new J.Class({extend :Gun},{
			init:function(options){
				options=options||{};
				J.extend(options,{
					name:"gun4",
					size:[120,30],
					angle:Math.PI/2,
					src:srcObj.gun,
					bulletName:"bullet4",
					fireDuration:0.5,//秒
					bulletCount:1
				});
				gunSet["gun4"].superClass.init.call(this,options);
			},
			setBulletPos:function(){//自定义炮弹发出位置
				var angle=this.angle;
				var pos=this.pos;
				this.posList=[new Vector2(pos.x+60*Math.cos(angle),pos.y-60*Math.sin(angle))];
				this.angleList=[angle];
			},
			fire:function(target){
				var bullet=gunSet["gun4"].superClass.fire.call(this)[0];
				var view=cg.view;
				var player=CsTank.gameObj.player;
				var tankName;
				var targetTank;
				
				if(tankName=target.getAttribute("tankName")){
					(tankName==player.name)?targetTank=player:targetTank=CsTank.main.tankObj[tankName];
					bullet.target=targetTank;
					
				}
				//this.trackPos=[cg.input.mouse.x,cg.input.mouse.y];
			}			

		})
	};

	this.mapSet=mapSet;
	this.bulletSet=bulletSet;
	this.gunSet=gunSet;
});