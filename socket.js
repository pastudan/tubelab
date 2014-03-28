var io = require('socket.io').listen(8888);
var playlists = {}; //replace with Redis sooner or later..

setInterval(function () {
    console.log("playlists: ", playlists);
//   console.log("sockets: ", io.sockets);
}, 3000);

io.sockets.on('connection', function (socket) {
    this.plid = '';

    console.log("CLIENT CONNECTED: " + socket.id);


    socket.on('control', function (data) {
        //console.log(playlists[this.plid].clients); return;
        if (this.plid == '') {
            //apparently not associated with a plid...
            //TODO: disconnect here?
            console.log("NOT ASSOCIATED WITH A PLID")
        } else {
            //check permissions
            switch (data.controlAction) {
                case "prev":
                case "next":
                case "play-pause":
                    console.log("Broadcasting {" + data.controlAction + "} action to all clients associated with plid");
                    //TODO: BROADCAST TO ONLY playlists[plid].clients.. started (maybe finished?) below
                    //console.log(socket.id);
                    //console.log(io.sockets);
                    for (key in playlists[this.plid].clients) {
                        io.sockets.socket(key).emit('control', {controlAction: data.controlAction});
                    }
                    break;
                default:
                    console.log("Control action was not understood");
                    break;
            }
        }
    });


    socket.on('authenticate', function (data) {
        console.log("AUTHENTICATING:");
        if (typeof playlists[data.plid] == 'undefined') {
            playlists[data.plid] = {
                clients: {},
                songs  : {}
            };
        }

        // if password || pin:
        var permissions = 'rw';
        //else
        var permissions = 'r';


        playlists[data.plid].clients[socket.id] = {
            permissions   : permissions,
            name          : 'Default to, for example,: desktop',
            remote_address: socket.handshake.address.address,

            remote_port: socket.handshake.address.port,
            version    : data.version
        };


        //instead, use this
        this.plid = data.plid;

        socket.broadcast.emit('client-announce', {
                clientId: "Dan's Android"
            }
        );

        console.log("authenticate: ", data);
    });


    socket.on('disconnect', function () {

        delete playlists[this.plid].clients[this.id];
    })


});
