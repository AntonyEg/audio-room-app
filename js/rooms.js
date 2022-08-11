window.electron.handleRoomEvent((_event, message) => {
    if (!$(`#room-${message.room_id}`).length) {
        showNewRoom(message.room_id, message.room_name);
    }
})

async function showRooms() {
    $('#audio-login').addClass('hide').hide();
    $('#rooms').removeClass('hide').show();
    
    $('#create-room').click(createNewRoom);

    const roomsRes = await window.electron.getRooms();
    const rooms = JSON.parse(roomsRes);

    rooms.forEach((item) => {
        showNewRoom(item.room_id, item.room_name);
    });
}

function showNewRoom(room_id, room_name) {
    const roomExists = checkJanusRoomExists(room_id);

    if (!roomExists) {
        mixertest.send({ message: { request: 'create', room: room_id, permanent: true, description: room_name } });
    }

    const newRoom = $(`<div li class="list-group-item" id="room-${room_id}">${room_name}</div>`);
    newRoom.click({ room: room_id }, chooseRoom);
    $('#room-list').append(newRoom);
}

function chooseRoom(event) {
    const username = myusername;
    let register = null;

    if (myroom) {
        register = { request: 'changeroom', room: event.data.room, display: username };
    } else {
        register = { request: 'join', room: event.data.room, display: username };
        // Check if we need to join using G.711 instead of (default) Opus
        if (acodec === 'opus' || acodec === 'pcmu' || acodec === 'pcma') {
            register.codec = acodec;
        }
    }

    myusername = escapeXmlTags(username);
    mixertest.send({ message: register });
}

async function createNewRoom() {
    const roomName = getName($('#room-name'), $('#create-room'), $('#create-room-message'));
    if (!roomName) {
        return;
    }

    const roomId = await window.electron.createRoom(roomName);

    if (!roomId) {
        $('#create-room-message')
            .removeClass().addClass('label label-warning')
            .html("This room already exists!");
        $('#room-name').removeAttr('disabled');
        $('#create-room').removeAttr('disabled').click(registerUsername);

        return;
    }

    mixertest.send({ message: { request: 'create', room: roomId, permanent: true, description: roomName } });

    $('#room-name').removeAttr('disabled');
    $('#create-room').removeAttr('disabled').click(registerUsername);

    showNewRoom(roomId, roomName);
}

async function checkRoomExists(room_id) {
    if (!room_id) {
        return;
    }

    const foundRoomId = await window.electron.checkRoomExists(room_id);

    return foundRoomId ? true : false;
}

function checkJanusRoomExists(room_id) {
    if (!room_id) {
        return;
    }

    let exists = false;
    mixertest.send({
        message: { request: 'exists', room: room_id },
        success: (result) => {
            exists = result.exists;
        },
    });

    return exists;
}
