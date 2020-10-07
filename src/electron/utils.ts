import { app, BrowserWindow, dialog } from 'electron';
import { BookData, BookDataFiltered } from '../shared/bookData';
import * as fs from 'fs';


export function saveOverwrite(filepath: string, bookData: BookDataFiltered): void {
  const content = JSON.stringify(bookData, null, 2);
  const tmpFilepath = 'filepath' + '.tmp';
  fs.promises.writeFile(tmpFilepath, content)
    .then(() => {
      return fs.promises.rename(tmpFilepath, filepath);
    })
    .catch(e => dialog.showErrorBox('file error', 'could not save file'));
}

export function saveExport(filepath: string, words: string[]): Promise<void> {
  const content = words.join('\n');
  return fs.promises.writeFile(filepath, content);
}

// open file, read as string and send to file service
export function getFileFromUser(win: BrowserWindow): void {
  const filesPromise = dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
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

export function userSaveExport(words: string[]): void {
  if (words.length === 0) {
    dialog.showErrorBox('Save error', 'no chapter selected or selected chapters have no words to study');
  }
  else {
    const options = {
      title: 'Save words to study from selected chapters',
      button: 'Save',
      defaultPath: '/Users/jannes/Nextcloud/中文/untitled',
      properties: ['createDirectory' as const]
    };
    dialog.showSaveDialog(options)
      .then((result) => {
        if (!result.canceled) {
          return saveExport(result.filePath, words);
        }
      }).catch((error) => {
        dialog.showErrorBox('Save error', `could not save file, error: ${error}`);
      });
  }
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
