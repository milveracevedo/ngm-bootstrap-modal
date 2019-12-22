import { OnDestroy } from '@angular/core';
import { DialogService } from './dialog.service';
import { Observable, Observer } from 'rxjs';
import { DialogWrapperComponent } from './dialog-wrapper.component';

/**
 * Abstract dialog
 * @template T - dialog data;
 * @template T1 - dialog result
 */
export class DialogComponent<T, T1> implements OnDestroy {

  /**
   * Observer to return result from dialog
   */
  private observer: Observer<T1>;

  /**
   * Dialog result
   */
  protected result: T1;

  /**
   * Dialog wrapper (modal placeholder)
   */
  wrapper: DialogWrapperComponent;

  /**
   * Constructor
   * @param dialogService - instance of DialogService
   */
  constructor(protected dialogService: DialogService) {
  }

  /**
   *
   * @param data T
   * @return Observable<T1>
   */
  fillData(data: T): Observable<T1> {
    data = data || {} as T;
    const keys = Object.keys(data);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      this[key] = data[key];
    }
    return Observable.create((observer) => {
      this.observer = observer;
      return () => {
        this.close();
      };
    });
  }

  /**
   * Closes dialog
   */
  close(): void {
    this.dialogService.removeDialog(this);
  }

  /**
   * OnDestroy handler
   * Sends dialog result to observer
   */
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.next(this.result);
    }
  }
}
