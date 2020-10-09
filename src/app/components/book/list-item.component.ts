import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
    selector: 'app-list-item',
    template: `
    <div (click)="amClicked($event)" (dblclick)="amDblClicked()" [ngClass]="{
        'bg-green-200': isFiltered,
        'border-black': isSelected,
        'border-white': !isSelected
    }"
    class="hover:bg-gray-200 text-2xl pl-5 shadow border-2 font-sanszh my-1">
        {{ chapterTitle }}
    </div>
  `,
    styles: []
})
export class ListItemComponent implements OnInit {

    @Input()
    chapterIndex: number;
    @Input()
    chapterTitle: string;
    @Input()
    isSelected: boolean;
    @Input()
    isFiltered: boolean;
    @Output()
    // index, has shift clicked
    clicked = new EventEmitter<[number, boolean]>();
    @Output()
    dblClicked = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit(): void {
    }

    amClicked(event: MouseEvent): void {
        this.clicked.emit([this.chapterIndex, event.shiftKey]);
    }

    amDblClicked(): void {
        this.dblClicked.emit(this.chapterIndex);
    }

}


