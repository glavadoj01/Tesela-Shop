import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
})
export class FormErrorLabelComponent {

  control = input.required<AbstractControl | null>();

  get errorMessage() {
    if (!this.control()) return null;

    const errors: ValidationErrors = this.control()!.errors || {};

    return this.control()!.touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)
      : null
  }
}
