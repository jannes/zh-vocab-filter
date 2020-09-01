import {HostListener, Component, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ElectronService} from "./core/services"
import {AppConfig} from '../environments/environment';
import {FileService} from "./file.service"
import {WordDisplayComponent} from "./word-display/word-display.component"

const SAVE_MESSAGE = 'ENTER to save';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'zv-vocab-filter';
  i = 0;
  words = [];
  wordsToStudy: string[];
  wordsToNotStudy: string[];
  wordsToIgnore: string[];

  @ViewChild(WordDisplayComponent)
  private wordDisplayComponent;

  constructor(private electronService: ElectronService,
              private fileService: FileService,
              private cdr: ChangeDetectorRef) {
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

  ngOnInit() {
    this.fileService.content.subscribe((contents) => {
      console.log('getting file event');
      if (contents != null) {
        console.log(`getting file contents: ${contents}`);
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
    console.log(`pressed key ${event.key}`);
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
