import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {Facet} from '../facet/facet-model';

/**
 * 组件添加对话框中, 左侧的 分类 和 标签 列表
 */
@Component({
    selector: 'app-data-list',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles.css']
})
export class DataListComponent {

    //右侧显示的 卡片组件的 对象
    @Input() objectList: any[];
    //搜索组件 搜索的 内容列表
    @Input() objectTitleList: string[];
    //搜索组件显示的 占位符
    @Input() placeHolderText: string;
    @Input() layoutColumnOneWidth: string;
    @Input() layoutColumnTwoWidth: string;
    @Input() listHeader: string;
    @Input() typeAheadIsInMenu: boolean;
    //显示的 分类表标签
    @Input() facetTags: Array<Facet>;

    //template 模板引用
    @ContentChild(TemplateRef) template: TemplateRef<any>;


    color = 'white';
    objectListCopy: any[] = [];

    /**
     * 通过标签检索 卡片组件
     * filterTag组件 进行 事件 回调
     * @param filterList
     */
    filterListByTags(filterList: string[]) {

        this.copyObjectList();
        this.objectList = this.objectListCopy.filter(object => {

            let tagFound = false;

            if (!filterList.length) {
                return true;
            } else {
                object.tags.forEach(tag => {

                    filterList.forEach(filter => {

                        if (tag.name.toLocaleLowerCase() === filter.toLocaleLowerCase()) {
                            tagFound = true;
                        }
                    });
                });

                return tagFound;
            }
        });

    }

    /**
     * 搜索 组件 进行 回调
     * @param searchString
     */
    filterListBySearchString(searchString: string) {

        this.copyObjectList();
        this.objectList = this.objectListCopy.filter(object => {

            if (searchString.localeCompare('') === 0) {
                return true;
            } else {

                if (object.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {

                    return true;
                }
            }

        });
    }

    /**
     * todo - find a better way to manage the list that is displayed and filtered.
     * 复制 卡片组件 对象
     */
    copyObjectList() {
        if (this.objectListCopy.length === 0) {
            this.objectList.forEach(item => {
                this.objectListCopy.push(item);
            });
        }
    }
}

