// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { ipcMain } = require('electron')

let connectDB = null;
const loggedIn = [];
let mainWindow = null;
let secondWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  const mysql = require('mysql');

  connectDB = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: 'test',
    database: 'audio-app',
  });

  connectDB.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('createUser', async (event, username) => {
  // check user exists
  const checkUser = await checkUserExists(username);
  if (checkUser) {
    return false;
  }

  const query = `
    INSERT INTO user
    (user_name)
    VALUES
    (?)
  `;
  const result = await doInsertQuery(query, username);
  if (result) {
    loggedIn.push(username);
  }

  return result;
});

ipcMain.handle('doLogin', async (event, username) => {
  // check user logged in
  if (loggedIn.includes(username)) {
    return 'User already logged in!';
  }

  // check user exists
  const checkUser = await checkUserExists(username);
  if (!checkUser) {
    return 'No such user!';
  }

  loggedIn.push(username);
  return;
});

ipcMain.handle('doLogout', async (event, username) => {
  const index = loggedIn.indexOf(username);
  // check user logged in
  if (index > -1) {
    loggedIn.splice(index, 1);
  }
});

ipcMain.handle('createRoom', async (event, roomName) => {
  // check user exists
  const checkRoom = await checkRoomExists(roomName);
  if (checkRoom) {
    return false;
  }

  const query = `
    INSERT INTO room
    (room_name)
    VALUES
    (?)
  `;
  const result = await doInsertQuery(query, roomName);

  if (result) {
    mainWindow.webContents.send('room', { room_id: result, room_name: roomName });
    secondWindow.webContents.send('room', { room_id: result, room_name: roomName });
  }

  return result;
});

ipcMain.handle('getRooms', async () => {
  return await getRooms();
});

ipcMain.handle('checkRoomExists', async () => {
  return await checkRoomExists();
});

function checkRoomExists(roomName) {
  return new Promise((resolve, reject) => {
    connectDB.query(
      `
        SELECT room_id
        FROM room
        WHERE room_name = ?
      `,
      [roomName],
      (err, result) => {
        return err ? reject(err) : resolve((result.length > 0 && result[0].room_id) ? result[0].room_id : false);
      }
    );
  });
};

function checkUserExists(username) {
  return new Promise((resolve, reject) => {
    connectDB.query(
      `
        SELECT user_id
        FROM user
        WHERE user_name = ?
      `,
      [username],
      (err, result) => {
        return err ? reject(err) : resolve((result.length > 0 && result[0].user_id) ? result[0].user_id : false);
      }
    );
  });
};

function doInsertQuery(query, params) {
  return new Promise((resolve, reject) => {
    connectDB.query(
      query,
      [params],
      (err, result) => {
        return err ? reject(err) : resolve(result.insertId);
      }
    );
  });
};

function getRooms() {
  return new Promise((resolve, reject) => {
    connectDB.query(
      `
        SELECT room_id, room_name
        FROM room
      `,
      (err, result) => {
        return err ? reject(err) : resolve(JSON.stringify(result));
      }
    );
  });
};
