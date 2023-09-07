import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  private titleSubject = new BehaviorSubject<String>('Profile');
  public titleAction$ = this.titleSubject.asObservable();

  constructor() {
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }
}
