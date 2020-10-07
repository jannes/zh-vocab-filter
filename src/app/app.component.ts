import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService, FileService } from './services';
import { AppConfig } from '../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private electronService: ElectronService, private fileService: FileService,
              private zone: NgZone, private router: Router) {
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in Electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit(): void {
    this.fileService.bookData.subscribe((bookData) => {
      // book behavior subject is initially null, so ignore that first value
      if (bookData != null) {
        console.log('getting file event');
        this.zone.run(() => this.router.navigate(['/overview']));
      }
    });
  }
}
