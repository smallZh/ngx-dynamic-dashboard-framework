import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AddGadgetService} from '../add-gadget/service';
import {Facet, Tag} from './facet-model';

/**
 * Created by jayhamilton on 6/27/17.
 * 卡片组件新增 对话框 左侧 分类 块组件
 */
@Component({
    moduleId: module.id,
    selector: 'app-filter-list',
    template: `
        <br>
        <div *ngFor='let facet of facet_tags ;let i = index'>

            <app-facet [facet]='facet' (tagSelectEvent)='tagSelect($event)' [openFacet]='i < 2'></app-facet>

        </div>
    `,
    styleUrls: ['./styles.css']
})
export class FilterListComponent {
    //便签 选中 触发事件
    @Output() tagSelectEvent: EventEmitter<any> = new EventEmitter();
    //全部的分类标签
    @Input() facet_tags: Array<Facet>;

    /**
     * 标签选中事件
     * @param tagName
     */
    tagSelect(tagName) {

        this.tagSelectEvent.emit(tagName);

    }
}
