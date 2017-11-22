module.exports = server => {
    const io = require('socket.io')(server);
    let rooms = {}; 
    let roomStr = null;
    
    io.on('connection', socket => {
        // setSocket(socket);
        // socket.emit('clientTest');
        socket.on('createOrJoin', room => {          
            if (!rooms[room]) {
                rooms[room] = [];
            }      
            let numClients = rooms[room].length;
            if (numClients == 0) {
                rooms[room].push(socket.id);     
                roomStr = room;
                socket.join(room);
                console.log(`Client ID ${socket.id} created room ${room}`);
                socket.emit('created', room, socket.id);
            } else if (numClients == 1) {
                rooms[room].push(socket.id); 
                console.log(`Client ID ${socket.id} joined room ${room}`);
                io.to(room).emit('join', room);
                socket.join(room);
                socket.emit('joined', room, socket.id);
                io.to(room).emit('ready');
            } else {
                socket.emit('full', room);
            }
            console.log(`Room ${room} now has ${rooms[room].length} client(s)`);
        }) 
    
        socket.on('message', message => {
            console.log('Client said: ', message);
            // the socket itself being excluded
            if (message == 'bye') {
                rooms[roomStr] = [];
                io.to(roomStr).emit('message', message);
            } else {
                socket.to(roomStr).emit('message', message);
            }            
        })
    
        socket.on('ipaddr', () => {
            console.log('ipaddr fire')
        })
    })
}