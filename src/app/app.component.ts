import { Component, NgZone, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HeaderComponent } from './header/header.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'ss-root',
  imports: [RouterOutlet, SpinnerComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showLoadingSpinner = true;

  constructor(private zone: NgZone, private translate: TranslateService) {
    this.translate.addLangs(['rs']);
    this.translate.setDefaultLang('rs');
    this.translate.use('rs');
  }

  ngOnInit(): void {
    this.zone.onStable.subscribe(() => {
      this.showLoadingSpinner = false;
    });
  }
}
