const editorMaxNo = document.getElementById("editor-max-line-no");
const editorTxt = document.getElementById("editor-txt");
const editorTitle = document.getElementById("editor-title");

let nLinesMax = 1;
const lineNoArr = ["1\n"];
editorMaxNo.textContent = lineNoArr.toString();

/*
 * Controls line indexing at editor
 */
editorTxt.addEventListener('input', e =>{
    const nLines = editorTxt.value.split("\n").length;
    
    if(nLinesMax < nLines) {
        lineNoArr.push(++nLinesMax + "\n");
        editorMaxNo.textContent = lineNoArr.join("");
    }
    else if(nLinesMax > nLines) {
        const nl = nLinesMax - nLines;
        for (let i = 0; i < nl; i++){
            nLinesMax--;
            lineNoArr.pop();
        }
        editorMaxNo.textContent = lineNoArr.join("");
    }
});

/*
 * Synchronizes scrollbars
 */
editorTxt.addEventListener('scroll', e =>{
    editorMaxNo.scrollTop = e.target.scrollTop;
    editorMaxNo.scrollBottom = e.target.scrollBottom;
});

/*
 * Editor special functionality
 */
editorTxt.addEventListener('keydown', e =>{
    // console.log(e.key)
    switch (e.key) {
        case '{':
            editorTxt.setRangeText("}");
            break;
        case '(':
            editorTxt.setRangeText(")");
            break;
        case '[':
            editorTxt.setRangeText("]");
            break;
        case '\"':
            editorTxt.setRangeText("\"");
            break;
        case '\'':
            editorTxt.setRangeText("\'");
            break;
        case 'Tab':
            e.preventDefault();
            const tabCursorPos = editorTxt.selectionStart;
            editorTxt.setSelectionRange(tabCursorPos, tabCursorPos);
            var start = editorTxt.selectionStart;
            editorTxt.value = editorTxt.value.substring(0, start) + '    ' + 
                editorTxt.value.substring(start, editorTxt.value.length);
            editorTxt.selectionEnd = editorTxt.value.substring(0, start).length + 4;
            break;
        case 'Backspace':
            var start = editorTxt.selectionStart;
            var end = editorTxt.selectionEnd;
            
            if (start === end) {
                const backcursorPos = editorTxt.selectionStart;
                editorTxt.setSelectionRange(backcursorPos - 4, backcursorPos);
                var start = editorTxt.selectionStart;
                var end = editorTxt.selectionEnd;
                const backSelect = editorTxt.value.substring(start, end);
                window.getSelection().collapseToEnd();
                if (backSelect === '    ') {
                    e.preventDefault();
                    editorTxt.value = editorTxt.value.substring(0, start) + 
                        editorTxt.value.substring(end, editorTxt.value.length);
                    editorTxt.selectionEnd = start;
                }
            }
            break;
        case 'Enter':
            const cursorPos = editorTxt.selectionStart;
            editorTxt.setSelectionRange(cursorPos - 1, cursorPos);
            var start = editorTxt.selectionStart;
            var end = editorTxt.selectionEnd;
            const a = editorTxt.value.substring(start, end);
            window.getSelection().collapseToStart();

            editorTxt.setSelectionRange(cursorPos, cursorPos + 1);
            start = editorTxt.selectionStart;
            end = editorTxt.selectionEnd;
            const b = editorTxt.value.substring(start, end);
            window.getSelection().collapseToStart();

            let nTabs = 0;
            let sTabs = '';
            const txtArr = editorTxt.value.split("");
            for (let i = cursorPos - 1; i >= 0; i--) {
                if (txtArr[i] === '\n' || i === 0) {
                    for (let j = i === 0 ? 0 : i + 1; j < txtArr.length; j++) {
                        if (txtArr[j] !== ' ') {
                            break;
                        }
                        if (txtArr[j] === ' ') {
                            nTabs++;
                        }
                    }
                    break;
                }

            }

            for (let i = 0; i < nTabs; i++) {
                sTabs += ' ';
            }

            if ((a === '{' && b === '}') || (a === '(' && b === ')') || (a === '[' && b === ']') || a === ':') {
                e.preventDefault();
                if (a !== ':') {
                    editorTxt.value = editorTxt.value.substring(0, start) + '\n' + sTabs + '    \n' + sTabs + 
                        editorTxt.value.substring(end - 1, editorTxt.value.length);
                    for (let i = 0; i < 2; i++) {
                        lineNoArr.push(++nLinesMax + "\n");
                        editorMaxNo.textContent = lineNoArr.join("");
                    }
                } else {
                    if (editorTxt.value.length - cursorPos !== 0) {
                        editorTxt.value = editorTxt.value.substring(0, start) + '\n    ' + sTabs + 
                            editorTxt.value.substring(end - 1, editorTxt.value.length);
                        lineNoArr.push(++nLinesMax + "\n");
                        editorMaxNo.textContent = lineNoArr.join("");
                    } else {
                        editorTxt.value = editorTxt.value.substring(0, start) + '\n    ' + sTabs +
                            editorTxt.value.substring(end, editorTxt.value.length);
                        lineNoArr.push(++nLinesMax + "\n");
                        editorMaxNo.textContent = lineNoArr.join("");
                    }
                }
                editorTxt.selectionEnd = nTabs + start + 5;
            }
            else {
                e.preventDefault();
                if (start !== end) {
                    editorTxt.value = editorTxt.value.substring(0, start) + "\n" + sTabs + editorTxt.value.substring(end - 1, editorTxt.value.length);
                    lineNoArr.push(++nLinesMax + "\n");
                    editorMaxNo.textContent = lineNoArr.join("");
                    editorTxt.selectionEnd = nTabs + end;
                }
                else {
                    editorTxt.value = editorTxt.value.substring(0, start) + "\n" + sTabs;
                    lineNoArr.push(++nLinesMax + "\n");
                    editorMaxNo.textContent = lineNoArr.join("");
                    editorTxt.selectionEnd = nTabs + end + 1;
                    editorTxt.scrollTop = editorTxt.scrollHeight;
                }

            }
            break;
    
        default:
            break;
    }
});