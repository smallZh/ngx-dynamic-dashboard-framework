import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {RuntimeService} from '../services/runtime.service';

/**
 * Created by jayhamilton on 2/26/17.
 *
 * 搜索组件
 */
@Component({
    moduleId: module.id,
    selector: 'app-typeahead-input',
    templateUrl: './view.html',
    styleUrls: ['./styles.css'],
})
export class TypeAheadInputComponent {

    //菜单组件、卡片列表组件 用于 进行 搜索的 内容
    @Input() searchList: string[];
    @Input() placeHolderText; //占位符内容
    @Input() typeAheadIsInMenu: boolean;
    //选择其中的 事件触发器
    @Output() selectionEvent = new EventEmitter<string>();
    @Output() ArtificialIntelligenceEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    requestCounter = 0;
    maxAttempts = 5;

    //查询字符串
    public query = '';
    public filteredList = []; //用于过滤使用
    public elementRef;

    constructor(myElement: ElementRef, private _runtimeService: RuntimeService) {
        this.elementRef = myElement;

    }

    /**
     * 执行 查询过滤
     */
    filter() {
        if (this.query !== '') {
            this.filteredList = this.searchList.filter(function (el) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
        } else {
            this.filteredList = [];
        }
        this.selectionEvent.emit(this.query);

        this.requestCounter++;
        if (this.requestCounter === this.maxAttempts) {

            this.processAIString(this.query);
            this.requestCounter = 0;
        }
    }

    select(item) {
        this.query = item;
        this.filteredList = [];
        this.selectionEvent.emit(item);
    }

    /**
     * 每5个 字符 进行 一次处理 判断,验证 是否 有 两种接口, 从接口中返回 组件
     * @param aiStatement
     */
    processAIString(aiStatement: string) {

        console.log('Processing statement: ' + aiStatement);

        const engine = localStorage.getItem('ai_engine');

        if (engine.localeCompare('watson') === 0) {
            this._runtimeService.callWatsonAI(aiStatement).subscribe(data => {
                this.ArtificialIntelligenceEventEmitter.emit(this.getAIIntentFromWatson(data));
            });
        }
        if (engine.localeCompare('witai') === 0) {
            this._runtimeService.callWitAI(aiStatement).subscribe(data => {
                this.ArtificialIntelligenceEventEmitter.emit(this.getAIIntentFromWitAI(data));
            });
        }
    }

    getAIIntentFromWitAI(aiObject: any) {

        let operation = '';
        let confidence = 0;

        if (aiObject && aiObject.entities) {
            if (aiObject.entities.intent && aiObject.entities.intent.length) {
                operation = aiObject.entities.intent[0].value;
                confidence = aiObject.entities.intent[0].confidence;
            }
        }

        return {
            'operation': operation,
            'confidence': confidence
        };
    }

    getAIIntentFromWatson(aiObject: any) {

        let operation = '';
        let confidence = 0;

        if (aiObject && aiObject.classes) {
            if (aiObject.classes && aiObject.classes.length) {
                operation = aiObject.classes[0].name;
                confidence = aiObject.classes[0].confidence;
            }
        }

        return {
            'operation': operation,
            'confidence': confidence
        };
    }
}
