import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BookDataFiltered, ChapterFiltered } from '../../shared/bookData';
import { ElectronService } from './electron.service';

// const electron = (window as any).require('electron');

@Injectable({
  providedIn: 'root'
})

export class FileService {

  // all state in this object
  bookData = new BehaviorSubject<BookDataFiltered>(null);
  exportCommand = new Subject<void>();
  currentFilepath: string;

  constructor(private electronService: ElectronService) {
    this.currentFilepath = '';
    electronService.ipcRenderer.on('getFile', (event: any, filepath: string, content: BookDataFiltered) => {
      this.bookData.next(content);
      this.currentFilepath = filepath;
    });
    electronService.ipcRenderer.on('export', (event: any) => {
      // notify book component to call back with the selected words
      this.exportCommand.next();
    });
  }

  saveChapter(title: string, wordsToStudy: string[], wordsToIgnore: string[]): void {
    const bookData = this.bookData.value;
    const chapter = bookData.vocabulary.find(c => c.title === title) as ChapterFiltered;
    chapter.words_study = wordsToStudy;
    chapter.words_ignore = wordsToIgnore;
    const wordsNotStudy = new Set(chapter.words);
    wordsToStudy.forEach(w => wordsNotStudy.delete(w));
    wordsToIgnore.forEach(w => wordsNotStudy.delete(w));
    chapter.words_not_study = Array.from(wordsNotStudy.values());

    this.electronService.ipcRenderer.send('save', this.currentFilepath, bookData);
    this.bookData.next(bookData);
  }

  exportSelection(wordsToStudy: string[]): void {
    this.electronService.ipcRenderer.send('export', wordsToStudy);
  }
}
