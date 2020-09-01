import {app, BrowserWindow, Menu, MenuItem, screen, dialog, ipcMain} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from "fs";

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

// open file, read as string and send to file service
function getFileFromUser(): void {
  const filesPromise = dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      {name: 'Text Files', extensions: ['txt']}
    ]
  });
  filesPromise.then((dialogReturn) => {
    if (dialogReturn.canceled) {
      return;
    }
    const filepath = dialogReturn.filePaths[0];
    console.log(filepath);
    const content = fs.readFileSync(filepath).toString();
    win.webContents.send('getFile', filepath, content);
  });
}

function appendSaveToFile(filepath: string, lines: string[]) {
  fs.appendFile(filepath, lines.join('\n') + '\n', (err) => {
    if (err) {
      console.log('something went wrong saving the file');
    }
  });
}

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      enableRemoteModule: false // true if you want to use remote module in renderer context (ie. Angular)
    },
  });

  const isMac = process.platform === 'darwin'

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services'},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click() {
            getFileFromUser();
          }
        }
      ]
    },
  ]

  // @ts-ignore
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu)

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(
        `${__dirname}/node_modules/electron`
      )
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('save-append', (event, filepath, lines) => {
    appendSaveToFile(filepath, lines);
  });

} catch (e) {
  // Catch Error
  // throw e;
}
