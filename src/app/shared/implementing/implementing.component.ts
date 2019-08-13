import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-implementing',
  templateUrl: './implementing.component.html',
  styleUrls: ['./implementing.component.scss'],
})
export class ImplementingComponent {

  /**
   * Feature name
   */
  @Input() feature = 'This feature';

  /**
   * Column class
   */
  @Input() column = 6;

  constructor() {
  }
}
