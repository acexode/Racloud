import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountriesModel } from './core/models/countries-model';
import { AuthService } from './core/services/auth/auth.service';
import { CountriesService } from './core/services/countries/countries.service';
import { FooterService } from './core/services/footer/footer.service';
import { TitleService } from './core/services/title/title.service';
import { MessagesService } from './shared/messages/services/messages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('footer', { static: true }) footer: TemplateRef<any>;
  title = 'ra-cloud';
  currentYear: number;
  account = this.authS.getAccountData();
  notFound = false;

  /* shoul be removed later */
  showSideHeaderAndFooter = false;
  noSideBarAndHeader = ['Login', 'signup', 'not-found', 'access-denied'];
  /*  */
  getCountriesState$: Subscription;
  loadCountriesState$: Subscription;
  constructor(
    private authS: AuthService,
    private titleService: TitleService,
    private footerS: FooterService,
    private cdref: ChangeDetectorRef,
    private countriesS: CountriesService,
    private msgS: MessagesService,
  ) {
    this.currentYear = this.getYear();
    this.titleService.handleNavigationTitle();
  }
  ngAfterViewInit() {
    this.footerS.addComponentToStore('footer', this.footer, '');
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.getCountriesState$ = this.countriesS.getCountriesState().subscribe(
      (res: CountriesModel) => {
        if (res.data === null) {
          this.loadCountriesState$ = this.countriesS.loadCountries().subscribe(
            _res => { },
            _err => {
              this.msgS.addMessage({
                text: 'Please Check your Network and reload. We encounter some issues while trying to load some data for you',
                type: 'danger',
                dismissible: true,
                customClass: 'mt-32',
                hasIcon: true,
              });
            }
          );
        }
      }
    );
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
  ngOnDestroy(): void {
    this.getCountriesState$.unsubscribe();
    if (this.loadCountriesState$) {
      this.loadCountriesState$.unsubscribe();
    }
  }
}
