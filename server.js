const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
// File Stream: for working with files
const fs = require("fs");
// Child Process: for executing external files
const cp = require("child_process");
// Node CMD
// const cmd = require("node-cmd");

const app = express();
const upload = multer();
const jsonParser = bodyParser.json();

const runInstruction = (user, file) => {
    const arrFile = file.split("");
    let fileExt = '';
    let fileName = '';
    for (let i = 0; i < arrFile.length; i++) {
        if (arrFile[i] === '.') {
            fileExt = file.substring(i + 1, arrFile.length);
            break;
        }
        fileName += arrFile[i];
    }
    if (fileName && fileExt) {
        const msgObj = {
            fn: fileName,
            ext: fileExt,
            msg: "",
            err: 0
        }

        switch (fileExt.toLowerCase()) {
            case 'py': // python
                msgObj.msg = `python ./ide/files/${user}/${file}`;
                return msgObj;
            case 'cpp': // c++
                msgObj.msg = `cd ./ide/files/${user} && gcc ${file} -lstdc++ -o ${fileName} && ${fileName}`;
                return msgObj;
            case 'c': // c
                msgObj.msg = `cd ./ide/files/${user} && gcc ${file} -o ${fileName} && ${fileName}`;
                return msgObj;
            case 'cs': // c#
                msgObj.msg = `csc.exe ./ide/files/${user}/${file}`;
                return msgObj;
            case 'java': // java
                msgObj.msg = `cd ./ide/files/${user} && javac ${file} && java ${fileName}`;
                return msgObj;
            case 'js': // javascript
                msgObj.msg = `node ./ide/files/${user}/${file}`;
                return msgObj;
            case 'txt': // text
                msgObj.msg = `cd ./ide/files/${user} && type ${file}`;
                return msgObj;
            case 'bat': // batch
                msgObj.msg = `@echo off && cd ./ide/files/${user} && ${file}`;
                return msgObj;
            case 'pl': // perl
                msgObj.msg = `cd ./ide/files/${user} && perl ${file}`;
                return msgObj;
            case 'rb': // ruby
                msgObj.msg = `cd ./ide/files/${user} && ruby ${file}`;
                return msgObj;
            // case 'ps1': // powershell
            //     msgObj.msg = ``;
            //     return msgObj;
            // case 'sh': // bash
            //     msgObj.msg = ``;
            //     return msgObj;
        
            default:
                msgObj.err = 1;
                return msgObj;
        }
    }
    else if (fileName) {
        msgObj.err = 2;
    }
    else if (fileExt) {
        msgObj.err = 3;
    } 
    else msgObj.err = 4;
    return  msgObj;
}

app.use(express.static(`./ide/`));

app.get("/", (req, res) => {
    res.sendFile(`./ide/index.html`);
});

app.post("/", jsonParser, (req, res) => {
    try {
        const user = req.body.user ? req.body.user : "temp";
        const fileObj = runInstruction(user, req.body.file);

        fs.access(`./ide/files/${user}`, err => {
            if (err) {
                fs.mkdir(`./ide/files/${user}`, err => {
                    if (err) console.log(err.message);
                });
            }
            fs.writeFile(`./ide/files/${user}/${req.body.file}`, req.body.code, err =>{
                if (err) {
                    console.error(err.message);
                } else {
                    console.log("Successfully Written");
                    cp.exec(fileObj.msg, (err, stdout, stderr) =>{
                        if (err) {
                            console.error(err.message);
                            return res.json({
                                output: stdout,
                                error: err ? err.message : err
                            });
                        }
                        return res.json({
                            output: stdout,
                            error: err ? err.message : err
                        });
                    });
                }
            });
        });
        
    } catch (error) {
        console.error(error.message);
        return "An error occured!";
    }
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`BRAVENS IDE is listening on port ${listener.address().port}`);
});