import type {MobileAppBridge} from '.';

declare const window: any;

// https://developer.apple.com/documentation/webkit/wkusercontentcontroller/1537172-add
const getIosMessageHandlers = () => window?.webkit?.messageHandlers;
const getIosRequestRiiidMobileService = () => getIosMessageHandlers()?.requestRiiidMobileService;
const getIosRespondRiiidBrowserService = () => getIosMessageHandlers()?.respondRiiidBrowserService;
const getIosRespondErrorRiiidBrowserService = () => getIosMessageHandlers()?.respondErrorRiiidBrowserService;
const getIosRequestRiiidMobileServicePostMessage = () => getIosRequestRiiidMobileService()?.postMessage;
const getIosRespondRiiidBrowserServicePostMessage = () => getIosRespondRiiidBrowserService()?.postMessage;
const getIosRespondErrorRiiidBrowserServicePostMessage = () => getIosRespondErrorRiiidBrowserService()?.postMessage;
const iosAppBridge: MobileAppBridge = {
  get available() {
    return (
      typeof getIosRequestRiiidMobileServicePostMessage() === 'function' &&
      typeof getIosRespondRiiidBrowserServicePostMessage() === 'function'
    );
    // `typeof getIosRespondErrorRiiidBrowserServicePostMessage() === 'function'` 조건도 확인해야 함이 옳으나
    // `respondErrorRiiidBrowserService` 메서드를 제공하지 않는 옛 버전의 네이티브 환경도 지원하기 위해 생략합니다.
  },
  requestMobileService(id, method, message) {
    getIosRequestRiiidMobileServicePostMessage().call(getIosRequestRiiidMobileService(), {id, method, message});
  },
  respondBrowserService(id, message) {
    getIosRespondRiiidBrowserServicePostMessage().call(getIosRespondRiiidBrowserService(), {id, message});
  },
  respondErrorBrowserService(id, errorMessage) {
    getIosRespondErrorRiiidBrowserServicePostMessage().call(getIosRespondErrorRiiidBrowserService(), {
      id,
      errorMessage,
    });
  },
};
export default iosAppBridge;
