Jx().$package("CsTank",function(J) {

	var mapManager=(function(){
		//地图列表
		var list={};
		return {
			add:function(name,map){
				list[name]=map;
			},
			get:function(name,callback){
				var map;
				var self=this;
				if(list[name]) return list[name];
				J.http.ajax("map/"+name+".js", {
					type:"text",
					onSuccess:function(data){
						map=eval(data.responseText);
						self.add(name,map);
						callback(map);
					}
				});	
			}
		}
	})();
	this.mapManager=mapManager;
});