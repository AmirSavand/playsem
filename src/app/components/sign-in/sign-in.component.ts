import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/services/auth/auth.service';
import { ApiError } from '@app/interfaces/api-error';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: FormGroup;
  loading = false;
  errors: ApiError = {};

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit(): void {
    /**
     * Setup form
     */
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    this.loading = true;
    this.errors = {};

    this.authService.signIn(this.f.username.value, this.f.password.value).subscribe(null, error => {
      this.loading = false;
      this.errors = error.error as ApiError;
    });
  }

}
