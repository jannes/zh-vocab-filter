import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services';
import { BookData, BookDataFiltered, ChapterData, ChapterFiltered } from '../../../shared/bookData';
import { StatisticsComponent } from './statistics.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styles: []
})
export class BookComponent implements OnInit, AfterViewInit{

  bookData: BookDataFiltered;
  chapters: ChapterFiltered[];
  // map of chapter title -> is_filtered
  chapterIsFilteredMap: Map<string, boolean>;
  title: string;

  // set of selected chapters (titles) used for statistics and export
  selected: Set<string>;

  @ViewChild(StatisticsComponent)
  private statisticsComponent: StatisticsComponent;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private fileService: FileService) {
    // const bookData = this.router.getCurrentNavigation().extras.state.data as BookDataFiltered;
  }

  initFilteredMap(): void {
    for (const chapter of this.chapters) {
      const isFiltered = (chapter.words.length === 0) || (chapter.words_ignore.length > 0) ||
                         (chapter.words_not_study.length > 0) || (chapter.words_study.length > 0);
      if (isFiltered) {
        console.log(`chapter ${chapter.title} is filtered`);
      }
      this.chapterIsFilteredMap.set(chapter.title, isFiltered);
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
      console.log(`amount chapters: ${this.chapters.length}`);
      this.title = bookData.title;
      this.bookData = bookData;
      this.chapterIsFilteredMap = new Map();
      this.selected = new Set();
      this.initFilteredMap();
    }
  }

  ngAfterViewInit(): void {
      this.cdr.detectChanges();
  }

  select(chapterTitle: string): void {
    console.log(`selecting: ${chapterTitle}`);
    const chapter = this.getChapterFromTitle(chapterTitle);
    this.selected = new Set();
    this.selected.add(chapterTitle);
    this.statisticsComponent.amountWords = chapter.words.length;
    this.statisticsComponent.amountWordsToStudy = chapter.words_study.length;
    this.statisticsComponent.amountWordsToIgnore = chapter.words_ignore.length;
    this.cdr.detectChanges();
  }

  chapterIsFiltered(title: string): boolean {
    return this.chapterIsFilteredMap.get(title);
  }

  chapterIsSelected(title: string): boolean {
    return title in this.selected;
  }

  getChapterFromTitle(title: string): ChapterFiltered | null {
    for (const chapter of this.chapters) {
      if (chapter.title === title) {
        return chapter;
      }
    }
    return null;
  }

  goToChapter(title: string): void {
    console.log(`go to chapter: ${title}`);
    const chapter = this.getChapterFromTitle(title);
    console.log(`chapter has ${chapter.words.length} words`);
    this.router.navigate(['/filter'], { state: { data: chapter } });
  }

}
