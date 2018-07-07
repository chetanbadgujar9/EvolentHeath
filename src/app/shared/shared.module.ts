import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthHttp } from './services/authHttp.service';
import {
  CalendarModule,
  DataTableModule,
  GrowlModule,
  TooltipModule,
  RadioButtonModule,
  CheckboxModule,
  ConfirmDialogModule,
  ProgressBarModule,
  AutoCompleteModule,
  InputMaskModule
} from 'primeng/primeng';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';
import { MessageService } from './services/message.service';
import { CommonService } from './services/common.service';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [SpinnerComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule, SpinnerComponent,
    CalendarModule, DataTableModule, GrowlModule,
    TooltipModule, RadioButtonModule, CheckboxModule,
    ConfirmDialogModule, ProgressBarModule,
    AutoCompleteModule,InputMaskModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [AuthHttp, SpinnerService, MessageService, CommonService]
    };
  }
}
