/**
 * Created by jayhamilton on 1/24/17.
 */
import {
    Component
} from '@angular/core';


@Component({
    selector: 'app-ai-config',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles.css']
})
export class AIComponent {

    token;
    ibmwatsonuid;
    ibmwatsonpwd;
    ibmwatsoncid;

    //用于 select的值
    ai_engines = [
        {value: 'watson', viewValue: 'Watson'},
        {value: 'witai', viewValue: 'WitAI'},
        {value: ' ', viewValue: ' '}
    ];
    //选中的 select 值
    selectedAIEngineValue: string;

    constructor() {

        this.token = localStorage.getItem('Wit.aiToken');
        this.ibmwatsonuid = localStorage.getItem('ibmwatsonuid');
        this.ibmwatsonpwd = localStorage.getItem('ibmwatsonpwd');
        this.ibmwatsoncid = localStorage.getItem('ibmwatsoncid');
        this.selectedAIEngineValue = localStorage.getItem('ai_engine');
    }

    /**
     * 选中 ai引擎
     * @param selectControl
     */
    selectChange(selectControl) {

        console.log(selectControl.value);
        this.selectedAIEngineValue = selectControl.value;

        localStorage.setItem('ai_engine', selectControl.value);
    }

    /**
     * 保存引擎选择
     */
    save() {

        localStorage.setItem('Wit.aiToken', this.token);
        localStorage.setItem('ibmwatsonuid', this.ibmwatsonuid);
        localStorage.setItem('ibmwatsonpwd', this.ibmwatsonpwd);
        localStorage.setItem('ibmwatsoncid', this.ibmwatsoncid);
    }

}
