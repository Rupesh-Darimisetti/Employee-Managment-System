import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from './Employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Employee Management System';

  displayedColumns: string[] = ['id', 'name', 'location', 'email', 'mobile', 'edit', 'delete'];
  dataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  EmployeeCount: number = 0;
  constructor(private dialog: MatDialog, private api: ApiService) { };

  ngOnInit(): void {
    this.getAllEmployees();
    this.TotalEmployeeCount();
  }
  openDialog() {
    this.dialog.open(AddEmployeeComponent).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllEmployees();
        this.TotalEmployeeCount();
      }
    })
  }

  TotalEmployeeCount() {
    this.api.getEmployeeCount().subscribe({
      next: (count: number) => {
        this.EmployeeCount = count;
      }
    });
  }
  getAllEmployees() {
    this.api.getEmployee().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('error while getting employees')
      }

    });
  }
  // edits the employee
  editEmployee(row: Employee) {
    this.dialog.open(AddEmployeeComponent, {
      data: row
    }).afterClosed().subscribe((val) => {
      if (val == 'update') {
        this.getAllEmployees();
        this.TotalEmployeeCount();
      }
    })
  }
  // deletes employee by id
  deleteEmployee(id: number) {
    this.api.deleteEmployee(id).subscribe({
      next: (res) => {
        alert('Employee deleted Successfuly');
        this.getAllEmployees();
        this.TotalEmployeeCount();
      },
      error: () => {
        alert('error while deleting the Employee ');
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
