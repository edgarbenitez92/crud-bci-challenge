import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../environments/environment';
import { Country } from '../shared/interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private readonly http = inject(HttpClient);

  searchCountries(name: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${environment.apiUrl}/name/${name}`).pipe(
      map(countries => countries.sort((a, b) => a.name.common.localeCompare(b.name.common)))
    );
  }

  getCountryByName(name: string): Observable<Country> {
    return this.http.get<Country[]>(`${environment.apiUrl}/name/${name}?fullText=true`).pipe(
      map(countries => countries[0])
    );
  }
} 