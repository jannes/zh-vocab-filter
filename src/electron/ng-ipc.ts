import { BrowserWindow, IpcMain } from 'electron';
import { saveOverwrite, userSaveExport } from './utils';


export function registerMessageHandlers(ipcMain: IpcMain): void {
  ipcMain.on('save', (event, filepath, bookDataFiltered) => {
    saveOverwrite(filepath, bookDataFiltered);
  });
  ipcMain.on('export', (event, words) => {
    userSaveExport(words);
  });
}

export function ngCmdExport(win: BrowserWindow): void {
  win.webContents.send('export');
}

