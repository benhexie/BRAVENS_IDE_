const explorerMenu = document.getElementsByClassName("explorer-menu")[0];
const explorerShowBtn = document.getElementById("explorer-show-btn");
const explorerHideBtn = document.getElementById("explorer-hide-btn");
const addFileBtn = document.getElementById("add-file-btn");
const fileListElm = document.getElementsByClassName("file-list")[0];
const fileBtn = document.getElementsByClassName("file");
const fileSelected = document.getElementsByClassName("file-selected");
const explorerFileName = document.getElementsByClassName("file-name-txt");
const explorerFileExt = document.getElementsByClassName("file-ext-txt");
const fileList = [];
let newFileBool = false;
let nExplorer = 0;

/*
 * Creates list of files and controls functionality
 */
let previousFile;
addFileBtn.addEventListener('click', e => {
    previousFile = editorTitle.value;
    editorTitle.value = '';
    editorTitle.disabled = false;
    editorTitle.focus();
    newFileBool = true;
});

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
            }
            else {
                editorTitle.value = `${explorerFileName[nExplorer].textContent.trim()}${explorerFileExt[nExplorer].textContent.trim()}`;
            }
        } else {
            if (fileObj.err !== 0) {
                editorTitle.value = `${explorerFileName[nExplorer].textContent.trim()}${explorerFileExt[nExplorer].textContent.trim()}`;
            }
            else {
                console.log(nExplorer);
                explorerFileName[nExplorer].textContent = fileObj.fn;
                explorerFileExt[nExplorer].textContent = `.${fileObj.ext}`;
            }
        }
        newFileBool = false;
        window.getSelection().collapseToStart();
        editorTitle.disabled = true;
    } 
});
titleForm.addEventListener('submit', e => {
    e.preventDefault();
    const fileObj = runInstruction(editorTitle.value.trim());
    if (newFileBool) {
        if (fileObj.err === 0) {
            addFileFtn(fileObj);
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
    nExplorer++;
}
fileListElm.addEventListener('click', elm => {
    
});

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
            element.style.backgroundColor = "#721d1d";
        });
        viewsBtnClicked = 1;
    } else {
        viewsDiv.style.display = "none";
        const viewBtnDivs = document.querySelectorAll("#views-btn > div");
        Array.from(viewBtnDivs).forEach(element => {
            element.style.backgroundColor = "#1b1b1b";
        });
        viewsBtnClicked = 0;
    }
});
viewsBtn.addEventListener('mouseover', () =>{
    const viewBtnDivs = document.querySelectorAll("#views-btn > div");
    if (viewsBtnClicked === 1) {
        // red
        Array.from(viewBtnDivs).forEach(element => {
            element.style.backgroundColor = "#721d1d";
        });
    } else {
        // black
        Array.from(viewBtnDivs).forEach(element => {
            element.style.backgroundColor = "#1b1b1b";
        });
    }
});
viewsBtn.addEventListener('mouseleave', () =>{
    const viewBtnDivs = document.querySelectorAll("#views-btn > div");
    Array.from(viewBtnDivs).forEach(element => {
        element.style.backgroundColor = "#333333";
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