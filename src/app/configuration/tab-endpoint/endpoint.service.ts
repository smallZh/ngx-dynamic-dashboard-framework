/**
 * Created by jayhamilton on 2/7/17.
 */
import {Injectable, Output} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {EndPoint} from './endpoint.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';

/**
 * 给 EndPoint组件 提供 EndPoint 数据
 */
@Injectable()
export class EndPointService {

    localStore = 'http://localhost:8090/api/store';
    private subject: Subject<any> = new Subject<any>();
    demo = true;

    constructor(private _http: HttpClient) {
    }

    /**
     * 获取 EndPoint数据
     * @returns {any}
     */
    getEndPoints() {

        if (this.demo) {

            if (localStorage.getItem('endpoint') == null) {

                return new Observable(observer => {
                    const base = {endPoint: []};
                    const testEndPoint = new EndPoint(
                        'TestEndPoint',
                        'localhost://test',
                        'test user',
                        'testCredential',
                        'password',
                        'description',
                        'token API',
                        'token API Header',
                        'token API Property'
                    );
                    base.endPoint.push(testEndPoint);
                    localStorage.setItem('endpoint', JSON.stringify(base));
                    observer.next(base);
                    return () => {
                    };
                });
            } else {

                return new Observable(observer => {
                    const data = JSON.parse(localStorage.getItem('endpoint'));
                    observer.next(data);
                    return () => {
                    };
                });

            }
        } else {

            return this._http.get(this.localStore + '/endpoint');
        }
    }

    /**
     * 删除 全部的 EndPoint
     * @returns {Observable<Object>}
     */
    deleteEndPoint() {
        return this._http.delete(this.localStore + '/' + 'endpoint');
    }

    /**
     * 存储 全部EndPoint
     * @param endpoint
     * @returns {any}
     */
    saveEndPoint(endpoint: any) {

        if (this.demo) {
            return new Observable(observer => {

                localStorage.setItem('endpoint', JSON.stringify(endpoint));
                observer.next({});
                return () => {
                };

            });
        } else {
            const headers = new HttpHeaders();

            headers.set('Content-Type', 'application/json');
            if (Object.keys(endpoint).length === 0 && endpoint.constructor === Object) {
                return Observable.empty();
            }
            return this._http.post(this.localStore + '?id=endpoint', JSON.stringify(endpoint), {headers: headers});
        }

    }
}
