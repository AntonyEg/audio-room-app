async function registerUsername() {
    const username = getName($('#signup-username'), $('#do-signup'), $('#signup-message'));
    if (!username) {
        return;
    }

    const usernameId = await window.electron.createUser(username);

    if (!usernameId) {
        $('#signup-message')
            .removeClass().addClass('label label-warning')
            .html("This username already exists!");
        $('#signup-username').removeAttr('disabled');
        $('#do-signup').removeAttr('disabled').click(registerUsername);

        return;
    }
    myusername = username;

    showRooms();
}

async function doLogin() {
    const username = getName($('#signin-username'), $('#do-signin'), $('#signin-message'));
    if (!username) {
        return;
    }

    const result = await window.electron.doLogin(username);

    if (result) {
        $('#signin-message')
            .removeClass().addClass('label label-warning')
            .html(result);
        $('#signin-username').removeAttr('disabled');
        $('#do-signin').removeAttr('disabled').click(doLogin);

        return;
    }
    myusername = username;

    showRooms();
}
