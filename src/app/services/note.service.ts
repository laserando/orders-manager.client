import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NoteModel } from '../models/note.model';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  public URL: string = `${Global.ENDPOINT.BASE}/notes`

  constructor(private http: HttpClient) { }

  addNote(notes, oldRole_id, newRole_id, order_id) {
    this.http.post<NoteModel>(
      this.URL,
      {
        textNote: notes,
        noteByRole: oldRole_id,
        noteToRole: newRole_id,
        order: order_id
      }
    ).toPromise()
  }
}