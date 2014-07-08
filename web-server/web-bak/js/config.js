Jx().$package("CsTank",function(J) {
	var config={
		srcObj:{
			ground:"style/map/ground1.jpg",
			gun:"style/tank/gun.png",
			gun1:"style/tank/gun1.png",
			gun2:"style/tank/gun2.png",
			body:"style/tank/body.png",
			bullet:"style/tank/bullet.png",
			bullet1:"style/tank/bullet1.png",
			explode:"style/game/explode.png",
			train:"style/map/train.png",
			tree:"style/map/tree.png",
			house:"style/map/house.png",
			exSheet:"style/game/yezi.png",
			shootSound:"audios/shoot.wav",
			explodeSound:"audios/explode.wav"
		},
		maxGunNumber:5,
		tankMoveSpeed:127,
		bulletMoveSpeed:500,
		tankTurnSpeed:Math.PI,
		speedLevel:{
			"0":1,
			"1":2,
			"2":3
		}
	}
	this.config=config;

});