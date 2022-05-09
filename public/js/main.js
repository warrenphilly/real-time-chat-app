const chatform = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.getElementById('users');


//get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


const socket = io();
//join chatroom
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {

    outputRoomName(room);
    outputUsers(users);


});

// message from server
socket.on('message', (message) => {
    outputMessage(message);
    console.log(message);

    //scroll down chat on new message
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

//send messgae
chatform.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    //emit the message to the server
    socket.emit('chatMessage', msg);
    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

///output message to dom
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to the dom
function outputRoomName(room) {
    roomName.innerText = room;
}

//add users to dom
function outputUsers(users) {
   
    userList.innerHTML= `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
    // var output =  user.username
    // console.log(output)
}