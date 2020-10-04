import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { FileService } from 'src/app/services';
import { BookData, BookDataFiltered, ChapterData } from '../../../shared/bookData';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styles: []
})
export class BookComponent implements OnInit {

  bookData: BookDataFiltered;
  chapters: ChapterData[];
  title: string;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private fileService: FileService) {
    // const bookData = this.router.getCurrentNavigation().extras.state.data as BookDataFiltered;
  }

  ngOnInit(): void {
    console.log('book component init');
    const bookData = this.fileService.bookData.value;
    if (bookData == null) {
      alert('book component could not retrieve book data from file service...')
    }
    else {
      this.chapters = bookData.vocabulary;
      this.title = bookData.title;
      this.bookData = bookData;
      console.log(`amount chapters: ${this.chapters.length}`);
      this.cdr.detectChanges();
    }
  }

  getChapter(title: string): ChapterData | null {
    for (const chapter of this.chapters) {
      if (chapter.title === title) {
        return chapter;
      }
    }
    return null;
  }

  goToChapter(title: string): void {
    console.log(`go to chapter: ${title}`);
    const chapter = this.getChapter(title);
    console.log(`chapter has ${chapter.words.length} words`);
    this.router.navigate(['/filter'], {state: {data: chapter}});
  }

}
