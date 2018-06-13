/**
 * Created by jayhamilton on 6/22/17.
 * 错误组件 使用的 数据模型
 */
export class ErrorObject {
    detail: string;
    summary: string;
    solutions: SolutionObject[];
    resource: string;
    constructor(detail: string, summary: string, solutions: SolutionObject[], resource: string) {
        this.detail = detail;
        this.summary = summary;
        this.solutions = solutions;
        this.resource = resource;
    }
};

export class SolutionObject {
    summary: string;
    articleId: number;
    link: string;
    constructor(summary, articleId, link) {
        this.summary = summary;
        this.articleId = articleId;
        this.link = link;
    }
}
