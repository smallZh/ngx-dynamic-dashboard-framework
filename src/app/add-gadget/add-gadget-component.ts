/**
 * Created by jayhamilton on 1/24/17.
 */
import {
    ViewChild, ElementRef, AfterViewInit, Component, Output, EventEmitter
} from '@angular/core';

import {
    style, trigger, animate, transition
} from '@angular/animations';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import {AddGadgetService} from './service';
import {Facet} from '../facet/facet-model';
import {FacetTagProcessor} from '../facet/facet-tag-processor';

declare var jQuery: any;

/**
 * Message Modal - clasable modal with message
 *
 * Selector message-modal
 *
 * Methods
 *      popMessageModal - display a message modal for a sepcified duration
 *      showMessageModal - show the message modal
 *      hideMessageModal - hide the message modal
 *
 *  提供新增组件 最外层的 对话框
 */
@Component({
    selector: 'app-add-gadget-modal',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles.css'],
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
export class AddGadgetComponent implements AfterViewInit {

    //用于触发 组件添加事件
    @Output() addGadgetEvent: EventEmitter<any> = new EventEmitter();

    //全部 可用的 卡片组件的 配置对象列表
    gadgetObjectList: any[] = [];
    gadgetObjectTitleList: string[] = [];

    //搜索组件的 文本占位符
    placeHolderText = 'Begin typing gadget name';

    layoutColumnOneWidth = 'six';
    layoutColumnTwoWidth = 'ten';
    listHeader= 'Gadgets';

    //全部组件 的 面 和 标签
    facetTags: Array<Facet>;

    color = 'white';

    typeAheadIsInMenu = false;

    modalicon: string;
    //对话框 的 标题头
    modalheader: string;
    modalmessage: string;

    //对话框 组件的 ng 引用
    @ViewChild('messagemodal_tag') messagemodalRef: ElementRef;
    //对话框 组件的 jQuery 引用
    messageModal: any;

    constructor(private _addGadgetService: AddGadgetService) {

        this.getObjectList();
    }

    /**
     * 卡片组件 触发 新增 组件 操作
     * @param actionItem
     * @param actionName
     */
    actionHandler(actionItem, actionName) {
        this.addGadgetEvent.emit(actionItem);
        this.hideMessageModal();

    }


    popMessageModal(icon: string, header: string, message: string, durationms: number) {
        this.showMessageModal(icon, header, message);
        Observable.interval(durationms).take(1).subscribe(
            () => {
                this.hideMessageModal();
            }
        );
    }

    showMessageModal(icon: string, header: string, message: string) {
        this.modalicon = icon;
        this.modalheader = header;
        this.modalmessage = message;
        this.messageModal.modal('show');

    }

    /**
     * 菜单组件 调用 打开 对话框
     * @param header
     */
    showComponentLibraryModal(header: string) {
        this.modalheader = header;
        this.messageModal.modal('show');
    }

    /**
     * 隐藏掉 对话框组件
     */
    hideMessageModal() {
        this.modalicon = '';
        this.modalheader = '';
        this.modalmessage = '';
        this.messageModal.modal('hide');
    }

    ngAfterViewInit() {
        //转换为 jQuery对象,便于 进行 对话框 打开 和关闭
        this.messageModal = jQuery(this.messagemodalRef.nativeElement);
    }

    /**
     * 获取全部的可用 卡片组件列表
     */
    getObjectList() {

        this._addGadgetService.getGadgetLibrary().subscribe(data => {
            this.gadgetObjectList.length = 0;
            const me = this;
            data.library.forEach(function (item) {
                me.gadgetObjectList.push(item);
                me.gadgetObjectTitleList.push(item.name);
            });
            const facetTagProcess = new FacetTagProcessor(this.gadgetObjectList);
            this.facetTags = facetTagProcess.getFacetTags();
        });

    }
}
