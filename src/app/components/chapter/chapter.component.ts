import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterData } from '../../../shared/bookData';
import { FileService } from 'src/app/services';
import { WordDisplayComponent } from './word-display.component';

const SAVE_MESSAGE = 'ENTER to save';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styles: []
})
export class ChapterComponent implements OnInit, AfterViewInit {

  chapterTitle = '';
  i = 0;
  words = [];
  wordsToStudy: string[];
  wordsToNotStudy: string[];
  wordsToIgnore: string[];

  @ViewChild(WordDisplayComponent)
  private wordDisplayComponent: WordDisplayComponent;

  constructor(private router: Router, private fileService: FileService, private cdr: ChangeDetectorRef) {
    const chapterData = this.router.getCurrentNavigation().extras.state.data as ChapterData;
    this.words = chapterData.words;
    this.wordsToStudy = [];
    this.wordsToNotStudy = [];
    this.wordsToIgnore = [];
    this.i = 0;
    this.chapterTitle = chapterData.title;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.words.length > 0) {
      this.wordDisplayComponent.currentWord = this.words[0];
      this.cdr.detectChanges();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // console.log(`pressed key ${event.key}`);
    if (this.i >= this.words.length) {
      if (event.key === 'Enter' && this.wordDisplayComponent.currentWord === SAVE_MESSAGE) {
        this.wordDisplayComponent.currentWord = '';
        this.fileService.saveChapter(this.chapterTitle, this.wordsToStudy, this.wordsToIgnore);
        this.router.navigate(['/overview']);
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
      case 'u': {
        this.performUndo();
        break;
      }
    }
  }

  updateCurrentWord(): void {
    this.i += 1;
    if (this.i >= this.words.length) {
      this.wordDisplayComponent.currentWord = SAVE_MESSAGE;
    } else {
      this.wordDisplayComponent.currentWord = this.words[this.i];
    }
    this.cdr.detectChanges();
  }

  performUndo(): void {
    if (this.i > 0) {
      this.i -= 1;
      const wordToUndo = this.words[this.i];
      this.wordDisplayComponent.currentWord = wordToUndo;
      if (this.wordsToStudy[this.wordsToStudy.length - 1] === wordToUndo) {
        this.wordsToStudy.pop();
      } else if (this.wordsToNotStudy[this.wordsToNotStudy.length - 1] === wordToUndo) {
        this.wordsToNotStudy.pop();
      } else if (this.wordsToIgnore[this.wordsToIgnore.length - 1] === wordToUndo) {
        this.wordsToIgnore.pop();
      }
    }
    this.cdr.detectChanges();
  }

}
