import { AuthService } from '@/auth/services/auth.service';
import { FormUtils } from '@/auth/utils/form-utils';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  fb = inject(FormBuilder)
  formsUtils = FormUtils
  authService = inject(AuthService)
  router = inject(Router);

  hasError = signal(false);

  registerForm = this.fb.group({
    email: ['',[Validators.required, Validators.pattern(this.formsUtils.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.pattern(this.formsUtils.namePattern)]]
  })

  onSubmit() {
    if( this.registerForm.invalid ) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      },5000)
      return;
    }

    const { email = '', password = '', fullName = '' } = this.registerForm.value;

    this.authService.register(email!, password!, fullName!).subscribe(
      isRegistered => {
        if (isRegistered) {
          this.router.navigateByUrl('/auth/login');
          return
        }

        this.hasError.set(true);
        setTimeout( () => {this.hasError.set(false)}, 5000);
      }
    )
  }
}
