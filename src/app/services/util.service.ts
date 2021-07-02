import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  openweathermapApiUrl: string = `${environment.openweathermapApiUrl}`;
  openweathermapApiId: string = `${environment.openweathermapApiId}`;

  constructor(private http: HttpClient) { }

  getCurrentTemperature(lat: number, lon: number): Observable<any> {
    var params = new HttpParams()
      .set('lat', String(lat))
      .set('lon', String(lon))
      .set('appid', this.openweathermapApiId);

    return this.http.get(this.openweathermapApiUrl, {params});
  }
}
