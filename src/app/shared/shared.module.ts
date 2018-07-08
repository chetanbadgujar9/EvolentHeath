import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  DataTableModule,
  GrowlModule,
  TooltipModule,
  ConfirmDialogModule
} from 'primeng/primeng';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';
import { MessageService } from './services/message.service';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [SpinnerComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule, SpinnerComponent,
    DataTableModule, GrowlModule,
    TooltipModule, ConfirmDialogModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [SpinnerService, MessageService]
    };
  }
}
