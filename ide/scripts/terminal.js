const terminalTitle = document.getElementsByClassName("terminal-title");
const terminalOutput = document.getElementsByClassName("terminal-output");
const terminalInput = document.getElementsByClassName("terminal-input");
const terminalError = document.getElementsByClassName("error-msg");
const terminalForm = document.getElementsByClassName("terminal-form");
const terminalList = document.getElementById("terminal-list");

const commandsHistory = [];
let nCurrentHistory = 0;
let firstDownPress = false;
let nTerminalOutput = 0;
let nTerminalError = 0;
let nTerminal = 0;

let echo = '';
const bravensTxt = `BRAVENS CONSOLE\n................`;
terminalTitle[0].textContent = bravensTxt;
let printBravens = false;

/*
 * Create new terminal intrerface
 */
const newTerminal = function(){
    if (nTerminal !== -1) 
        terminalInput[nTerminal].disabled = true;
    terminalList.insertAdjacentHTML('beforeend', `
    <li>
        <textarea name="terminal-title" class="terminal-title" placeholder="BRAVENS CONSOLE" disabled></textarea>
        <div>
            <label for="terminal-input">
                <textarea disabled>BRAVENS:</textarea>
                <textarea disabled>~</textarea>
                <textarea disabled>$</textarea>
            </label>
            <form action="" method="post" class="terminal-form">
                <input type="text" name="terminal-input" class="terminal-input" spellcheck="false" autocomplete="off">
                <input type="submit" hidden>
            </form>
        </div>
        <textarea name="error-msg" class="error-msg" disabled></textarea>
        <textarea name="terminal-output" class="terminal-output" disabled></textarea>
    </li>`);

    nTerminal++;

    if (printBravens === true) {
        terminalTitle[nTerminal].textContent = bravensTxt;
        terminalTitle[nTerminal].style.display = "inline";
        printBravens = false;
    } else {
        terminalTitle[nTerminal].style.display = "none";
    }
    terminalInput[nTerminal].focus();
    
    terminalForm[nTerminal].addEventListener('submit', e=> { terminalCommand(e) });
    terminalInput[nTerminal].addEventListener('keydown', e => { viewTerminalHistory(e) });
}

/*
 * Checks terminal commands
 */
const terminalCommand = e => {
    e.preventDefault();
    firstDownPress = false;
    const terminalInputArr = terminalInput[nTerminal].value.trim().split("");
    if (terminalInputArr[0]) {
        commandsHistory.push(terminalInput[nTerminal].value);
        nCurrentHistory = commandsHistory.length;
        let terminalWord = "";
        const terminalArr = [];
        let i = 0;
        while (terminalInputArr[i]) {
            while (terminalInputArr[i] && terminalInputArr[i] === ' ') {
                i++;
            }
            while (terminalInputArr[i] && terminalInputArr[i] !== ' ') {
                terminalWord += terminalInputArr[i];
                i++;
            }
            if (terminalWord)
                terminalArr.push(terminalWord);
            terminalWord = '';
        }
        switch (terminalArr[0].toLowerCase()) {
            // python command
            case 'python':
                const helpmsg = `usage: python [option]
Options and arguments:
--help      : Prints out list of available arguments
-h          : Same as --help
<filename>  : Name of python file to be run
              e.g. test.py`;
                if (terminalArr[1] && terminalArr.length <= 2) {
                    if (terminalArr[1].toLowerCase() === '--help' || terminalArr[1].toLowerCase() === '-h') {
                        terminalDisplay(helpmsg, "");
                    }
                    else if(terminalArr[1].substring(terminalArr[1].length - 3, terminalArr[1].length).toLowerCase() === '.py') {
                        if (terminalArr[1] === 'test.py') {
                            const code = editorTxt.value;

                            fetch("/", {
                                method: 'POST',
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    runWith: runInstruction("test.py"),
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
                                return;
                            })
                            .catch(error => {
                                const err = "An error occured!";
                                console.error(error.message);
                                terminalDisplay("", err);
                                newTerminal();
                                return;
                            });
                        }
                        else {
                            const err = "No such file or directory";
                            terminalDisplay("", err);
                            newTerminal();
                        }
                    }
                    else {
                        const err = "No such file or directory";
                        terminalDisplay("", err);
                        newTerminal();
                    }
                }
                else {
                    const err = "Invalid Argument!";
                    terminalDisplay(helpmsg, err);
                    terminalOutput[nTerminal].style.display = "flex";
                    newTerminal();
                }
                break;
            // BRAVENS command
            case 'bravens':
                printBravens = true;
                newTerminal();
                break;
            // echo command
            case 'echo':
                let msg = '';
                for (let i = 1; i < terminalArr.length; i++) {
                    msg += terminalArr[i] + ' ';
                }
                terminalDisplay(msg, "");
                newTerminal();
                break;
            case 'cls':
            case 'clear':
                Array.from(document.querySelectorAll('#terminal-list > li')).forEach(elm => {
                    elm.remove();
                });
                nTerminal = -1;
                newTerminal();
                break;
                
            default:
                const err = "Command does not exist";
                terminalDisplay("", err);
                newTerminal();
        }
    }
    else newTerminal();
}

/*
* View past commands function
*/
let lastDown = false;
const viewTerminalHistory = e => {
    if (((e.key === 'ArrowUp' && commandsHistory[nCurrentHistory - 1]) || 
        (e.key === 'ArrowDown' && commandsHistory[nCurrentHistory + 1]))) {
        e.preventDefault();
        lastDown = false;
        if (e.key === 'ArrowUp'){
            firstDownPress = true;
            if (commandsHistory[nCurrentHistory - 1])
                nCurrentHistory--;
        }
        if(e.key === 'ArrowDown'){
            if (commandsHistory[nCurrentHistory + 1])
                nCurrentHistory++;
        }
        
        terminalInput[nTerminal].value = commandsHistory[nCurrentHistory];
    }
    else if (e.key === 'ArrowDown' && firstDownPress === true){
        e.preventDefault();
        terminalInput[nTerminal].value = "";
        if (!lastDown){
            nCurrentHistory++;
            lastDown = true;
        }
    }

}

/*
 * Textarea auto-resizing at terminal
 */
const autoResize = (element, index) => {
    const scrollY = element[index].scrollHeight;
    element[index].style.height = `${scrollY + 2}px`;
}

/*
 * Terminal output display
 */
const terminalDisplay = (msg, err) => {
    if (msg) {
        terminalError[nTerminal].style.display = "none"
        terminalOutput[nTerminal].style.display = "flex";
        terminalOutput[nTerminal].value = msg;
        autoResize(terminalOutput, nTerminal);
    }
    if (err) {
        terminalOutput[nTerminal].style.display = "none";
        terminalError[nTerminal].style.display = "flex"
        terminalError[nTerminal].value = "Error: " + err;
        autoResize(terminalError, nTerminal);
    }
    if (!msg && !err) {
        terminalError[nTerminal].style.display = "none"
        terminalOutput[nTerminal].style.display = "none";
    }
}

/*
 * Focus terminal
 */
terminal.addEventListener('click', e =>{
    terminalInput[nTerminal].focus();
});

/*
 * Submit terminal command
 */
terminalForm[nTerminal].addEventListener('submit', e => { terminalCommand(e) });

/*
 * View past commands
 */
terminalInput[nTerminal].addEventListener('keydown', e => { viewTerminalHistory(e) });