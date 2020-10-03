import { BrowserWindow, dialog } from 'electron';
import * as fs from 'fs';

// open file, read as string and send to file service
function getFileFromUser(win: BrowserWindow): void {
    const filesPromise = dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [
        {name: 'JSON Files', extensions: ['json']}
      ]
    });
    filesPromise.then((dialogReturn) => {
      if (dialogReturn.canceled) {
        return;
      }
      const filepath = dialogReturn.filePaths[0];
      console.log(filepath);
      const content = fs.readFileSync(filepath);
      try {
        const parsed = JSON.parse(content.toString());
        // TODO: better validation
        if (('title' in parsed) && ('vocabulary' in parsed)) {
          console.log(parsed.vocabulary.length());
          win.webContents.send('getFile', filepath, parsed);
        }
        else {
          throw SyntaxError;
        }
      }
      catch (e) {
        alert('invalid json');
      }
    });
  }
  