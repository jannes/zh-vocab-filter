import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {WordDisplayComponent} from './components/chapter/word-display.component';
import {StatisticsComponent} from './components/book/statistics.component';
import {StartComponent} from './components/start/start.component';
import {AppRoutingModule} from './app-routing.module';
import {BookComponent} from './components/book/book.component';
import {ChapterComponent} from './components/chapter/chapter.component';

@NgModule({
  declarations: [
    AppComponent,
    WordDisplayComponent,
    StatisticsComponent,
    StartComponent,
    BookComponent,
    ChapterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
