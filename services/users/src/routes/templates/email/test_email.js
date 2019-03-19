var nodemailer = require("nodemailer");
var handlebars = require('handlebars');
var fs = require('fs');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mailercsr@gmail.com',
      pass: 'mailercsr123'
    }
  });
  
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

var func = new Promise((resolve, reject) => {
    (receiver, name, title, content) => {
        var resp = "";
        readHTMLFile(__dirname + '/reset_email/csr.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name: name,
                title: title,
                content: content
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'mailercsr@gmail.com',
                to: receiver,
                subject: title,
                html : htmlToSend
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    resolve(error);
                } 
                else {
                    console.log('Email sent: ' + info.response);
                    resolve('Email sent: ' + info.response);
                }
            }); 
        });
    }
});

exports.sendPasswordReset = (receiver, title, content) => {
    return new Promise((resolve, reject) => {
        
            var resp = "";
            readHTMLFile(__dirname + '/reset_email/csr.html', function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                    title: title,
                    content: content
                };
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: 'mailercsr@gmail.com',
                    to: receiver,
                    subject: title,
                    html : htmlToSend
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                        resolve(error);
                    } 
                    else {
                        console.log('Email sent: ' + info.response);
                        resolve('Email sent: ' + info.response);
                    }
                }); 
            });
    });
}