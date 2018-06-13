/**
 * Created by jayhamilton on 2/5/17.
 */
import {
    Component, Input, OnInit, Output, EventEmitter,
    ChangeDetectorRef, AfterViewInit
} from '@angular/core';

import {
    style, state, trigger, animate, transition
} from '@angular/animations';

import {FormGroup} from '@angular/forms';

import {PropertyControlService} from './property-control.service';
import {ConfigurationService} from '../services/configuration.service';
import {EndPointService} from '../configuration/tab-endpoint/endpoint.service';
import {EndPoint} from '../configuration/tab-endpoint/endpoint.model';

/**
 * 卡片组件 配置页面的 表单
 */
@Component({
    /* solves error: Expression has changed after it was checked exception resolution - https://www.youtube.com/watch?v=K_BRcal-JfI*/
    // changeDetection: ChangeDetectionStrategy.OnPush,
    moduleId: module.id,
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./styles-props.css'],
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
        ]),
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
    ],
    providers: [PropertyControlService]
})
export class DynamicFormComponent implements OnInit, AfterViewInit {

    //通过属性 配置页 设成 tab面板 和 form表单中的内容
    @Input() propertyPages: any[];
    @Input() instanceId: number; //实例的id
    //属性 更新 事件源
    @Output() updatePropertiesEvent: EventEmitter<any> = new EventEmitter(true);

    currentTab = 'run';
    endPoints: EndPoint[];
    state = 'inactive';
    lastActiveTab = {};

    form: FormGroup = new FormGroup({});
    payLoad = '';
    showMessage = false;

    constructor(private pcs: PropertyControlService,
                private configService: ConfigurationService,
                private endPointService: EndPointService,
                private changeDetectionRef: ChangeDetectorRef) {

        this.updateEndPointList();
    }

    /**
     * 更新 EndPoint 列表, 用于下拉选择 EndPoint API 接口
     */
    updateEndPointList() {

        this.endPointService.getEndPoints().subscribe(data => {
            this.endPoints = data['endPoint'];
        });
    }

    /* better solution that solves error: Expression has changed after it was checked exception resolution*/
    ngAfterViewInit(): void {

        this.changeDetectionRef.detectChanges();
    }

    ngOnInit() {

        this.form = this.pcs.toFormGroupFromPP(this.propertyPages);

    }

    /**
     * 保存配置 表单中的 数据
     */
    onSubmit() {

        this.payLoad = JSON.stringify(this.form.value);

        console.debug('Saving Form!');
        this.updatePropertiesEvent.emit(this.payLoad);

        console.debug('Sending configuration to the config service!');
        this.configService.notifyGadgetOnPropertyChange(this.payLoad, this.instanceId);

        if (this.payLoad) {
            this.showMessage = true;

            setTimeout(function() {
                this.showMessage = false;
            }.bind(this), 2000);
        }
    }

    /**
     * 设置 tab面板的选中值
     * @param tab
     */
    setCurrentTab(tab) {
        this.currentTab = tab.groupId;

    }

    get isPropertyPageValid (){

        return this.form.valid;
    }
}





