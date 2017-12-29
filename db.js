var spicedPg = require('spiced-pg');
var db;

//BCRYPT
const bcrypt = require('bcryptjs');

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL)
} else {
    var secrets = require('./secrets.json');
    db = spicedPg(`postgres:${secrets.username}:${secrets.password}@localhost:5432/sn`);
}

//FRIEND REQUEST status
const PENDING = 1, ACCEPTED = 2, CANCELLED = 3, TERMINATED = 4, REJECTED = 5

//====================================================================================

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

exports.hashPassword = hashPassword;

//====================================================================================

function checkPassword(email, hashedPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(email, hashedPassword, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}

exports.checkPassword = checkPassword;

//====================================================================================

function register(first, last, email, password) {
    return db.query(
        'INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [first, last, email, password]
    ).then((results) => {
        console.log('REGISTERED');
        return results.rows[0].id;
    }).catch((err) => {
        console.log(err);
    });
}

exports.register = register;

//====================================================================================

function loginInfo(email) {
    return db.query('SELECT id, first, last, email, password FROM users WHERE email = $1',
        [email]
    ).then((results) => {
        return results.rows[0];
    }).catch((err) => {
        console.log(err);
    });
}

exports.loginInfo = loginInfo;

//====================================================================================

function  getUserInfo(id) {
    return db.query('SELECT id, first, last, profile_pic, bio FROM users WHERE id = $1',
        [id]
    ).then((results) => {
        return results.rows[0];
    }).catch((err) => {
        console.log(err);
    });
}

exports.getUserInfo = getUserInfo;

//====================================================================================

function saveImageToDB(image, id) {
    return db.query('UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING profile_pic',
        [image, id]
    ).then((results) => {
        console.log('PROFILE PIC UPDATED');
        return results.rows[0].profile_pic
    }).catch((err) => {
        console.log(err);
    })
}

exports.saveImageToDB = saveImageToDB

//====================================================================================

function updateBio(bio, id) {
    return db.query('UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio',
        [bio, id]
    ).then((results) => {
        console.log('BIO UPDATED');
        return results.rows[0].bio
    }).catch((err) => {
        console.log(err);
    })
}

exports.updateBio = updateBio

//====================================================================================

function getFriendRequestStatus(id, otherId) {
    return db.query('SELECT status, sender_id, recipient_id FROM friend_requests WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)',
        [id, otherId]
    ).then((results) => {
        // console.log('FRIEND REQUEST STATUS: ', results.rows[0].status);
        // console.log('SENDER ID: ', results.rows[0].sender_id);
        return results.rows[0];
    }).catch((err) => {
        console.log(err);
    })
}

exports.getFriendRequestStatus = getFriendRequestStatus

//====================================================================================

function sendFriendRequest(loggedInUserId, otherUserId) {
    return db.query(`INSERT INTO friend_requests (sender_id, recipient_id, status) VALUES ($1, $2, ${PENDING}) RETURNING status`,
        [loggedInUserId, otherUserId]
    ).then((results) => {
        console.log('STATUS: ', results.rows[0].status);
        return results.rows[0].status
    }).catch((err) => {
        console.log(err);
    })
}

exports.sendFriendRequest = sendFriendRequest

//====================================================================================

function cancelFriendRequest(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${CANCELLED} WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) RETURNING status`,
        [loggedInUserId, otherUserId]
    ).then((results) => {
        console.log('STATUS: ', results.rows[0].status);
        return results.rows[0].status
    }).catch((err) => {
        console.log(err);
    })
}

exports.cancelFriendRequest = cancelFriendRequest

//====================================================================================

function terminateFriendship(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${TERMINATED} WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) RETURNING status`,
        [loggedInUserId, otherUserId]
    ).then((results) => {
        console.log('STATUS: ', results.rows[0].status);
        return results.rows[0].status
    }).catch((err) => {
        console.log(err);
    })
}

exports.terminateFriendship = terminateFriendship

//====================================================================================

function sendFriendRequestAgain(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${PENDING} WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) RETURNING status`,
        [loggedInUserId, otherUserId]
    ).then((results) => {
        console.log('STATUS: ', results.rows[0].status);
        return results.rows[0].status
    }).catch((err) => {
        console.log(err);
    })
}

exports.sendFriendRequestAgain = sendFriendRequestAgain

//====================================================================================

function acceptFriendRequest(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${ACCEPTED} WHERE (sender_id = $2 AND recipient_id = $1) RETURNING status`,
        [loggedInUserId, otherUserId]
    ).then((results) => {
        console.log('STATUS: ', results.rows[0].status);
        return results.rows[0].status
    }).catch((err) => {
        console.log(err);
    })
}

exports.acceptFriendRequest = acceptFriendRequest

//====================================================================================

function rejectFriendRequest(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${REJECTED} WHERE (sender_id = $2 AND recipient_id = $1) RETURNING status`,
        [loggedInUserId, otherUserId]
    ).then((results) => {
        console.log('STATUS: ', results.rows[0].status);
        return results.rows[0].status
    }).catch((err) => {
        console.log(err);
    })
}

exports.rejectFriendRequest = rejectFriendRequest

//====================================================================================

function newGetOtherUserInfo(loggedInId, otherId) {
    return db.query(`SELECT users.id, first, last, profile_pic, bio, status, sender_id, recipient_id
                     FROM users
                     JOIN friend_requests
                     ON (users.id = $2 AND sender_id = $1 AND recipient_id = $2)
                     OR (users.id = $2 AND sender_id = $2 AND recipient_id = $1)`,
                        [loggedInId, otherId]
    ).then((results) => {
        console.log('OTHER USER INFO ', results.rows);
        return results.rows
    }).catch((err) => {
        console.log(err);
    })
}

exports.newGetOtherUserInfo = newGetOtherUserInfo

//====================================================================================

function newGetOtherUserInfoNoStatus(otherId) {
    return db.query(`SELECT id, first, last, profile_pic, bio FROM users WHERE id = $1`,
                        [otherId]
    ).then((results) => {
        console.log('OTHER USER INFO ', results.rows);
        return results.rows
    }).catch((err) => {
        console.log(err);
    })
}

exports.newGetOtherUserInfoNoStatus = newGetOtherUserInfoNoStatus

//====================================================================================

function getFriends(id) {
    return db.query(`SELECT users.id, first, last, profile_pic, status
                     FROM friend_requests
                     JOIN users
                     ON (status = ${PENDING} AND recipient_id = $1 AND sender_id = users.id)
                     OR (status = ${ACCEPTED} AND recipient_id = $1 AND sender_id = users.id)
                     OR (status = ${ACCEPTED} AND sender_id = $1 AND recipient_id = users.id)`,
                        [id]
    ).then((results) => {
        console.log('FRIENDS: ', results.rows);
        return results.rows
    }).catch((err) => {
        console.log(err);
    })
}

exports.getFriends = getFriends

//====================================================================================

function newTerminateFriendship(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${TERMINATED}
                     WHERE (sender_id = $1 AND recipient_id = $2)
                     OR (sender_id = $2 AND recipient_id = $1)`,
        [loggedInUserId, otherUserId]
    ).catch((err) => {
        console.log(err);
    })
}

exports.newTerminateFriendship = newTerminateFriendship

//====================================================================================

function newAcceptFriendship(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${ACCEPTED}
                     WHERE (sender_id = $2 AND recipient_id = $1)`,
        [loggedInUserId, otherUserId]
    ).catch((err) => {
        console.log(err);
    })
}

exports.newAcceptFriendship = newAcceptFriendship

//====================================================================================

function newRejectFriendship(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests SET status = ${REJECTED}
                     WHERE (sender_id = $2 AND recipient_id = $1)`,
        [loggedInUserId, otherUserId]
    ).catch((err) => {
        console.log(err);
    })
}

exports.newRejectFriendship = newRejectFriendship

//====================================================================================

function newCancelFriendship(loggedInUserId, otherUserId) {
    return db.query(`DELETE FROM friend_requests
                     WHERE (sender_id = $1 AND recipient_id = $2)`,
        [loggedInUserId, otherUserId]
    ).catch((err) => {
        console.log(err);
    })
}

exports.newCancelFriendship = newCancelFriendship

//====================================================================================

function currentRequestSitch(loggedInUserId, otherUserId) {
    return db.query(`SELECT * FROM friend_requests
                     WHERE (sender_id = $1 AND recipient_id = $2)
                     OR (sender_id = $2 AND recipient_id = $1)`,
        [loggedInUserId, otherUserId]
    ).then((results) => {
        return results.rows[0]
    }).catch((err) => {
        console.log(err);
    })
}

exports.currentRequestSitch = currentRequestSitch

//====================================================================================

function newSendFriendship(loggedInUserId, otherUserId) {
    return db.query(`INSERT INTO friend_requests (sender_id, recipient_id, status)
                     VALUES ($1, $2, ${PENDING})`,
        [loggedInUserId, otherUserId]
    ).catch((err) => {
        console.log(err);
    })
}

exports.newSendFriendship = newSendFriendship

//====================================================================================

function newSendFriendshipAgain(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests
                     SET status = ${PENDING}
                     WHERE (sender_id = $1 AND recipient_id = $2)`,
        [loggedInUserId, otherUserId]
    ).catch((err) => {
        console.log(err);
    })
}

exports.newSendFriendshipAgain = newSendFriendshipAgain

//====================================================================================

function newSendFriendshipAgainReverse(loggedInUserId, otherUserId) {
    return db.query(`UPDATE friend_requests
                     SET sender_id = $1, recipient_id = $2, status = ${PENDING}
                     WHERE (sender_id = $2 AND recipient_id = $1)`,
        [loggedInUserId, otherUserId]
    ).catch((err) => {
        console.log(err);
    })
}

exports.newSendFriendshipAgainReverse = newSendFriendshipAgainReverse

//====================================================================================

function numberOfFriends(id) {
    return db.query(`SELECT * FROM friend_requests
                     WHERE (sender_id = $1 AND status = 2)
                     OR (recipient_id = $1 AND status = 2)`,
        [id]
    ).then((results) => {
        return results.rows
    }).catch((err) => {
        console.log(err);
    })
}

exports.numberOfFriends = numberOfFriends

//====================================================================================

function getOnlineUsers(ids) {
    return db.query(`SELECT id, first, last, profile_pic FROM users WHERE id = ANY($1)`,
        [ids]
    ).then((results) => {
        return results.rows
    }).catch((err) => {
        console.log(err);
    })
}

exports.getOnlineUsers = getOnlineUsers
