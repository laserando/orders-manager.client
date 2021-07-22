import qs from 'qs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeOfMaterialModel } from '../models/type-of-material.model';

@Injectable({
  providedIn: 'root'
})
export class TypeOfMaterialService {

  public URL: string = "http://localhost:1337/materials"

  constructor(private http: HttpClient) { }

  find(where: any = null, q: string = null, start: number = 0, limit: number = 20, sort: string = null) {
    const query: any = {
      _start: start || 0,
      _limit: limit || 20
    }

    if (q) query._q = q;
    if (where) query._where = where;
    if (sort) query._sort = sort;

    return this.http.get<TypeOfMaterialModel[]>(`${this.URL}?${qs.stringify(query)}`).toPromise();
  }

  findById(id: number) {
    return this.http.get<TypeOfMaterialModel>(this.URL + "/" + id).toPromise()
  }

  addMaterial(dataMaterial: TypeOfMaterialModel) {
    return this.http.post<TypeOfMaterialModel>(this.URL, dataMaterial).toPromise()
  }

  updateMaterial(id: number, newDataMaterial: TypeOfMaterialModel) {
    return this.http.put<TypeOfMaterialModel>(this.URL + "/" + id, newDataMaterial).toPromise()
  }

  deleteMaterial(id: number) {
    return this.http.delete<TypeOfMaterialModel>(this.URL + "/" + id).toPromise()
  }
}


