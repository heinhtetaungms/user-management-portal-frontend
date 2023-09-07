import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {NotifierService} from "angular-notifier";
import {User} from "../model/user";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../enum/notification-type.enum";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  showLoading: boolean | undefined;
  private subscriptions: Subscription[] = []

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }

  public onRegister(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe({
          next: (response: User) => {
            this.showLoading = false;
            this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.firstName}.
            Please check your email for password to log in.`);
            },
          error: (err: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, err?.error?.message)
            this.showLoading = false
          }
        }
      )

    )

  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notifierService.notify(notificationType, message)
    }else {
      this.notifierService.notify(notificationType, 'An error occured. Please try again.')
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
