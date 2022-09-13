const explorerMenu = document.getElementsByClassName("explorer-menu")[0];
const explorerShowBtn = document.getElementById("explorer-show-btn");
const explorerHideBtn = document.getElementById("explorer-hide-btn");
const addFileBtn = document.getElementById("add-file-btn");
const fileListElm = document.getElementsByClassName("file-list")[0];
const fileBtn = document.getElementsByClassName("file");
const fileSelected = document.getElementsByClassName("file-selected");
const explorerFileName = document.getElementsByClassName("file-name-txt");
const explorerFileExt = document.getElementsByClassName("file-ext-txt");

// COLORS
const edit_icon_hover_color_3 = "#1b1b1b";
const views_bg = "#721d1d";
const icon_color = "#333333";

const fileList = [];
let newFileBool = false;
let nExplorer = 0;
let fileContent = [];
let nfileSelected = 0;

const fileStructure = {
    filename: '',
    fileext: '',
    filecontent: ''
};

fileStructure.filename = `${explorerFileName[0].textContent.trim()}`;
fileStructure.fileext = `${explorerFileExt[0].textContent.trim().substring(1, explorerFileExt[0].textContent.trim().length)}`;
fileContent.push(fileStructure);
fileSelected[0].style.backgroundColor = "green";

/*
 * To create new files
 */
let previousFile;
addFileBtn.addEventListener('click', e => {
    previousFile = editorTitle.value;
    editorTitle.value = '';
    editorTitle.disabled = false;
    editorTitle.focus();
    newFileBool = true; // tells the application that you're trying to create a new file
});

/*
 * Creating new files and editing the title of existing files
 */
titleEditBtn.addEventListener('click', e => {
    if (editorTitle.disabled) {
        editorTitle.disabled = false;
        editorTitle.focus();
        editorTitle.selectionStart = 0;
        editorTitle.selectionEnd = editorTitle.value.length;
    } else {
        const fileObj = runInstruction(editorTitle.value.trim());
        if (newFileBool) {
            if (fileObj.err === 0) {
                addFileFtn(fileObj);
                editorMaxNo.textContent = '1\n';
            }
            else {
                editorTitle.value = `${explorerFileName[nExplorer].textContent.trim()}${explorerFileExt[nExplorer].textContent.trim()}`;
            }
        } else {
            if (fileObj.err !== 0) {
                editorTitle.value = `${explorerFileName[nExplorer].textContent.trim()}${explorerFileExt[nExplorer].textContent.trim()}`;
            }
            else {
                explorerFileName[nExplorer].textContent = fileObj.fn;
                explorerFileExt[nExplorer].textContent = `.${fileObj.ext}`;
            }
        }
        newFileBool = false;
        window.getSelection().collapseToStart();
        editorTitle.disabled = true;
        editorTxt.focus();
    } 
});
titleForm.addEventListener('submit', e => {
    e.preventDefault();
    const fileObj = runInstruction(editorTitle.value.trim());
    if (newFileBool) {
        if (fileObj.err === 0) {
            addFileFtn(fileObj);
            editorMaxNo.textContent = '1\n';
        } 
    } else {
        if (fileObj.err !== 0) {
            editorTitle.value = `${explorerFileName[nExplorer].textContent.trim()}${explorerFileExt[nExplorer].textContent.trim()}`;
        }
        else {
            explorerFileName[nfileSelected].textContent = fileObj.fn;
            explorerFileExt[nfileSelected].textContent = `.${fileObj.ext}`;
            fileContent[nfileSelected].filename = fileObj.fn;
            fileContent[nfileSelected].fileext = fileObj.ext;
        }
    }
    newFileBool = false;
    window.getSelection().collapseToStart();
    editorTitle.disabled = true;
    editorTxt.focus();
});

const addFileFtn = fileObj => {
    fileListElm.insertAdjacentHTML('beforeend', `
    <li class="file">
        <div class="file-selected"></div>
        <h2 class="file-name">
            <span class="file-name-txt">
                ${fileObj.fn}
            </span>
            <span class="file-dots-txt">
                ...
            </span>
            <span class="file-ext-txt">
                .${fileObj.ext}
            </span>
        </h2>
    </li>`);
    fileContent.push({  // Stores the file title
        filename: `${fileObj.fn}`,
        fileext: `${fileObj.ext}`
    });
    editorTxt.value = '';
    nLinesMax = 1;
    lineNoArr = ["1\n"];
    editorMaxNo.textContent = '1\n';
    nExplorer++;
    fileSelected[nExplorer].style.backgroundColor = "green";
    nfileSelected = nExplorer;
    for (let j = 0; j < Array.from(fileBtn).length; j++) {
        if (j !== nExplorer) {
            fileSelected[j].style.backgroundColor = "rgb(163, 163, 163)";
        }
    }
    listClickFtn();
}

/*
 * Controls file click  functionality
 */
const listClickFtn = () => {
    Array.from(fileBtn).forEach((e, i) => {
        e.addEventListener('click', () => {
            fileContent[nfileSelected]["filecontent"] = editorTxt.value;
            fileSelected[i].style.backgroundColor = "green";
            for (let j = 0; j < Array.from(fileBtn).length; j++) {
                if (j !== i) {
                    fileSelected[j].style.backgroundColor = "rgb(163, 163, 163)";
                }
            }
            nfileSelected = i;
            editorTitle.value = `${fileContent[i]["filename"]}.${fileContent[i]["fileext"]}`;
            editorTxt.value = fileContent[i]["filecontent"] ? fileContent[i]["filecontent"] : '';

            const nLines = editorTxt.value.split("\n").length;
            nLinesMax = 0;
            lineNoArr = [];
            for (let j = 0; j < nLines; j++) {
                lineNoArr.push(++nLinesMax + "\n");
            }
            editorMaxNo.textContent = lineNoArr.join("");
            editorTxt.focus();
        });
    });
}
listClickFtn();

/*
 * Show and hide file explorer
 */
explorerHideBtn.addEventListener('click', () =>{
    explorer.style.display = "none";
    // explorerShowBtn.style.setProperty('display', 'flex', 'important');
    explorerMenu.style.display = "flex";
});
explorerShowBtn.addEventListener('click', () =>{
    explorer.style.display = "inline";
    // explorerShowBtn.style.setProperty('display', 'none', 'important');
    explorerMenu.style.display = "none";
});

/*
 * View button mouse event handlers
 */
viewsBtn.addEventListener('click', () =>{
    if (viewsBtnClicked === 0) {
        viewsDiv.style.display = "flex";
        const viewBtnDivs = document.querySelectorAll("#views-btn > div");
        Array.from(viewBtnDivs).forEach(element => {
            element.style.backgroundColor = views_bg;
        });
        viewsBtnClicked = 1;
    } else {
        viewsDiv.style.display = "none";
        const viewBtnDivs = document.querySelectorAll("#views-btn > div");
        Array.from(viewBtnDivs).forEach(element => {
            element.style.backgroundColor = edit_icon_hover_color_3;
        });
        viewsBtnClicked = 0;
    }
});
viewsBtn.addEventListener('mouseover', () =>{
    const viewBtnDivs = document.querySelectorAll("#views-btn > div");
    if (viewsBtnClicked === 1) {
        // red
        Array.from(viewBtnDivs).forEach(element => {
            element.style.backgroundColor = views_bg;
        });
    } else {
        // black
        Array.from(viewBtnDivs).forEach(element => {
            element.style.backgroundColor = edit_icon_hover_color_3;
        });
    }
});
viewsBtn.addEventListener('mouseleave', () =>{
    const viewBtnDivs = document.querySelectorAll("#views-btn > div");
    Array.from(viewBtnDivs).forEach(element => {
        element.style.backgroundColor = icon_color;
    });
});

/*
 * Manage explorer expansion
 */
if (parseFloat(getComputedStyle(explorer).width) > 250) {
    explorer.style.width = 250 + "px";
}
window.addEventListener('resize', e => {
    if (parseFloat(getComputedStyle(explorer).width) > 250) {
        explorer.style.width = 250 + "px";
    }
});