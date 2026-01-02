import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco'; // <--- WICHTIG

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslocoModule, // <--- WICHTIG
  ],
  templateUrl: './event-dialog.html',
  styleUrl: './event-dialog.scss',
})
export class EventDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EventDialogComponent>);

  selectedFile: File | null = null;

  form = this.fb.group({
    date: [new Date(), Validators.required],
    description: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { date: Date }) {
    if (data?.date) {
      this.form.patchValue({ date: data.date });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  save() {
    if (this.form.valid) {
      const rawVal = this.form.value;
      const formattedDate = format(rawVal.date!, 'yyyy-MM-dd');

      this.dialogRef.close({
        event: {
          date: formattedDate,
          description: rawVal.description,
        },
        file: this.selectedFile,
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
