import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AdminRoutingModule } from '../+admin/admin.routing';
import { ButtonComponent } from '../shared/button/button.component';
import { LS_USER_LANGUAGE } from '../shared/constants';
import { IconComponent } from '../shared/icon/icon.component';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'ss-header',
  imports: [AdminRoutingModule, IconComponent, ButtonComponent, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public accountService: AccountService,
    private router: Router,
    private translateService: TranslateService
  ) { }

  goToSignIn() {
    this.router.navigate(['sign-in']);
  }

  changeLanguage(language: 'en' | 'rs') {
    this.translateService.setDefaultLang(language);
    localStorage.setItem(LS_USER_LANGUAGE, language);
    this.translateService.use(language);
  }
}
