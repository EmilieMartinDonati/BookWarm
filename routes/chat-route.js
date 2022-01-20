/* const { } = require("mongoose");

const router = require("express").Router();

router.get("/",(req,res) => {
    res.sendFile(__dirname +"/index.html");
}) 


    //on connecte Socket.io
io.on("connection", (socket) => {
    console.log(socket.id);

    //on déconnecte le socket
socket.on("disconnet",() => {
    console.log("Someone just disconnected")
});

// gestion du chat 
socket.on("chat_message", =>{

})
   
})
 */
const router = require("express").Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  io.on('connection', (socket) => {
    socket.on('chat message', msg => {
      io.emit('chat message', msg);
    });
  });
  