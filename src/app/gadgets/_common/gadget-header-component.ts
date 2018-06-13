/**
 * Created by jayhamilton on 2/28/17.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
/**
 * Created by jayhamilton on 2/26/17.
 */

@Component({
    moduleId: module.id,
    selector: 'app-gadget-header',
    templateUrl: './gadget-header.html',
    styleUrls: ['./styles-gadget.css']
})
export class GadgetHeaderComponent {
    //显示的标题
    @Input() title: string;
    //控制 配置工具栏是否显示
    @Input() showControls: boolean;
    @Input() inRun: boolean;
    @Input() inConfig: boolean;
    @Input() actionInitiated: boolean;
    @Input() showOperationControls: boolean;
    @Input() showConfigurationControl: boolean;
    @Input() gadgetHasOperationControls: boolean;
    // 移除操作 触发的 事件
    @Output() removeEvent: EventEmitter<any> = new EventEmitter();
    // 展开、折叠 配置表单
    @Output() toggleConfigModeEvent: EventEmitter<any> = new EventEmitter();
    @Output() runEvent: EventEmitter<any> = new EventEmitter();
    @Output() stopEvent: EventEmitter<any> = new EventEmitter();
    @Output() helpEvent: EventEmitter<any> = new EventEmitter();


    /**
     * 触发移除操作
     */
    remove() {
        this.removeEvent.emit();
    }

    /**
     * 展开、隐藏 表单配置
     */
    toggleConfigMode() {
        this.toggleConfigModeEvent.emit();
    }

    /**
     * 将子组件 的 run 事件 继续 向上传递
     */
    run() {

        this.runEvent.emit();

    }

    /**
     * 将子组件的 stop 事件 向上传递
     */
    stop() {

        this.stopEvent.emit();
    }

    /**
     * 触发 help事件
     */
    help(){
        this.helpEvent.emit();
    }

}