import {BrowserWindow, IpcMain} from 'electron';
import {saveOverwrite, userSaveExport, userSaveIgnored} from './utils';


export function registerMessageHandlers(ipcMain: IpcMain): void {
  ipcMain.on('save', (event, filepath, bookDataFiltered) => {
    saveOverwrite(filepath, bookDataFiltered);
  });
  ipcMain.on('export', (event, words) => {
    console.log('electron: receive export answer');
    userSaveExport(words);
  });
  ipcMain.on('export-ignored', (event, words) => {
    console.log('electron: receive export-ignored answer');
    userSaveIgnored(words);
  });
}

export function ngCmdExport(win: BrowserWindow): void {
  console.log('electron: send export cmd');
  win.webContents.send('export');
}

export function ngCmdExportIgnored(win: BrowserWindow): void {
  console.log('electron: send export ignore cmd');
  win.webContents.send('export-ignored');
}

