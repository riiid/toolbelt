import type {MobileAppBridge} from '.';

declare const window: any;

// https://www.notion.so/riiid/Android-0e4062a7c42d48338099386c64de3fa4
const getAndroidAppBridgeObject = () => window?.appBridge;
const getAndroidRequestRiiidMobileService = () => getAndroidAppBridgeObject()?.requestRiiidMobileService;
const getAndroidRespondRiiidBrowserService = () => getAndroidAppBridgeObject()?.respondRiiidBrowserService;
const getAndroidRespondErrorRiiidBrowserService = () => getAndroidAppBridgeObject()?.respondErrorRiiidBrowserService;
const androidAppBridge: MobileAppBridge = {
  get available() {
    return (
      typeof getAndroidRequestRiiidMobileService() === 'function' &&
      typeof getAndroidRespondRiiidBrowserService() === 'function'
    );
    // `typeof getAndroidRespondErrorRiiidBrowserService() === 'function'` 조건도 확인해야 함이 옳으나
    // `respondErrorRiiidBrowserService` 메서드를 제공하지 않는 옛 버전의 네이티브 환경도 지원하기 위해 생략합니다.
  },
  requestMobileService(id, method, message) {
    getAndroidRequestRiiidMobileService().call(getAndroidAppBridgeObject(), id, method, message);
  },
  respondBrowserService(id, message) {
    getAndroidRespondRiiidBrowserService().call(getAndroidAppBridgeObject(), id, message);
  },
  respondErrorBrowserService(id, errorMessage) {
    getAndroidRespondErrorRiiidBrowserService().call(getAndroidAppBridgeObject(), id, errorMessage);
  },
};
export default androidAppBridge;
