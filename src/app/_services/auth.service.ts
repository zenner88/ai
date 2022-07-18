import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlTree, Router } from '@angular/router';
import { StorageService } from './storage.service';

const AUTH_API = 'http://202.67.10.238:5000/cc/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private auth: StorageService, private router: Router) {}
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login_user',
      {
        username,
        password,
      },
      httpOptions
    );
  }
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }
  logout() {
    window.sessionStorage.clear();
    this.router.navigate(['/login'])
    window.location.reload();

  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.auth.isLoggedIn()) {
        return true;
      }
      // Swal.fire({  
      //   icon: 'error',  
      //   title: 'Please Login!',  
      //   text: 'You don\'t have permission to view this page',  
      //   background: '#000000',
      // }).then(function() {
      //   window.location.reload();
      // });
      return false;
  }
}