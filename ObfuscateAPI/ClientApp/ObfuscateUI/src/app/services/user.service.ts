import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { EncryptedHttpService } from './encrypted-http.service';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = "User/";
  userEndpoint: string = "User"
  constructor(private http: HttpClient, private encryptedHttp: EncryptedHttpService) { }

  getUsers(): Observable<Users[]>{
    return this.encryptedHttp.get<Users[]>(`${this.userEndpoint}`).pipe(catchError(this.handleError('getUsers', [])));
  }

  postUser(user: Users): Observable<Users>{
    return this.encryptedHttp.post<Users>(this.userEndpoint, user).pipe(catchError(this.handleError<Users>('postUsers')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
