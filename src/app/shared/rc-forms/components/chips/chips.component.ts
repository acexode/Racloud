import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChipsComponent,
      multi: true,
    },
  ],
})
export class ChipsComponent implements OnInit {

  @Input() name: string;
  @Input() color: string;
  @Input() disabled: string;
  @Output() chipClickEvent: EventEmitter<any> = new EventEmitter(null);
  defaultText = 'Default';

  chipClasses = {
    default: 'default',
    selected: 'selected',
  };
  text = this.defaultText;
  formGroup = this.fb.group({
    chip: this.fb.control(null),
  });

  onChange: (_: any) => void;
  onTouched: () => void;
  value: any;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) { }

  get chipsClass() {
    return this.color ?? this.chipClasses.default;
  }

  get isDisabled() {
    return this.disabled ?? false;
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.formGroup.setValue({ radio: obj });
    this.formGroup.updateValueAndValidity();
    this.cdRef.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable({ emitEvent: true });
    } else {
      this.formGroup.enable({ emitEvent: true });
    }
    this.cdRef.markForCheck();
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
      }
    });
  }

  getFieldValue() {
    const field = this.formGroup.get('chip');
    return field ? field.value : null;
  }
  onClickButton() {
    this.chipClickEvent.emit(null);
  }

}
