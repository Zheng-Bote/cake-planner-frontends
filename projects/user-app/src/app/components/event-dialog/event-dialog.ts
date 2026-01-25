/**
 * @file event-dialog.ts
 * @brief Component for the dialog to create or edit a cake event.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
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
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    provideTranslocoScope({ scope: 'event', alias: 'event' }),
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslocoModule,
  ],
  templateUrl: './event-dialog.html',
  styleUrl: './event-dialog.scss',
})
export class EventDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EventDialogComponent>);

  selectedFile: File | null = null;

  // CORRECTION: bakerName removed. The backend takes the user from the token.
  form = this.fb.group({
    date: [new Date(), Validators.required],
    description: [''],
  });

  /**
   * @brief Constructs the component and initializes the form with the provided date.
   * @param data The data injected into the dialog, containing the date for the event.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { date: Date }) {
    if (data?.date) {
      this.form.patchValue({ date: data.date });
    }
  }

  /**
   * @brief Handles the file selection for the event image.
   * @param event The file selection event.
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  /**
   * @brief Saves the event data and closes the dialog.
   */
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

  /**
   * @brief Cancels the dialog.
   */
  cancel() {
    this.dialogRef.close();
  }
}