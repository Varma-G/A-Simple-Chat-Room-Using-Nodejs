// Get the Nikname-Box-Modal
var modal = document.getElementById("Nickname-Box-Modal");
const nicknameInput = document.getElementById("Nickname-Input");

// Close modal when nick-name is typed
nicknameInput.onkeypress = e => {
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if(keycode == '13'){
        modal.style.display = "none";
    }

};
