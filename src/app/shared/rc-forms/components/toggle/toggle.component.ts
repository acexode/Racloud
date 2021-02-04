import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToggleComponent,
      multi: true,
    },
  ],
})
export class ToggleComponent implements ControlValueAccessor  {

  @ViewChild('inp', { static: true }) input: ElementRef<HTMLInputElement>;

  onChange = (_: any) => { };

  onTouched = () => { };

  constructor(private _renderer: Renderer2) { }

  writeValue(value: any): void {
    this._renderer.setProperty(this.input.nativeElement, 'checked', value);
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }

  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this.input.nativeElement, 'disabled', isDisabled);
  }

}
