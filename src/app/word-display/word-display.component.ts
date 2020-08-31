import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-word-display',
  template: `
  <div class="container mx-auto w-1/3 bg-red-100 shadow border border-black mt-20">
    <p class="w-full h-24 text-5xl font-bold text-center">{{word}}</p>
  </div>
  `,
  styles: [
  ]
})
export class WordDisplayComponent implements OnInit {

  constructor() { }

  @Input() word: string;
  ngOnInit(): void {
  }

}
