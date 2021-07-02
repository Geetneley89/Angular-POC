import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = `${environment.baseUrl}/users`;
  private users: User[] = [];
  private user: User

  constructor(private http: HttpClient) { }

  //gets all users
  getUsers(): Observable<User[]> {
    if(this.users.length > 0){
      return of([...this.users]);
    }
    return this.http.get<User[]>(this.baseUrl).pipe(
      tap(users => this.users = users)
    );
  }

  //gets the user by Id
  getUserById(userId: number): User | undefined {
    return [...this.users].find(user => user.id === userId);
  }

  isManager(userName: string):  boolean{
    const matchingUser = [...this.users].find(user => user.name === userName);
    return matchingUser ? matchingUser.isManager : false;
  }

  //updates the user to be updated in user json
  updateUser(userToUpdate: User): Observable<User[]> {
    let matchingUser = this.users.find(user => user.id === userToUpdate.id);

    if (matchingUser) {
      matchingUser = userToUpdate;
    } else {
      console.log(`No user found to update for id: ${userToUpdate.id}`);
    }
    console.log('The loggedIn user with updated timesheet details', matchingUser);
    return this.http.put<User[]>(this.baseUrl, [matchingUser]);
   
  }
}
