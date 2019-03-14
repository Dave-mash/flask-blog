
const socket = io();

socket.on('connect', () => {
    console.log('connected to server!')
    // socket.emit('createMessage', {
    //     from: 'Dave',
    //     text: "This is Dave's message"
    // });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server!')
});

socket.on('newMessage', (message) => {
    console.log('New Message', message);
});