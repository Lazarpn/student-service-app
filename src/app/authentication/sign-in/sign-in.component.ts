import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SignInModel } from '../../shared/models/user';
import { AccountService } from '../../shared/services/account.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'ss-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['sign-in.component.scss'],
  imports: [TranslatePipe, InputComponent, FormsModule, ButtonComponent]
})

export class SignInComponent {
  model = {} as SignInModel;

  isSigningIn: boolean = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private notification: NotificationService
  ) { }

  signIn() {
    this.isSigningIn = true;

    this.accountService.signIn(this.model).subscribe({
      next: () => {
        this.router.navigate(['/home/departments']).then(() => this.notification.info({ message: `Zdravo ${this.model.email}!` }));
        this.isSigningIn = false;
      },
      error: () => {
        this.notification.info({ message: `Neispravni kredencijali!` });
        this.isSigningIn = false;
      },
    });
  }
}
