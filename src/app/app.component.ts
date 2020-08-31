import {HostListener, Component} from '@angular/core';
import {ElectronService} from "./core/services"
import {AppConfig} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'zv-vocab-filter';
  words = ['王耐衡', '王诗文'];
  i = 0;
  currentWord: string;
  wordsToStudy: string[];
  wordsToNotStudy: string[];
  wordsToIgnore: string[];

  constructor(private electronService: ElectronService) {
    this.currentWord = this.words[this.i];
    this.wordsToStudy = [];
    this.wordsToNotStudy = [];
    this.wordsToIgnore = [];

    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    console.log(`pressed key ${event.key}`);
    if (this.i >= this.words.length) {
      this.currentWord = 'DONE';
      return;
    }
    switch (event.key) {
      case 'j': {
        this.wordsToStudy.push(this.currentWord);
        this.updateCurrentWord();
        break;
      }
      case 'k': {
        this.wordsToNotStudy.push(this.currentWord);
        this.updateCurrentWord();
        break;
      }
      case 'l': {
        this.wordsToIgnore.push(this.currentWord);
        this.updateCurrentWord();
        break;
      }
    }
  }

  updateCurrentWord() {
    this.i += 1;
    if (this.i >= this.words.length) {
      this.currentWord = 'DONE';
    } else {
      this.currentWord = this.words[this.i];
    }
  }

}
