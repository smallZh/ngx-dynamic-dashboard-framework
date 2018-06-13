import {Component, Output, EventEmitter} from '@angular/core';
import {GadgetInstanceService} from './grid.service';
import {ConfigurationService} from '../services/configuration.service';
import {GadgetConfigModel} from '../gadgets/_common/gadget-config-model';
import {AddGadgetService} from '../add-gadget/service';
import {ToastService} from '../toast/toast.service';
import {MenuEventService} from '../menu/menu-service';

/**
 * 网格组件, 按照 某种布局 显示 卡片组件
 */
@Component({
    moduleId: module.id,
    selector: 'app-grid-component',
    templateUrl: './grid.html',
    styleUrls: ['./styles-grid.css']
})
export class GridComponent {

    //定义 面板更新事件 ?
    @Output() boardUpdateEvent: EventEmitter<any> = new EventEmitter();

    //面板的配置对象, json对象, GadgetInstanceService 服务中已经存储, 此处 model 用于 页面模板 中的 数据双向绑定
    model: any = {};

    //是否有卡片 组件, 默认为 true,即: 无卡片组件
    noGadgets = true;

    //?
    dashedStyle: {};

    dropZone1: any = null;
    dropZone2: any = null;
    dropZone3: any = null;

    //? 不清楚 作用
    gadgetLibrary: any[] = [];

    /** todo ??
     * Temporary objects for experimenting with AI
     * @type
     */
    gridInsertionPosition = {
        x: 0,
        y: 0
    };

    /**
     * Todo - split model and board operations. This class should really focus on an individual board model's operations
     * within the grid. The board specific operations should be moved to the board component.
     * @param _gadgetInstanceService
     * @param _procmonConfigurationService
     */

    constructor(private _gadgetInstanceService: GadgetInstanceService,
                private _configurationService: ConfigurationService,
                private _gadgetLibraryService: AddGadgetService,
                private _toastService: ToastService,
                private _menuEventService: MenuEventService) {


        this.setupEventListeners();
        this.initializeBoard();
        this.getGadgetLibrary();

    }

    /**
     * 设置事件 定于 服务, 主要 订阅 菜单 中的 服务
     */
    setupEventListeners() {

        //监听 卡片组件 移除事件
        this._gadgetInstanceService.listenForInstanceRemovedEventsFromGadgets().subscribe((message: string) => {
            this.saveBoard('Gadget Removed From Board: ' + message, false);
        });

        //监听 菜单事件服务
        this._menuEventService.listenForMenuEvents().subscribe((event: IEvent) => {
            const edata = event['data'];

            switch (event['name']) {
                case 'boardChangeLayoutEvent':
                    this.updateBoardLayout(edata);
                    break;
                case 'boardSelectEvent':
                    this.loadBoard(edata);
                    break;
                case 'boardCreateEvent':
                    this.createBoard(edata);
                    break;
                case 'boardEditEvent':
                    this.editBoard(edata);
                    break;
                case 'boardDeleteEvent':
                    this.deleteBoard(edata);
                    break;
                case 'boardAddGadgetEvent':
                    this.addGadget(edata);
                    break;
                case 'boardAIAddGadgetEvent':
                    this.addGadgetUsingArtificialIntelligence(edata);
                    break;
            }
        });
    }

    /**
     * 该代码暂时 并未使用,不清楚作用
     * This is experimental code that deals with AI
     */
    getGadgetLibrary() {

        this._gadgetLibraryService.getGadgetLibrary().subscribe(data => {
            this.gadgetLibrary.length = 0;
            const me = this;
            data.library.forEach(function (item) {
                me.gadgetLibrary.push(item);
            });
        });
    }

    getGadgetFromLibrary(gadgetType: string) {

        let gadgetObject = null;
        this.gadgetLibrary.forEach(gadget => {


            if (gadgetType.localeCompare(gadget['componentType']) === 0) {

                gadgetObject = gadget;
            }
        });
        return gadgetObject;
    }

    //??
    addGadgetUsingArtificialIntelligence(aiObject: any) {

        console.log('In add gadget component');
        console.log(aiObject);
        /** todo
         * make confidence code configurable
         */
        if (aiObject && aiObject.operation) {
            switch (aiObject.operation) {
                case 'get_storage':
                    this.addGadget(this.getGadgetFromLibrary('StorageObjectListComponent'));
                    break;
                case 'get_cpu':
                    this.addGadget(this.getGadgetFromLibrary('CPUGadgetComponent'));
                    break;
            }
        }
    }

    /**
     * This is the end of the experimental AI code.
     */

    updateGadgetPositionInBoard($event, columnNumber, rowNumber, type) {
        let moveComplete = false;

        this.getModel().rows.forEach(row => {

            let colpos = 0;

            row.columns.forEach(column => {

                let gadgetpos = 0;

                if (column.gadgets) {

                    column.gadgets.forEach(_gadget => {

                        if (_gadget.instanceId === $event.dragData && !moveComplete) {

                            const gadget = column.gadgets.splice(gadgetpos, 1);


                            if (!this.getModel().rows[rowNumber].columns[columnNumber].gadgets) {
                                this.getModel().rows[rowNumber].columns[columnNumber].gadgets = [];
                            }
                            this.getModel().rows[rowNumber].columns[columnNumber].gadgets.push(gadget[0]);
                            this.saveBoard('drag drop operation', false);
                            moveComplete = true;
                        }
                        gadgetpos++;
                    });
                    colpos++;
                }
            });
        });
    }

    /**
     * 根据 标题 创建 面板
     * @param name
     */
    public createBoard(name: string) {
        this.loadNewBoard(name);
    }

    /**
     * 编辑 面板 , 暂时 并未实现, 修改 面板的标题
     * @param name
     */
    public editBoard(name: string) {

    }

    /**
     * 删除面板, 删除面板 配置对象
     * @param name
     */
    public deleteBoard(name: string) {

        this._configurationService.deleteBoard(name).subscribe(data => {

                this.initializeBoard();

            },
            error => console.error('Deletion error', error),
            () => console.debug('Board Deletion: ' + name));

    }

    /**
     * 添加卡片 组件
     * @param gadget 配置数据对象 结构?
     */
    public addGadget(gadget: any) {

        const _gadget = Object.assign({}, gadget);

        _gadget.instanceId = new Date().getTime();
        _gadget.config = new GadgetConfigModel(gadget.config);

        this.setGadgetInsertPosition();

        const x = this.gridInsertionPosition.x;
        const y = this.gridInsertionPosition.y;

        if (!this.getModel().rows[x].columns[y].gadgets) {

            this.getModel().rows[x].columns[y].gadgets = [];
        }
        this.getModel().rows[x].columns[y].gadgets.push(_gadget);

        this.saveBoard('Adding Gadget To The Board', false);

    }

    /**
     * 更新面板布局
     * @param structure
     */
    public updateBoardLayout(structure) {

        console.log('UPDATING LAYOUT');

        // user selected the currently selected layout
        if (structure.id === this.getModel().id) {
            return;
        }

        // copy the current board's model
        const _model = Object.assign({}, this.getModel());

        // get just the columns that contain gadgets from all rows
        const originalColumns: any[] = this.readColumnsFromOriginalModel(_model);

        // reset the copied model's rows, which include columns
        _model.rows.length = 0;

        // copy the contents of the requested structure into the temporary model
        // we now have a board model we can populate with the original board's gadgets
        Object.assign(_model.rows, structure.rows);
        _model.structure = structure.structure;
        _model.id = structure.id;

        let originalColumnIndexToStartProcessingFrom = 0;

        /* For each column from the original board, copy its gadgets to the new structure.
         The requested layout may have more or less columns than defined by the original layout. So the fillGridStructure method
         will copy column content into the target. If there are more columns than the target,
         the fillGridStructure will return the count of remaining columns to be processed and then process those.
         */
        while (originalColumnIndexToStartProcessingFrom < originalColumns.length) {
            originalColumnIndexToStartProcessingFrom = this.fillGridStructure(_model, originalColumns, originalColumnIndexToStartProcessingFrom);
        }

        // This will copy the just processed model and present it to the board
        this.setModel(_model);

        // clear temporary object ?? 为什么清空对象? 作用域结束,不就 没了吗?
        for (const member in  _model) {
            delete  _model[member];
        }

        // persist the board change
        this.saveBoard('Grid Layout Update', false);
    }

    /**
     * 更新 网格组件 的 样式
     */
    private updateGridState() {

        //仅仅 只是 判断 是否 有 卡片组件?
        let gadgetCount = 0;

        if (this.getModel().rows) {
            this.getModel().rows.forEach(function (row) {
                row.columns.forEach(function (column) {
                    if (column.gadgets) {
                        column.gadgets.forEach(function (gadget) {
                            gadgetCount++;
                        });
                    }
                });
            });
        }

        this.noGadgets = !gadgetCount;

        this.dashedStyle = {
            'border-style': this.noGadgets ? 'dashed' : 'none',
            'border-width': this.noGadgets ? '2px' : 'none',
            'border-color': this.noGadgets ? 'darkgray' : 'none',
            'padding': this.noGadgets ? '5px' : 'none'
        };
    }

    /**
     * 从 面板 配置对象 中 读取 列
     * @param _model 面板配置对象
     * @returns {Array} 返回全部的 列
     */
    private readColumnsFromOriginalModel(_model) {

        const columns = [];
        _model.rows.forEach(function (row) {
            row.columns.forEach(function (col) {
                columns.push(col);
            });
        });
        return columns;

    }

    /**
     * 填充 网格组件 的  结构
     * @param destinationModelStructure
     * @param originalColumns
     * @param counter
     * @returns {number}
     */
    private fillGridStructure(destinationModelStructure, originalColumns: any[], counter: number) {

        const me = this;

        destinationModelStructure.rows.forEach(function (row) {
            row.columns.forEach(function (destinationColumn) {
                if (!destinationColumn.gadgets) {
                    destinationColumn.gadgets = [];
                }
                if (originalColumns[counter]) {
                    me.copyGadgets(originalColumns[counter], destinationColumn);
                    counter++;
                }
            });
        });

        console.log('Fill grid structure counter value returned: ' + counter);

        return counter;

    }

    /**
     * 将 原来布局中的 组件 复制到 目标组件
     * @param source
     * @param target
     */
    private copyGadgets(source, target) {

        if (source.gadgets && source.gadgets.length > 0) {
            let w = source.gadgets.shift();
            while (w) {
                target.gadgets.push(w);
                w = source.gadgets.shift();
            }
        }
    }

    public enableConfigMode() {

        this._gadgetInstanceService.enableConfigureMode();
    }

    /**
     * 初始化 面板信息
     */
    private initializeBoard() {

        this._configurationService.getBoards().subscribe(board => {

            if (board && board instanceof Array && board.length) {

                const sortedBoard = board.sort(function (a, b) {
                    return a.boardInstanceId - b.boardInstanceId;
                });

                this.loadBoard(sortedBoard[0].title);
            } else {

                this.loadDefaultBoard();
            }
        });
    }

    /**
     * 根据 面板 标题 加载 对应的 面板
     * @param boardTitle
     */
    private loadBoard(boardTitle: string) {

        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getBoardByTitle(boardTitle).subscribe(board => {

                this.setModel(board);
                this.updateServicesAndGridWithModel();
                this.boardUpdateEvent.emit(boardTitle);
            },
            error => {
                console.error(error);
                this.loadDefaultBoard();

            });

    }

    /**
     * 加载默认的 面板
     */
    private loadDefaultBoard() {

        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe(board => {

            console.log('loading default board');
            this.setModel(board);
            this.updateServicesAndGridWithModel();
            this.saveBoard('Initialization of a default board', true);


        });
    }

    /**
     * 加载 新的面板, 使用 默认的 面板进行初始化
     * @param name
     */
    private loadNewBoard(name: string) {

        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe(res => {

            this.setModel(res);
            this.getModel().title = name;
            this.getModel().boardInstanceId = new Date().getTime();

            this.updateServicesAndGridWithModel();
            this.saveBoard('Initialization of a new board', true);


        });
    }

    /**
     * 更新 面板的 配置数据
     *
     * 同时更新 GadgetInstanceService 服务中 model 对象
     * 同时更新 ConfigurationService 服务中 model 对象
     *
     * 当删除一个 卡片组件时, 会同步更新 grid网格组件中  的 model
     */
    private updateServicesAndGridWithModel() {
        this._gadgetInstanceService.setCurrentModel(this.getModel());
        this._configurationService.setCurrentModel(this.getModel());
        this.updateGridState();
    }

    /**
     * 保存 面板
     * @param operation 未使用
     * @param alertBoardListenerThatTheMenuShouldBeUpdated ?
     */
    private saveBoard(operation: string, alertBoardListenerThatTheMenuShouldBeUpdated: boolean) {

        this.updateServicesAndGridWithModel();

        this._configurationService.saveBoard(this.getModel()).subscribe(result => {

                this._toastService.sendMessage(this.getModel().title + ':' + this.getModel().boardInstanceId + ' has been updated!', '');

                if (alertBoardListenerThatTheMenuShouldBeUpdated) {
                    this._menuEventService.raiseGridEvent({name: 'boardUpdateEvent', data: this.getModel().title});
                }
            },
            error => console.error('Error' + error),
            () => console.debug('Saving configuration to store!'));

    }

    /**
     * 清空全部的 卡片组件
     */
    private clearGridModelAndGadgetInstanceStructures() {
// clear gadgetInstances
        this._gadgetInstanceService.clearAllInstances();
// clear current model
        for (const prop in this.getModel()) {
            if (this.model.hasOwnProperty(prop)) {
                delete this.model[prop];
            }
        }
    }

    /**
     * 设置 卡片组件 插入的位置
     * 横坐标x 为 row 索引
     * 纵坐标y 为 column 索引
     */
    private setGadgetInsertPosition() {

        for (let x = 0; x < this.getModel().rows.length; x++) {

            for (let y = 0; y < this.getModel().rows[x].columns.length; y++) {

                if (this.getModel().rows[x].columns[y].gadgets && this.getModel().rows[x].columns[y].gadgets.length === 0) {

                    this.gridInsertionPosition.x = x;
                    this.gridInsertionPosition.y = y;
                    return;

                }
            }
        }
// we go here because the board is either empty or full
// insert in the top left most cell
        this.gridInsertionPosition.y = 0;

        if (this.noGadgets) {
            // there are no gadgets so insert in top row
            this.gridInsertionPosition.x = 0;
        } else {
            // board is full so insert in the last row
            this.gridInsertionPosition.x = this.getModel().rows.length - 1;
        }
    }

    public setModel(model: any) {

        this.model = Object.assign({}, model);
    }

    public getModel() {
        return this.model;
    }


}
