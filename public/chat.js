// 1) First_Step In app.js it is listening for socket connection on the same url or say localhost----------------

// To Make Socket Connection First add cdn link  on header of index.html and  below add the code
var socket = io.connect('http://localhost:3000/');

//2)After requesting the connecting to the server on the other side still it is listening
//Second_Step Accessing all Required  Document Elements
//// Query DOM
   let message = $("#message");
   let send_message = $("#send_message");
   let chatroom = $("#Chatroom");
   let feedback = $("#feedback");
   let usersList = $("#Users-List");
   let nickName = $("#Nickname-Input");
   // 2)Second_Step-=----------------------------------

//Emit message or Sending message to server has String named new_message ,in app.js it listens the string new_message
//2) If send message btn is clicked
send_message.click(function(){
          //alert(message.val()); for testing purpose
           socket.emit('new_message', {message : message.val()});
});

//2) Or if the enter key is pressed
message.keypress( e => {

      let keycode = (e.keyCode ? e.keyCode : e.which);
      if(keycode == '13')
      {
            socket.emit('new_message', {message : message.val()});
      }
});

//3)Listen on new_message it takes the resended message from server to display
    socket.on("new_message", (data) => {
        message.val('');
        feedback.html('');
        let color=data.color;

        //append the new message on the chatroom
        chatroom.append(`
                        <div>
                            <div class="box3 sb14">
                              <p style='color:${color}' class="chat-text user-nickname">${data.username}</p>
                              <p class="chat-text" style="color: rgba(0,0,0,0.87)">${data.message}</p>
                            </div>
                        </div>
                        `);
        keepTheChatRoomToTheBottom();
    });

// this fortyping event
//Emit typing
        message.on("keypress", e => {

            let keycode = (e.keyCode ? e.keyCode : e.which);
            if(keycode != '13'){
                socket.emit('typing')
            }
        });

        //Listen on typing
        socket.on('typing', (data) => {
            feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
        });

//--------------------Nickname can display on left pannel so the given code emit the user name ------
// nick_name emited to app.js and  listens, it rewrite the temporary username and color
//Emit a username
        nickName.keypress( e => {
            let keycode = (e.keyCode ? e.keyCode : e.which);
            if(keycode == '13'){
                socket.emit('change_username', {nickName : nickName.val()});
                socket.on('get users', data => {
                    let html = '';
                    for(let i=0;i<data.length;i++){
                        html += `<li class="list-item" style="color: ${data[i].color}">${data[i].username}</li>`;
                    }
                    usersList.html(html)
                });
            }
        });

// function thats keeps the chatbox stick to the bottom
        const keepTheChatRoomToTheBottom = () => {
            const chatroom = document.getElementById('Chatroom');
            chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
        }
