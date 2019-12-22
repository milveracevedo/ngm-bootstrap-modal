import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogWrapperComponent } from './dialog-wrapper.component';
import { DialogOptions } from './dialog.service';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-holder',
  template: '<ng-template #element></ng-template>',
})
export class DialogHolderComponent {

  /**
   * Target element to insert dialogs
   */
  @ViewChild('element', {static: true, read: ViewContainerRef}) public element: ViewContainerRef;

  /**
   * Array of dialogs
   */
  dialogs: Array<DialogComponent<any, any>> = [];

  /**
   * Constructor
   * @param resolver ComponentFactoryResolver
   */
  constructor(private resolver: ComponentFactoryResolver) {
  }

  /**
   * Adds dialog
   * @param component Type<DialogComponent>
   * @param data object?
   * @param options DialogOptions?
   * @return Observable<*>
   */
  addDialog<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Observable<T1> {
    options = options || {} as DialogOptions;
    const factory = this.resolver.resolveComponentFactory(DialogWrapperComponent);
    const componentRef = this.element.createComponent(factory, options.index);
    const dialogWrapper: DialogWrapperComponent = componentRef.instance as DialogWrapperComponent;
    // tslint:disable-next-line:variable-name
    const _component: DialogComponent<T, T1> = dialogWrapper.addComponent(component, options.customFactory);
    if (typeof (options.index) !== 'undefined') {
      this.dialogs.splice(options.index, 0, _component);
    } else {
      this.dialogs.push(_component);
    }
    setTimeout(() => {
      dialogWrapper.container.nativeElement.classList.add('show');
      dialogWrapper.container.nativeElement.classList.add('in');
    });
    if (options.autoCloseTimeout) {
      setTimeout(() => {
        this.removeDialog(_component);
      }, options.autoCloseTimeout);
    }
    if (options.closeByClickingOutside) {
      dialogWrapper.closeByClickOutside();
    }
    if (options.backdropColor) {
      dialogWrapper.container.nativeElement.style.backgroundColor = options.backdropColor;
    }
    return _component.fillData(data);
  }

  /**
   * Removes dialog
   * @param component DialogComponent
   */
  removeDialog(component: DialogComponent<any, any>) {
    const element = component.wrapper.container.nativeElement;

    element.classList.remove('show');
    element.classList.remove('in');
    setTimeout(() => {
      this._removeElement(component);
    }, 300);
  }

  private _removeElement(component) {
    const index = this.dialogs.indexOf(component);
    if (index > -1) {
      this.element.remove(index);
      this.dialogs.splice(index, 1);
    }
  }

  clear() {
    this.element.clear();
    this.dialogs = [];
  }
}
