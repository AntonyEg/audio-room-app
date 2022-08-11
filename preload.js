const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  createUser: async (username) => {
    return await ipcRenderer.invoke('createUser', username); 
  },
  doLogin: async (username) => {
    return await ipcRenderer.invoke('doLogin', username); 
  },
  doLogout: async (username) => {
    return await ipcRenderer.invoke('doLogout', username); 
  },
  createRoom: async (roomName) => {
    return await ipcRenderer.invoke('createRoom', roomName);
  },
  getRooms: async () => {
    return await ipcRenderer.invoke('getRooms');
  },
  checkRoomExists: async () => {
    return await ipcRenderer.invoke('checkRoomExists');
  },
  handleRoomEvent: (callback) => ipcRenderer.on('room', callback),
});
