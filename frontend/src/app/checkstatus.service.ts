import { Injectable } from '@angular/core';
import { QUERY_URL, VERSION } from './globals';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class checkstatus {
  prevIdArray = [];
    constructor(private cookieService: CookieService, private httpClient: HttpClient) { }

    checkStatus() {
      let formStatus = new FormData();
      const error_arr = ['Error', 'File format', 'None', 'File not aligned', 'File is not aligned', '遺伝的差異計算Error',
                        '系統樹作成Error', 'Check datatype or align definitions', 'Cancelled',
                        'log(0) in Distance Matrix Calculation. Check Type and Genetic Difference',
                        'Alignment error', 'No valid matrix', 'Time limit of 60 minutes reached',
                        'Linecount maximum exceeded'];
      const sec_arr = ['Finished', 'Cancelled'];
      const allCookies: {} = this.cookieService.getAll();
      // tslint:disable-next-line: forin
      for (let key in allCookies) {
        let value = allCookies[key];
        let valueSplit = value.split(';');
        if ( error_arr.includes(valueSplit[0])) {
          // pass
        } else if (sec_arr.includes(valueSplit[1])) {
          //pass
        } else {
          formStatus.set('result_id', valueSplit[0]);
          formStatus.set('result_kind', 'complete');
          this.httpClient.post(QUERY_URL, formStatus, {observe: 'response'}).subscribe(query => {
            valueSplit[1] = query.body['msg'];
            // valueSplit[1] = query;
            valueSplit[0] = query.body['result_id'];
            this.cookieService.set(key, valueSplit[0] + ';' + valueSplit[1] + ';' + valueSplit[2] +
            ';' + valueSplit[3] + ';' + valueSplit[4] + ';' + String(VERSION));
          });
        }
        formStatus.delete('result_id');
        formStatus.delete('result_kind');
      }
  }

  getStatus() {
    let allCookies: {} = this.cookieService.getAll();
    let prevIds = [];
      // tslint:disable-next-line: forin
    for (var key in allCookies) {
        var value = allCookies[key];
        var valueSplit = value.split(';');
        prevIds.push({id: valueSplit[0], msg: valueSplit[1], time: valueSplit[2], number: valueSplit[3], type: valueSplit[4], version: valueSplit[5]});
      }
    this.prevIdArray = prevIds;
    return this.prevIdArray;
  }
}
