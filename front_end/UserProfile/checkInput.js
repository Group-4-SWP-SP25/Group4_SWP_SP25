const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
if (email != null) {
    document.getElementById('email').value = email;
    document.getElementById('email').setAttribute('readonly', true);
}


function checkName(nameTag, errorTag) {
    if (nameTag.value.trim().length === 0) {
        errorStyle(nameTag);
        contentError(errorTag, 'Name cannot be empty!');
        return false;
    } else {
        successStyle(nameTag);
        contentError(errorTag, '');
    }
    return true;
}
