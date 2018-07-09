import {Component, OnDestroy, OnInit, EventEmitter} from '@angular/core';

import { SpinnerService } from './spinner.service';

@Component({
  selector: 'story-spinner',
  template: `
    <div class="overlay" *ngIf="visible" ><div class="spinner" > <i class="fa fa-spinner fa-spin" style="font-size:75px"></i></div></div>`,
  styles: ['.spinner { width: 50px;height: 75px;position: absolute;top: 50%;left: 50%;margin: -28px 0 0 -25px;}' +
    '.overlay {position: fixed;left: 0;top: 0;bottom: 0;right: 0;z-index: 9996;background: rgba(85, 85, 85, 0.71);opacity: 0.9;filter: alpha(opacity=80);}'
  ],
})

export class SpinnerComponent implements OnDestroy, OnInit {
  visible: boolean = false;
  subscription: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private _spinnerService: SpinnerService) { }

  ngOnInit() {
    this.subscription = this._spinnerService.getSpinnerEmitter()
      .subscribe((value: boolean) => { this.visible = value; });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
