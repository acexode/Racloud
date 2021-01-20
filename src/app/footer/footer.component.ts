import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { FooterService } from '../core/services/footer/footer.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  currentYear: number;
  templateList$ = this.fService.templateStore;

  constructor(
    private fService: FooterService,
    private cdRef: ChangeDetectorRef
  ) {
    this.currentYear = this.getYear();
  }

  ngOnInit(): void {
    this.templateList$.subscribe((v) => this.cdRef.markForCheck());
    console.log(environment.appVersion);
  }

  /**
   * Allows us to get the current year
   */
  public getYear(): number {
    const data = new Date().getFullYear();
    return data;
  }
}
