//Importanmos el Framework Express
const express = require('express');

//Creamos una instancia principal de la aplicación
const app = express();

//Creamos el servidor HTTP basado en Express
const http = require('http').createServer(app);

//Conectamos Socket.io
const io = require('socket.io')(http);

//Importar modulo path para manejar rutas
const path = require('path');

app.use(express.static(__dirname+'/public/laboratorio6'));

const usuarios = {}; 
io.on('connection', (socket) => { 
    console.log('● Usuario conectado'); 
    
    socket.on('nuevo usuario', (nick) => { 
        //Guardamos el Nick
        usuarios[socket.id] = nick; 
        //Enviamos a todos los usuarios el mensaje
        io.emit('mensaje sistema',`🛎 ${nick} ha entrado al chat.`)
        //Enviamos la lista actualizada
        io.emit('usuarios conectados', Object.values(usuarios));
        console.log(`${nick} se ha conectado`); 
    }); 

    socket.on('chat message', (msg) => { 
        console.log(' ', msg); 
        io.emit('chat message', msg); //Reenviamos el mensaje a todos
    }); 
    
    socket.on('disconnect', () => { 
        const nick = usuarios[socket.id]; //Obtenemos el nick antes de eliminar
        delete usuarios[socket.id]; //Quitamos el usuario del objeto

        //Enviamos a todos el mensaje indicando que se desconecto
        io.emit('mensaje sistema', `🛎 ${nick} ha salido del chat.`); 
        console.log(`${nick || 'Usuario'} se ha desconectado`); 

        //Atualizamos la lista de usuarios conectados para todos
        io.emit('usuarios conectados', Object.values(usuarios));        
    }); 
});

http.listen(3000, () => {
    console.log(' Servidor corriendo en http://localhost:3000'); 
});

