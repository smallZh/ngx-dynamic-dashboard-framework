/**
 * 卡片组件 标签的集合 称为一个 面, 其实 等同于 分类
 */
export class Facet {
    name: string;
    tags: Array<Tag>;

    constructor(name: string, tags: Array<Tag>) {

        this.name = name;
        this.tags = tags;
    }
}

/**
 * 卡片组件 所属于的标签
 */
export class Tag {
    name: string;
    count: number;

    constructor(name: string) {
        this.name = name;
        this.count = 1;
    }
}
