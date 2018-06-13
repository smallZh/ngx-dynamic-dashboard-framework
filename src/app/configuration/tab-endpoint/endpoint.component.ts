/**
 * Created by jayhamilton on 5/31/17.
 * http接口配置 组件
 */
import {Component} from '@angular/core';
import {EndPoint} from './endpoint.model';
import {EndPointService} from './endpoint.service';
import {ToastService} from '../../toast/toast.service';

@Component({
    selector: 'app-endpoint',
    moduleId: module.id,
    templateUrl: './endpoint.html',
    styleUrls: ['./styles-endpoints.css']


})
export class EndPointComponent {

    //http接口 配置对象
    endPoints: EndPoint[];

    //默认当前选中的 http接口
    currentEndPoint: EndPoint = new EndPoint('', '', '', '', '', '',
        '', '', '');

    constructor(private _endPointService: EndPointService) {

        this._endPointService.getEndPoints().subscribe(data => {
            this.endPoints = data['endPoint'];

            if (this.endPoints && this.endPoints.length) {
                this.setSelectedEndPoint(this.endPoints[0]);
            }

        });
    }

    /**
     * 设置当前选中的 EndPoint
     * @param endPoint
     */
    setSelectedEndPoint(endPoint: EndPoint) {
        this.currentEndPoint = endPoint;
    }

    /**
     * 新增 一个 EndPoint
     * @param endPoint
     */
    createEndPoint(endPoint: EndPoint) {

        if (!this.endPoints) {
            this.endPoints = [];
        }

        this.endPoints.push(endPoint);

        this.clearPersistantStore();

        this.persistInMemoryDataToStore();

        this.setSelectedEndPoint(endPoint);
    }

    updateEndPoint(endPoint: EndPoint) {

        this.deleteEndPoint(endPoint);
        this.createEndPoint(endPoint);

    }

    deleteEndPoint(endPoint: EndPoint) {

        // find endPoint in memory by name for now (need to use the id) and remove it
        this.endPoints.forEach(item => {

            if (item.name === endPoint.name) {
                const index = this.endPoints.indexOf(item);
                if (index > -1) {
                    this.endPoints.splice(index, 1);
                }
            }
        });

        this.clearPersistantStore();

        this.persistInMemoryDataToStore();

        if (this.endPoints && this.endPoints.length === 0) {
            this.currentEndPoint.name = '';
            this.currentEndPoint.address = '';
            this.currentEndPoint.description = '';
            this.currentEndPoint.credential = '';
            this.currentEndPoint.credentialType = '';
            this.currentEndPoint.tokenAPI = '';
            this.currentEndPoint.tokenAPIProperty = '';
            this.currentEndPoint.user = '';
        }
    }

    /**
     * 清除全部的 EndPoint
     */
    clearPersistantStore() {

        // delete the currently persisted structure
        this._endPointService.deleteEndPoint().subscribe(data => {

            /**
             * todo - error handling
             */
        });
    }

    /**
     * 保存 全部的 EndPoint, 这里 采用的 是 全部新增,全部删除
     */
    persistInMemoryDataToStore() {

        const endpointModel = {
            endPoint: this.endPoints
        };
        // persist in memory structure
        this._endPointService.saveEndPoint(endpointModel).subscribe(data => {

            /**
             * todo - error handling
             */
        });

    }

}


