/**    
 * TS (Tank Strike) 
 * Copyright (c) 2013, AlloyTeam.com, All rights reserved.
 * http://TS.AlloyTeam.com/
 *
 * @version    1.0
 * @author    Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

// 游戏主界面，菜单、系统弹窗、背景、音乐
Jx().$package("tankStrike.start", function(J){
	var $D = J.dom,
		$E = J.event;
	var bg = $D.id("bg"),
	
		startButtonEl = $D.id("startButton"),
		settingButtonEl = $D.id("settingButton"),
		creditsButtonEl = $D.id("creditsButton"),
		aboutButtonEl = $D.id("aboutButton"),
		quitButtonEl = $D.id("quitButton"),
		
		loginWindowEl = $D.id("loginWindow"),
		loginWindowCloseEl = $D.id("loginWindowClose"),
		loginOKEl = $D.id("loginOK"),
		
		
		aboutWindowEl = $D.id("aboutWindow"),
		aboutWindowCloseEl = $D.id("aboutWindowClose"),
		aboutOKEl = $D.id("aboutOK");
	
	var count=1;
	
	
	
	$E.on(document, "keydown",function(e){
		console.log(count);
		if(e.keyCode === 39){
			count++;
			$D.setStyle(bg,"backgroundImage","url(style/start/gametitle_bg"+count+".jpg)");
			
		}else if(e.keyCode === 37){
			count--;
			$D.setStyle(bg,"backgroundImage","url(style/start/gametitle_bg"+count+".jpg)");
		
		}
	});
	
	
	
	$E.on(startButtonEl, "click",function(e){
		$D.show(loginWindowEl);
	});
	$E.on(settingButtonEl, "click",function(e){
		alert("你想设置什么呢？")
	});
	$E.on(creditsButtonEl, "click",function(e){
		$D.show(aboutWindowEl);
	});
	$E.on(aboutButtonEl, "click",function(e){
		$D.show(aboutWindowEl);
	});
	$E.on(quitButtonEl, "click",function(e){
		alert("客官不要走嘛，刚来就走啊...")
	});
	
	$E.on(loginWindowCloseEl, "click",function(e){
		$D.hide(loginWindowEl);
	});
	$E.on(loginOKEl, "click",function(e){
		//alert("欢迎进入 坦克争霸 的世界...")
	});
	
	
	$E.on(aboutWindowCloseEl, "click",function(e){
		$D.hide(aboutWindowEl);
	});
	$E.on(aboutOKEl, "click",function(e){
		$D.hide(aboutWindowEl);
	});



	var J=Jx(),$D=J.dom;
    var toQueryPair = function(key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
    };
    var toQueryString = function(obj){
        var result=[];
        for(var key in obj){
            result.push(toQueryPair(key, obj[key]));
        }
        return result.join("&");
    };


    var uid;
    var pwd;
    var accessToken;

    var showGameFrame = function(accessToken,uid){
    	var gameFrame = document.createElement("iframe");
    	gameFrame.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"
    	gameFrame.src = "./index?accessToken="+encodeURIComponent(accessToken)+"&uid="+encodeURIComponent(uid);
    	document.body.appendChild(gameFrame);

    }
    
   
    uid=localStorage.getItem("uid");
    pwd=localStorage.getItem("pwd");

    if(uid!="")
    	$D.id("loginAccount").value=uid;
    if(pwd!="")
    	$D.id("loginPassword").value=pwd;

	$D.id("loginOK").onclick=function(){
		uid=$D.id("loginAccount").value;
		pwd=$D.id("loginPassword").value;
		J.http.ajax("http://account.alloyteam.com/api/login",{
			method:"POST",
			contentType:"application/x-www-form-urlencoded",
			data:toQueryString({
				uid:uid,
				pwd:pwd
			}),
			onSuccess:function(data){
				data=JSON.parse(data.responseText).data;
				accessToken=data.accessToken;
				uid=data.uid;
				//messageHandler.login(accessToken,uid);
				localStorage.setItem("uid",uid);
				localStorage.setItem("pwd",pwd);
				//window.location.href = "./?accessToken="+encodeURIComponent(accessToken)+"&uid="+encodeURIComponent(uid);
				showGameFrame(accessToken,uid);
			}
		});
	}
	// connect();
	

});


// TankStrike 选择地区和服务器的模块
Jx().$package("tankStrike.server", function(J){
	var $D = J.dom,
		$E = J.event;

	

});


// TankStrike 创建和选择房间模块
Jx().$package("tankStrike.room", function(J){
	var $D = J.dom,
		$E = J.event;

	

});


// TankStrike 游戏模块
Jx().$package("tankStrike.game", function(J){
	var $D = J.dom,
		$E = J.event;

	

});
