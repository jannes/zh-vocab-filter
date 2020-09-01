import {ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {WordDisplayComponent} from "../word-display/word-display.component"
import {FileService} from "../file.service"

const SAVE_MESSAGE = 'ENTER to save';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
  title = 'zv-vocab-filter';
  i = 0;
  words = [];
  wordsToStudy: string[];
  wordsToNotStudy: string[];
  wordsToIgnore: string[];

  @ViewChild(WordDisplayComponent)
  private wordDisplayComponent;

  constructor(private fileService: FileService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.fileService.content.subscribe((contents) => {
      console.log('getting file event');
      if (contents != null) {
        this.words = contents
          .split('\n')
          .map(word => word.trim())
          .filter(word => word.length > 0);
        this.wordsToStudy = [];
        this.wordsToNotStudy = [];
        this.wordsToIgnore = [];
        this.i = 0;
        if (this.words.length > 0) {
          this.wordDisplayComponent.currentWord = this.words[0];
          this.cdr.detectChanges();
        }
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // console.log(`pressed key ${event.key}`);
    if (this.i >= this.words.length) {
      if (event.key === 'Enter' && this.wordDisplayComponent.currentWord === SAVE_MESSAGE) {
        this.wordDisplayComponent.currentWord = '';
        this.fileService.saveForCurrentFile(this.wordsToStudy, this.wordsToIgnore);
      }
      return;
    }
    switch (event.key) {
      case 'j': {
        this.wordsToStudy.push(this.wordDisplayComponent.currentWord);
        this.updateCurrentWord();
        break;
      }
      case 'k': {
        this.wordsToNotStudy.push(this.wordDisplayComponent.currentWord);
        this.updateCurrentWord();
        break;
      }
      case 'l': {
        this.wordsToIgnore.push(this.wordDisplayComponent.currentWord);
        this.updateCurrentWord();
        break;
      }
    }
  }

  updateCurrentWord() {
    this.i += 1;
    if (this.i >= this.words.length) {
      this.wordDisplayComponent.currentWord = SAVE_MESSAGE;
    } else {
      this.wordDisplayComponent.currentWord = this.words[this.i];
    }
  }
}
