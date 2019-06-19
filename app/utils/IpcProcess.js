import FileProcess from './FileProcess';

const { ipcMain } = require('electron');

function IPC() {
  ipcMain.on('readFile', (event, arg) => {
    const fileData = FileProcess.readFile(arg);

    return fileData.then(data => {
      event.sender.send('fileData', data);
      return data;
    });
    // console.log(fileData)
    // console.log(arg); // prints "ping"
    // event.reply('asynchronous-reply', 'pong');
  });

  // ipcMain.on('synchronous-message', (event, arg) => {
  //   // console.log(arg); // prints "ping"
  //   // event.returnValue = 'pong';
  // });
}

module.exports = {
  IPC
};
