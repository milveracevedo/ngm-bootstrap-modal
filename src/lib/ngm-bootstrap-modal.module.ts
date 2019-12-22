import { ApplicationRef, ComponentFactoryResolver, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { DialogServiceConfig, DialogService } from './dialog.service';
import { DialogHolderComponent } from './dialog-holder.component';
import { DialogWrapperComponent } from './dialog-wrapper.component';
import { CommonModule } from '@angular/common';

/**
 * Dialog service factory. Creates dialog service with options
 * @param resolver ComponentFactoryResolver
 * @param applicationRef ApplicationRef
 * @param injector Injector
 * @param options DialogServiceConfig
 * @return DialogService
 */
export function dialogServiceFactory(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector,
                                     options: DialogServiceConfig) {
  return new DialogService(resolver, applicationRef, injector, options);
}

@NgModule({
  declarations: [
    DialogHolderComponent,
    DialogWrapperComponent
  ],
  providers: [
    DialogService
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    DialogHolderComponent,
    DialogWrapperComponent
  ]
})
export class NgmBootstrapModalModule {
  static forRoot(config: DialogServiceConfig): ModuleWithProviders {
    return {
      ngModule: NgmBootstrapModalModule,
      providers: [
        {provide: DialogServiceConfig, useValue: config},
        {
          provide: DialogService,
          useFactory: dialogServiceFactory,
          deps: [ComponentFactoryResolver, ApplicationRef, Injector, DialogServiceConfig]
        }
      ]
    };
  }
}
