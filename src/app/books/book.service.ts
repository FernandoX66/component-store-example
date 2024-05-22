import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './books-store.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  readonly #http = inject(HttpClient);

  readonly API_URL = 'http://localhost:3000';

  getAll(): Observable<Book[]> {
    return this.#http.get<Book[]>(`${this.API_URL}/books`);
  }
}
