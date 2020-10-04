import { App, BrowserWindow, dialog, MenuItem, MenuItemConstructorOptions } from 'electron';
import { BookData, BookDataFiltered } from '../shared/bookData';
import { saveOverwrite } from './main';
import * as fs from 'fs';


export function getMenuTemplate(isMac: boolean, app: App, win: BrowserWindow): Array<(MenuItemConstructorOptions) | (MenuItem)> {
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
          click(): void {
            getFileFromUser(win);
          }
        }
      ]
    },
  ];
  // TODO: check what is wrong here with the template type
  // @ts-ignore
  return template;
}

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
      const parsed = JSON.parse(content.toString());
      // TODO: better validation
      if (('title' in parsed) && ('vocabulary' in parsed) && (parsed.vocabulary as any[]).length > 0) {
        let bookData = null;
        if ('words_study' in parsed.vocabulary[0]) {
          bookData = parsed as BookDataFiltered;
        }
        else {
          bookData = firstOpenSetup(filepath, parsed as BookData);
          saveOverwrite(filepath, bookData);
        }
        win.webContents.send('getFile', filepath, bookData);
      }
    })
    .catch((error) => {
      dialog.showErrorBox('File error', `could not parse json, malformatted or schema invalid, error: ${error}`);
    });
  }

function firstOpenSetup(filepath: string, parsed: BookData): BookDataFiltered {
  console.log('first time opening json file, setup keys for filtered vocabulary');
  const bookData = parsed as BookData;
  const bookDataFiltered = {
    title: bookData.title,
    vocabulary: []
  };
  for (const chapter of bookData.vocabulary) {
    const chapterFiltered = {
      title: chapter.title,
      words: chapter.words,
      words_study: [],
      words_not_study: [],
      words_ignore: []
    };
    bookDataFiltered.vocabulary.push(chapterFiltered);
  }
  return bookDataFiltered;
}
