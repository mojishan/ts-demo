/**
*
* name:cnGame.js    
*`author:cson
*`date:2012-2-7
*`version:1.5
*
**/ 
Jx().$package(function(J){
    var $D = J.dom;
    
    var cnGame = {
        /**
        *初始化
        **/
        init: function(id, options) {
            options = options || {};
            this.canvas = $D.id(id || "canvas");
            this.context = this.canvas.getContext('2d');
            this.title = $D.tagName('title')[0];
            this.size=options.size||[400,400];
            this.canvas.width =this.width= this.size[0];
            this.canvas.height =this.height= this.size[1];
            this.pos=this.getCanvasPos(this.canvas);
            this.fps=options.fps||60;
            this.tps=options.tps||60;
            this.bgColor=options.bgColor;
            this.spriteList=new J.cnGame.SpriteList();
            this.bgImageSrc=options.bgImageSrc;
            this.isScaleBg=options.isScaleBg;
            this.view=options.view||new J.cnGame.View();
        },
        setView:function(view){
            this.view=view;
        },
        setSize:function(width,height){
            width=width||this.size[0];
            height=height||this.size[1];

            this.size=[width,height];
            var canvas=this.canvas;
            canvas.width =this.width= this.size[0];
            canvas.height =this.height= this.size[1];
            canvas.style.width=canvas.width+"px";
            canvas.style.height=canvas.height+"px";
        },
        getSize:function(){
            return [this.width,this.height];
        },
        /**
         *获取canvas在页面的位置
         **/
        getCanvasPos:function(canvas) {
            var left = 0;
            var top = 0;
            while (canvas.offsetParent) {
                left += canvas.offsetLeft;
                top += canvas.offsetTop;
                canvas = canvas.offsetParent;
            }
            return new Vector2(left,top);
        },
        updateCanvasPos:function(){
            this.pos=this.getCanvasPos(this.canvas);  
        },
        /**
        *返回是否在canvas外
        **/
        isOutsideCanvas:function(elem){
            return elem.pos[0]+elem.size[0]<0||elem.pos[0]>this.canvas.width||elem.pos[1]+elem.size[1]<0||elem.pos[1]>this.canvas.height;
        },
        /**
        *清除画布
        **/
        clean: function() {
            this.context.clearRect(0,0,this.width, this.height);
        },
        /**
        *绘制画布背景色
        **/     
        drawBg:function(){
            var view=this.view;
            var s=view.size;
            var w=s[0];
            var h=s[1];
            var p=view.pos;
            var x=p[0];
            var y=p[1];

            var ctx=this.context;
          
            if(this.bgColor){
                ctx.save();
                this.view.apply(ctx);
                ctx.fillStyle=this.bgColor;
                ctx.translate(this.width/2,this.height/2);
                ctx.fillRect(-w/2,-h/2,s[0],s[1]);
                ctx.restore();
            }   
            else if(this.bgImageSrc){
                var img=this.loader.loadedImgs[this.bgImageSrc];
                if(img){
                    ctx.save();
                    this.view.apply(ctx);
                    ctx.translate(this.width/2,this.height/2);
                    if(this.isScaleBg){
                        ctx.drawImage(img,0,0,img.width,img.height,-this.width/2,-this.height/2,this.width,this.height);
                    }
                    else{
                        ctx.drawImage(img,0,0,img.width,img.height,-this.width/2,-this.height/2,img.width,img.height);
                    }
                    ctx.restore();
                }
            }
        }
    }
    J.cnGame=cnGame;
    
});
/**
*
*基本工具函数模块
*
**/
Jx().$package(function(J){
    var core=J.cnGame.core={};
    /**
    按id获取元素
    **/
    core.$ = function(id) {
        return document.getElementById(id);
    };
    /**
    按标签名获取元素
    **/
    core.$$ = function(tagName, parent) {
        parent = parent || document;
        return parent.getElementsByTagName(tagName);
    };
     /**
    按标签名创建元素
    **/
    core.$$$ = function(tagName) {
        return document.createElement(tagName);
    };
    /**
    按类名获取元素
    **/
    core.$Class = function(className, parent) {
        var arr = [], result = [];
        parent = parent || document;
        arr = core.$$("*");
        for (var i = 0, len = arr.length; i < len; i++) {
            if ((" " + arr[i].className + " ").indexOf(" " + className + " ") > 0) {
                result.push(arr[i]);
            }
        }
        return result;
    };
    /**
    事件绑定
    **/
    core.bindHandler = (function() {

        if (window.addEventListener) {
            return function(elem, type, handler,context) {
                elem.addEventListener(type, function(){
                    handler.apply(context,arguments);
                }, false);
            }
        }
        else if (window.attachEvent) {
            return function(elem, type, handler,context) {
                elem.attachEvent("on" + type, function(){
                    handler.apply(context,arguments);
                });
            }
        }
    })();
    /**
    事件解除
    **/
    core.removeHandler = (function() {
        if (window.addEventListener) {
            return function(elem, type, handler) {
                elem.removeEventListener(type, handler, false);
            }
        }
        else if (window.attachEvent) {
            return function(elem, type, handler) {
                elem.detachEvent("on" + type, handler);
            }
        }
    })();

    /**
    获取事件对象
    **/
    core.getEventObj = function(eve) {
        return eve || win.event;
    };
    /**
    获取事件目标对象
    **/
    core.getEventTarget = function(eve) {
        var eve = core.getEventObj(eve);
        return eve.target || eve.srcElement;
    };
    /**
    禁止默认行为
    **/
    core.preventDefault = function(eve) {
        if (eve.preventDefault) {
            eve.preventDefault();
        }
        else {
            eve.returnValue = false;
        }

    };
    /**
    是否为undefined
    **/
    core.isUndefined = function(elem) {
        return typeof elem === 'undefined';
    };
    /**
    是否为数组
    **/
    core.isArray = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Array]";
    };
    /**
    是否为Object类型
    **/
    core.isObject = function(elem) {
        return elem === Object(elem);
    };
    /**
    是否为字符串类型
    **/
    core.isString = function(elem) {
        return Object.prototype.toString.call(elem) === "[object String]";
    };
    /**
    是否为数值类型
    **/
    core.isNum = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Number]";
    };
    /**
    是否为function
    **/
   core.isFunction = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Function]";
    };
    /**
    *复制对象属性
    **/
    core.extend = function(destination, source, isCover) {
        var isUndefined = core.isUndefined;
        (isUndefined(isCover)) && (isCover = true);
        for (var name in source) {
            if (isCover || isUndefined(destination[name])) {
                destination[name] = source[name];
            }

        }
        return destination;
    };

});

/**
*
*矩阵
*
**/
Jx().$package(function(J){
    var matrix=new J.Class({
        /**
        *初始化
        **/         
        init:function(options){
            this.matrix=[];
            this.setOptions(options);
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *矩阵相加
        **/
        add:function(mtx){
            var omtx=this.matrix;
            var newMtx=[];
            if(!mtx.length||!mtx[0].length||mtx.length!=omtx.length||mtx[0].length!=omtx[0].length){//如果矩阵为空，或行或列不相等，则返回
                return;
            }
            for(var i=0,len1=omtx.length;i<len1;i++){
                var rowMtx=omtx[i];
                newMtx.push([]);
                for(var j=0,len2=rowMtx.length;j<len2;j++){
                    newMtx[i][j]=rowMtx[j]+mtx[i][j];
                }
            }
            this.matrix=newMtx;
            return this;
        },
        /**
        *矩阵相乘
        **/
        multiply:function(mtx){
            var omtx=this.matrix;
            var mtx=mtx.matrix;
            var newMtx=[];
            //和数字相乘
            if(J.cnGame.core.isNum(mtx)){
                for(var i=0,len1=omtx.length;i<len1;i++){
                    var rowMtx=omtx[i];
                    newMtx.push([]);
                    for(var j=0,len2=rowMtx.length;j<len2;j++){
                        omtx[i][j]*=mtx;    
                    }
                }
                this.matrix=newMtx;
                return this;
            }
            //和矩阵相乘
            var sum=0;
            for(var i=0,len1=omtx.length;i<len1;i++){
                var rowMtx=omtx[i]; 
                newMtx.push([]);
                for(var m=0,len3=mtx[0].length;m<len3;m++){
                    for(var j=0,len2=rowMtx.length;j<len2;j++){
                        sum+=omtx[i][j]*mtx[j][m];  
                    }
                    newMtx[newMtx.length-1].push(sum);
                    sum=0;
                }
            }
            this.matrix=newMtx;
            return this;        
        },
        /**
        *2d平移
        **/
        translate2D:function(x,y){
            var changeMtx= new matrix({
                matrix:[
                   [1,0,0],
                   [0,1,0],
                   [x,y,1]
                ]
            });
            return this.multiply(changeMtx);
        },
        /**
        *2d缩放
        **/             
        scale2D:function(scale,point){//缩放比，参考点
            var sx=scale[0],sy=scale[1],x=point[0],y=point[1];

            var changeMtx= new matrix({
                matrix:[
                   [sx,0,0],
                   [0,sy,0],
                   [(1-sx)*x,(1-sy)*y,1]
                ]
            }); 
            return this.multiply(changeMtx);                
            
        },
        /**
        *2d对称变换
        **/                 
        symmet2D:function(axis){//对称轴
            var changeMtx;
            axis=="x"&&(changeMtx= new matrix({//相对于x轴对称
                matrix:[
                   [1,0,0],
                   [0,-1,0],
                   [0,0,1]
                ]
            }));                
            axis=="y"&&(changeMtx= new matrix({//相对于y轴对称
                matrix:[
                   [-1,0,0],
                   [0,1,0],
                   [0,0,1]
                ]
            }));    
            axis=="xy"&&(changeMtx= new matrix({//相对于原点对称
                matrix:[
                   [-1,0,0],
                   [0,-1,0],
                   [0,0,1]
                ]
            }));    
            axis=="y=x"&&(changeMtx= new matrix({//相对于y=x对称
                matrix:[
                   [0,1,0],
                   [1,0,0],
                   [0,0,1]
                ]
            }));    
            axis=="y=-x"&&(changeMtx= new matrix({//相对于y=-x对称
                matrix:[
                   [0,-1,0],
                   [-1,0,0],
                   [0,0,1]
                ]
            }));
            return this.multiply(changeMtx);                
        },
        /**
        *2d错切变换
        **/             
        shear2D:function(kx,ky){
            var changeMtx= new matrix({
                matrix:[
                   [1,kx,0],
                   [ky,1,0],
                   [0,0,1]
                ]
            }); 
            return this.multiply(changeMtx);
        },
        /**
        *2d旋转
        **/         
        rotate2D:function(angle,point){
            var x=point[0],y=point[1];
            var cos=Math.cos;
            var sin=Math.sin;
            var changeMtx= new matrix({
                matrix:[
                   [cos(angle),sin(angle),0],
                   [-sin(angle),cos(angle),0],
                   [(1-cos(angle))*x+y*sin(angle),(1-cos(angle))*y-x*sin(angle),1]
                ]
            }); 
            return this.multiply(changeMtx);
        },
        /**
        *3d平移
        **/
        translate3D:function(x,y,z){
            var changeMtx= new matrix({
                matrix:[
                   [1,0,0,0],
                   [0,1,0,0],
                   [0,0,1,0],
                   [x,y,z,1]
                ]
            });
            return this.multiply(changeMtx);
        },
        /**
        *3d缩放
        **/             
        scale3D:function(scale,point){//缩放比数组，参考点数组
            var sx=scale[0],sy=scale[1],sz=scale[2],x=point[0],y=point[1],z=point[2];           
            var changeMtx= new matrix({
                matrix:[
                   [sx,0,0,0],
                   [0,sy,0,0],
                   [0,0,sz,0],
                   [(1-sx)*x,(1-sy)*y,(1-sz)*z,1]
                ]
            }); 
            return this.multiply(changeMtx);                
            
        },          
        /**
        *3d旋转
        **/         
        rotate3D:function(angle,axis){
            var cos=Math.cos(angle);
            var sin=Math.sin(angle);
            var changeMtx; 

            axis=="x"&&(changeMtx=new matrix({
                            matrix:[
                               [1,0,0,0],
                               [0,cos,sin,0],
                               [0,-sin,cos,0],
                               [0,0,0,1]
                            ]
                        }));    

            axis=="y"&&(changeMtx=new matrix({
                            matrix:[
                               [cos,0,-sin,0],
                               [0,1,0,0],
                               [sin,0,cos,0],
                               [0,0,0,1]
                            ]
                        }));                        
            axis=="z"&&(changeMtx=new matrix({
                            matrix:[
                               [cos,sin,0,0],
                               [-sin,cos,0,0],
                               [0,0,1,0],
                               [0,0,0,1]
                            ]
                        }));                                    
            return this.multiply(changeMtx);
        } 
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Matrix=matrix;
});


/**
*
*Ajax模块
*
**/
/*
cnGame.register("cnGame.ajax", function(cg) {
    var activeXString; //为IE特定版本保留的activeX字符串
    var onXHRload = function(xhr, options) {
        return function(eve) {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.state < 300) || xhr.status == 304) {
                    var onSuccess = options.onSuccess;
                    onSuccess && onSuccess();
                }
                else {
                    var onError = options.onError;
                    onError && onError();

                }
            }
        }
    };
    /**
    *生成XMLHttpRequest对象
    **/
  /*  this.creatXHR = function() {
        if (!cg.core.isUndefined(XMLHttpRequest)) {
            return new XMLHttpRequest();
        }
        else if (!cg.core.isUndefined(ActiveXObject)) {
            if (!cg.core.isString(activeXString)) {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                for (var i = 0, len = versions.length; i < len; i++) {
                    try {
                        var xhr = new ActiveXObject(versions[i]);
                        activeXString = versions[i];
                        return xhr;
                    }
                    catch (e) {
                    }
                }
            }
            return new ActiveXObject(activeXString);
        }
    }
    /**
    *发送请求
    **/
    /*this.request = function(options) {
        var defaultObj = {
            type: "get"
        };
        cg.core.extend(defaultObj, options);
        var type = options.type;
        var xhr = this.creatXHR();

        cg.core.bindHandler(xhr, "readystatechange", function(eve) {//资源加载完成回调函数
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.state < 300) || xhr.status == 304) {
                    var onSuccess = options.onSuccess;
                    onSuccess && onSuccess();
                }
                else {
                    var onError = options.onError;
                    onError && onError();

                }
            }
        });

        var requestOpt = options.requestOpt;
        var url = options.url;

        if (type == "get") {//get请求数据处理
            if (url.indexOf("?") < 0) {
                url += "?";
            }
            else {
                url += "&";
            }

            for (name in requestOpt) {
                if (requestOpt.hasOwnProperty(name)) {
                    url += encodeURIComponent(name) + "=" + encodeURIComponent(requestOpt[name]) + "&";
                    url = url.slice(0, -1);
                    xhr.open(type, url, true);
                    xhr.send(null);
                }
            }
        }
        else if (type == "post") {//post请求数据处理
            var _requestOpt = {}
            for (name in requestOpt) {
                if (requestOpt.hasOwnProperty(name)) {
                    _requestOpt[encodeURIComponent(name)] = encodeURIComponent(requestOpt[name]);
                }
            }
            xhr.open(type, url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(_requestOpt);
        }
    }

});
*/
/**
*
*资源加载器
*
**/
Jx().$package(function(J){
    $E = J.event;

    var file_type = {}
    file_type["js"] = "js";
    file_type["json"] = "json";
    file_type["wav"] = "audio";
    file_type["mp3"] = "audio";
    file_type["ogg"] = "audio";
    file_type["png"] = "image";
    file_type["jpg"] = "image";
    file_type["jpeg"] = "image";
    file_type["gif"] = "image";
    file_type["bmp"] = "image";
    file_type["tiff"] = "image";

    /**
    *资源加载完毕的处理程序
    **/
    var resourceLoad = function(self, type) {
        return function() {
            
            type == "image" && (self.loadedImgs[this.srcPath] = this);
            type == "audio" && (self.loadedAudios[this.srcPath] = this);
            if(type == "error"){
                self.errorCount ++;
            }
            else{
                self.loadedCount ++;
            }
            $E.removeEventListener(this, "load", arguments.callee);//保证图片的onLoad执行一次后销毁
            $E.removeEventListener(this, "error", arguments.callee);
            $E.removeEventListener(this, "canplaythrough", arguments.callee);
            if(type){//不是无资源的直接调用resourceLoad
                self.loadedPercent = Math.floor((self.loadedCount+self.errorCount) / self.sum * 100);
                self.onLoad && self.onLoad(self.loadedPercent);
            }
            if (!type || self.loadedPercent === 100) {//如果没有资源需要加载或者资源已经加载完毕
                self.loadedCount = 0;
                self.errorCount = 0;
                self.loadedPercent = 0;
                type == "image" && (self.loadingImgs = {});
                type == "audio" && (self.loadingAudios = {});
                if (self.gameObj && self.gameObj.initialize) {
                    self.gameObj.initialize(self.startOptions);
                    if (J.cnGame.loop && !J.cnGame.loop.stop) {//结束上一个循环
                        J.cnGame.loop.end();
                    }
                    J.cnGame.loop = new J.cnGame.GameLoop(self.gameObj,{fps:J.cnGame.fps,tps:J.cnGame.tps}); //开始新游戏循环
                    J.cnGame.loop.start();
                }
            }
        }
    }
    /**
    *图像加载器
    **/
    var loader = {
        sum: 0,         //图片总数
        loadedCount: 0, //图片已加载数
        errorCount:0,   //错误数
        loadingImgs: {}, //未加载图片集合
        loadedImgs: {}, //已加载图片集合
        loadingAudios: {}, //未加载音频集合
        loadedAudios: {}, //已加载音频集合
        /**
        *动态加载
        **/        
        load:function(src,onLoad,onError){
            var suffix = src.substring(src.lastIndexOf(".") + 1);
            var type = file_type[suffix];
            var loaderContext = this; 
            if(type == "image"){
                this.loadImage(src,function(){
                    loaderContext.loadedImgs[this.srcPath]=this;
                    if(onLoad){
                        onLoad(this);
                    }
                },onError);
            }
            if(type == "audio"){
                this.loadAudio(src,function(){
                    loaderContext.loadedAudios[this.srcPath]=this;
                    if(onLoad){
                        onLoad(this);
                    }
                },onError);
            }
            if(type == "js"){
                this.loadJS(src,function(){
                    if(onLoad){
                        onLoad();
                    }
                },onError);
            }

        },
        loadImage:function(path,onLoad,onError){
            var img = new Image();
            $E.addOriginalEventListener(img, "load", onLoad);
            $E.addOriginalEventListener(img, "error", onError);
            img.src = path;
            img.srcPath = path; //没有经过自动变换的src      
        },
        loadAudio:function(path,onLoad,onError){   
            if(J.browser.ie && J.browser.ie < 9){
                return;
            }
            var audio=this.loadingAudios[path]=new Audio();
            $E.addOriginalEventListener(audio, "canplaythrough",onLoad);
            $E.addOriginalEventListener(audio, "error", onError);  
            audio.src=path;     
            audio.srcPath = path; //没有经过自动变换的src
            audio.load();    
        },
        loadJS:function(path,onLoad,onError){
            var head = J.cnGame.core.$$("head")[0];
            var script = document.createElement("script");
            head.appendChild(script);
            $E.addOriginalEventListener(script, "load",onLoad );
            $E.addOriginalEventListener(script, "error",onError );
            script.src = path;
        },
        /**
        *图像加载，之后启动游戏
        **/
        start: function(gameObj, options) {//options:srcArray,onload
            var loaderContext = this;
            options=options||{};
            var srcArr = options.srcArray;
            this.startOptions = options.startOptions; //游戏开始需要的初始化参数
            this.onLoad = options.onLoad;
            this.gameObj = gameObj;
            this.sum = 0;
            J.cnGame.spriteList.clean();
            if(!srcArr){//如果没有资源需要加载，直接执行resourceLoad回调
                resourceLoad(this)();
            }
            else if (J.isArray(srcArr) || J.isObject(srcArr)) {
                
                for (var i in srcArr) {
                    if (srcArr.hasOwnProperty(i)) {
                        loaderContext.sum++;
                        var path = srcArr[i];
                        if(J.isObject(path)){
                            load(path);

                        }else{
                            var suffix = srcArr[i].substring(srcArr[i].lastIndexOf(".") + 1);
                            var type = file_type[suffix];
                            if (type == "image") {
                                this.loadImage(path,resourceLoad(loaderContext, "image"),resourceLoad(loaderContext, "error"));
                            }
                            else if (type == "audio") {
                                this.loadAudio(path,resourceLoad(loaderContext, "audio"),resourceLoad(loaderContext, "error"));       
                            }
                            else if (type == "js") {//如果是脚本，加载后执行
                                this.loadJS(path,resourceLoad(loaderContext, "js"),resourceLoad(loaderContext, "error"));

                            }

                        }
                        
                    }
                }

            }
            if(!loaderContext.sum){//传入的是空对象
                resourceLoad(this)();
            }

        }
    };
    J.cnGame=J.cnGame||{};
    J.cnGame.loader = loader;
});
/**
*
*movableObj对象
*
**/
Jx().$package(function(J){
    var restrict360=function(angle){
        angle=angle%(Math.PI*2);
        if(angle<0){
            angle+=Math.PI*2;
        }
        return angle;
    }
    var angleToRadian=function(angle){
        return angle/180*Math.PI;
    }
    var radianToAngle=function(radian){
        return radian*180/Math.PI;
    }
    var movableObj=new J.Class({
        /**
        *初始化
        **/
        init:function(options){
            var postive_infinity=Number.POSITIVE_INFINITY;
            /**
            *默认值
            **/
            this.pos= new Vector2(0,0);
            this.imgStart= [0,0];
            this.imgSize= [32,32];
            this.size= [32,32];
            this.angle= 0;
            this.speed= [Vector2.zero,0];
            this.a= [Vector2.zero,0];
            this.maxSpeed=postive_infinity;
            this.maxAngleSpeed=postive_infinity;
            this.maxPos=[postive_infinity,postive_infinity];
            this.minPos=[-postive_infinity,-postive_infinity];
            options = options || {};
            this.setOptions(options);           
            
        },
        /**
        *返回X方向速度
        **/
        getSpeedX:function(){
            return this.speed[0].x;
        },
        /**
        *返回Y方向速度
        **/
        getSpeedY:function(){
            return -this.speed[0].y;
        },
        /**
        *返回参照物相对于该对象的角度
        **/
        getRelatedAngle:function(elem){
            v=elem.pos[1].subtract(this.pos[1])

            var dy=-v.sy;
            var dx=v.x;
            var heading=this.getHeading();
            var posAngle=Math.atan2(dy,dx);
            relatedAngle=posAngle- angleToRadian(heading);
            if(relatedAngle<-Math.PI) relatedAngle+=2*Math.PI;
            else if(relatedAngle>Math.PI) relatedAngle-=2*Math.PI;
            return radianToAngle(relatedAngle);

        },
        /**
        *获取某对象到该对象距离
        **/        
        getDistance:function(elem){
            return Math.sqrt((elem.pos.x-this.pos.x)*(elem.pos.x-this.pos.x)+(elem.pos.y-this.pos.y)*(elem.pos.y-this.pos.y));
        },       
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *移动一定距离
        **/
        move: function(v) {
            this.pos=this.pos.add(v);
            return this;

        },
        /**
        *移动到某处
        **/
        moveTo: function(pos) {
            this.pos.x = Math.min(Math.max(this.minPos.x, pos.x), this.maxPos.x);
            this.pos.y = Math.min(Math.max(this.minPos.y, pos.y), this.maxPos.y);
            return this;
        },
        /**
        *旋转一定角度
        **/
        rotate: function(da) {//要旋转的角度
            da = da || 0;
            var angle=this.angle||0;
            this.angle = angle+da;
            restrict360(this.angle);
            return this;
        },
        /**
        *旋转到一定角度
        **/
        rotateTo: function(angle) {
            this.angle = angle;
            return this;
        },
        /**
        *停止移动
        **/
        stop:function(){
            this.speed=[Vector2.zero,0];   
            this.a=[Vector2.zero,0];
            return this;
        },
        resetPos:function(){
            if(this.prePos)
                this.pos=this.prePos;
            if(this.preAngle)
                this.angle=this.preAngle;
        },
        /**
        *更新位置
        **/
        update: function(duration) {//duration:该帧历时 单位：秒

            this.prePos=this.pos;
            this.preSpeed=this.speed.slice();
            this.preAngle=this.angle;
           
            this.speed[0]=this.speed[0].add(this.a[0].multiply(duration));
            this.pos=this.pos.add(this.speed[0].multiply(duration));

            //角速度 
            this.speed[1] = this.speed[1] + this.a[1] * duration; 
            this.rotate(this.speed[1]*duration);

        }

    });  
    J.cnGame=J.cnGame||{};
    J.cnGame.MovableObj=movableObj;
});
/*
*
*canvas基本形状对象
*
**/
Jx().$package(function(J){

    /**
    *矩形对象
    **/
    var rect =new J.Class({extend : J.cnGame.MovableObj},{
        /**
        *初始化
        **/
        init: function(options) {

            this.style="Red";
            this.angle=0;
            this.isFill=true;
            this.alpha=1;
            rect.superClass.init.call(this,options);

        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *绘制矩形
        **/
        draw: function() {
            var cg=J.cnGame;
            var context = J.cnGame.context;
            context.save()
            var point=this.pos;//默认的相对点为sprite的中点
            cg.view.apply(context);
            context.translate(point.x,point.y);
            context.rotate(this.angle * -1);
            context.globalAlpha=this.alpha;
            if (this.isFill) {
                context.fillStyle = this.style;
                context.fillRect(-this.size[0]/2, -this.size[1]/2 , this.size[0], this.size[1]);
            }
            else {
                context.strokeStyle = this.style;
                context.strokeRect(-this.size[0]/2, -this.size[1]/2, this.size[0], this.size[1]);
            }
            context.restore();
            return this;
        },
        /**
        *改变一定尺寸
        **/
        resize: function(dSize) {
            this.size[0] += dSize[0];
            this.size[1] += dSize[1];
            return this;
        },
        /**
        *改变到一定尺寸
        **/
        resizeTo: function(size) {
            this.width = size[0];
            this.height = size[1];
            return this;
        },
        /**
        *返回是否在某对象左边
        **/
        isLeftTo:function(obj,isCenter){//isCenter:是否以中点为依据判断
            if(isCenter) return this.pos.x<obj.pos.x;
            return this.pos.x+this.size[0]/2<obj.pos.x-obj.size[0]/2;
        },
        /**
        *返回是否在某对象右边
        **/
        isRightTo:function(obj,isCenter){
            if(isCenter) return this.pos.x>obj.pos.x;
            return this.pos.x-this.size[0]/2>obj.pos.x+obj.size[0]/2;
        },
        /**
        *返回是否在某对象上边
        **/
        isTopTo:function(obj,isCenter){
            if(isCenter) return this.pos.y<obj.pos.y;
            return this.pos.y+this.size[1]/2<obj.pos.y-obj.size[0]/2;
        },
        /**
        *返回是否在某对象下边
        **/
        isBottomTo:function(obj,isCenter){
            if(isCenter) return this.pos.y>obj.pos.y;
            return this.pos.y-this.size[0]/2>obj.pos.y+obj.size[1]/2;
        },
        /**
        *点是否在矩形内
        **/            
        isInside:function(v){
            var pointX=v.x;
            var pointY=v.y;
            var x=this.pos.x;
            var y=this.pos.y;
            var right=x+this.size[0];
            var bottom=y+this.size[1];
            return (pointX >= x && pointX <= right && pointY >= y && pointY <= bottom);
        },
        /**
        *返回正矩形的相对于某点的四个顶点坐标
        **/
        getPoints:function(v){
            
            var leftTop=[],rightTop=[],leftBottom=[],rightBottom=[],pos=[];
            //相对于point的坐标
            pos.x=this.pos.x-v.x;
            pos.y=v.y-this.pos.y;

            //相对于point的四个顶点坐标
            leftTop=new Vector2(pos.x-this.size[0]/2,pos.y-this.size[1]/2);
            rightTop=new Vector2(pos.x+this.size[0]/2,pos.y-this.size[1]/2);
            leftBottom=new Vector2(pos.x-this.size[0]/2,pos.y+this.size[1]/2);
            rightBottom=new Vector2(pos.x+this.size[0]/2,pos.y+this.size[1]/2);

            return[leftTop,rightTop,rightBottom,leftBottom];
        },
        /**
        *返回相对于某点包含该sprite的矩形对象
        **/
        getRect: function() {  
            var point=this.pos;//默认的相对点为sprite的中点
            var points=this.getPoints(point);
            var pointsArr=[];
            var angle=this.angle;
            for(var i=0,len=points.length;i<len;i++){
                var thePoint=points[i];
                //相对于某点旋转后的顶点坐标
                var newX=thePoint.x*Math.cos(angle)-thePoint.y*Math.sin(angle);
                var newY=thePoint.x*Math.sin(angle)+thePoint.y*Math.cos(angle);
                //从相对于某点的坐标系转换为相对于canvas的位置
                newX+=point.x;
                newY=point.y-newY;
                pointsArr.push(new Vector2(newX,newY));//四个顶点旋转后的坐标
            }
            return new J.cnGame.shape.Polygon({pointsArr:pointsArr});
        }
    });
    /**
    *圆形对象
    **/
    var circle =new J.Class({extend : J.cnGame.MovableObj},{
        /**
        *初始化
        **/
        init: function(options) {
            /**
            *默认值对象
            **/
            this.r = 100;
            this.startAngle= 0;
            this.endAngle= Math.PI * 2;
            this.antiClock= false;
            this.alpha=1;
            this.style= "red";
            this.isFill= true;
            options = options || {};
            circle.superClass.init.call(this,options);
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *绘制圆形
        **/
        draw: function() {
            var context = J.cnGame.context;
            context.globalAlpha=this.alpha;
            context.beginPath();
        
            context.arc(this.pos.x, this.pos.y, this.r, this.startAngle, this.endAngle, this.antiClock);
            context.closePath();
            if (this.isFill) {
                context.fillStyle = this.style;
                context.fill();
            }
            else {
                context.strokeStyle = this.style;
                context.stroke();
            }

        },
        /**
        *将圆形改变一定大小
        **/
        resize: function(dr) {
            dr = dr || 0;
            this.r += dr;
            return this;

        },
        /**
        *将圆形改变到特定大小
        **/
        resizeTo: function(r) {
            r = r || this.r;
            this.r = r;
            return this;
        },
        /**
        *返回是否在某对象左边
        **/
        isLeftTo:function(obj,isCenter){
            if(isCenter) return this.pos.x<obj.pos.x;
            return this.pos.x+this.r<obj.pos.x-obj.r;
        },
        /**
        *返回是否在某对象右边
        **/
        isRightTo:function(obj,isCenter){
            if(isCenter) return this.pos.x>obj.pos.x;
            return this.pos.x-this.r>obj.pos.x+obj.r;
        },
        /**
        *返回是否在某对象上边
        **/
        isTopTo:function(obj,isCenter){
            if(isCenter) return this.pos.y<obj.pos.y;
            return this.pos.y+this.r<obj.pos.y-obj.r;
        },
        /**
        *返回是否在某对象下边
        **/
        isBottomTo:function(obj,isCenter){
            if(isCenter) return this.pos.y>obj.pos.y;
            return this.pos.y-this.r>obj.pos.y+obj.r;
        },
        /**
        *点是否在圆形内
        **/
        isInside: function(v) {
            var pointX=v.x;
            var pointY=v.y;
            var x=this.pos.x;
            var y=this.pos.y;
            var r=this.r;
            return (Math.pow((pointX - x), 2) + Math.pow((pointY - y), 2) < Math.pow(r, 2));
        }
    });
    /**
    *将圆形改变到特定大小
    **/
    var text =new J.Class({extend : J.cnGame.MovableObj},{
        /**
        *初始化
        **/
        init: function(options) {
            this.text="test";
            this.style="red";
            this.isFill=true;
            this.alpha=1;
            this.context=J.cnGame.context;
            options = options || {};
            text.superClass.init.call(this,options);
        },
        /**
        *绘制
        **/
        draw: function() {
            var context = this.context; 
            context.save();
            context.globalAlpha=this.alpha;
            (!J.isUndefined(this.font)) && (context.font = this.font);
            (!J.isUndefined(this.textBaseline)) && (context.textBaseline = this.textBaseline);
            (!J.isUndefined(this.textAlign)) && (context.textAlign = this.textAlign);
            (!J.isUndefined(this.maxWidth)) && (context.maxWidth = this.maxWidth);
            if (this.isFill) {
                context.fillStyle = this.style;
                this.maxWidth ? context.fillText(this.text, this.pos.x, this.pos.y, this.maxWidth) : context.fillText(this.text, this.pos.x, this.pos.y);
            }
            else {
                context.strokeStyle = this.style;
                this.maxWidth ? context.strokeText(this.text, this.pos.x, this.pos.y, this.maxWidth) : context.strokeText(this.text, this.pos.x, this.pos.y);
            }
            context.restore();
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        }
    });
    /*  线段  */
    var line=new J.Class({
        /**
        *初始化
        **/
        init: function(options) {   
            this.start=Vector2.zero;
            this.end=Vector2.zero; 
            this.style="red";
            this.lineWidth=1;
            this.alpha=1;
            this.context=J.cnGame.context;
            options = options || {};
            this.setOptions(options);
        },
        /**
        *判断线段和另一条线段是否相交
        **/
        isCross:function(newLine){
            var start=this.start;
            var end=this.end;
            var newStart=newLine.start;
            var newEnd=newLine.end;
            var point=[];
            if(start.x==end.x){//垂直
                if(newStart.y==newEnd.y){
                    if(((start.x-newStart.x)*(start.x-newEnd.x)<=0)&&((start.y-newStart.y)*(end.y-newStart.y)<=0))
                       // return true;
                    return [newStart.x,start.y];
                }
            }
            else if(start.y==end.y){//水平
                if(newStart.x==newEnd.x){
                    if(((start.y-newStart.y)*(start.y-newEnd.y)<=0)&&((start.x-newStart.x)*(end.x-newStart.x)<=0)){
                        //return true;
                        return [newStart.x,start.y];
                    }
                }
            }
            
            var k1=(end.y-start.y)/(end.x-start.x);//所在直线斜率
            var b1=end.y-end.x*k1;//所在直线截距
            
            var k2=(newEnd.y-newStart.y)/(newEnd.x-newStart.x);//新线段所在直线斜率
            var b2=newEnd.y-newEnd.x*k2;//新线段所在直线截距

            if(k1==k2){
                if(start.y==newStart.y){
                    return (start.x<newStart.x&&end.x>newStart.x)||(newStart.x<start.x&&newEnd.x>start.x);
                }
                else if(start.x==newStart.x){
                    return (start.y<newStart.y&&end.y>newStart.y)||(newStart.y<start.y&&newEnd.y>start.y);
                }
            }
          
            //这里线段A的端点在线段B上，还不算相交
            if(((newStart.x*k1+b1-newStart.x)*(newEnd.x*k1+b1-newEnd.y))<=0&&((start.x*k2+b2-start.y)*(end.x*k2+b2-end.y))<=0){     
                var pointX=(b1-b2)/(k2-k1);     
                return new Vector2(Math.round(pointX),Math.round(k2*pointX+b2));   
            }
            return false;
            
        },
        /**
        *绘制
        **/
        draw: function() {
            var ctx=J.cnGame.context;
            var start=this.start;
            var end=this.end;
            
            ctx.save();
            ctx.strokeStyle = this.style;
            ctx.lineWidth = this.lineWidth;
            ctx.globalAlpha=this.alpha;
            ctx.beginPath(); 
            ctx.lineTo(start.x,start.y);
            ctx.lineTo(end.x,end.y);
            ctx.closePath();  
            ctx.stroke();
            ctx.restore();
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        }
    });
    
    /*  多边形 */
    var polygon=new J.Class({
        init:function(options){
            this.pointsArr=[];//所有顶点数组
            this.style="black";
            this.lineWidth=1;
            this.alpha=1;
            this.isFill=true;
            options=options||{};
            this.setOptions(options);  
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *判断某点是否在多边形内(射线法)
        **/
        isInside:function(point){
            var lines=this.getLineSegs();

            var count=0;//相交的边的数量
            var lLine=new Line({start:new Vector2(point.x,point.y),end:new Vector2(-9999,point[1])});//左射线
            var crossPointArr=[];//相交的点的数组
            for(var i=0,len=lines.length;i<len;i++){
                var crossPoint=lLine.isCross(lines[i]);
                if(crossPoint){
                    for(var j=0,len2=crossPointArr.length;j<len2;j++){
                        //如果交点和之前的交点相同，即表明交点为多边形的顶点
                        if(crossPointArr[j].x==crossPoint.x&&crossPointArr[j].y==crossPoint.y){
                            break;  
                        }
                        
                    }
                    if(j==len2){
                        crossPointArr.push(crossPoint); 
                        count++;
                    }
                    
                }
            }
            if(count%2==0){//不包含
                return false;
            }
            return true;//包含
        },
        /**
        *获取多边形的线段集合
        **/
        getLineSegs:function(){
            var pointsArr=this.pointsArr.slice();//点集合
            pointsArr.push(pointsArr[0]);
            var lineSegsArr=[];
            for(var i=0,len=pointsArr.length;i<len-1;i++){
                var point=pointsArr[i];
                var nextPoint=pointsArr[i+1];
                var newLine=new line({start:new Vector2(point.x,point.y),end:new Vector2(nextPoint[0],nextPoint[1])});
                lineSegsArr.push(newLine);
            }
            return lineSegsArr;
            
        },
        /**
        *返回多边形各个点坐标
        **/
        getPoints:function(){
            return this.pointsArr.slice();
        },
        /**
        *绘制
        **/
        draw:function(){
            var ctx=J.cnGame.context;
            ctx.save();
            ctx.globalAlpha=this.alpha;
            ctx.beginPath();
            
            for(var i=0,len=this.pointsArr.length;i<len-1;i++){
                var start=this.pointsArr[i];
                var end=this.pointsArr[i+1];
                ctx.lineTo(start.x,start.y);
                ctx.lineTo(end.x,end.y);        
            }
            ctx.closePath();
            if(this.isFill){
                ctx.fillStyle = this.style;
                ctx.fill(); 
            }
            else{
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.style;
                ctx.stroke();   
            }  
            ctx.restore();
        }  
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.shape=J.cnGame.shape||{};
    J.cnGame.shape.Polygon=polygon;
    J.cnGame.shape.Line = line;
    J.cnGame.shape.Text = text;
    J.cnGame.shape.Rect = rect;
    J.cnGame.shape.Circle = circle;
});

/**
*
*事件模块
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var eventManager={
        /**
        *订阅
        **/
        subscribe:function(target,evtName,func,context){
            var newFunc;
            var targetEvts=target.events=target.events||{};
            targetEvts[evtName]=targetEvts[evtName]||[];
            if(!J.isArray(func)){
               func=[func]; 
            }
            for(var i=0,len=func.length;i<len;i++){
                (newFunc=function(){func[arguments.callee.i].apply(context,arguments);}).i=i;
                newFunc.oriFunc=func[i];
                targetEvts[evtName].push(newFunc);
            }
        },
        /**
        *通知
        **/
        notify:function(target,evtName,evtObj){
            var evtsArr;
            //if(evtName=="hitWall")
            if(target.events&&(evtsArr=target.events[evtName])){
                for(var i=0,len=evtsArr.length;i<len;i++){
                    if(cg.core.isFunction(evtsArr[i])){
                        evtsArr[i](evtObj);
                    }
                }
            }   
        },
        remove:function(target,evtName,func){
            if(target.events){
                var evtsArr=target.events[evtName];
                if(evtsArr){
                    for(var i=0,len=evtsArr.length;i<len;i++){
                        if(evtsArr[i].oriFunc===func){
                            evtsArr.splice(i,1);
                            return;
                        }
                    }
                }
            }
        }
    };
    J.cnGame=J.cnGame||{};
    J.cnGame.eventManager=eventManager;
});

/**
*
*输入记录模块
*
**/
Jx().$package(function(J){
    var input={};                                     
    input.mouse={};
    input.mouse.x = 0;
    input.mouse.y = 0;
    var m=[];
    m[0]= m[1] ="left";
    m[2]="right";
    /**
    *鼠标按下触发的处理函数
    **/
    var mousedown_callbacks = {};
    /**
    *鼠标松开触发的处理函数
    **/
    var mouseup_callbacks = {};
    /**
    *鼠标移动触发的处理函数
    **/
    var mousemove_callbacks = [];
    
    /**
    *记录鼠标在canvas内的位置
    **/
    var recordMouseMove = function(eve) {
        var pageX, pageY, x, y;
        eve = eve||window.event;
        pageX = eve.pageX || eve.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
        pageY = eve.pageY || eve.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
        if(J.cnGame.pos){
            J.cnGame.input.mouse.x = pageX - J.cnGame.pos.x;
            J.cnGame.input.mouse.y = pageY - J.cnGame.pos.y;
        }
        for (var i = 0, len = mousemove_callbacks.length; i < len; i++) {
            mousemove_callbacks[i]();
        }
    }
    /**
    *记录鼠标按键
    **/
    var recordMouseDown=function(eve){
        eve = eve||window.event;
        var pressed_btn=m[eve.button];
        if(pressed_btn=="left"){//左键按下
            J.cnGame.input.mouse.left_pressed=true;
        }
        else if(pressed_btn=="right"){//右键按下
            J.cnGame.input.mouse.right_pressed=true;
        }
        var callBacksArr=mousedown_callbacks[pressed_btn];
        if(callBacksArr&&callBacksArr.length){
            for (var i = 0, len = callBacksArr.length; i < len; i++) {
                callBacksArr[i]();
            }   
        }
    }
    /**
    *记录鼠标松开的键
    **/
    var recordMouseUp=function(eve){
        
        eve = J.cnGame.core.getEventObj(eve);
        var pressed_btn=m[eve.button];
        if(pressed_btn=="left"){//左键松开
            J.cnGame.input.mouse.left_pressed=false;
        }
        else if(pressed_btn=="right"){//右键松开
            btn=J.cnGame.input.mouse.right_pressed=false;
        }
        var callBacksArr=mouseup_callbacks[pressed_btn];
        if(callBacksArr&&callBacksArr.length){
            for (var i = 0, len = callBacksArr.length; i < len; i++) {
                callBacksArr[i]();
            }   
        }
    }
    $E.addOriginalEventListener(window, "mousemove", recordMouseMove);
    $E.addOriginalEventListener(window, "mousedown", recordMouseDown);
    $E.addOriginalEventListener(window, "mouseup", recordMouseUp);
    
    

    /**
    *绑定鼠标按下事件
    **/
    input.onMouseDown = function(buttonName, handler) {
        buttonName = buttonName || "all";
        if (J.isUndefined(mousedown_callbacks[buttonName])) {
            mousedown_callbacks[buttonName] = [];
        }
        mousedown_callbacks[buttonName].push(handler);
    };
    /**
    *绑定鼠标松开事件
    **/
    input.onMouseUp = function(buttonName, handler) {
        buttonName = buttonName || "all";
        if (J.isUndefined(mouseup_callbacks[buttonName])) {
            mouseup_callbacks[buttonName] = [];
        }
        
        mouseup_callbacks[buttonName].push(handler);
    };
    /**
    *绑定鼠标松开事件
    **/
    input.onMouseMove = function(handler) {  
        mousemove_callbacks.push(handler);
    };
    

    /**
    *被按下的键的集合
    **/
    var pressed_keys = {};
    /**
    *要求禁止默认行为的键的集合
    **/
    var preventDefault_keys = {};
    /**
    *键盘按下触发的处理函数
    **/
    var keydown_callbacks = {};
    /**
    *键盘弹起触发的处理函数
    **/
    var keyup_callbacks = {};


    /**
    *键盘按键编码和键名
    **/
    var k = [];
    k[8] = "backspace"
    k[9] = "tab"
    k[13] = "enter"
    k[16] = "shift"
    k[17] = "ctrl"
    k[18] = "alt"
    k[19] = "pause"
    k[20] = "capslock"
    k[27] = "esc"
    k[32] = "space"
    k[33] = "pageup"
    k[34] = "pagedown"
    k[35] = "end"
    k[36] = "home"
    k[37] = "left"
    k[38] = "up"
    k[39] = "right"
    k[40] = "down"
    k[45] = "insert"
    k[46] = "delete"

    k[91] = "leftwindowkey"
    k[92] = "rightwindowkey"
    k[93] = "selectkey"
    k[106] = "multiply"
    k[107] = "add"
    k[109] = "subtract"
    k[110] = "decimalpoint"
    k[111] = "divide"

    k[144] = "numlock"
    k[145] = "scrollock"
    k[186] = "semicolon"
    k[187] = "equalsign"
    k[188] = "comma"
    k[189] = "dash"
    k[190] = "period"
    k[191] = "forwardslash"
    k[192] = "graveaccent"
    k[219] = "openbracket"
    k[220] = "backslash"
    k[221] = "closebracket"
    k[222] = "singlequote"

    var numpadkeys = ["numpad1", "numpad2", "numpad3", "numpad4", "numpad5", "numpad6", "numpad7", "numpad8", "numpad9"]
    var fkeys = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"]
    var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    for (var i = 0; numbers[i]; i++) { k[48 + i] = numbers[i] }
    for (var i = 0; letters[i]; i++) { k[65 + i] = letters[i] }
    for (var i = 0; numpadkeys[i]; i++) { k[96 + i] = numpadkeys[i] }
    for (var i = 0; fkeys[i]; i++) { k[112 + i] = fkeys[i] }


    /**
    *记录键盘按下的键
    **/
    var recordPress = function(eve) {
        eve = eve||window.event;
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = true;
        if (keydown_callbacks[keyName]) {
            for (var i = 0, len = keydown_callbacks[keyName].length; i < len; i++) {
                keydown_callbacks[keyName][i]();

            }

        }
        if (keydown_callbacks["allKeys"]) {
            for (var i = 0, len = keydown_callbacks["allKeys"].length; i < len; i++) {
                keydown_callbacks["allKeys"][i]();

            }
        }
        if (preventDefault_keys[keyName]) {
            eve.preventDefault();
        }
    }
    /**
    *记录键盘松开的键
    **/
    var recordUp = function(eve) {
        eve = eve||window.event;
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = false;
        if (keyup_callbacks[keyName]) {
            for (var i = 0, len = keyup_callbacks[keyName].length; i < len; i++) {
                keyup_callbacks[keyName][i]();

            }
        }
        if (keyup_callbacks["allKeys"]) {
            for (var i = 0, len = keyup_callbacks["allKeys"].length; i < len; i++) {
                keyup_callbacks["allKeys"][i]();

            }
        }
        if (preventDefault_keys[keyName]) {
            J.cnGame.core.preventDefault(eve);
        }
    }
    $E.addOriginalEventListener(window, "keydown", recordPress);
    $E.addOriginalEventListener(window, "keyup", recordUp);

    /**
    *判断某个键是否按下
    **/
    input.isPressed = function(keyName) {
        return !!pressed_keys[keyName];
    };
    /**
    *禁止某个键按下的默认行为
    **/
    input.preventDefault = function(keyName) {
        if (J.isArray(keyName)) {
            for (var i = 0, len = keyName.length; i < len; i++) {
                arguments.callee.call(input, keyName[i]);
            }
        }
        else {
            preventDefault_keys[keyName] = true;
        }
    }
    /**
    *绑定键盘按下事件
    **/
    input.onKeyDown = function(keyName, handler,context) {
        keyName = keyName || "allKeys";
        if (J.isUndefined(keydown_callbacks[keyName])) {
            keydown_callbacks[keyName] = [];
        }
        keydown_callbacks[keyName].push(function(){
            handler.apply(context,arguments)
        });

    }
    /**
    *绑定键盘弹起事件
    **/
    input.onKeyUp = function(keyName, handler) {
        keyName = keyName || "allKeys";
        if (J.isUndefined(keyup_callbacks[keyName])) {
            keyup_callbacks[keyName] = [];
        }
        keyup_callbacks[keyName].push(handler);

    }
    /**
    *清除键盘按下事件处理程序
    **/
    input.clearDownCallbacks = function(keyName) {
        if (keyName) {
            keydown_callbacks[keyName] = [];
        }
        else {
            keydown_callbacks = {};
        }

    }
    /**
    *清除键盘弹起事件处理程序
    **/
    input.clearUpCallbacks = function(keyName) {
        if (keyName) {
            keyup_callbacks[keyName] = [];
        }
        else {
            keyup_callbacks = {};
        }
    };

    J.cnGame=J.cnGame||{};
    input.key=k;
    J.cnGame.input=input;
});

/**
*
*碰撞检测
*
**/
Jx().$package(function(J){
    var collision={};

    /**
    *矩形和矩形间的碰撞
    **/
    collision.col_Between_Rects = function(rectObjA, rectObjB) {
        return ((rectObjA.x+rectObjA.width >= rectObjB.x && rectObjA.x+rectObjA.width <= rectObjB.right || rectObjA.x >= rectObjB.x && rectObjA.x <= rectObjB.right) && (rectObjA.y+rectObjA.height >= rectObjB.y && rectObjA.y+rectObjA.height <= rectObjB.y+rectObjB.height || rectObjA.y <= rectObjB.y+rectObjB.height && rectObjA.y+rectObjA.height >= rectObjB.y));
    };
    /**
    *圆形和圆形间的碰撞
    **/
    collision.col_between_Circles = function(circleObjA, circleObjB) {
        return (Math.pow((circleObjA.x - circleObjB.x), 2) + Math.pow((circleObjA.y - circleObjB.y), 2) < Math.pow((circleObjA.r + circleObjB).r, 2));

    };
    /**
    *多边形间的碰撞
    **/
    collision.col_between_Polygons=function(polygonA , polygonB){
        var linesA=polygonA.getLineSegs();
        var linesB=polygonB.getLineSegs();
        
        for(var i=0,len=linesA.length;i<len;i++){
            for(var j=0,len2=linesB.length;j<len2;j++){
                if(linesA[i].isCross(linesB[j])){
                    return true;    
                }
            }
        }
        return false;
    };
    /**
    *多边形和线段间的碰撞
    **/        
    collision.col_Line_Polygon=function(line,polygon){
        var lines=polygon.getLineSegs();
        for(var i=0,len=lines.length;i<len;i++){
            if(line.isCross(lines[i])){
        
                return true;
            }
        }
        return false;
    };

    /**
    *旋转矩形间的碰撞
    **/  


    //获取该矩形上的垂直的两个轴
    var getTwoAxis=function(rectPointsArr){
        var p0=rectPointsArr[0];
        var p1=rectPointsArr[1];
        var p2=rectPointsArr[2];
        axis1=[p0,p1];
        axis2=[p1,p2];
        return [axis1,axis2];
    };
    //获取该矩形上的四条边
    var getFourLines=function(rectPointsArr){
        var p0=rectPointsArr[0];
        var p1=rectPointsArr[1];
        var p2=rectPointsArr[2];
        var p3=rectPointsArr[3];
        var l1=[p0,p1];
        var l2=[p1,p2];
        var l3=[p2,p3];
        var l4=[p3,p0];
        return [l1,l2,l3,l4];

    }
    var getTYPoing=function(p,axis){//获取点在轴上的投影点
        //顶点在轴上的投影
        var x=((p.x*axis.x+p.y*axis.y)/(axis.x*axis.x+axis.y*axis.y))*axis.x;
        var y=((p.x*axis.x+p.y*axis.y)/(axis.x*axis.x+axis.y*axis.y))*axis.y;
        return new Vector2(x,y);
    };
    var getLineTYToAxis=function(line,axis){//线到轴的投影
    
        var a=new Vector2(axis[1].x-axis[0].x,axis[1].y-axis[0].y);//轴向量
        var p0=line[0];//线的一个顶点0
        var p1=line[1];//线的一个顶点1
        var pt0=getTYPoing(p0,a);
        var pt1=getTYPoing(p1,a);
        return [pt0,pt1];
        
    };
    var isLineOverlap=function(l1,l2){//判断线段是否重叠
        
        var l1p1=l1[0],l1p2=l1[1],l2p1=l2[0],l2p2=l2[1];
        if(l1p1.x!=l2p1.x){//非垂直X轴的两线段
            if((l1p1.x-l2p1.x)*(l1p1.x-l2p2.x)<0||(l1p2.x-l2p1.x)*(l1p2.x-l2p2.x)<0||(l2p1.x-l1p1.x)*(l2p1.x-l1p2.x)<0||(l2p2.x-l1p1.x)*(l2p2.x-l1p2.x)<0){
                return true;
            }
        }
        else{
            if((l1p1.y-l2p1.y)*(l1p1.y-l2p2.y)<0||(l1p2.y-l2p1.y)*(l1p2.y-l2p2.y)<0||(l2p1.y-l1p1.y)*(l2p1.y-l1p2.y)<0||(l2p2.y-l1p1.y)*(l2p2.y-l1p2.y)<0){
                return true;
            }           
        }
        return false;
    }
    var detectAxisCollision=function(axis,lineArr){//矩形的轴和另一个矩形要比较的四个边
        
        for(var i=0,len=lineArr.length;i<len;i++){
            var tyLine=getLineTYToAxis(lineArr[i],axis);//获取线段在轴上的投影线段 [[a,b],[a1,b1]]
            var tyAxis=getLineTYToAxis(axis,axis);
            
            if(isLineOverlap(tyLine,tyAxis)){
                return true;
            }
        }
        return false;
    };

    collision.rotateRectCollisionDetect=function(r1,r2){
        var rect1=r1.getRect();
        var rect2=r2.getRect();

        var linesArr1=getFourLines(rect1.pointsArr);//矩形1的四个边
        var linesArr2=getFourLines(rect2.pointsArr);//矩形2的四个边

        
        if(detectAxisCollision(linesArr2[0],linesArr1)&&detectAxisCollision(linesArr2[1],linesArr1)&&detectAxisCollision(linesArr1[0],linesArr2)&&detectAxisCollision(linesArr1[1],linesArr2)){
            return true;
        }
        return false;
    };


    J.cnGame=J.cnGame||{};
    J.cnGame.collision=collision;
});

/**
*
*帧动画
*
**/
Jx().$package(function(J){

    var cg=J.cnGame;
    /**
    *帧的增量
    **/
    var path = 1;
    /**
    *获取帧集合
    **/
    var caculateFrames = function() {
        var frames = [];
        var size = this.size;
        var beginPos = this.beginPos;
        var frameSize = this.frameSize;
        var direction = this.direction;


        /* 保存每一帧的精确位置 */
        if (direction == "right") {
            for (var y = beginPos[1]; y < size[1] ; y += frameSize[1]) {
                for (var x = beginPos[0]; x < size[0]; x += frameSize[0]) {
                    var frame = {};
                    frame.startPos=[];
                    frame.startPos[0] = x;
                    frame.startPos[1] = y;
                    frames.push(frame);
                }
            }
        }
        else {
            for (var x = beginPos[0]; x < size[0]; x += frameSize[0]) {
                for (var y = beginPos[1]; y < size[1]; y += frameSize[1]) {
                    var frame = {};
                    frame.startPos=[];
                    frame.startPos[0] = x;
                    frame.startPos[1] = y;
                    frames.push(frame);
                }
            }
        }

        return frames;

    }
    /**
    *包含多帧图像的大图片
    **/
    spriteSheet =new J.Class({
        /**
        *初始化
        **/
        init: function(options) {
            /**
            *默认值
            **/
            this.id="0";
            this.size=[400,40];
            this.pos=options.pos;
            this.frameSize= [40, 40];//每帧尺寸
            this.frameDuration= 100;//每帧持续时间
            this.direction= "right", //从左到右
            this.beginPos=[0,0];//截取图片的起始位置
            this.loop= false;//是否循环播放
            this.bounce= false;//是否往返播放
            this.scale=1;//缩放比
            this.currentIndex = 0;                  //目前帧索引
            this.context=J.cnGame.context;//使用的上下文对象，默认是框架的context
            this.onFinish = null;           //播放完毕后的回调函数
            this.now = new Date().getTime();            //当前时间
            this.last = new Date().getTime();       //上一帧开始时间
            options = options || {};
            J.extend(this, options);
            this.image = J.cnGame.loader.loadedImgs[this.src]; //图片对象
            this.frames = caculateFrames.call(this);    //帧信息集合
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *更新帧
        **/
        update: function() {

            this.now = new Date().getTime();
            var frames = this.frames;
            if ((this.now - this.last) >= this.frameDuration) {//如果间隔大于等于帧间间隔，则update
                var currentIndex = this.currentIndex;
                var length = this.frames.length;
                this.last = this.now;

                if (currentIndex >= length - 1) {
                    if (this.loop) {    //循环
                        return frames[this.currentIndex = 0];
                    }
                    else if (!this.bounce) {//没有循环并且没有往返滚动，则停止在最后一帧
                        this.onFinish && this.onFinish();
                        return frames[currentIndex];
                    }
                }
                if ((this.bounce) && ((currentIndex >= length - 1 && path > 0) || (currentIndex <= 0 && path < 0))) {   //往返
                    path *= (-1);
                }
                this.currentIndex += path;

            }
            return frames[this.currentIndex];
        },
        /**
        *跳到特定帧
        **/
        index: function(index) {
            this.currentIndex = index;
            return this.frames[this.currentIndex];
        },
        /**
        *获取现时帧
        **/
        getCurrentFrame: function() {
            return this.frames[this.currentIndex];
        },
        /**
        *在特定位置绘制该帧
        **/
        draw: function() {

            var currentFrame = this.getCurrentFrame();
            var width = this.frameSize[0];
            var height = this.frameSize[1];
            var context=this.context;
            context.save()
            var point=this.pos;//默认的相对点为sprite的中点
            cg.view.apply(context);
            context.translate(point.x,point.y);
            context.rotate(this.angle * -1);

            this.context.drawImage(this.image, currentFrame.startPos[0], currentFrame.startPos[1], width, height,-width/2,-height/2, width*this.scale, height*this.scale);
     
            context.restore();
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.SpriteSheet = spriteSheet;

});

/**
*
*sprite对象
*
**/
Jx().$package(function(J){

    var postive_infinity = Number.POSITIVE_INFINITY;
    var spriteList=[];
    var cg=J.cnGame;

    var sprite = new J.Class({extend : J.cnGame.shape.Rect},{
        /**
        *初始化
        **/
        init: function(options) {
            sprite.superClass.init.call(this,options);
            this.context=options.context||J.cnGame.context;
            this.spriteSheetList = {};

            if (this.src) { //传入图片路径
                this.setCurrentImage(this.src);
            }
            else if (this.spriteSheet) {//传入spriteSheet对象
                this.addAnimation(this.spriteSheet);
                this.setCurrentAnimation(this.spriteSheet);
            }

        },
        /*      
        *添加动画
        **/
        addAnimation: function(spriteSheet) {
            spriteSheet.relatedSprite=this;
            this.spriteSheetList[spriteSheet.id] = spriteSheet;
        },
        /**
        *设置当前显示动画
        **/
        setCurrentAnimation: function(id) {//可传入id或spriteSheet
            if (!this.isCurrentAnimation(id)) {
                if (J.isString(id)) {
                    this.spriteSheet = this.spriteSheetList[id];
                    if(this.spriteSheet){
                        this.size=[this.spriteSheet.frameSize[0],this.spriteSheet.frameSize[1]];
                        this.image = null;
                    }
                }
                else if (J.isObject(id)) {
                    this.spriteSheet = id;
                    if(this.spriteSheet){
                        var frameSize=this.spriteSheet.frameSize;
                        this.size=[frameSize[0],frameSize[1]];
                        this.addAnimation(id);
                        this.image = this.imgStart = null;
                    }
                }
            }

        },
        /**
        *判断当前动画是否为该id的动画
        **/
        isCurrentAnimation: function(id) {
            var spriteSheet=this.spriteSheet;
            if (J.isString(id)) {
                return (spriteSheet && spriteSheet.id === id);
            }
            else if (J.isObject(id)) {
                return spriteSheet === id;
            }
        },
        /**
        *设置当前显示图像
        **/
        setCurrentImage: function(src) {
      
            var image = J.cnGame.loader.loadedImgs[src];
            if (!this.isCurrentImage(src)) {
                this.image = image;
                this.spriteSheet = null;
            }
        },
        /**
        *判断当前图像是否为该src的图像
        **/
        isCurrentImage: function(src) {
            var image = this.image;
            if(image&&src){
                if (J.isString(src)) {
                    return (image.srcPath === src );
                }
                else{
                    return image==src;
                }
                
            }
            return false;       
        },
        /**
        *跳到特定帧
        **/
        index:function(index){
            var spriteSheet=this.spriteSheet;
            spriteSheet&&spriteSheet.index(index);      
        },

        /**
        *更新位置和帧动画
        **/
        update: function(duration) {//duration:该帧历时 单位：秒
    
            sprite.superClass.update.call(this,duration);

            if (this.spriteSheet) {//更新spriteSheet动画

                this.spriteSheet.pos = this.pos;
                this.spriteSheet.update();
            }
        },
        /**
        *绘制出sprite
        **/
        draw: function() {
            var context = this.context;
            var halfWith;
            var halfHeight;

            if (this.spriteSheet) {
                this.spriteSheet.pos = this.pos.copy();
                this.spriteSheet.angle=this.angle;
                this.spriteSheet.draw();
            }
            else if (this.image) {

                context.save()
                var img=this.image;
                var point=this.pos;//默认的相对点为sprite的中点
                halfWith = this.size[0] / 2;
                halfHeight = this.size[1] / 2;
                cg.view.apply(context);
                context.translate(point.x,point.y);
                context.rotate(this.angle * -1);
                context.drawImage(this.image, 0, 0, img.width,img.height,-halfWith,-halfHeight, this.size[0], this.size[1]);
                context.restore();
            }
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Sprite = sprite;

});
/**
 *
 *Sprite列表
 *
**/
Jx().$package(function(J){
    var SpriteList=new J.Class({
        init:function(){
            this.list=[];
        },
        get:function(index){//传入索引或条件函数
            if(J.isUndefined(index)){
                return this.list.slice();
            }
            if(J.isNumber(index)){
                return this.list[index];
            }
            else if(J.isFunction(index)){
                
                var arr=[];
                for(var i=0,len=this.list.length;i<len;i++){
                    if(index(this.list[i])){
                        arr.push(this.list[i]);
                    }
                }
                return arr;
            }
        },
        add: function(sprite) {
            this.list.push(sprite);
        },
        remove: function(sprite) {//传入sprite或条件函数
            for (var i = 0, len = this.list.length; i < len; i++) {
                if (this.list[i] === sprite||(J.cnGame.core.isFunction(sprite)&&sprite(this.list[i]))) {
                    this.list.splice(i, 1);
                    i--;
                    len--;
                }
            }
        },
        clean: function() {
            for (var i = 0, len = this.list.length; i < len; i++) {
                this.list.pop();
            }
        },
        sort: function(func) {
            this.list.sort(func);
        },
        getLength:function(){
            return this.list.length;
        },
        update:function(duration){
            for (var i = 0;i < this.list.length; i++) {
                if(this.list[i]&&this.list[i].update){
                    this.list[i].update(duration);
                }
            }
        },
        draw:function(){
            for (var i = 0;i < this.list.length; i++) {
                if(this.list[i]&&this.list[i].draw){
                    this.list[i].draw();
                }
            }               
            
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.SpriteList=SpriteList;
});
/**
 *
 *动画
 *
**/
Jx().$package(function(J){
    var list=[];//动画队列
    /**
    *动画类
    **/  
    var Animation=new J.Class({
        /**
        *初始化
        **/            
        init:function(options){
            this.targetElem=null;    //目标对象  
            this.propertyName="";//属性名
            this.duration=0;    //变化耗时
            this.onFinished=null;//完成动画的回调
            this.tweenFun=Animation.tweenObj.linear;                    //使用的缓动方法，默认为匀速线性运动
            this.setOptions(options);
            this.from=parseFloat(this.from||0);   //初始值
            this.to=parseFloat(this.to||0);                            //目标值
            this.changeDistance=this.to-this.from;                     //变化距离

        },   
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },

        /**
        *动画更新
        **/            
        update:function(){
          
            var time=Date.now()-this.startTime;//历时
            var p=time/this.duration;
            if(p>=1){//完成动画
               this.onFinished&&this.onFinished.call(this);
               Animation.remove(this);
               return; 
            }
          
            var currentValue=this.changeDistance*this.tweenFun(time/this.duration)+this.from;  
            this.targetElem[this.propertyName]=currentValue;
            
        
        }
    });
    J.extend(Animation,{
         /**
          *添加动画
         **/            
        add:function(animation){
            list.push(animation);
            animation.startTime=Date.now();//设置初始时间
        },
        /**
        *移除动画
        **/
        remove:function(animation){
            for(var i=0;i<list.length;i++){
                if(list[i]===animation){
                    list.splice(i,1);
                    return;
                }
            }                
        },
        /**
        *更新队列中的动画
        **/ 
        update:function(){
            for(var i=0;i<list.length;i++){
                list[i].update();
            }
        },
        /**
        *缓动函数对象
        **/ 
        tweenObj:{
            linear:function(p){//传入运行时间占总运行时间的百分比
                return p;
            },
            cubic: {
                easeIn: function(p){
                    return p*p*p;
                },
                easeOut: function(p){
                    return (p-=1)*p*p+1;
                },
                easeInOut: function(p){
                    if ((p/2) < 1){
                        return p*p*p/2;
                    }
                    return ((p-=2)*p*p + 2)/2;
                }
            }                
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Animation=Animation;
});

/**
*
*游戏循环
*
**/
Jx().$package(function(J){

    var timeId;
    var delay;
    var requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.oRequestAnimationFrame
    || function(callback) {
        setTimeout(callback, delay);
    };
    var drawLastTime;
    var updateLastTime;
    var isDraw=function(){
        var frameDuration=1000/this.fps;
        if(!drawLastTime) drawLastTime=Date.now();
        else if(Date.now()-drawLastTime>=Math.floor(turnDuration)) {    
            return true;
        }
        else return false;
    }
    /**
    *循环方法
    **/
    var loop = function() {
        var self = this;
        var sumFPS=0;
        var sumTPS=0;
        var fpsCount=0;
        var tpsCount=0;
        var sumUpdateTime=0;
        var sumDrawTime=0;
        self.avgTPS=self.tps;
        self.avgFPS=self.fps;


        return function() {

            self.interval = 1000 / self.tps;
            var now = Date.now();
            var tpsDuration = (now - updateLastTime); //帧历时
            updateLastTime = now;
            
            //console.log(duration);
            if(self.pause){
                updateLastTime=now;
                drawLastTime=now;
            }
            else if (!self.pause && !self.stop) {

                if(sumUpdateTime>=1000){
                    self.avgTPS = tpsCount;//计算平均tps
                    tpsCount=0;
                    sumUpdateTime=0;
                }
                sumUpdateTime+=tpsDuration;
                tpsCount++;

                J.cnGame.updateCanvasPos();
                
                if (self.gameObj.update) {//调用游戏对象的update
                    self.gameObj.update(tpsDuration / 1000);
                }

                var Animation = J.cnGame.Animation;
                //动画队列更新
                Animation.update();
                //更新所有sprite
                J.cnGame.spriteList.update(1/self.tps); 
                
                var fpsDuration = (now - drawLastTime); //帧历时
             
                if(self.fps==self.tps||fpsDuration>=1000/self.fps){
               
                    if(sumDrawTime>1000){
                        sumDrawTime=0;
                        self.avgFPS=fpsCount;
                        fpsCount=0;
                    }
                    sumDrawTime+=fpsDuration;
                    fpsCount++;
    

                    J.cnGame.clean();
                    J.cnGame.drawBg();//绘制背景色
                    if (self.gameObj.draw) {
                        self.gameObj.draw(fpsDuration / 1000);
                    }
                    J.cnGame.spriteList.draw();  
                    drawLastTime=now;
                }
    
                if (tpsDuration > self.interval) {//修正delay时间
                    delay = Math.max(1, self.interval - (tpsDuration - self.interval));
                }
                else{
                    delay=self.interval;
                }
            }
        
            if(self.tps==60) {
                timeId = requestAnimationFrame(arguments.callee);
            }
            else {
                timeId = window.setTimeout(arguments.callee, delay); 
            }
        }
    };
    /**
    *游戏循环构造函数
    **/
    var gameLoop =new J.Class({
        /**
        *初始化
        **/
        init: function(gameObj, options) {
            /**
            *默认对象
            **/
            var defaultObj = {
                tps: 60,
                fps:60
            };
            options = options || {};
            options = J.extend(defaultObj, options);
            this.gameObj = gameObj;
            this.avgFPS=this.fps = options.fps;
            this.avgTPS=this.tps = options.tps;
            this.interval = delay = 1000 / this.tps;
            this.pause = false;
            this.stop = true;
        },

        /**
        *开始循环
        **/
        start: function() {
            if (this.stop) {        //如果是结束状态则可以开始
                this.stop = false;
                drawLastTime=updateLastTime=Date.now();
                if(this.tps==60){
                   requestAnimationFrame(loop.call(this));
                }
                else{
                    window.setTimeout(loop.call(this),delay);
                }
                
            }
        },  
        /**
        *继续循环
        **/
        runLoop: function() {
            this.pause = false;
        },
        /**
        *暂停循环
        **/
        pauseLoop: function() {
            this.pause = true;
        },
        /**
        *停止循环
        **/
        end: function() {
            this.stop = true;
            window.clearTimeout(timeId);
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.GameLoop = gameLoop;
});

/**
*
*地图
*
**/
/*Jx().$package(function(J){
    /**
    *层按zIndex由小到大排序
    **/                            
  /*  var sortLayers=function(layersList){
        layersList.sort(function(layer1,layer2){
            if (layer1.zIndex > layer2.zIndex) {
                return 1;
            }
            else if (layer1.zIndex < layer2.zIndex) {
                return -1;
            }
            else {
                return 0;
            }                
        });     
    }
    /**
    *层对象
    **/                            
  /*  var layer = new J.Class({
        
        /**
        *初始化
        **/
       /* init: function(id,mapMatrix,options) {
            /**
            *默认对象
            **/ 
          /*  var defaultObj = {
                cellSize: [32, 32],   //方格宽，高
                x: 0,                 //layer起始x
                y: 0                  //layer起始y

            };  
            options = options || {};
            options = J.extend(defaultObj, options);
            this.id=options.id;
            this.mapMatrix = mapMatrix;
            this.cellSize = options.cellSize;
            this.x = options.x;
            this.y = options.y;
            this.row = mapMatrix.length; //有多少行
            this.width=this.cellSize[0]* mapMatrix[0].length;
            this.height=this.cellSize[1]* this.row;
            this.spriteList=new J.cnGame.SpriteList();//该层上的sprite列表
            this.imgsReference=options.imgsReference;//图片引用字典：{"1":{src:"xxx.png",x:0,y:0},"2":{src:"xxx.png",x:1,y:1}}
            this.zIindex=options.zIndex;
        },
        /**
        *添加sprite
        **/         
      /*  addSprites:function(sprites){
            if (J.isArray(sprites)) {
                for (var i = 0, len = sprites.length; i < len; i++) {
                    arguments.callee.call(this, sprites[i]);
                }
            }
            else{
                this.spriteList.add(sprites);
                sprites.layer=this;
            }               
            
        },
        /**
        *获取特定对象在layer中处于的方格的值
        **/
       /* getPosValue: function(x, y) {
            if (J.isObject(x)) {
                y = x.y;
                x = x.x;
            }
            var isUndefined = J.isUndefined;
            y = Math.floor(y / this.cellSize[1]);
            x = Math.floor(x / this.cellSize[0]);
            if (!isUndefined(this.mapMatrix[y]) && !isUndefined(this.mapMatrix[y][x])) {
                return this.mapMatrix[y][x];
            }
            return undefined;
        },
        /**
        *获取特定对象在layer中处于的方格索引
        **/
     /*   getCurrentIndex: function(x, y) {
            if (J.isObject(x)) {
                y = x.y;
                x = x.x;
            }
            return [Math.floor(x / this.cellSize[0]), Math.floor(y / this.cellSize[1])];
        },
        /**
        *获取特定对象是否刚好与格子重合
        **/
       /* isMatchCell: function(x, y) {
            if (J.isObject(x)) {
                y = x.y;
                x = x.x;
            }
            return (x % this.cellSize[0] == 0) && (y % this.cellSize[1] == 0);
        },
        /**
        *设置layer对应位置的值
        **/
     /*   setPosValue: function(x, y, value) {
            this.mapMatrix[y][x] = value;
        },
        /**
        *更新层上的sprite列表
        **/         
       /* update:function(duration){
            this.spriteList.update(duration);
            
        },
        /**
        *根据layer的矩阵绘制layer和该layer上的所有sprite
        **/
    /*    draw: function() {
            var mapMatrix = this.mapMatrix;
            var beginX = this.x;
            var beginY = this.y;
            var cellSize = this.cellSize;
            var currentRow;
            var currentCol
            var currentObj;
            var row = this.row;
            var img;
            var col;
            for (var i = beginY, ylen = beginY + row * cellSize[1]; i < ylen; i += cellSize[1]) {   //根据地图矩阵，绘制每个方格
                currentRow = (i - beginY) / cellSize[1];
                col=mapMatrix[currentRow].length;
                for (var j = beginX, xlen = beginX + col * cellSize[0]; j < xlen; j += cellSize[0]) {
                    currentCol = (j - beginX) / cellSize[0];
                    currentObj = this.imgsReference[mapMatrix[currentRow][currentCol]];
                    if(currentObj){
                        currentObj.x = currentObj.x || 0;
                        currentObj.y = currentObj.y || 0;
                        img = J.cnGame.loader.loadedImgs[currentObj.src];
                        //绘制特定坐标的图像
                        J.cnGame.context.drawImage(img, currentObj.x, currentObj.y, cellSize[0], cellSize[1], j, i, cellSize[0], cellSize[1]); 
                    }
                }
            }
            //更新该layer上所有sprite
            this.spriteList.draw();

        }
    });
    
    
    
    /**
    *地图对象
    **/
   /* var map = new J.Class({
        /**
        *初始化
        **/
       /* init: function(options) {
            /**
            *默认对象
            **/
           /* var defaultObj = {
                layers:[],
                x:0,
                y:0,
                width:100,
                height:100

            };
            options = options || {};
            options = J.extend(defaultObj, options);
            this.layers=options.layers;
            this.x=options.x;
            this.y=options.y;
            this.width=options.width;
            this.height=options.height;
            this.enviroment=options.enviroment;//地形layer
        },
        /**
        *添加layer
        **/
      /*  addLayer:function(layers){
            if (J.isArray(layers)) {
                for (var i = 0, len = layers.length; i < len; i++) {
                    arguments.callee.call(this, layers[i]);
                }
            }
            else{
                layers.x=this.x;
                layers.y=this.y;
                this.layers.push(layers);
                sortLayers(this.layers);
            }
            
        },
        /**
        *获取某个layer
        **/         
        /*getLayer:function(id){
            for (var i = 0, len = this.layers.length; i < len; i++) {
                if(this.layers[i].id==id){
                    return  this.layers[i];
                }
            }           
        },
        /**
        *更新所有layer
        **/
       /* update:function(duration){
            for(var i=0,len=this.layers.length;i<len;i++){
                this.layers[i].x=this.x;
                this.layers[i].y=this.y;
                this.layers[i].update(duration);                
            }               
        },          
        /**
        *绘制所有layer
        **/
       /* draw:function(){
            for(var i=0,len=this.layers.length;i<len;i++){
                this.layers[i].draw();              
            }               
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Layer = layer;
    J.cnGame.Map = map;

});

/**
*
*map2
*
**/
/*Jx().$package(function(J){

    var cg=J.cnGame;

    var MapElement=new J.Class({extend : J.cnGame.Sprite},{
        init:function(options){
            
            options.coor=options.coor||[0,0];
            options.cols=options.cols||3;
            options.rows=options.rows||3;
            options.gridSize= options.gridSize||[32,32];

            var coor=options.coor;
            var gridSize=options.gridSize;
            var gw=gridSize[0];
            var gh=gridSize[1];
            options.size=[options.cols*gw,options.rows*gh];
            options.pos= new Vector2(coor[0]*gw+options.size[0]/2,coor[1]*gh+options.size[1]/2);
      
            MapElement.superClass.init.call(this,options);
        },
        isInnerElement:function(coor){
            var c1=this.coor;
            var c2=coor;
            var rows=this.rows;
            var cols=this.cols;

            if(c2[0]>=c1[0]&&c2[0]<=c1[0]+cols-1&&c2[1]>=c1[1]&&c2[1]<=c1[1]+rows-1){
                return true;
            }
            return false;
                
        }
    });

    var Map2=new J.Class({
        init:function(options){
            this.gridSize=options.gridSize||[32,32];
            this.elemList=[];
        },
        add:function(elem){
            elem.gridSize=this.gridSize;
            elem.map=this;
            this.elemList.push(elem);
        },
        getInnerElement:function(v){
            var x=v.x;
            var y=v.y;
            var gridSize=this.gridSize;
            var xi=Math.floor(x/gridSize[0]);
            var yi=Math.floor(y/gridSize[1]);
            var elemList=[];
            for(var i=0,len=this.elemList.length;i<len;i++){
                var elem=this.elemList[i];
                if(elem.isInnerElement([xi,yi])){
                    elemList.push(elem);
                }
            }
            return elemList;
        },
        remove:function(elem){
            for(var i=0,len=this.elemList.length;i<len;i++){
                if(this.elemList[i]==elem){
                    this.elemList.splice(i,1);   
                    return;   
                }
               
            }

        },
        update:function(duration){
            for(var i=0;i<this.elemList.length;i++){
                this.elemList[i].update(duration);
            }            
        },
        draw:function(){
            for(var i=0;i<this.elemList.length;i++){
                this.elemList[i].draw();
            }
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.MapElement = MapElement;  
    J.cnGame.Map2 = Map2;    
});

*/

/**
*
*障碍物范围
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var BlockRange=new J.Class({extend:cg.shape.Rect},{
        init:function(options){
            options=options||{};
            this.pos=options.pos||[0,0];
            this.size=options.size||[32,32];
            BlockRange.superClass.init.call(this,options);
            this.layerElement=options.layerElement;//所在元素
            this.layerElement=options.layerElement;
           
        },
        draw:function(){//blockrange绘制 测试使用
            var cg=J.cnGame;
            var context = cg.context;
            context.save()
            var point=this.pos;
            context.translate(point.x,point.y);
            context.fillStyle = this.style;
            context.fillRect(-this.size[0]/2, -this.size[1]/2 , this.size[0], this.size[1]);
            context.restore();
            return this;
        },
        isInnerRange:function(point){
            var l=this.layerElement;
            var x=point[0],y=point[1];
            var bx=l.pos.x+this.pos[0],by=l.pos.y+this.pos[1];
            var bw=this.size[0],bh=this.size[1];
            if(x>bx&&x<bx+bw&&y>by&&y<by+bh){
                return true;
            }
            return false;
        },
        isCollideWithBlock:function(r){
            //修复为全局位置 全局位置下进行障碍物和对象的碰撞检测
            var le=this.layerElement;
            var lw=le.size[0],lh=le.size[1];
            var newRange=this.clone();
            newRange.pos=newRange.pos.add(new Vector2(-lw/2,-lh/2)).add(this.layerElement.pos);
            return cg.collision.rotateRectCollisionDetect(newRange,r);
        },
        clone:function(){
            return new BlockRange({
                pos:this.pos.copy(),
                size:this.size.slice()
            });
        }
    });
    cg.BlockRange=BlockRange;
});
/**
*
*层元素
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var LayerElement=new J.Class({extend:cg.Sprite},{
        init:function(options){
            options=options||{};
            options.blockRanges=options.blockRanges||[];
            options.pos=options.pos||[0,0];
            options.size=options.size||[32,32];
            LayerElement.superClass.init.call(this,options);

            var src=options.src;
            var self=this;
            this.src=src;
            this.zIndex=options.zIndex;
            this.repeat=options.repeat;
           
            cg.loader.loadImage(src,function(){
                self.image=this;
            });
        },
        addBlockRange:function(br){
            this.blockRanges.push(br);
        },
        draw:function(){
            if(!this.image) return;
            var img=this.image;
            var x=this.pos.x;
            var y=this.pos.y;
            var w=this.size[0];
            var h=this.size[1];
            var ctx=cg.context;
            ctx.save();
            cg.view.apply(ctx);
            ctx.translate(x,y);
            if(this.repeat){
                var pattern = ctx.createPattern(img, this.repeat);
                var oldFillStyle = ctx.fillStyle;
                ctx.fillStyle = pattern;
                ctx.fillRect(-w/2,-h/2,w,h);
                ctx.fillStyle = oldFillStyle;
            } else {
                ctx.drawImage(img,0,0,img.width,img.height,-w/2,-h/2,w,h);
            }
            ctx.translate(-w/2,-h/2);
            //this.drawBlockRanges(); //测试使用
            ctx.restore();
            //layerElement.superClass.draw.call(this);

        },
        drawBlockRanges:function(){
            var brs=this.blockRanges;
            for(var i=0,l=brs.length;i<l;i++){
                brs[i].draw();
            }
        },
        isInnerBlockRange:function(point){
            var brs=this.blockRanges;
            for(var j=0,l=brs.length;j<l;j++){
                var br=brs[j];
                if(br.isInnerRange(point)){
                    return true;
                }
            }
            return false;
        },
        isCollideWithBlock:function(r){
            var brs=this.blockRanges;
            for(var j=0,l=brs.length;j<l;j++){
                var br=brs[j];
                if(br.isCollideWithBlock(r)){
                    return true;
                }
            }
            return false;
        }
    });
    cg.LayerElement=LayerElement;
});
/**
*
*层
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var Layer=new J.Class({
        init:function(options){
            options=options||{};
            this.layerElements=options.layerElements||[];
            this.size=options.size||[100,100];
            this.zIndex=options.zIndex||0;
            this.stage=options.stage;
        },
        addLayerElement:function(le){
            this.layerElements.push(le);        
        },
        draw:function(){
            var le=this.layerElements;
            for(i=0,l=le.length;i<l;i++){
                le[i].draw();
            }            
        },
        isInnerBlockRange:function(point){
            var les=this.layerElements;

            for(var i=0,l=les.length;i<l;i++){
                var le=les[i];
                if(le.isInnerBlockRange(point)){//返回层元素
                    return le;
                }
            }
            return false;
        },
        removeLayerElement:function(le){
            var les=this.layerElements;
            for(var i=0,l=les.length;i<l;i++){
                if(les[i]==le){
                    les.splice(i,1);
                    return;
                }
            }
        },
        isCollideWithBlock:function(r){
            var les=this.layerElements;

            for(var i=0,l=les.length;i<l;i++){
                var le=les[i];
                if(le.isCollideWithBlock(r)){//返回层元素
                    return le;
                }
            }
            return false;
        }
    });
    cg.Layer=Layer;
});
/**
*
*舞台
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var Stage=new J.Class({
        init:function(options){
            options=options||{};
            this.layers=options.layers||[];
        },
        addLayer:function(l){
            this.layers.push(l);
        },
        draw:function(){
            this.sortLayers();
            var ls=this.layers;
            for(var i=0,l=ls.length;i<l;i++){
                ls[i].draw();
            }
        },
        sortLayers:function(){
            this.layers.sort(function(a,b){
                var  az=a.zIndex,bz=b.zIndex;
                if(az>bz) return 1;
                else if(az==bz) return 0;
                else return -1;
            });
        },
        getLayer:function(layerIndex){
            var ly=this.layers;
            for(var i=0,l=ly.length;i<l;i++){
                if(ly[i].zIndex==layerIndex){
                    return ly[i];
                }
            }
        },
        isInnerBlockRange:function(point,layerIndex){
            var layer=this.getLayer(layerIndex);
            return layer&&layer.isInnerBlockRange(point);
        },
        isCollideWithBlock:function(r,layerIndex){
            var layer=this.getLayer(layerIndex);
            return layer&&layer.isCollideWithBlock(r);
        },
        removeLayerElement:function(le,layerIndex){
            var l=this.getLayer(layerIndex);
            l.removeLayerElement(le);
        }
    });

    cg.Stage=Stage;
});

/**
*
*场景
*
**/
Jx().$package(function(J){

    var cg=J.cnGame;
    var view = new J.Class({

        /**
        *初始化
        **/
        init: function(options) {
            this.size=cg.size.slice();
            this.pos=new Vector2(cg.width/2,cg.height/2);
        },
        /**
        *使player的位置保持在场景中点之前的移动背景
        **/
        translate: function(pos) {
            this.pos=pos;
        },
        apply:function(ctx){
            var s=this.size;
            var pos=this.pos;
            //view距离初始位置的距离
            var dx=pos.x-cg.width/2;
            var dy=pos.y-cg.height/2;
            ctx.translate(-dx,-dy);
        },
        setSize:function(w,h){
            w=w||this.size[0];
            h=h||this.size[1];
            this.size=[w,h];
        },
        draw:function(){
            var ctx=this.context;
            var p=this.pos;

            var s=this.size;
            ctx.save();
            ctx.translate(p.x,p.y,-s[0]/2,-s[1]/2);
            ctx.draw();
            ctx.restore();
        },
        /**
        *判断对象是否在view内
        **/
        isPartlyInsideView:function(sprite){
            var spriteRect=sprite.getRect();
            var viewRect=this.getRect();
            return J.cnGame.collision.col_Between_Rects(spriteRect,viewRect);
            
        },
        /**
        *使坐标相对于view
        **/
        applyInView:function(func){ 
            J.cnGame.context.save();
            J.cnGame.context.translate(-this.x, -this.y);
            func();
            J.cnGame.context.restore();
        },
        /**
        *返回包含该view的矩形对象
        **/
        getRect: function() {
            return new J.cnGame.shape.Rect({ x: this.x, y: this.y, width: this.width, height: this.height });
        }

    });
    J.cnGame=J.cnGame||{};
    J.cnGame.View = view;
});

/**
*
*UI类
*
**//*
cnGame.register("cnGame.ui", function(cg) {
    /*  点击回调    */                                
    /*var clickCallBacks={};
    
    var recordClick=function(){
            
        
    }
    /*  按钮  */
   /* var button=cg.class(function(options){
        this.init(options);
        cg.core.bindHandler(cg.canvas,"click",recordClick);
        
    }).methods({
        init:function(options){
            
            this.setOptions(options);           
                        
        },
        onClick:function(){
            
        },
        setOptions:function(options){
            cg.core.extend(this,options);
            
        }
        
        
    });
                                      
});*/

