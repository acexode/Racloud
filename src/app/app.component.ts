import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { FooterService } from './core/services/footer/footer.service';
import { TitleService } from './core/services/title/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ra-cloud';
  currentYear: number;
  account = this.authS.getAccountData();
  notFound = false;

  constructor(private authS: AuthService, private titleService: TitleService ) {
    this.currentYear = this.getYear();
    this.titleService.handleNavigationTitle();
  }

  ngOnInit(): void {
    this.titleService.handleNavigationTitle().subscribe((v) => {
      if (v && v === 'Not found') {
        this.notFound = true;
      } else {
        this.notFound = false;
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
