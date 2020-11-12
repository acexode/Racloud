import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.scss'],
})
export class ErrorMessagesComponent implements OnInit {
  private genKey = 'generic_error';
  private readonly errorMessages = {
    required: () => 'Campul este obligatoriu',
    minlength: (params) =>
      'Numarul minim de caractere este ' + params.requiredLength,
    maxlength: (params) =>
      'Numarul maxim de caractere este ' + params.requiredLength,
    email: (params) => 'Valoare email invalida.',
    equalTo: (params) => 'Parolele nu corespund.',
    pattern: (pattern) => this.handlePattern(pattern),
    generic_error: (params) => 'Eroare valori camp',
    lowercaseCharacterRule: (params) =>
      'Numarul minim de litere mici este ' + params.required,
    digitCharacterRule: (params) =>
      'Numarul minim de cifre este ' + params.required,
    uppercaseCharacterRule: (params) =>
      'Numarul minim de litere mari este ' + params.required,
    specialCharacterRule: (params) =>
      'Numarul minim de caractere speciale este ' + params.required,
  };

  @Input()
  control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return (
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors).map((field) =>
      this.getMessage(field, this.control.errors[field])
    );
  }

  private getMessage(type: string, params: any) {
    return this.errorMessages[type]
      ? this.errorMessages[type](params)
      : this.errorMessages[this.genKey](params);
  }

  constructor() {}

  ngOnInit(): void {}

  handlePattern(pattern) {
    const rP =
      pattern && pattern.hasOwnProperty('requiredPattern')
        ? RegExp(pattern.requiredPattern).source.toString()
        : null;

    const strongPass = RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
    ).source.toString();

    switch (rP) {
      case strongPass:
        return 'Valori acceptate: 0-9';
      default:
        return 'Eroare valori camp';
    }
  }
}
