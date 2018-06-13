import {Facet, Tag} from './facet-model';

export class FacetTagProcessor {

    facet_tags: Array<Facet> = [];
    //全部可用的 卡片组件列表
    objectList: any[];

    constructor(objectList: any[]) {
        this.objectList = objectList;
    }

    /**
     * 获取 卡片组件的 标签
     * @returns {Array<Facet>}
     */
    getFacetTags() {

        const me = this;
        this.objectList.forEach(function (item) {

            me.formatAndUpdateTagList(item.tags);

        });

        return this.facet_tags;
    }

    /***
     * 格式化,并 更新 标签列表
     * @param items
     */
    formatAndUpdateTagList(items: any[]) {

        items.forEach(tag => {

            // add the first facet and tag to the facet_tag array
            if (!this.facet_tags.length) {

                this.createFacetAndAddItToTheFacetTagArray(tag);

            } else {

                let facetExists = false;

                this.facet_tags.forEach(facet => {

                    if (facet.name.toLowerCase() === tag.facet.toLowerCase()) {
                        facetExists = true;
                    }
                });

                if (facetExists) {

                    this.updateFacetWithTag(tag);

                } else {

                    this.createFacetAndAddItToTheFacetTagArray(tag);

                }
            }
        });
    }

    /**
     * 创建 方面 和 其中 的标签
     * @param tag
     */
    createFacetAndAddItToTheFacetTagArray(tag: any) {

        const _tags: Array<Tag> = [];
        const _tag: Tag = this.createTag(this.capitalize(tag.name));

        _tags.push(_tag);

        const facet: Facet = new Facet(tag.facet, _tags);

        this.facet_tags.push(facet);

    }

    /**
     * 创建tag 标签
     * @param tag
     * @returns {Tag}
     */
    createTag(tag) {

        return new Tag(tag);
    }


    /**
     * 使用 标签 更新 方面
     * @param tag
     */
    updateFacetWithTag(tag: any) {

        // find the facet and then add the tag or update the count
        this.facet_tags.forEach(facet => {

            if (facet.name.toLowerCase() === tag.facet.toLowerCase()) {


                let tagExists = false;


                facet.tags.forEach(_tag => {

                    if (_tag.name.toLowerCase() === tag.name.toLowerCase()) {

                        tagExists = true;

                        _tag.count = _tag.count + 1;

                    }

                });

                if (!tagExists) {

                    facet.tags.push(this.createTag(this.capitalize(tag.name)));
                }
            }

        });
    }

    /**
     * 将 名字首字母大写
     * @param value
     * @returns {string}
     */
    capitalize(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
}
