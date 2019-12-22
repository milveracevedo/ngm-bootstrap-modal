import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Optional,
  Type
} from '@angular/core';
import { Observable } from 'rxjs';
import { DialogHolderComponent } from './dialog-holder.component';
import { DialogComponent } from './dialog.component';

export interface DialogOptions {
  index?: number;
  autoCloseTimeout?: number;
  closeByClickingOutside?: boolean;
  backdropColor?: string;
  customFactory?: ComponentFactory<{}>;
}

export class DialogServiceConfig {
  container: HTMLElement = null;
}

@Injectable()
export class DialogService {
  /**
   * Placeholder of modal dialogs
   */
  private dialogHolderComponent: DialogHolderComponent;

  /**
   * HTML container for dialogs
   * type {HTMLElement}
   */
  private container: HTMLElement;

  /**
   * @param resolver resolver
   * @param applicationRef applicationRef
   * @param injector injector
   * @param config config
   */
  constructor(private resolver: ComponentFactoryResolver, private applicationRef: ApplicationRef, private injector: Injector,
              @Optional() config: DialogServiceConfig) {
    this.container = config && config.container;
  }

  /**
   * Adds dialog
   * @return Observable<T1>
   * @param component component
   * @param data data
   * @param options options
   */
  addDialog<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Observable<T1> {
    if (!this.dialogHolderComponent) {
      this.dialogHolderComponent = this.createDialogHolder(options ? options.customFactory : null);
    }
    return this.dialogHolderComponent.addDialog<T, T1>(component, data, options);
  }

  /**
   * Hides and removes dialog from DOM
   * @param component DialogComponent
   */
  removeDialog(component: DialogComponent<any, any>): void {
    if (!this.dialogHolderComponent) {
      return;
    }
    this.dialogHolderComponent.removeDialog(component);
  }

  /**
   * Closes all dialogs
   */
  removeAll(): void {
    this.dialogHolderComponent.clear();
    setTimeout(() => {
      const body = document.querySelector('body');
      if (body && body.classList) {
        body.classList.remove('modal-open');
      }
    }, 1);
  }

  /**
   * Creates and add to DOM dialog holder component
   * @return DialogHolderComponent
   */
  private createDialogHolder(customFactory?: ComponentFactory<{}>): DialogHolderComponent {
    let componentFactory: any = null;

    if (customFactory) {
      componentFactory = customFactory;
    } else {
      componentFactory = this.resolver.resolveComponentFactory(DialogHolderComponent);
    }

    const componentRef = componentFactory.create(this.injector);
    const componentRootNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    if (!this.container) {
      const componentRootViewContainer = this.applicationRef.components[0];
      this.container = (componentRootViewContainer.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }
    this.applicationRef.attachView(componentRef.hostView);

    componentRef.onDestroy(() => {
      this.applicationRef.detachView(componentRef.hostView);
    });
    this.container.appendChild(componentRootNode);

    return componentRef.instance;
  }
}
