import {RespondErrorFn, RespondFn} from '../client/types';
import {RequestFn} from '../server/types';

export interface MobileAppBridge {
  available: boolean;
  requestMobileService: RequestFn;
  respondBrowserService: RespondFn;
  respondErrorBrowserService: RespondErrorFn;
}
