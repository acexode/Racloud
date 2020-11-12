import {
  Directive,
  Input,
  forwardRef,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { PasswordValidator } from './password-validator';

@Directive({
  selector: '[appPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => PasswordDirective),
      multi: true,
    },
  ],
})
export class PasswordDirective implements Validator, OnInit, OnChanges {
  @Input() repeatCharacter = 4;
  @Input() alphabeticalCharacter = 1;
  @Input() digitCharacter = 1;
  @Input() lowercaseCharacter = 1;
  @Input() uppercaseCharacter = 1;

  private repeatCharacterValidator: ValidatorFn;
  private alphabeticalCharacterValidator: ValidatorFn;
  private digitCharacterValidator: ValidatorFn;
  private lowercaseCharacterValidator: ValidatorFn;
  private uppercaseCharacterValidator: ValidatorFn;
  private onChange: () => void;

  ngOnInit() {
    this.repeatCharacterValidator = PasswordValidator.repeatCharacterRegexRule(
      this.repeatCharacter
    );
    this.alphabeticalCharacterValidator = PasswordValidator.alphabeticalCharacterRule(
      this.alphabeticalCharacter
    );
    this.digitCharacterValidator = PasswordValidator.digitCharacterRule(
      this.digitCharacter
    );
    this.lowercaseCharacterValidator = PasswordValidator.lowercaseCharacterRule(
      this.lowercaseCharacter
    );
    this.uppercaseCharacterValidator = PasswordValidator.uppercaseCharacterRule(
      this.uppercaseCharacter
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    let inputChanged = false;
    if (changes.repeatCharacter) {
      this.repeatCharacterValidator = PasswordValidator.repeatCharacterRegexRule(
        changes.repeatCharacter.currentValue
      );
      inputChanged = changes.repeatCharacter.isFirstChange() ? false : true;
    }

    if (changes.alphabeticalCharacter) {
      this.alphabeticalCharacterValidator = PasswordValidator.alphabeticalCharacterRule(
        changes.alphabeticalCharacter.currentValue
      );
      inputChanged = changes.alphabeticalCharacter.isFirstChange()
        ? false
        : true;
    }

    if (changes.digitCharacter) {
      this.digitCharacterValidator = PasswordValidator.digitCharacterRule(
        changes.digitCharacter.currentValue
      );
      inputChanged = changes.digitCharacter.isFirstChange() ? false : true;
    }

    if (changes.lowercaseCharacter) {
      this.lowercaseCharacterValidator = PasswordValidator.lowercaseCharacterRule(
        changes.lowercaseCharacter.currentValue
      );
      inputChanged = changes.lowercaseCharacter.isFirstChange() ? false : true;
    }

    if (changes.uppercaseCharacter) {
      this.uppercaseCharacterValidator = PasswordValidator.uppercaseCharacterRule(
        changes.uppercaseCharacter.currentValue
      );
      inputChanged = changes.uppercaseCharacter.isFirstChange() ? false : true;
    }

    if (inputChanged) {
      this.onChange();
    }
  }

  validate(c: AbstractControl): ValidationErrors {
    const compose: ValidatorFn = Validators.compose([
      this.repeatCharacterValidator,
      this.digitCharacterValidator,
      this.alphabeticalCharacterValidator,
      this.lowercaseCharacterValidator,
      this.uppercaseCharacterValidator,
    ]);
    return compose(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
