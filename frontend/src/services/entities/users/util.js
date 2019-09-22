

import { isAdmin } from '../../shared/auth';


function updatePasswordValidation(data) {
    if (data["oldPassword"].trim() === "" && !isAdmin()) {
        alert("Must enter old password!");
        return false;
    }

    if(data["newPassword"].trim() === "" || data["newPasswordConfirm"].trim() === "") {
        alert("Must enter password");
        return false;
    }

    if (data["newPassword"].trim() !== data["newPasswordConfirm"].trim()) {
        alert("Passwords don't match");
        return false;
    }

    return true;
}


export {
    updatePasswordValidation
}