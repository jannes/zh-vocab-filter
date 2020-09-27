import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { NgZone } from '@angular/core';
import { FileService } from 'src/app/services';
import {BookData} from 'src/app/data/bookData';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit {
  title = 'zv-vocab-filter';

  constructor(private router: Router, private fileService: FileService, private zone: NgZone) {
  }

  ngOnInit(): void {
    this.fileService.content.subscribe((contents) => {
      console.log('getting file event');
      if (contents != null) {
        try {
        const parsed = JSON.parse(contents);
        const casted = parsed as BookData;
        this.zone.run(() => this.router.navigate(['/overview'], {state: {data: casted}}));
        } catch {
          alert('invalid json');
        }
      }
    });
  }
}
