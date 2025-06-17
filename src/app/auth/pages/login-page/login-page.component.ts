import { AuthService } from '@/auth/services/auth.service';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  fb = inject(FormBuilder)
  formsUtils = FormUtils
  authService = inject(AuthService)
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['',[Validators.required, Validators.pattern(this.formsUtils.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit() {
    if( this.loginForm.invalid ) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      },5000)
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return
        }

        this.hasError.set(true);
        setTimeout( () => {this.hasError.set(false)}, 5000);
      }
    )
  }
}
