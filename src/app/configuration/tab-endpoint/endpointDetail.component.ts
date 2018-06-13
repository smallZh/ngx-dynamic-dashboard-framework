/**
 * Created by jayhamilton on 5/16/17.
 * 编辑 EndPoint的 表单
 */
import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {credentialScheme, EndPoint} from './endpoint.model';
import {ToastService} from '../../toast/toast.service';

@Component({
    selector: 'app-endpoint-detail',
    moduleId: module.id,
    templateUrl: './endpointDetail.html',
    styleUrls: ['./styles-endpoints.css']

})
export class EndPointDetailComponent implements OnChanges {

    //当前 的 EndPoint
    @Input() currentEndPoint: EndPoint;

    //创建、修改、删除 事件监听器
    @Output() createEvent: EventEmitter<EndPoint> = new EventEmitter();
    @Output() updateEvent: EventEmitter<EndPoint> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<EndPoint> = new EventEmitter();

    //当前 状态
    currentState: string;

    //对应表单
    endPointForm: FormGroup;
    credentialScheme = credentialScheme;


    ngOnChanges() {

        this.endPointForm.reset();
        this.endPointForm.setValue({
            name: this.currentEndPoint.name,
            address: this.currentEndPoint.address,
            user: this.currentEndPoint.user,
            credentialType: this.currentEndPoint.credentialType,
            credential: this.currentEndPoint.credential,
            description: this.currentEndPoint.description,
            tokenAPI: this.currentEndPoint.tokenAPI,
            tokenAPIProperty: this.currentEndPoint.tokenAPIProperty,
            tokenAPIHeader: this.currentEndPoint.tokenAPIHeader
        });
    }

    constructor(private fb: FormBuilder) {

        this.createForm();
        const me = this;
        this.endPointForm.valueChanges.forEach( //设置当前状态, 遍历 表单中的 每一个 值
            (value => {
                if (this.currentState !== 'create') {
                    me.setFormState();
                }
            })
        );
    }

    /**
     * 设置form 状态
     */
    setFormState() {

        /**
         * todo - implement state machine
         */

        if (this.endPointForm.get('name').pristine) {

            // something other than name changed so this must be an update
            if (this.endPointForm.dirty) {
                this.currentState = 'update';
            }
        } else {
            // name change so assume user wants to perform save as
            this.currentState = 'save as';
        }

        // reset state when a form is clean
        if (this.endPointForm.pristine) {
            this.currentState = 'reset';
        }
    }

    /**
     * 动态创建 表单组件
     */
    createForm() {

        this.endPointForm = this.fb.group({

            name: ['', Validators.required],
            address: ['', Validators.required],
            user: ['', Validators.required],
            credentialType: ['', Validators.required],
            credential: ['', Validators.required],
            tokenAPI: ['', Validators.required],
            tokenAPIProperty: ['', Validators.required],
            tokenAPIHeader: ['', Validators.required],
            description: ''
        });

    }

    /**
     * 保存 EndPoint
     */
    createEndPoint() {

        const ep: EndPoint = new EndPoint(
            this.endPointForm.value.name,
            this.endPointForm.value.address,
            this.endPointForm.value.user,
            this.endPointForm.value.credential,
            this.endPointForm.value.credentialType,
            this.endPointForm.value.description,
            this.endPointForm.value.tokenAPI,
            this.endPointForm.value.tokenAPIProperty,
            this.endPointForm.value.tokenAPIHeader
        );

        this.createEvent.emit(ep);
        this.currentState = 'reset';
    }

    /**
     * 更新 EndPoint
     */
    updateEndPoint() {

        this.currentEndPoint.name = this.endPointForm.value.name;
        this.currentEndPoint.address = this.endPointForm.value.address;
        this.currentEndPoint.user = this.endPointForm.value.user;
        this.currentEndPoint.credential = this.endPointForm.value.credential;
        this.currentEndPoint.credentialType = this.endPointForm.value.credentialType;
        this.currentEndPoint.description = this.endPointForm.value.description;
        this.currentEndPoint.tokenAPI = this.endPointForm.value.tokenAPI;
        this.currentEndPoint.tokenAPIProperty = this.endPointForm.value.tokenAPIProperty;
        this.currentEndPoint.tokenAPIHeader = this.endPointForm.value.tokenAPIHeader;

        this.updateEvent.emit(this.currentEndPoint);
        this.currentState = 'reset';
    }

    /**
     * 新创建 一个 EndPoint
     */
    newEndPoint() {
        this.endPointForm.reset();
        /**
         * The create state is used to display the save icon even if the form is being edited
         * todo - implmenet state machine
         */
        this.currentState = 'create';
    }

    /**
     * 重置
     */
    resetEndPoint() {
        this.ngOnChanges();

    }

    /**
     * 删除
     */
    deleteEndPoint() {

        this.deleteEvent.emit(this.currentEndPoint);

    }
}
