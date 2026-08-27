import { Component, inject, signal } from "@angular/core";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MessageService } from "primeng/api";
import { AuthService } from "../../../core/services/auth";
import { CommonModule } from "@angular/common";

// PrimeNG Modules
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: "./register.html",
  providers: [MessageService],
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  isLoading = signal(false);

  // Added a 'name' field for registration
  registerForm = this.fb.group({
    name: this.fb.control<string>("", {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: this.fb.control<string>("", {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control<string>("", {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const credentials = this.registerForm.getRawValue();

    // Call the register method on your AuthService
    this.authService.register(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: "success",
          summary: "Account Created",
          detail: "Successfully registered! Redirecting to login...",
        });
        
        // Wait 1.5 seconds so the user can actually read the success toast before navigating
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: "error",
          summary: "Registration Failed",
          detail: err.error?.message || "Could not create account.",
        });
      },
    });
  }
}