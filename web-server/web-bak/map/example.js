(function(){
	var J=Jx();
	var cg=J.cnGame;
	var loadedImgs=cg.loader.loadedImgs;
	var srcObj=CsTank.config.srcObj;
	
	var map= new cg.Map2({gridSize:[40,40]});
	var house=new J.cnGame.MapElement({
		name:"house",
		img:loadedImgs[srcObj.house],
		coor:[10,7],
		cols:7,
		rows:5,
		isBlock:true
	});

	var tree1=new cg.MapElement({
		name:"tree1",
		img:loadedImgs[srcObj.tree1],
		coor:[10,13],
		cols:3,
		rows:3,
		isBlock:true
	});
	var tree2=new cg.MapElement({
		name:"tree1",
		img:loadedImgs[srcObj.tree1],
		coor:[10,17],
		cols:3,
		rows:3,
		isBlock:true
	});		
	var tree3=new cg.MapElement({
		name:"tree3",
		img:loadedImgs[srcObj.tree1],
		coor:[27,7],
		cols:3,
		rows:3,
		isBlock:true
	});	
	var tree4=new cg.MapElement({
		name:"tree4",
		img:loadedImgs[srcObj.tree1],
		coor:[27,10],
		cols:3,
		rows:3,
		isBlock:true
	});		
	map.add(house);
	map.add(tree1);
	map.add(tree2);
	map.add(tree3);
	map.add(tree4);
	
	return map;
})();
