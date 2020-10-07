import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services';
import { BookDataFiltered, ChapterFiltered } from '../../../shared/bookData';
import { StatisticsComponent } from './statistics.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styles: []
})
export class BookComponent implements OnInit, AfterViewInit{

  title: string;
  bookData: BookDataFiltered;
  chapters: ChapterFiltered[];
  // set of selected chapters (indices) used for statistics and export
  selected: Set<number>;
  chapterIsSelected: boolean[];
  chapterIsFiltered: boolean[];


  @ViewChild(StatisticsComponent)
  private statisticsComponent: StatisticsComponent;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private fileService: FileService) { }

  initFilteredChapters(): void {
    for (let i = 0; i < this.chapters.length; i++) {
      const chapter = this.chapters[i];
      const isFiltered = (chapter.words.length === 0) || (chapter.words_ignore.length > 0) ||
                         (chapter.words_not_study.length > 0) || (chapter.words_study.length > 0);
      if (isFiltered) {
        console.log(`chapter ${chapter.title} is filtered`);
      }
      this.chapterIsFiltered[i] = isFiltered;
    }
  }

  ngOnInit(): void {
    console.log('book component init');
    const bookData = this.fileService.bookData.value;
    if (bookData == null) {
      alert('book component could not retrieve book data from file service...');
    }
    else {
      this.chapters = bookData.vocabulary;
      const amountChapters = this.chapters.length;
      console.log(`amount chapters: ${amountChapters}`);
      this.chapterIsSelected = Array<boolean>(amountChapters);
      this.chapterIsFiltered = Array<boolean>(amountChapters);
      this.title = bookData.title;
      this.bookData = bookData;
      this.selected = new Set();
      this.chapterIsSelected.fill(false);
      this.initFilteredChapters();
      this.fileService.exportCommand.subscribe(() => {
        this.fileService.exportSelection(this.getSelectedChaptersStudyWords());
      });
    }
  }

  ngAfterViewInit(): void { }

  getSelectedChaptersStudyWords(): string[] {
    const words = new Array<string>();
    const sortedIndices = Array.from(this.selected).sort();
    for (const i of sortedIndices) {
      const chapter = this.chapters[i];
      words.push(...chapter.words_study);
    }
    return words;
  }

  unselectChapters(indices: Set<number>): void {
    for (const index of indices) {
      this.chapterIsSelected[index] = false;
    }
  }

  // event: [index, shiftIsDown]
  selectChapter(event: [number, boolean]): void {
    const index = event[0];
    const shiftPressed = event[1];
    const chapter = this.chapters[index];
    console.log(`clicked chapter: ${chapter.title}`);
    if (!shiftPressed) {
      this.unselectChapters(this.selected);
      this.selected = new Set();
    }
    else if (this.selected.size > 0) {
      // select all elements between including clicked one
      let j = this.selected.values().next().value;
      while (j < index) {
        j += 1;
        this.chapterIsSelected[j] = true;
        this.selected.add(j);
      }
      while (j > index) {
        j -= 1;
        this.chapterIsSelected[j] = true;
        this.selected.add(j);
      }
    }
    this.chapterIsSelected[index] = true;
    this.selected.add(index);
    let amountWords = 0;
    let amountWordsToStudy = 0;
    let amountWordsToIgnore = 0;
    for (const i of this.selected) {
      amountWords += this.chapters[i].words.length;
      amountWordsToStudy += this.chapters[i].words_study.length;
      amountWordsToIgnore += this.chapters[i].words_ignore.length;
    }
    this.statisticsComponent.amountWords = amountWords;
    this.statisticsComponent.amountWordsToStudy = amountWordsToStudy;
    this.statisticsComponent.amountWordsToIgnore = amountWordsToIgnore;
    this.cdr.detectChanges();
  }

  goToChapter(index: number): void {
    const chapter = this.chapters[index];
    console.log(`go to chapter: ${chapter.title}`);
    console.log(`chapter has ${chapter.words.length} words`);
    this.router.navigate(['/filter'], { state: { data: chapter } });
  }

}
