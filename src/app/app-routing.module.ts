import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BookComponent} from './components/book/book.component';
import {ChapterComponent} from './components/chapter/chapter.component';
import { StartComponent } from './components/start/start.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'start', component: StartComponent},
  {path: 'overview', component: BookComponent},
  {path: 'filter', component: ChapterComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
