Jx().$package('ws', function(J){
    var packageContext = this;

    //var socketUrl = 'ws://dynamic.jit.su/';
    // var socketUrl = 'http://ts.alloyteam.com/ws';
    var socketUrl = '/ws';
    var socket;

    this.init = function(){

    }

    this.connect = function(){
        if(!socket){
            socket = io.connect(socketUrl);
        }

        socket.on('connect', onSocketOpen);
        socket.on('message', onSocketMessage);
        socket.on('disconnect', onSocketClose);
    }

    this.send = function(data){
        socket.emit('message', JSON.stringify(data));
    }

    this.on = function(type, func){
        if(type && func){
            J.event.addObserver(packageContext, type, func);
        }else{
            throw type + "'s function is undefined.";
        }
    }

    var onSocketOpen = function(data){
        J.event.notifyObservers(packageContext, 'connect', data);
    }

    var onSocketMessage = function(data){

        if(typeof data == "string")
            data = JSON.parse(data);
        if(data.type){
            J.event.notifyObservers(packageContext, data.type, data);
        }
    }

    var onSocketClose = function(data){
        J.event.notifyObservers(packageContext, 'disconnect', data);
    }

});
