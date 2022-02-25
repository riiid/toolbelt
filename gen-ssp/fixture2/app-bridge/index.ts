import {MobileAppBridge} from './types';
import iosAppBridge from './ios';
import androidAppBridge from './android';
import iframeAppBridge from './iframe';

export function getAppBridge(): MobileAppBridge {
  for (const appBridge of [iosAppBridge, androidAppBridge, iframeAppBridge]) {
    if (appBridge.available) return appBridge;
  }
  throw new Error('app bridge not found');
}
