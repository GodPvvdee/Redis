const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const redis = require('redis')
let client = ''
const session = require('express-session')({
    secret: 'my-secret',
    resave: true,
    saveUninitialized: true
})
const sharedsession = require('express-socket.io-session')
client = redis.createClient({
    host: 'localhost',
    port: 6379
})
client.on('connect', function(err) {
    console.log("Redis connect")
    // client.set("foo", "bar");
    // client.get("missing_key", function(err, reply) {
    //     // reply is null when the key is missing
    //     console.log(reply);
    //   });
})

// 
app.use(session)

io.use(
    sharedsession(session, {
        autoSave: true
    })
)

app.use(require("express").static(__dirname))


io.on('connection', function(socket){
    console.log('Connected')
    socket.on('login', arr => {
        console.log(arr)
        socket.handshake.session.userdata = arr
        socket.handshake.session.save()
        socket.emit('print', socket.handshake.session)
        // console.log(socket.handshake.session)
        // console.log("USER DATA 0 ", socket.handshake.session.userdata[0])
        client.set('email', socket.handshake.session.userdata[0])
        client.set('pass', socket.handshake.session.userdata[1])
        client.get("email", function(err, reply) {
            // reply is null when the key is missing
            console.log(reply);
        });
    })
    
})

server.listen(3000, () => {
    console.log('3000 ')
})