import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {NotifierService} from "angular-notifier";
import {User} from "../model/user";
import {Subscription} from "rxjs";
import {NotificationType} from "../enum/notification-type.enum";
import {HeaderType} from "../enum/header-type.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{
  showLoading: boolean | undefined;
  private subscriptions: Subscription[] = []

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }else {
      this.router.navigateByUrl('/login')
    }
  }

  public onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe({
        next: response => {
          const token = response.headers.get(HeaderType.JWT_TOKEN)
          this.authenticationService.saveToken(token!);
          this.authenticationService.addUserToLocalCache(response.body!);
          this.router.navigateByUrl('/user/management')
          this.showLoading = false
        },
        error: err => {
          console.log(err)
          this.sendErrorNotification(NotificationType.ERROR, err.error.message)
          this.showLoading = false
        }
        }
      )
    )

  }

  private sendErrorNotification(notificationType: NotificationType, message: string) {
    if (message) {
      this.notifierService.notify(notificationType, message)
    }else {
      this.notifierService.notify(notificationType, 'AN ERROR OCCURED. PLEASE TRY AGAIN')
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
