import { Component, EventEmitter, Output} from '@angular/core';

import {
    style, trigger, animate, transition
} from '@angular/animations';
/**
 * Created by jayhamilton on 6/27/17.
 * 卡片组件的 标签组件
 */
@Component({
    moduleId: module.id,
    selector: 'app-filter-tag',
    template: `
        <div class='ui basic segment' style='background-color:white; min-height: 4.5em; border-radius:5px'>
            <div class='ui large circular labels'>
               <a class='ui label' [@showHideAnimation] *ngFor='let tag of filterList'>
                    {{tag}}
                </a>
            </div>
        </div>
    `,
    styleUrls: ['../gadgets/_common/styles-gadget.css'],
    animations: [
        trigger(
            'showHideAnimation',
            [
                transition(':enter', [   // :enter is alias to 'void => *'
                    style({opacity: 0}),
                    animate(750, style({opacity: 1}))
                ]),
                transition(':leave', [   // :leave is alias to '* => void'
                    animate(750, style({opacity: 0}))
                ])
            ])
    ]

})
export class FilterTagComponent {

    //触发 标签变化 事件
    @Output() updateFilterListEvent = new EventEmitter<any>();

    //标签列表
    filterList: Array<string> = [];

    constructor() {
    }

    /**
     * 更新过来列表, 由 filterList组件进行调用
     * @param filter
     */
    updateFilterList(filter) {

        filter = filter.toLocaleLowerCase();

        const index: number = this.filterList.indexOf(filter);
        if (index !== -1) {
            this.filterList.splice(index, 1);
        } else {
            this.filterList.push(filter);
        }

        this.updateFilterListEvent.emit(this.filterList);

    }
}
