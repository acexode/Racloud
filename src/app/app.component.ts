import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { FooterService } from './core/services/footer/footer.service';
import { TitleService } from './core/services/title/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('footer', { static: true }) footer: TemplateRef<any>;
  title = 'ra-cloud';
  currentYear: number;
  account = this.authS.getAccountData();
  notFound = false;

  /* shoul be removed later */
  showSideHeaderAndFooter = false;
  noSideBarAndHeader = ['Login', 'signup', 'not-found', 'access-denied'];
  /*  */
  constructor(
    private authS: AuthService,
    private titleService: TitleService,
    private footerS: FooterService,
    private cdref: ChangeDetectorRef,
  ) {
    this.currentYear = this.getYear();
    this.titleService.handleNavigationTitle();
  }
  ngAfterViewInit() {
    this.footerS.addComponentToStore('footer', this.footer, '');
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.titleService.handleNavigationTitle().subscribe((v) => {
      if (v && v === 'Not found') {

        this.notFound = true;
      }
      else if (v && v === 'Access Denied') {
        this.notFound = true;
      }
      else {
        this.notFound = false;
        if (this.noSideBarAndHeader.includes(v)) {
          this.showSideHeaderAndFooter = false;
        } else {
          this.showSideHeaderAndFooter = true;
        }
      }
    });
  }
  /**
   * Allows us to get the current year
   */
  public getYear(): number {
    const data = new Date().getFullYear();
    return data;
  }
}
