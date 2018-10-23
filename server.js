const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const path = require('path');
const port = process.env.PORT || 8000;

const app = express();
app.set('port', port);
const server = app.listen(port, () => console.log(`Express server listening on port ${port}`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

const io = require('socket.io').listen(server);
var users = [];
var messages = [];
var curStones = [];
var userStones = {};

function curUser(user) {
    curCount = users.length;
    for (let i=0; i<curCount; i++) {
        if (user == users[i]) {
            return true;
        }
    }
    return false;
}

io.sockets.on('connection', function(socket) {
    socket.on('loadPage', function(data) {
        if (curUser(data.user) === true) {
            socket.emit('userExists', {error: 'User already exists'})
        } else {
            users.push(data.user);
            socket.emit('messageLoad', {currentUser: data.user, messages:messages})
            userStones[data.user] = 0;
        }
    });
    socket.on('newMessage', function(data) {
        if (curUser(data.user) === false) {
            users.push(data.user);
            socket.emit('messageLoad', {currentUser: data.user, messages:messages})
            userStones[data.user] = 0;
            io.emit('newMessagePost', {newMessage: 'HAS BEEN RESET', user: data.user + '(' + userStones[data.user] + ')'});
        } else {
            let checker = data.message.toLowerCase();;
            console.log(userStones);
            console.log(curStones);
            if (checker.includes(config.soul)) {
                if (curStones.includes(data.user + 'soul')) {
                    messages.push({name: data.user, message: 'HAS ALREADY OBTAINED THE SOUL ROCK AND IS REMINDING ALL'});
                    io.emit('newMessagePost', {newMessage: 'HAS ALREADY OBTAINED THE SOUL ROCK AND IS REMINDING ALL', user: data.user});
                } else {
                    userStones[data.user] += 1;
                    messages.push({name: data.user, message: 'HAS OBTAINED THE SOUL ROCK'});
                    io.emit('newMessagePost', {newMessage: 'HAS OBTAINED THE SOUL ROCK', user: data.user + '(' + userStones[data.user] + ')'});
                    curStones.push(data.user + 'soul');
                }
            } else if (checker.includes(config.mind)) {
                if (curStones.includes(data.user + 'mind')) {
                    messages.push({name: data.user, message: 'HAS ALREADY OBTAINED THE MIND ROCK AND IS REMINDING ALL'});
                    io.emit('newMessagePost', {newMessage: 'HAS ALREADY OBTAINED THE MIND ROCK AND IS REMINDING ALL', user: data.user});
                } else {
                    userStones[data.user] += 1;
                    messages.push({name: data.user, message: 'HAS OBTAINED THE MIND ROCK'});
                    io.emit('newMessagePost', {newMessage: 'HAS OBTAINED THE MIND ROCK', user: data.user + '(' + userStones[data.user] + ')'});
                    curStones.push(data.user + 'mind');
                }
            } else if (checker.includes(config.power)) {
                if (curStones.includes(data.user + 'power')) {
                    messages.push({name: data.user, message: 'HAS ALREADY OBTAINED THE POWER ROCK AND IS REMINDING ALL'});
                    io.emit('newMessagePost', {newMessage: 'HAS ALREADY OBTAINED THE POWER ROCK AND IS REMINDING ALL', user: data.user});
                } else {
                    userStones[data.user] += 1;
                    messages.push({name: data.user, message: 'HAS OBTAINED THE POWER ROCK'});
                    io.emit('newMessagePost', {newMessage: 'HAS OBTAINED THE POWER ROCK', user: data.user + '(' + userStones[data.user] + ')'});
                    curStones.push(data.user + 'power');
                }
            } else if (checker.includes(config.reality)) {
                if (curStones.includes(data.user + 'reality')) {
                    messages.push({name: data.user, message: 'HAS ALREADY OBTAINED THE REALITY ROCK AND IS REMINDING ALL'});
                    io.emit('newMessagePost', {newMessage: 'HAS ALREADY OBTAINED THE REALITY ROCK AND IS REMINDING ALL', user: data.user});
                } else {
                    userStones[data.user] += 1;
                    messages.push({name: data.user, message: 'HAS OBTAINED THE REALITY ROCK'});
                    io.emit('newMessagePost', {newMessage: 'HAS OBTAINED THE REALITY ROCK', user: data.user + '(' + userStones[data.user] + ')'});
                    curStones.push(data.user + 'reality');
                }
            } else if (checker.includes(config.space)) {
                if (curStones.includes(data.user + 'space')) {
                    messages.push({name: data.user, message: 'HAS ALREADY OBTAINED THE SPACE ROCK AND IS REMINDING ALL'});
                    io.emit('newMessagePost', {newMessage: 'HAS ALREADY OBTAINED THE SPACE ROCK AND IS REMINDING ALL', user: data.user});
                } else {
                    userStones[data.user] += 1;
                    messages.push({name: data.user, message: 'HAS OBTAINED THE SPACE ROCK'});
                    io.emit('newMessagePost', {newMessage: 'HAS OBTAINED THE SPACE ROCK', user: data.user + '(' + userStones[data.user] + ')'});
                    curStones.push(data.user + 'space');
                }
            } else if (checker.includes(config.time)) {
                if (curStones.includes(data.user + 'time')) {
                    messages.push({name: data.user, message: 'HAS ALREADY OBTAINED THE TIME ROCK AND IS REMINDING ALL'});
                    io.emit('newMessagePost', {newMessage: 'HAS ALREADY OBTAINED THE TIME ROCK AND IS REMINDING ALL', user: data.user});
                } else {
                    userStones[data.user] += 1;
                    messages.push({name: data.user, message: 'HAS OBTAINED THE TIME ROCK'});
                    io.emit('newMessagePost', {newMessage: 'HAS OBTAINED THE TIME ROCK', user: data.user + '(' + userStones[data.user] + ')'});
                    curStones.push(data.user + 'time');
                }
            } else if (checker === 'dersneyrevengers') {
                messages = [];
                curStones = [];
                for (var [key, value] of Object.entries(userStones)) {
                    userStones[key] = 0;
                    console.log(key, value);
                }
                users = [];
                io.emit('newMessagePost', {newMessage: 'ADMIN HAS RESET ALL', user: data.user});
            } else {
                messages.push({name: data.user, message: data.message});
                io.emit('newMessagePost', {newMessage: data.message, user: data.user + '(' + userStones[data.user] + ')'});
            }
            if (userStones[data.user] == 6) {
                messages.push({name: data.user, message: 'HAS OBTAINED ALL SIX ETERNITY ROCKS AND MAY POOF HALF THE POPULATION NOW'});
                io.emit('newMessagePost', {newMessage: 'HAS OBTAINED ALL SIX ETERNITY ROCKS AND MAY POOF HALF THE POPULATION NOW', user: data.user});
            }
        }
    });
});