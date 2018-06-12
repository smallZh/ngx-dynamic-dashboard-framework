import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MenuEventService} from './menu-service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';


declare var jQuery: any;


/**a
 * Menu component
 *
 */
@Component({
    moduleId: module.id,
    selector: 'app-menu-component',
    templateUrl: './view.html',
    styleUrls: ['./styles.css'],
    animations: [

        trigger('accordion', [
            state('in', style({
                opacity: '1'
            })),
            state('out', style({
                opacity: '0'
            })),
            transition('in => out', animate('50ms ease-in-out')),
            transition('out => in', animate('100ms ease-in-out'))
        ]),
        trigger('accordion2', [
            state('in', style({
                height: '*'
            })),
            state('out', style({
                height: '0px'
            })),
            transition('in => out', animate('100ms ease-in-out')),
            transition('out => in', animate('50ms ease-in-out'))
        ])
    ]
})
export class MenuComponent implements OnInit {

    //地址栏地址, 用于 文档加载跳转 -->  个人觉着: 没必要记录, 待验证?
    host = window.location.host;

    //存放 菜单栏中 显示 的 面板的 标题,即 title 属性
    dashboardList: any[] = [];

    //当前选中的 面板 标题
    selectedBoard = '';

    //搜索组件的 占位符
    placeHolderText = 'Ask the board to do something!';


    searchList: Array<string> = [];

    //菜单栏 折叠 还是 展开的 标示符
    detailMenuOpen = 'out';

    //通知侧边栏 ng引用
    @ViewChild('notificationSideBar_tag') notificationSideBarRef: ElementRef;
    //布局侧边栏 ng引用
    @ViewChild('layoutSideBar_tag') layoutSideBarRef: ElementRef;
    //整体菜单栏 ng引用
    @ViewChild('stickymenu_tag') stickyMenuRef: ElementRef;

    //通知侧边栏 jQuery引用
    notificationSideBar: any;
    //布局侧边栏 jQuery引用
    layoutSideBar: any;
    //整个菜单栏 jQuery引用
    stickyMenu: any;

    typeAheadIsInMenu = true;

    //当前选中的 布局的id
    layoutId = 0;

    constructor(private _configurationService: ConfigurationService,
                private _menuEventService: MenuEventService, private _route: Router) {

        this.setupEventListeners();
    }

    /**
     * 设置 事件监听器
     */
    setupEventListeners() {
        //订阅 网格组件 变化服务
        this._menuEventService.listenForGridEvents().subscribe((event: IEvent) => {

            const edata = event['data'];

            // 通知 更新 整个 面板 网格组件, 不太清楚 哪个组件 触发的事件
            switch (event['name']) {
                case 'boardUpdateEvent':
                    this.updateDashboardMenu(edata);
                    break;
            }

        });
    }

    /**
     * 组件 初始化
     */
    ngOnInit() {
        this.updateDashboardMenu(''); //选中第一个 默认的 面板
        this.stickyMenu = jQuery(this.stickyMenuRef.nativeElement);
        this.stickyMenu.sticky();
    }

    /**
     * 面板 布局变化 通知处理
     * @param event
     */
    emitBoardChangeLayoutEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardChangeLayoutEvent', data: event});
    }

    /**
     * 触发 面板 更新事件
     * @param event
     */
    emitBoardSelectEvent(event) {
        this.boardSelect(event); //设置当前 选中的 面板
        //发起 订阅消息
        this._menuEventService.raiseMenuEvent({name: 'boardSelectEvent', data: event});
    }

    /**
     * 触发 面板 创建
     * @param event
     */
    emitBoardCreateEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardCreateEvent', data: event});
        //选中新创建的 面板
        this.updateDashboardMenu(event);
    }

    /**
     * 触发面板修改
     * @param event
     */
    emitBoardEditEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardEditEvent', data: event});
    }

    /**
     * 触发 布局 删除 服务
     * @param event
     */
    emitBoardDeleteEvent(event) {
        //通知 菜单订阅服务
        this._menuEventService.raiseMenuEvent({name: 'boardDeleteEvent', data: event});
        //初始化默认的? 还是当前选中的, 需 判断处理
        this.updateDashboardMenu('');
    }

    /**
     * 触发 布局卡片添加
     * @param event
     */
    emitBoardAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAddGadgetEvent', data: event});
    }


    emitBoardAIAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAIAddGadgetEvent', data: event});
    }

    /**
     * 初始化 菜单中的 面板标题
     * @param selectedBoard 面板的标题
     */
    updateDashboardMenu(selectedBoard: string) {

        this._configurationService.getBoards().subscribe(data => {

            const me = this;
            if (data && data instanceof Array && data.length) {
                this.dashboardList.length = 0;


                // sort boards
                data.sort((a: any, b: any) => a.boardInstanceId - b.boardInstanceId);

                data.forEach(board => {

                    me.dashboardList.push(board.title);

                });

                if (selectedBoard === '') {

                    this.boardSelect(this.dashboardList[0]);

                } else {

                    this.boardSelect(selectedBoard);
                }
            }
        });
    }

    /**
     * 设置当前的 面板选中项
     * @param selectedBoard 面板标题
     */
    boardSelect(selectedBoard: string) {
        this.selectedBoard = selectedBoard;
    }

    /**
     * 打开、折叠 菜单栏
     */
    toggleAccordion(): void {

        this.detailMenuOpen = this.detailMenuOpen === 'out' ? 'in' : 'out';

    }

    /**
     * 打开、关闭 布局侧边栏
     */
    toggleLayoutSideBar() {
        //参见 通知侧边栏说明
        this.layoutSideBar = jQuery(this.layoutSideBarRef.nativeElement);
        this.layoutSideBar.sidebar('setting', 'transition', 'overlay');
        this.layoutSideBar.sidebar('toggle');
        this.layoutId = this._configurationService.currentModel.id;
    }

    /**
     * 打开、关闭通知侧边栏
     */
    toggleNotificationSideBar() {
        //通过jQuery 的 class 中的 siderbar ,实现 侧边栏, 使用semantic ui 进行实现
        this.notificationSideBar = jQuery(this.notificationSideBarRef.nativeElement); //转换为 jQuery对象
        this.notificationSideBar.sidebar('setting', 'transition', 'overlay');// 设置属性为 为 透明、遮罩
        this.notificationSideBar.sidebar('toggle'); // 展开
    }


    /**
     * 显示 文档
     *
     * 新窗口 打开 链接 如何操作? 暂时无解
     */
    public showDocumentation() {

        window.location.href = 'http://' + window.location.host + '/assets/documentation/index.html';
    }

}
