import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  public getConfig() {
    return environment;
  }

  private getConfigKey(k: string) {
    const config = this.getConfig();
    return config.hasOwnProperty(k) ? config[k] : null;
  }

  public getRecaptchaKey() {
    return this.getConfigKey('recaptchaKey');
  }

  public getFakeBackendConfig() {
    return this.getConfigKey('fakeBackend');
  }
  public getServerUrlConfig() {
    return this.getConfigKey('serverUrl');
  }
}
