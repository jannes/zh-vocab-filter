import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { BookData } from '../../shared/bookData';
import { ElectronService } from './electron.service';

// const electron = (window as any).require('electron');

@Injectable({
  providedIn: 'root'
})

export class FileService {

  // this includes the already filtered words, use to save file
  content = new BehaviorSubject<any>(null);
  // this is only the actual chapter vocabulary, use to filter in book component
  book = new BehaviorSubject<BookData>(null);
  currentFilepath: string;

  constructor(private electronService: ElectronService) {
    this.currentFilepath = '';
    electronService.ipcRenderer.on('getFile', (event: any, filepath: string, content: any) => {
      this.content.next(content);
      // TODO: error handling
      this.book.next(content as BookData);
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
    this.electronService.ipcRenderer.send('save-append', filepathToStudy, wordsToStudy);
    this.electronService.ipcRenderer.send('save-append', filepathToIgnore, wordsToIgnore);
  }
}
