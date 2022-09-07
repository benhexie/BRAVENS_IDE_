/**
 * CONSTANTS AND VARIABLES
 */
 const terminal = document.getElementsByClassName("terminal")[0];
const editor = document.getElementsByClassName("editor")[0];
const explorer = document.getElementsByClassName("explorer")[0];

const testBtn = document.getElementById("test-btn");
const submitBtn = document.getElementById("submit-btn");
const viewsBtn = document.getElementById("views-btn");
const titleEditBtn = document.getElementById("edit-btn");
const titleForm = document.getElementById("title-form");
const viewsDiv = document.getElementById("views-div");
const editorOnly = document.getElementById("editor-only");
const terminalOnly = document.getElementById("terminal-only");
const editorAndTerminal = document.getElementById("editor-and-terminal");
let viewsBtnClicked = 0;

/*
 * Show various application views
 */
editorOnly.addEventListener('click', () =>{
    terminal.style.display = 'none';
    editor.style.display = 'flex';
    editor.style.height = "100%";
});
terminalOnly.addEventListener('click', () =>{
    editor.style.display = 'none';
    terminal.style.display = 'inline';
    terminal.style.height = "100%";
});
editorAndTerminal.addEventListener('click', () =>{
    editor.style.display = 'flex';
    terminal.style.display = 'inline';
    editor.style.height = "65%";
    terminal.style.height = "35%";
});

/*
 * TEST instructions
 */
const runInstruction = file => {
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
    const msgObj = {
        fn: fileName,
        ext: fileExt,
        msg: "",
        err: 0
    }
    if (fileName && fileExt) {

        switch (fileExt.toLowerCase()) {
            case 'py': // python
                msgObj.msg = `python ${file}`;
                return msgObj;
            case 'cpp': // c++
                msgObj.msg = `gcc ${file} -lstdc++ -o ${fileName} && ${fileName}`;
                return msgObj;
            case 'c': // c
                msgObj.msg = `gcc ${file} -o ${fileName} && ${fileName}`;
                return msgObj;
            case 'cs': // c#
                msgObj.msg = `csc.exe ${file}`;
                return msgObj;
            case 'java': // java
                msgObj.msg = `javac ${file} && java ${fileName}`;
                return msgObj;
            case 'js': // javascript
                msgObj.msg = `node ${file}`;
                return msgObj;
            case 'txt': // text
                msgObj.msg = `type ${file}`;
                return msgObj;
            case 'bat': // batch
                msgObj.msg = `${file}`;
                return msgObj;
            case 'pl': // perl
                msgObj.msg = `perl ${file}`;
                return msgObj;
            case 'rb': // ruby
            msgObj.msg = `ruby ${file}`;
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

/*
 * TEST EVENT
 */
testBtn.addEventListener('click', e => {
    const file = editorTitle.value;
    const code = editorTxt.value;
    
    const runWithTxt = runInstruction(file);
    if (runWithTxt.err === 0) {
        terminalInput[nTerminal].value = runWithTxt.msg;
        commandsHistory.push(runWithTxt.msg);
        nCurrentHistory = commandsHistory.length;

        fetch("/", {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: "bimbo",
                file: file,
                code: code
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.error) 
                terminalDisplay("", result.error);
            else 
                terminalDisplay(result.output, "");
            newTerminal();
        })
        .catch(error => {
            console.error(error.message);
            const err = "An error occured!";
            terminalDisplay("", err);
            newTerminal();
        });
    }
    else {
        let err = `"${file}" cannot be created.`
        if (runWithTxt.err === 1) {
            err = `".${runWithTxt.ext}" cannot run on terminal.`
        }
        else if (runWithTxt.err === 2) {
            err = `"${runWithTxt.fn}" must have an extension.\n\te.g. test.py`;
        }
        else if (runWithTxt.err === 3) {
            err = `".${runWithTxt.ext}" must have a filename.\n\te.g. test.py`;
        }
        terminalDisplay("", err);
        newTerminal();
    }
});

/*
 * SUBMIT EVENT
 */
submitBtn.addEventListener('click', e => {

});
