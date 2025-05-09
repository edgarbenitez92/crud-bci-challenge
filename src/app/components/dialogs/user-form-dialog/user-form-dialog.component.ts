import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { CountriesService } from '../../../services/countries.service';
import { Country } from '../../../shared/interfaces/country.interface';
import { SnackBarService } from '../../../services/snack-bar.service';
import { User } from '../../../shared/interfaces/user.interface';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss'
})
export class UserFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  private readonly usersService = inject(UsersService);
  private readonly countriesService = inject(CountriesService);
  private readonly snackBarService = inject(SnackBarService);
  readonly data: User | undefined = inject(MAT_DIALOG_DATA);

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    country: ['', Validators.required],
    region: [''],
    enable: [true]
  });

  isLoading = signal<boolean>(false);
  countries = signal<Country[]>([]);
  isSearchingCountries = signal<boolean>(false);

  constructor() {
    // Initialize form if editing
    if (this.data) this.userForm.patchValue(this.data);

    // Country search on value change
    this.onCountryValueChange();
  }

  onCountryValueChange(): void {
    this.countryControl?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => value?.length > 1),
      switchMap(value => {
        this.isSearchingCountries.set(true);
        return this.countriesService.searchCountries(value).pipe(
          catchError(() => {
            this.countries.set([]);
            this.countryControl?.setErrors({ notFound: true });

            // Show error notification
            this.snackBarService.showErrorNotification('Country not found. Please try with another country.');

            // Return empty observable to continue the flow
            return of([]);
          }),
          finalize(() => this.isSearchingCountries.set(false))
        );
      })
    ).subscribe(countries => {
      this.countryControl?.setErrors(countries.length === 0 ? { notFound: true } : null);
      this.countries.set(countries);
    });
  }

  onCountrySelected(event: MatAutocompleteSelectedEvent): void {
    const country = this.countries().find(c => c.name.common === event.option.value);
    if (country) this.regionControl?.setValue(country.region);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBarService.showErrorNotification('Please fill in all fields correctly');
      return;
    }

    const userFormValue = this.userForm.value;
    this.isLoading.set(true);

    // Validate country and then create/update user
    this.countriesService.getCountryByName(userFormValue.country).pipe(
      switchMap(country => {
        if (!country) {
          throw new Error('Country not found');
        }

        const userData = {
          name: userFormValue.name.trim(),
          lastname: userFormValue.lastname.trim(),
          email: userFormValue.email.trim(),
          country: userFormValue.country,
          region: country.region,
          enable: userFormValue.enable,
          createdAt: new Date()
        };

        return this.data
          ? this.usersService.updateUser(this.data.id, userData)
          : this.usersService.createUser(userData);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: () => {
        const snackBarMessage = this.data ? 'User updated successfully' : 'User created successfully';
        this.snackBarService.showSuccessNotification(snackBarMessage);
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);

        if (error.status === 404) {
          this.snackBarService.showErrorNotification('Country not found. Please select a valid country from the list.');
          return;
        }

        this.snackBarService.showErrorNotification('Error processing request, please try again later.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Form Control Getters
  get nameControl(): AbstractControl | null { return this.userForm.get('name'); }
  get lastnameControl(): AbstractControl | null { return this.userForm.get('lastname'); }
  get emailControl(): AbstractControl | null { return this.userForm.get('email'); }
  get countryControl(): AbstractControl | null { return this.userForm.get('country'); }
  get regionControl(): AbstractControl | null { return this.userForm.get('region'); }
  get enableControl(): AbstractControl | null { return this.userForm.get('enable'); }

  // Error Message Getters
  get nameErrorMessage(): string {
    if (!this.nameControl?.errors) return '';
    if (this.nameControl.errors['required']) return 'Name is required';
    if (this.nameControl.errors['minlength']) return 'Name must be at least 2 characters';
    return '';
  }

  get lastnameErrorMessage(): string {
    if (!this.lastnameControl?.errors) return '';
    if (this.lastnameControl.errors['required']) return 'Last name is required';
    if (this.lastnameControl.errors['minlength']) return 'Last name must be at least 2 characters';
    return '';
  }

  get emailErrorMessage(): string {
    if (!this.emailControl?.errors) return '';
    if (this.emailControl.errors['required']) return 'Email is required';
    if (this.emailControl.errors['email']) return 'Please enter a valid email';
    return '';
  }

  get countryErrorMessage(): string {
    if (!this.countryControl?.errors) return '';
    if (this.countryControl.errors['required']) return 'Country is required';
    if (this.countryControl.errors['notFound']) return 'Country not found. Please try with another country.';
    return '';
  }
}
