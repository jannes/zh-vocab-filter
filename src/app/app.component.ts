import {HostListener, Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'zv-vocab-filter';
  words = ['王耐衡', '王诗文'];
  i = 0;
  currentWord: string;
  wordsToStudy: string[];
  wordsToNotStudy: string[];
  wordsToIgnore: string[];

  constructor() {
    this.currentWord = this.words[this.i];
    this.wordsToStudy = [];
    this.wordsToNotStudy = [];
    this.wordsToIgnore = [];
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
