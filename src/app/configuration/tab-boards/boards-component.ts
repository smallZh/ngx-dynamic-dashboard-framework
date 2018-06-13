/**
 * Created by jayhamilton on 1/24/17.
 */
import {
    ViewChild, ElementRef, AfterViewInit, Component, Output, EventEmitter, Input
} from '@angular/core';
import {
     style, state, trigger, animate, transition
} from '@angular/animations';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import {tabsModel} from '../tabs.model';
import {ConfigurationService} from '../../services/configuration.service';


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
 * 面板 配置 对话框 组件
 */
@Component({
    selector: 'app-board-configuration-modal',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles-board.css'],
    animations: [

        trigger('contentSwitch', [
            state('inactive', style({
                opacity: 0
            })),
            state('active', style({
                opacity: 1
            })),
            transition('inactive => active', animate('750ms ease-in')),
            transition('active => inactive', animate('750ms ease-out'))
        ])
    ]


})
export class BoardsComponent implements AfterViewInit {

    //面板创建 事件触发器
    @Output() dashboardCreateEvent: EventEmitter<any> = new EventEmitter();
    //面板编辑 事件触发器  暂未使用
    @Output() dashboardEditEvent: EventEmitter<any> = new EventEmitter();
    //面板删除 事件派发器
    @Output() dashboardDeleteEvent: EventEmitter<any> = new EventEmitter();

    //面板 标题名称 列表
    @Input() dashboardList: any [];


    //新的面板的 标题
    newDashboardItem = '';


    modalicon: string;
    //对话框的 标题头
    modalheader: string;
    modalconfig: string;

    //对话框的 ng引用
    @ViewChild('boardconfigmodal_tag') boardconfigmodalaRef: ElementRef;
    //对话框的 jQuery引用
    configModal: any;

    //当前的 tab 面板 的 标题
    currentTab: string;
    tabsModel: any[]; //全部支持的 tab面板

    constructor(private _configurationService: ConfigurationService) {

        Object.assign(this, {tabsModel});
        this.setCurrentTab(0);

    }


    popConfigModal(icon: string, header: string, message: string, durationms: number) {
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
        this.modalconfig = message;
        this.configModal.modal('show');

    }

    /**
     * 菜单组件 调用 打开 该对话框
     * @param header
     */
    showBoardConfigurationModal(header: string) {
        this.modalheader = header;
        this.configModal.modal('show');
    }

    hideMessageModal() {
        this.modalicon = '';
        this.modalheader = '';
        this.modalconfig = '';
        this.configModal.modal('hide');
    }

    /**
     * 创建 面板
     * @param name
     */
    createBoard(name: string) {
        if (name !==  '') {
            this.dashboardCreateEvent.emit(name);
            this.newDashboardItem = '';
        }
    }

    editBoard(name: string) {
        this.dashboardEditEvent.emit(name);
    }

    /**
     * 删除面板
     * @param name
     */
    deleteBoard(name: string) {
        this.dashboardDeleteEvent.emit(name);
    }


    ngAfterViewInit() {
        //jQuery 对象化 对话框组件
        this.configModal = jQuery(this.boardconfigmodalaRef.nativeElement);
        this.configModal.modal('hide');
    }

    /**
     * 设置默认的 tab 面板
     * @param tab_index
     */
    setCurrentTab(tab_index) {
        this.currentTab = this.tabsModel[tab_index].displayName;
    }

}
