Jx().$package("CsTank",function(J) {
	var config=CsTank.config,
	srcObj=config.srcObj;
	
	var bulletSet={
		"bullet0":{
			src:srcObj.bullet,
			size:[35,12],
			power:5,
			moveSpeed:config.bulletMoveSpeed
		},
		"bullet1":{
			src:srcObj.bullet,
			size:[35,12],
			power:5,
			moveSpeed:config.bulletMoveSpeed
		},
		"bullet2":{
			src:srcObj.bullet,
			size:[35,12],
			power:5,
			moveSpeed:config.bulletMoveSpeed
		}
	}

	var gunSet={
		"gun0":{
			name:"gun0",
			size:[190,50],
			angle:0,
			src:srcObj.gun
		},
		"gun1":{
			name:"gun1",
			size:[190,50],
			angle:0,
			src:srcObj.gun1
		},
		"gun2":{
			name:"gun2",
			size:[190,50],
			angle:0,
			src:srcObj.gun2			
		}
	}
	this.bulletSet=bulletSet;
	this.gunSet=gunSet;
});