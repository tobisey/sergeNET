//EXPRESS
const express = require('express');
const app = express();

//SOCKET.IO
const server = require('http').Server(app);
const io = require('socket.io')(server);

//COMPRESSION
const compression = require('compression');
app.use(compression());

//BODY-PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//S3
const s3 = require('./s3');

//CONFIG
var config = require('./config.json');

//COOKIE-SESSION
const cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: 'no distance left to run',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

//UPLOAD IMAGE STUFF
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

//CSURF
// const csurf = require('csurf');
// app.use(csurf());
//
// app.use(function(req, res, next){
//     res.cookie('mytoken', req.csrfToken());
//     next();
// });

//DATABASE
const db = require('./db.js');


if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

//STATIC
app.use(express.static('./public'));

//DISK STORAGE/MULTER ETC.
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//SOCKET

let onlineUsers = [];
let chatMessages = [];

io.on('connection', (socket) => {
    console.log(`socket ${socket.id} has connected`);

    socket.on('disconnect', function() {
        let disconnectedId;
        onlineUsers = onlineUsers.filter(user => {
            if (user.socketId === socket.id) {
                disconnectedId = user.id;
            }
            return user.socketId !== socket.id
        })

        let x = onlineUsers.some(user => user.id == disconnectedId)
        if (x) {
            return
        } else {
            io.sockets.emit('userLeft', {
                disconnectedId
            })
        }

        console.log(`socket ${socket.id} is now disconnected`);

    });
})

app.get('/connected/:socketId', (req, res) => {
    console.log('ONLINE USER BEFORE: ', onlineUsers); //----run if statement to see if user already in array
    onlineUsers.push({id: req.session.user.id, socketId: req.params.socketId});

    // const ids = onlineUsers.map(obj => obj.id)
    var ids = [];
    onlineUsers.forEach((user) => {
        if (!ids.includes(user.id)) {
            ids.push(user.id)
        }
    })

    console.log('ONLINE USER IDS: ', ids);
    db.getOnlineUsers(ids).then((users) => {
        io.sockets.sockets[req.params.socketId].emit('onlineUsers', {
            users
        })
        io.sockets.sockets[req.params.socketId].emit('chatMessages', {
            chatMessages
        })
        users = users.filter(user => user.id == req.session.user.id)
        io.sockets.emit('userJoined', {
            users,
            text: `${req.session.user.first} ${req.session.user.last} just logged in`
        })
        res.send()
    })
})

app.post('/new-message', (req, res) => {
    console.log(req.body);
    chatMessages.push(req.body);
    if (chatMessages.length > 10) {
        console.log('MORE THAN 10 IN ARRAY!!!!!');
        chatMessages = chatMessages.splice(chatMessages.length - 10)
    }
    console.log('NEW CHAT MESSAGES: ', chatMessages);
    io.sockets.emit('chatMessages', {
        chatMessages
    })
    res.json({success: true})
})

//GET ROUTES
app.get('/welcome', (req, res) => {
    console.log('/welcome');
    if(req.session.user) {
        res.redirect('/')
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

app.get('/', (req, res) => {
    console.log('/');
    if(!req.session.user) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }

})

app.get('/user', (req, res) => {
    db.getUserInfo(req.session.user.id).then((results) => {
        res.json({
            success: true,
            results: results
        })
    }).catch((err) => {
        console.log(err);
        res.json({success: false})
    })
})

app.get('/number-friends', (req, res) => {
    db.numberOfFriends(req.session.user.id).then((results) => {
        console.log('NUMBER OF FRIENDS', results.length);

        function pad(num, size) {
            var s = "0000" + num;
            return s.substr(s.length-size);
        }
        res.json({
            success: true,
            numberFriends: pad(results.length, 4)
        })
    })
})

app.get('/get-other-user', (req, res) => {
    console.log('QUERY ID: ', req.query.id);
    db.newGetOtherUserInfo(req.session.user.id, req.query.id).then((results) => {
        if (results.length === 0) {
            db.newGetOtherUserInfoNoStatus(req.query.id).then((results) => {
                console.log('try again');
                res.json({
                    otherUser: results
                })
            })
        } else {
            res.json({
                otherUser: results
            })
        }
    })
})

app.get('/get-friends', (req, res) => {
    console.log('GETTING FRIENDS MY DUDE');
    db.getFriends(req.session.user.id).then((results) => {
        res.json({
            friends: results
        })
    })
})

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
})

//POST ROUTES
app.post('/register', (req, res) => {

    console.log('first: ', req.first);

    db.hashPassword(req.body.password).then((hash) => {
        db.register(req.body.first, req.body.last, req.body.email, hash).then((id) => {

            req.session.user = {
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                id: id,
                pic: false
            }
            console.log('USER SESSION: ', req.session.user);

            res.json({success: true})
        }).catch((err) => {
            console.log(err);
            res.json({success: false})
        })
    })

})

app.post('/login', (req, res) => {

    db.loginInfo(req.body.email).then((results) => {
        db.checkPassword(req.body.password, results.password).then((doesMatch) => {
            if (doesMatch) {

                req.session.user = {
                    first: results.first,
                    last: results.last,
                    email: results.email,
                    id: results.id,
                    pic: results.profile_pic
                }
                console.log('USER SESSION: ', req.session.user);
                res.json({success: true})
            } else {
                res.json({success: false})
            }

        }).catch((err) => {
            console.log(err);
            res.json({success: false})
        })
    })

})

app.post('/upload-image', uploader.single('file'), (req, res) => {

    console.log('inside of POST /upload-image');
    s3.upload(req.file).then(() => {
        req.file.filename = config.s3Url + req.file.filename;
        db.saveImageToDB(req.file.filename, req.session.user.id).then((results) => {
            res.json({
                success: true,
                results: results
            })
        })
    }).catch((err) => {
        console.log(err);
        res.json({success: false})
    })

})

app.post('/update-bio', (req, res) => {

    console.log('inside of POST /update-bio');
    db.updateBio(req.body.newbio, req.session.user.id).then((results) => {
        console.log(results);
        res.json({
            success: true,
            results: results
        })
    }).catch((err) => {
        console.log(err);
        res.json({success: false})
    })
})

app.post('/terminate', (req, res) => {
    console.log('TERMINATING...');
    db.newTerminateFriendship(req.session.user.id, req.body.id).then(() => {
        let recipient = onlineUsers.filter(user => user.id == req.body.id)
        io.sockets.sockets[recipient[0].socketId].emit('sendFriend', {
            text: `${req.session.user.first} ${req.session.user.last} doesn't think your friendship is worth saving`
        })

    }).then(() => {
        res.json({
            success: true
        })
    }).catch((err) => {
        console.log(err);
        res.json({success: false})
    })
})

app.post('/accept', (req, res) => {
    console.log('ACCEPTING...');
    db.newAcceptFriendship(req.session.user.id, req.body.id).then(() => {
        let recipient = onlineUsers.filter(user => user.id == req.body.id)
        io.sockets.sockets[recipient[0].socketId].emit('sendFriend', {
            text: `${req.session.user.first} ${req.session.user.last} thinks you're worthy of their friendship`
        })

    }).then(() => {
        res.json({
            success: true
        })
    }).catch((err) => {
        console.log(err);
        res.json({success: false})
    })
})

app.post('/reject', (req, res) => {
    console.log('REJECTING...');
    db.newRejectFriendship(req.session.user.id, req.body.id).then(() => {
        let recipient = onlineUsers.filter(user => user.id == req.body.id)
        io.sockets.sockets[recipient[0].socketId].emit('sendFriend', {
            text: `${req.session.user.first} ${req.session.user.last} rejects your advances`
        })

    }).then(() => {
        res.json({
            success: true
        })
    }).catch((err) => {
        console.log(err);
        res.json({success: false})
    })
})

app.post('/cancel', (req, res) => {
    console.log('CANCELLING...');
    db.newCancelFriendship(req.session.user.id, req.body.id).then(() => {
        res.json({
            success: true
        })
    }).catch((err) => {
        console.log(err);
        res.json({success: false})
    })
})

app.post('/send', (req, res) => {
    console.log('SENDING...');
    db.currentRequestSitch(req.session.user.id, req.body.id).then((results) => {
        console.log(results);
        if (!results) {
            db.newSendFriendship(req.session.user.id, req.body.id).then(() => {
                let recipient = onlineUsers.filter(user => user.id == req.body.id)
                io.sockets.sockets[recipient[0].socketId].emit('sendFriend', {
                    text: `${req.session.user.first} ${req.session.user.last} wants to be best buds`
                })

            }).then(() => {
                res.json({
                    success: true
                })
            }).catch((err) => {
                console.log(err);
                res.json({success: false})
            })
        } else if (results.sender_id === req.session.user.id) {
            db.newSendFriendshipAgain(req.session.user.id, req.body.id).then(() => {
                let recipient = onlineUsers.filter(user => user.id == req.body.id)
                io.sockets.sockets[recipient[0].socketId].emit('sendFriend', {
                    text: `${req.session.user.first} ${req.session.user.last} wants to be best buds`
                })

            }).then(() => {
                res.json({
                    success: true
                })
            }).catch((err) => {
                console.log(err);
                res.json({success: false})
            })
        } else if (results.recipient_id === req.session.user.id) {
            db.newSendFriendshipAgainReverse(req.session.user.id, req.body.id).then(() => {
                let recipient = onlineUsers.filter(user => user.id == req.body.id)
                io.sockets.sockets[recipient[0].socketId].emit('sendFriend', {
                    text: `${req.session.user.first} ${req.session.user.last} wants to be best buds`
                })

            }).then(() => {
                res.json({
                    success: true
                })
            }).catch((err) => {
                console.log(err);
                res.json({success: false})
            })
        }
    })
})

app.get('*', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080, function() {
    console.log("listening 8080...")
});
