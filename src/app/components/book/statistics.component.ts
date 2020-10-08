import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  template: `
    <div>
      total: {{ amountWords }}, to study: {{ amountWordsToStudy }}, to ignore: {{ amountWordsToIgnore }}
    </div>
  `,
  styles: [
  ]
})
export class StatisticsComponent implements OnInit {

  amountWords: number;
  amountWordsToStudy: number;
  amountWordsToIgnore: number;

  constructor() { }

  ngOnInit(): void { }

}
