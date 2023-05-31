import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Employee } from 'src/app/Employee';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  actionBtn: string = 'save';
  phoneLength: number = 10;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editEmployee: Employee,
    private dialogRef: MatDialogRef<AddEmployeeComponent>) { };

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      name: new FormControl('', [Validators.pattern(/^[A-Za-z,.'-]+$/), Validators.minLength(3), Validators.required]),
      location: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      mobile: new FormControl('', [Validators.pattern(/^[0-9]{10}$/), Validators.maxLength(10), Validators.required])
    });
    // display the data in the form
    if (this.editEmployee) {
      this.actionBtn = 'update';
      this.employeeForm.controls['name'].setValue(this.editEmployee.name);
      this.employeeForm.controls['location'].setValue(this.editEmployee.location);
      this.employeeForm.controls['email'].setValue(this.editEmployee.email);
      this.employeeForm.controls['mobile'].setValue(this.editEmployee.mobile);
    }
  }

  addEmployee() {
    if (!this.editEmployee) {
      if (this.employeeForm.valid) {
        this.api.postEmployee(this.employeeForm.value)
          .subscribe({
            next: (res) => {
              alert("Employee added successfully")
              this.employeeForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              alert("Error while adding employee")
            }
          });
      }
    } else {
      this.updateEmployee();
    }
  }
  updateEmployee() {
    this.api.putEmployee(this.employeeForm.value, this.editEmployee.id)
      .subscribe({
        next: (res) => {
          alert('employee updated successfully');
          this.employeeForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert('error updating employee')
        }
      })
  }
}
