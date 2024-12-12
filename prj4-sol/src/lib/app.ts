import { Errors } from 'cs544-js-utils';

//types defined in library.ts in earlier projects
import * as Lib from 'library-types';


import { NavLinks, LinkedResult, PagedEnvelope, SuccessEnvelope }
  from './response-envelopes.js';

import { makeLibraryWs, LibraryWs } from './library-ws.js';

import { makeElement, makeQueryUrl } from './utils.js';
import { ErrResult } from 'cs544-js-utils/dist/lib/errors.js';

export default function makeApp(wsUrl: string) {
  return new App(wsUrl);
}


class App {
  private readonly wsUrl: string;
  private readonly ws: LibraryWs;

  private readonly result: HTMLElement;
  private readonly errors: HTMLElement;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
    this.ws = makeLibraryWs(wsUrl);
    this.result = document.querySelector('#result');
    this.errors = document.querySelector('#errors');
    //TODO: add search handler
    const searchWidget = document.querySelector<HTMLInputElement>('#search');
    if (searchWidget) {
      searchWidget.addEventListener('blur', async () => {
        const query = searchWidget.value.trim();
        if (query) {
          const searchUrl = makeQueryUrl(`${this.wsUrl}/api/books`, { search: query });
          console.log(`Search URL: ${searchUrl}`);
          await this.searchBooks(searchUrl);
        }
      });
    }
  }

  private clearErrors(): void {
    this.errors.innerHTML = '';
  }

  private async searchBooks(url: URL | string) {
    this.clearErrors();
    this.result.innerHTML = '';
    try {
      const result = await this.ws.findBooksByUrl(url);
      if (result.isOk) {
        const books = result.val.result;
        if (books.length === 0) {
          this.result.textContent = 'No books found.';
          return;
        }
        // Create scroll controls if `prev` or `next` links exist
        const scrollSectionLeft = this.createScrollSection(result.val.links);
        const scrollSectionRight = this.createScrollSection(result.val.links);
        const resultSection = makeElement('ul', { id: 'search-results' });
        for (const book of books) {
          const li = makeElement('li', {}, makeElement('span', { class: 'content' }, book.result.title), makeElement('a', { class: 'details' }, 'details...'));
          // Attach click handler to 'details...' link
          li.querySelector('.details')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showBookDetails(result.val.links.self.href);
          });
          resultSection.append(li);
        }
        this.result.append(scrollSectionLeft, resultSection, scrollSectionRight);
      } else {
        displayErrors((result as ErrResult).errors);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      this.errors.append(makeElement('li', { class: 'error' }, `Error: ${err}`));
    }
  }

  private createScrollSection(links: NavLinks): HTMLElement {
    const scrollDiv = makeElement('div', { class: 'scroll' });
    if (links.prev) {
      const prevLink = makeElement('a', links.prev , '<<');
      prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.loadPage(links.prev.href);
      });
      scrollDiv.append(prevLink);
    }
    if (links.next) {
      const nextLink = makeElement('a', links.next, '>>');
      nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.loadPage(links.next.href);
      });
      scrollDiv.append(nextLink);
    }
    return scrollDiv;
  }

  private async loadPage(url: string) {
    this.clearErrors();
    try {
      const result = await this.ws.findBooksByUrl(url);
      if (result.isOk) {
        this.result.innerHTML = '';
        this.searchBooks(result.val.links.self.href); // Reload the current page
      } else {
        displayErrors((result as ErrResult).errors);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      this.errors.append(makeElement('li', { class: 'error' }, `Error: ${err}`));
    }
  }

  private async showBookDetails(url: string) {
    this.clearErrors();
    try {
      const result = await this.ws.getBookByUrl(url);
      if (result.isOk) {
        const book = result.val.result;
        const details = makeElement('dl', { class: 'book-details' },
          makeElement('dt', {}, 'ISBN'), makeElement('dd', {}, book.isbn),
          makeElement('dt', {}, 'Title'), makeElement('dd', {}, book.title),
          makeElement('dt', {}, 'Authors'), makeElement('dd', {}, book.authors.join('; ')),
          makeElement('dt', {}, 'Number of Pages'), makeElement('dd', {}, book.pages.toString()),
          makeElement('dt', {}, 'Publisher'), makeElement('dd', {}, book.publisher),
          makeElement('dt', {}, 'Number of Copies'), makeElement('dd', {}, book.nCopies.toString()),
          makeElement('dt', {}, 'Borrowers'), makeElement('dd', { id: 'borrowers' })
        );
        this.result.innerHTML = '';
        this.result.append(details);
        this.addCheckoutForm(book.isbn);
      } else {
        displayErrors((result as ErrResult).errors);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      this.errors.append(makeElement('li', { class: 'error' }, `Error: ${err}`));
    }
  }

  private addCheckoutForm(isbn: string) {
    this.clearErrors();
    const form = makeElement('form', { class: 'grid-form' },
      makeElement('label', { for: 'patronId' }, 'Patron ID'),
      makeElement('span', {},
        makeElement('input', { id: 'patronId', type: 'text' }),
        makeElement('span', { class: 'error', id: 'patronId-error' })
      ),
      makeElement('button', { type: 'submit' }, 'Checkout Book')
    );

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const patronIdInput = form.querySelector<HTMLInputElement>('#patronId');
      const patronId = patronIdInput?.value.trim();
      if (!patronId) {
        displayErrors([{ message: 'Patron ID is required.', options: { code: 'REQUIRED_FIELD', widget: 'patronId' } }]);
        return;
      }
  
      const lend: Lib.Lend = { isbn, patronId };
      const result = await this.ws.checkoutBook(lend);
      if (result.isOk) {
        console.log(`Book with ISBN ${isbn} successfully checked out to Patron ${patronId}`);
        await this.updateBorrowers(isbn); // Refresh the borrowers list
      } else {
        displayErrors((result as ErrResult).errors);
      }
    });
    this.result.append(form);
  }

  private async updateBorrowers(isbn: string) {
    this.clearErrors();
    const borrowersSection = document.querySelector('#borrowers');
    if (!borrowersSection) return;  
    const result = await this.ws.getLends(isbn);
    if (result.isOk) {
      const lends = result.val;
      if (lends.length === 0) {
        borrowersSection.innerHTML = 'None';
        return;
      }
  
      const list = makeElement('ul');
      for (const lend of lends) {
        const listItem = makeElement('li', {},
          makeElement('span', { class: 'content' }, lend.patronId),
          makeElement('button', { class: 'return-book' }, 'Return Book')
        );
        const returnButton = listItem.querySelector('return-book');
        if (returnButton) {
          returnButton.addEventListener('click', async () => {
            try {
              await this.ws.returnBook(lend); // Call the returnBook function
              alert(`Book with ISBN ${isbn} returned successfully by patron ${lend.patronId}`);
              await this.updateBorrowers(isbn); // Refresh the borrowers list
            } catch (err) {
              console.error('Error returning book:', err);
              this.errors.append(makeElement('li', { class: 'error' }, `Error: ${err}`));
            }
          });
        }
        list.append(listItem);
      }
      borrowersSection.innerHTML = '';
      borrowersSection.append(list);
    } else {
      displayErrors((result as ErrResult).errors);
    }
  }

} //class App

/** Display errors. If an error has a widget or path widgetId such
 *  that an element having ID `${widgetId}-error` exists,
 *  then the error message is added to that element; otherwise the
 *  error message is added to the element having to the element having
 *  ID `errors` wrapped within an `<li>`.
 */  
function displayErrors(errors: Errors.Err[]) {
  for (const err of errors) {
    const id = err.options.widget ?? err.options.path;
    const widget = id && document.querySelector(`#${id}-error`);
    if (widget) {
      widget.append(err.message);
    }
    else {
      const li = makeElement('li', {class: 'error'}, err.message);
      document.querySelector(`#errors`)!.append(li);
    }
  }
}

//TODO: add functions as needed
