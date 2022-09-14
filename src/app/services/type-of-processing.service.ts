import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeOfProcessingModel } from '../models/type-of-processing.model';
import qs from 'qs';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class TypeOfProcessingService {

  

  public URL: string = `${Global.ENDPOINT.BASE}/type-of-processings`

  constructor(private http: HttpClient) { }

  find(where: any = null, q: string = null, start: number = 0, limit: number = 20, sort: string = null) {
    const query: any = {
      _start: start || 0,
      _limit: limit || 20
    }

    if (q) query._q = q;
    if (where) query._where = where;
    if (sort) query._sort = sort;

    return this.http.get<TypeOfProcessingModel[]>(`${this.URL}?${qs.stringify(query)}`).toPromise();
  }

  findById(id: number) {
    return this.http.get<TypeOfProcessingModel>(this.URL + "/" + id).toPromise()
  }

  addProcessing(dataTypeOfProcessing: TypeOfProcessingModel) {
    return this.http.post<TypeOfProcessingModel>(this.URL, dataTypeOfProcessing).toPromise()
  }

  updateProcessing(id: number, newDataTypeOfProcessing: TypeOfProcessingModel) {
    return this.http.put<TypeOfProcessingModel>(this.URL + "/" + id, newDataTypeOfProcessing).toPromise()
  }

  deleteProcessing(id: number) {
    return this.http.delete<TypeOfProcessingModel>(this.URL + "/" + id).toPromise()
  }
}
