import { Injectable, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  RemoteConfig,
  fetchAndActivate,
  getRemoteConfig,
  getBoolean,
  getNumber,
  getString,
  getValue,
} from 'firebase/remote-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private remoteConfig: RemoteConfig;
  private app: FirebaseApp = inject(FirebaseApp);

  constructor() {
    this.remoteConfig = getRemoteConfig(this.app);
    this.remoteConfig.defaultConfig = {
      "title": "BEZEJMENA",
      "subtitle": "Závěrečná víkendovka OHB 2024/2025",
      "eventStart": "2025-05-07T04:00:00Z",
      "showTaskEnd": "true",
    };
    this.remoteConfig.settings.minimumFetchIntervalMillis
        = environment.configFetchIntervalMillis;
  }

  async initializeConfig(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      console.log('Remote config fetched and activated');
    } catch (error) {
      console.error('Error fetching remote config:', error);
    }
  }

  getValue(key: string) {
    return getValue(this.remoteConfig, key);
  }

  getBoolean(key: string) {
    return getBoolean(this.remoteConfig, key);
  }

  getNumber(key: string) {
    return getNumber(this.remoteConfig, key);
  }

  getString(key: string) {
    return getString(this.remoteConfig, key);
  }

  getEventStart() : Date {
    return new Date(this.getString('eventStart'));
  }
}
