import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Employee } from '../Employee';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "http://localhost:5000/employeeList/";
  constructor(private http: HttpClient) { }

  postEmployee(data: Employee) {
    return this.http.post<any>(this.apiUrl, data);
  }
  getEmployee() {
    return this.http.get<any>(this.apiUrl);
  }
  putEmployee(data: any, id: number) {
    return this.http.put<any>(this.apiUrl + id, data);
  }
  deleteEmployee(id: number) {
    return this.http.delete<any>(this.apiUrl + id);
  }

  getEmployeeCount() {
    return this.http.get<any>(this.apiUrl).pipe(
      map((employeeList: any[]) => employeeList.length)
    )
  }
}
