/**
 * Created by jayhamilton on 2/7/17.
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/**
 * 该服务 用于 为 新增组件对话框 提供 卡片 组件模型
 */
@Injectable()
export class AddGadgetService {

    constructor(private _http: HttpClient) {}

    getGadgetLibrary() {
        return this._http.get<GadgetLibraryResponse>('/assets/api/gadget-library-model.json');
    }

}
