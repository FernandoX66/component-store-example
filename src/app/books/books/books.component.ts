import { Component, OnInit, inject } from '@angular/core';
import { Book, BooksStoreService } from '../books-store.service';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { BOOK } from '../book';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgClass],
  providers: [BooksStoreService],
  templateUrl: './books.component.html',
})
export class BooksComponent implements OnInit {
  readonly #booksStore = inject(BooksStoreService);
  readonly books$ = this.#booksStore.select((state) => state.books);
  readonly favorites$ = this.#booksStore.select((state) => state.favorites);

  ngOnInit(): void {
    this.#booksStore.getAllBooks();
  }

  onAddClick(): void {
    this.addBook(BOOK);
  }

  setBooks(books: Book[]): void {
    this.#booksStore.patchState({ books });
  }

  addBook(book: Book): void {
    this.#booksStore.setState((state) => ({
      ...state,
      books: [...state.books, book],
    }));
  }

  toggleFavorite(id: number): void {
    this.#booksStore.toggleFavorite(id);
  }
}
