import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent {

  constructor(private api: ApiService) { }

  // Mock users list — replace with API data via service
  users: UserRow[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Manager', active: true },
    { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', role: 'User', active: false }
  ];

  onCreateUser() {
    // Replace with navigation to create user page or open modal
    console.log('Create user clicked');

    const newUser = {
      "email": "shemil2@example.com",
      "passcode": "1234",
      "phone_number": "+919876545563",
      "role": "EX",
      "username": "shemil"
    }

    this.api.post('users', newUser).subscribe({
      next: (response: any) => {
        console.log('User created successfully', response);

        // {
        //     "status_code": 201,
        //     "message": "User created successfully",
        //     "data": {
        //         "user_id": "EX-88e06808-8a3e-4110-b4b2-a86085352333",
        //         "username": "shemil",
        //         "email": "shemil@example.com",
        //         "phone_number": "+919876545633",
        //         "role": "EX",
        //         "status": "ACTIVE"
        //     }
        // }

      },
      error: (error) => {
        console.error('User creation failed', error);
      }
    });


  }

  onEditUser(user: UserRow) {
    // Replace with navigation to edit page or open edit modal
    console.log('Edit user', user);
  }

  ngOnInit() {
    console.log('SuperAdminComponent initialized');
    this.fetchUsers();
  }

  fetchUsers() {
    this.api.get('projects').subscribe({
      next: (response: any) => {
        console.log('User created successfully', response);

        // {
        //     "status_code": 201,
        //     "message": "User created successfully",
        //     "data": {
        //         "user_id": "EX-88e06808-8a3e-4110-b4b2-a86085352333",
        //         "username": "shemil",
        //         "email": "shemil@example.com",
        //         "phone_number": "+919876545633",
        //         "role": "EX",
        //         "status": "ACTIVE"
        //     }
        // }

      },
      error: (error) => {
        console.error('User creation failed', error);
      }
    });
  }

}
