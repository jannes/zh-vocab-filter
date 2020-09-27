import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { BookData, ChapterData } from 'src/app/data/bookData';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styles: []
})
export class BookComponent implements OnInit {

  chapters: ChapterData[];
  title: string;

  constructor(private router: Router) {
    // this.chapters = ["jannes", "jannes", "hannes"];
    const bookData = this.router.getCurrentNavigation().extras.state.data as BookData;
    this.chapters = bookData.vocabulary;
    this.title = bookData.title;
  }

  ngOnInit(): void {
    console.log('book component init');
  }

}
