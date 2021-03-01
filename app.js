const express = require("express");
const socket = require("socket.io");
let randomColor = require('randomcolor');
const uuid = require('uuid');
//First_Step-----------------------------------------------------

const app = express();
// Static files
app.use(express.static('public'));
//Listening to the Local Port
var server = app.listen(3000,function(){
	console.log("Your server is running on port 3000");
});

//Second_Step-------------------------------------------------------

//When user typed the url or localhost:3000 we(server) get it and respond it by sending fill
app.get("/",function(req,res){
	res.sendFile(__dirname + "/index1.html");
});

//socket.io instantiation

var io = socket(server);

//Waiting for client to make a connection and set up a web socket between two.
//Each client has its own socket connection with that server.
//In Order to connect the client also instal the socket.io and make a connection to that url.
//2)After recieved the req confirmation it is connected and the unique id for each socket is console log for every new connection.
//the below is for storing users names to show in ther online users section.
let users = [];
let connnections = [];
io.on('connection', function(socket){

	    console.log('made socket connection', socket.id);
			console.log('New user connected');


		// 	//1)After a connection is made the user get pushed to an array
		// 	 connnections.push(socket)

			let color = randomColor();
	 		socket.username = 'Anonymous';
	 		socket.color = color;

		//2)listen on new_message ,takes the client sent message and resend to all clients, in chat the client also listen to this message and have to take
			socket.on('new_message', (data) => {
			     //broadcast the new message
			     io.sockets.emit('new_message', {message : data.message, username : socket.username,color:socket.color});
			});

		//listen on typing
    	socket.on('typing', data => {
        socket.broadcast.emit('typing',{username: socket.username});
    	});

// listen on change_username
				 socket.on('change_username', data => {
						 let id = uuid.v4(); // create a random id for the user
						 socket.id = id;
						 socket.username = data.nickName;
						 users.push({id, username: socket.username, color: socket.color});
						 updateUsernames();
				 });
//updation of usernames by sending data to chat.js
				 const updateUsernames = () => {

			        io.sockets.emit('get users',users);
			    }

//Disconnect IF ANY USER DISCONNECTED
					    socket.on('disconnect', data => {

					        if(!socket.username)
					            return;
					        //find the user and delete from the users list
					        let user = undefined;
					        for(let i= 0;i<users.length;i++){
					            if(users[i].id === socket.id){
					                user = users[i];
					                break;
					            }
					        }
					        users = users.filter( x => x !== user);
					        //Update the users list
					        updateUsernames();
					        connnections.splice(connnections.indexOf(socket),1);
					    });
});
