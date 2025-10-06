import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AdminRoutingModule } from '../+admin/admin.routing';

@Component({
  selector: 'ss-not-found',
  templateUrl: 'not-found.component.html',
  styleUrls: ['not-found.component.scss'],
  imports: [AdminRoutingModule, TranslatePipe]
})

export class NotFoundComponent {
  constructor() { }
}
