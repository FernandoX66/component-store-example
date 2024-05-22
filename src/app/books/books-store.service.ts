import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap } from 'rxjs';
import { BookService } from './book.service';

export interface Book {
  id: number;
  title: string;
  price: number;
  author: string;
  cover: string;
}

export interface BooksStore {
  books: Book[];
  favorites: number[];
}

const initialState: BooksStore = {
  books: [],
  favorites: [1],
};

@Injectable()
export class BooksStoreService extends ComponentStore<BooksStore> {
  readonly #bookService = inject(BookService);

  constructor() {
    super(initialState);
  }

  getAllBooks = this.effect<void>(($) =>
    $.pipe(
      exhaustMap(() => this.#bookService.getAll()),
      tapResponse({
        next: (books) => this.addBooks(books),
        error: (error) => console.error(error),
      })
    )
  );

  readonly addBooks = this.updater((state, books: Book[]) => ({
    ...state,
    books,
  }));

  readonly toggleFavorite = this.updater((state, id: number) => {
    const favoriteAlreadyExists = state.favorites.includes(id);
    if (favoriteAlreadyExists) {
      return this.#removeFavorite(state, id);
    } else {
      return this.#addFavorite(state, id);
    }
  });

  #addFavorite(state: BooksStore, id: number): BooksStore {
    return { ...state, favorites: [...state.favorites, id] };
  }

  #removeFavorite(state: BooksStore, id: number): BooksStore {
    return { ...state, favorites: state.favorites.filter((fav) => fav !== id) };
  }
}
