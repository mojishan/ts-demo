Jx().$package("CsTank.collision",function(J) {
	var collision=J.cnGame.collision;


	this.blockCol=function(tank,stage){
		/*var block;
		if(block=stage.isInnerBlockRange([tank.pos.x,tank.pos.y],1))
			return block;
		return false;*/
		var block;
		if(block=stage.isCollideWithBlock(tank,1))
			return block;
		return false;

	};
	this.wallCol=function(tank,bg){
		var rect=tank.getRect();
		var arr=rect.pointsArr;
		
		for(var i=0,len=arr.length;i<len;i++){
			var x=arr[i].x;
			var y=arr[i].y;
			if(x<0||x>bg.width||y<0||y>bg.height){
				return true;
			}
		}
		return false;
	}
	this.tankCol=function(s1,s2){
		return collision.rotateRectCollisionDetect(s1,s2);
	}
	this.bulletHitCol=function(s1,s2){
		return collision.rotateRectCollisionDetect(s1,s2);
	}
});