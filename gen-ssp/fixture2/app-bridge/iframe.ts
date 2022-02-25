import {MobileAppBridge} from './types';

const iframeAppBridge: MobileAppBridge = {
  get available() {
    return window.self !== window.parent;
  },
  requestMobileService(id, method, message) {
    window.parent.postMessage(['requestRiiidMobileService', [id, method, message]], '*');
  },
  respondBrowserService(id, message) {
    window.parent.postMessage(['respondRiiidBrowserService', [id, message]], '*');
  },
  respondErrorBrowserService(id, errorMessage) {
    window.parent.postMessage(['respondErrorRiiidBrowserService', [id, errorMessage]], '*');
  },
};
export default iframeAppBridge;
