import {Component, OnInit, Input, SimpleChange} from '@angular/core';

@Component({
  selector: 'app-progress',
  template: `
    <div class="text-1xl text-center">{{displayString(totalAmount, filteredAmount)}}</div>
  `,
  styles: []
})
export class ProgressComponent implements OnInit {

  @Input()
  totalAmount: number;
  @Input()
  filteredAmount: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  displayString(total: number, filtered: number): string {
    return `filtered ${this.filteredAmount} out of ${this.totalAmount}`;
  }
}
