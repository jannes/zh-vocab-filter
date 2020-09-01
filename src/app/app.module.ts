import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WordDisplayComponent } from './word-display/word-display.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    WordDisplayComponent,
    StatisticsComponent,
    MainComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
