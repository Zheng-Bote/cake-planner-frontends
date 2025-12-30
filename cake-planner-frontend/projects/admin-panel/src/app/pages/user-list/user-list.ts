import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService, User, AuthService } from 'shared-lib'; // <--- Nutzung der Shared Lib

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  cols = ['name', 'email', 'isAdmin', 'active'];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getUsers().subscribe((data) => this.users.set(data));
  }

  toggleUser(user: User, isActive: boolean) {
    // Optimistic UI Update (optional)
    this.adminService.toggleUserActive(user.id, isActive).subscribe({
      next: () => console.log('Status geändert'),
      error: () => {
        alert('Fehler beim Speichern');
        this.loadData(); // Reset bei Fehler
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
