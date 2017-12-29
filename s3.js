const knox = require('knox');
const fs = require('fs');

let secrets;

if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets.json'); // secrets.json is in .gitignore
}

const client = knox.createClient({
    key: secrets.aws_key,
    secret: secrets.aws_secret,
    bucket: 'yomanthisiszerocool'
});

exports.upload = function(file) {
    return new Promise(function(resolve, reject) {
        const s3Request = client.put(file.filename, {
            'Content-Type': file.mimetype,
            'Content-Length': file.size,
            'x-amz-acl': 'public-read'
        });

        const readStream = fs.createReadStream(file.path);
        readStream.on('error', function(err) {
            console.log(err);
        })
        readStream.pipe(s3Request);
        s3Request.on('response', s3Response => {
            const wasSuccessful = s3Response.statusCode == 200;
            if (wasSuccessful) {
                fs.unlink(file.path, (err) => {
                    console.log('deleting file');
                    err ? reject() : resolve()
                })
            } else {
                console.log('rejecting');
                reject();
            }
        });
    });
};
