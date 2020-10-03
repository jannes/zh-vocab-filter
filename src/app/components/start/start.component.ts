import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { NgZone } from '@angular/core';
import { FileService } from 'src/app/services';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit {
  title = 'zv-vocab-filter';

  constructor(private router: Router, private fileService: FileService, private zone: NgZone) {
  }

  ngOnInit(): void {
    this.fileService.content.subscribe((bookData) => {
      console.log('getting file event');
      this.zone.run(() => this.router.navigate(['/overview'], {state: {data: bookData}}));
    });
  }
}
