import {
  Component,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  ReflectiveInjector,
  Type,
  ComponentFactory,
  Provider,
  Injector,
  ResolvedReflectiveProvider
} from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-wrapper',
  template: `
      <div #container class="modal fade" style="display:block !important;" role="dialog">
          <ng-template #element></ng-template>
      </div>
  `
})
export class DialogWrapperComponent {

  /**
   * Target element to insert dialog content component
   */
  @ViewChild('element', {static: true, read: ViewContainerRef}) public element: ViewContainerRef;

  /**
   * Link container DOM element
   */
  @ViewChild('container', {static: true}) public container;

  /**
   * Dialog content componet
   */
  private content: DialogComponent<any, any>;

  /**
   * Constructor
   * @param resolver resolver
   * @param dialogService dialogService
   */
  constructor(private resolver: ComponentFactoryResolver, private dialogService: DialogService) {
  }

  /**
   * Adds content dialog component to wrapper
   * @return DialogComponent
   * @param component component
   * @param customFactory customFactory
   */
  addComponent<T, T1>(component: Type<DialogComponent<T, T1>>, customFactory?: ComponentFactory<{}>) {
    const factory = customFactory || this.resolver.resolveComponentFactory(component);
    const injector = ReflectiveInjector.fromResolvedProviders([], this.element.injector);
    const componentRef = factory.create(injector);
    this.element.insert(componentRef.hostView);
    this.content = componentRef.instance as DialogComponent<T, T1>;
    this.content.wrapper = this;
    return this.content;
  }

  /**
   * Registers event handler to close dialog by click on backdrop
   */
  closeByClickOutside() {
    const containerEl = this.container.nativeElement;
    containerEl.querySelector('.modal-content').addEventListener('click', (event) => {
      event.stopPropagation();
    });
    containerEl.addEventListener('click', () => {
      this.dialogService.removeDialog(this.content);
    }, false);
  }
}
