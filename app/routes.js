'use strict';

var emailhandler = require('nodemailer'),
    exec = require('child_process').exec,
    fs = require('fs'),
    gunzip = require('gunzip-maybe'),
    ini = require('ini'),
    multer = require('multer'),
    path = require('path'),
    shortid = require('shortid'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var dir = __dirname + "/../tmp";
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            if (file.originalname.endsWith(".tar.gz")) {
                cb(null, shortid.generate() + ".tar.gz");
            }
            else {
                cb(null, shortid.generate() + ".ini");
            }
        },
        limits: {
            fileSize: 50 * 1024 * 1024 // 50 MB
        }
    }),
    tar = require('tar-fs'),
    transporter = emailhandler.createTransport({
        service: "Gmail",
        auth: {
            user: "superresolution6@gmail.com",
            pass: "fouriertransform"
        }
    }),
    upload = multer({
        storage: storage,
        fileFilter: fileFilter
    });

exports.setup = function (app) {

    app.post('/upload', upload.fields([{ name: 'zippedImgs', maxCount: 1 }, { name: 'configIni', maxCount: 1 }]), uploadImage);

    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });
}

function fileFilter(req, file, cb)
{
    if (file.originalname.endsWith(".tar.gz") || file.originalname.endsWith(".ini")) {
        cb(null, true);
    }
    else
    {
        cb(new Error("Files rejected due to file type or file name\n"));
    }
}

function uploadImage(req, res, next)
{
    console.log(req.files);
    var configFile = req.files['configIni'][0];
    /* Once a file has been verified to be a compressed tar, unzip its contents into a temporary folder of the same name*/
    var tarFile = req.files['zippedImgs'][0];
    var fp2tarfile = tarFile.path;
    var extractionPath = path.dirname(fp2tarfile) + '/' + tarFile.filename + ".tmp";

    var stream = fs.createReadStream(fp2tarfile).pipe(gunzip())
        .pipe(tar.extract(extractionPath));

    /* Execute the fourier ptychography algorithm */
    stream.on('finish', function() {
        var config = ini.parse(fs.readFileSync(configFile.path, 'utf-8'));;
        var matlabCommand = "\"cd app/fpm_code; runAlgorithm(\'" + extractionPath + "\'"  + "," + config.LEDgap + "," + config.LEDheight + "," + config.arraysize + "," + config.wavelength + "," + config.NA + "," + config.spsize + ")"
        console.log(matlabCommand);
        exec("matlab -nodesktop -r " + matlabCommand + "; exit; \"",
            function(err, stdout, stderr) {
				res.send('OK');
                console.log(stdout);
                console.log(stderr);
                console.log("Ran something in matlab");
				console.log("output path should be " + extractionPath + ".result.png");
				var myInterval = setInterval( function(){					
					fs.stat(extractionPath + ".result.png", function(err2, stat) {
						if (err2 == null)
						{
							var mailOptions = {
								from: '"FPM Utilities" <superresolution6@gmail.com>',
								to: req.body['email'] || "sujayt123@gmail.com",
								subject: 'Automated Notification: Fourier Ptychography Job Complete',
								text: err ? "Your job was prematurely terminated." : "Your job successfully completed.",
								attachments: (err)? [] : [{
															filename: tarFile.originalname + ".result",
															content: fs.createReadStream(extractionPath + ".result.png")
														}]
							};
							transporter.sendMail(mailOptions, (error, info) => {
								if (error) {
									return console.log(error);
								}
								console.log('Message %s sent: %s', info.messageId, info.response);
								clearInterval(myInterval);								
							});
						}
					})
				}, 25000);
            });
    });
}
