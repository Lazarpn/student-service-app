import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  async error(options: SnackBarErrorOptions) {
    this.showSnackBar(options as SnackBarOptions);
  }

  async info(options: SnackBarOptions) {
    this.showSnackBar(options);
  }

  private async showSnackBar(options: SnackBarOptions) {
    if (!options.actionText) {
      options.actionText = await lastValueFrom(this.translateService.get('label.Close'));
    }

    if (options.timeoutMs === undefined) {
      options.timeoutMs = 6000;
    }

    const snackBar = this.snackBar.open(options.message, options.actionText, {
      panelClass: 'snackBar',
      duration: options.timeoutMs ?? undefined
    });

    if (!options.action) {
      options.action = () => snackBar.dismiss();
    }

    snackBar.onAction().subscribe(() => options.action());
  }
}

export interface SnackBarOptions {
  message?: string;
  actionText?: string;
  action?: () => void;
  timeoutMs?: number | null;
}

export interface SnackBarErrorOptions extends SnackBarOptions {
}
