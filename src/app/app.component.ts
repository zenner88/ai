import { Component } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ai';
  spinnerStyle = Spinkit;
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  name: any;
  constructor(private storageService: StorageService, private authService: AuthService) { }
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.name = this.storageService.getUser().name;
    console.log(this.isLoggedIn)

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.level_user;
      this.showAdminBoard = this.roles.includes('superadmin');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.username = user.username;
    }
  }
  logout(): void {
    this.authService.logout()
    window.location.reload();
  }
}
