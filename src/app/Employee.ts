import { EmailValidator } from "@angular/forms";

export interface Employee {
    id: number;
    name: string;
    location: string;
    email: EmailValidator;
    mobile: number;
}