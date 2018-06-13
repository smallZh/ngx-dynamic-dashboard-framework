/**
 * Created by jayhamilton on 1/28/17.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';


/**
 * 卡片组件实例 服务
 *
 * 提供 卡片组件 修改、删除 的 订阅服务处理
 */
@Injectable()
export class GadgetInstanceService {

    //记录 每个组件的实例 引用, 用于删除 该实例对象
    private concreteGadgetInstances: any[] = [];

    //存储 grid 网格组件中 当前面板配置数据对象
    private model: any;

    //通知 grid网格组件 配置对象数据的变化
    private subject: Subject<string> = new Subject<string>();

    constructor() {
    }

    /**
     * 记录每个组件的 实例引用
     * @param gadget
     */
    addInstance(gadget: any) {

        this.concreteGadgetInstances.push(gadget);

    }

    enableConfigureMode() {

        this.concreteGadgetInstances.forEach(function (gadget) {
            gadget.instance.toggleConfigMode();
        });
    }

    /**
     * 卡片组件 删除按钮 触发的操作
     * @param id
     */
    removeInstance(id: number) {

        // remove instance representation from model
        this.model.rows.forEach(function (row) {
            row.columns.forEach(function (column) {
                if (column.gadgets) {
                    for (let i = column.gadgets.length - 1; i >= 0; i--) {

                        if (column.gadgets[i].instanceId === id) {

                            column.gadgets.splice(i, 1);

                            break;
                        }
                    }
                }
            });
        });

        // removes concrete instance from service
        for (let x = this.concreteGadgetInstances.length - 1; x >= 0; x--) {

            if (this.concreteGadgetInstances[x].instance.instanceId === id) {

                const _gadget = this.concreteGadgetInstances.splice(x, 1);

                _gadget[0].destroy();

                break;
            }
        }

        // raise an event indicating a gadget was removed
        this.subject.next('gadget id: ' + id);
    }

    getInstanceCount() {
        return this.concreteGadgetInstances.length;
    }

    /**
     * this allows this service to update the board when a delete operation occurs
     * @param model
     */
    setCurrentModel(model: any) {

        this.model = model;
    }

    /**
     * raise an event that the grid.component is listening for when a gadget is removed.
     *
     * grid 网格组件 监听 服务中 的 model 变化
     *
     * @returns {Observable<string>}
     */
    listenForInstanceRemovedEventsFromGadgets(): Observable<string> {
        return this.subject.asObservable();
    }

    /**
     * 清空全部的 卡片组件实例
     */
    clearAllInstances() {
        this.concreteGadgetInstances.length = 0;
    }

}
