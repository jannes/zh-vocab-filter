import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { BookData } from '../data/bookData';

const electron = (window as any).require('electron');

@Injectable({
  providedIn: 'root'
})

export class FileService {

  content = new BehaviorSubject<BookData>(null);
  currentFilepath: string;

  constructor() {
    this.currentFilepath = '';
    electron.ipcRenderer.on('getFile', (event: any, filepath: string, content: BookData) => {
      this.content.next(content);
      this.currentFilepath = filepath;
    });
  }

  saveForCurrentFile(wordsToStudy: string[], wordsToIgnore: string[]): void {
    const currentDir = this.currentFilepath
      .split('/')
      .slice(0, -1)
      .join('/');
    const filepathToStudy = this.currentFilepath
      .split('.')
      .slice(0, -1)
      .join('.') + '-filtered.txt';
    const filepathToIgnore = currentDir + '/ignored_words.txt';
    // console.log(`path for words to study: ${filepathToStudy}`);
    // console.log(`path for words to ignore: ${filepathToIgnore}`);
    electron.ipcRenderer.send('save-append', filepathToStudy, wordsToStudy);
    electron.ipcRenderer.send('save-append', filepathToIgnore, wordsToIgnore);
  }
}
