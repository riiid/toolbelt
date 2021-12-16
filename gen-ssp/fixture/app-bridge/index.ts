import iosAppBridge from './ios';
import androidAppBridge from './android';
import iframeAppBridge from './iframe';

export const browserServiceMethodTable: BrowserServiceMethodTable = {};

export function getAppBridge(): MobileAppBridge {
  for (const appBridge of [iosAppBridge, androidAppBridge, iframeAppBridge]) {
    if (appBridge.available) return appBridge;
  }
  throw new Error('app bridge not found');
}

export function requestRiiidMobileService<T, Req = any, Res = any>(
  method: string,
  message: string,
  requestType: Req,
  responseType: Res
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const appBridge = getAppBridge();
      const id = requestRiiidMobileService.reqId++;
      requestRiiidMobileService.reqTable[id] = {
        method,
        requestType,
        responseType,
        resolve,
        reject,
      };
      appBridge.requestMobileService(id, method, message);
    } catch (err) {
      reject(err);
    }
  });
}
requestRiiidMobileService.reqTable = {} as ReqTable;
requestRiiidMobileService.reqId = 0;

export const respondRiiidMobileService: RespondFn = (id, message) => {
  const req = requestRiiidMobileService.reqTable[id];
  if (!req) throw new Error('unknown app bridge request id: ' + id);
  const res = req.responseType.decode(Buffer.from(message, 'base64'));
  req.resolve(res.toJSON());
  delete requestRiiidMobileService.reqTable[id];
};
export const respondErrorRiiidMobileService: RespondErrorFn = (id, errorMessage) => {
  const req = requestRiiidMobileService.reqTable[id];
  if (!req) throw new Error('unknown app bridge request id: ' + id);
  req.reject(new Error(errorMessage));
  delete requestRiiidMobileService.reqTable[id];
};
export const requestRiiidBrowserService: RequestFn = async (id, method, message) => {
  const appBridge = getAppBridge();
  const browserServiceMethod = browserServiceMethodTable[method];
  if (!browserServiceMethod) throw new Error('unknown app bridge method: ' + method);
  try {
    const response = await browserServiceMethodTable[method](message);
    appBridge.respondBrowserService(id, response);
  } catch (error) {
    if (error instanceof Error) {
      appBridge.respondErrorBrowserService(id, error.message ?? 'error');
    }
  }
};

/**
 * 부모 환경(안드로이드, iOS, parent window 등)에서 부를 수 있도록 노출된 함수들입니다.
 * @example
 *  window.respondRiiidMobileService(0, '');
 *  // 또는
 *  window.postMessage(['respondRiiidMobileService', [0, '']], '*');
 */
export const globalFunctions = {
  respondRiiidMobileService,
  respondErrorRiiidMobileService,
  requestRiiidBrowserService,
};
declare const window: any;
if (typeof window !== 'undefined') {
  Object.assign(window, globalFunctions);
  window.addEventListener('message', (e: MessageEvent) => {
    if (!Array.isArray(e.data)) return;
    const [name, params] = e.data;
    if (!(name in globalFunctions)) return;
    if (!Array.isArray(params)) throw new Error('올바른 인자 형식이 아닙니다.');
    ((globalFunctions as any)[name] as (...args: any[]) => any)(...params);
  });
}

export interface BrowserServiceMethod {
  (request: string): string | Promise<string>;
}
export interface BrowserServiceMethodTable {
  [method: string]: BrowserServiceMethod;
}
interface Req {
  method: string;
  requestType: any;
  responseType: any;
  resolve(value: any): void;
  reject(error: any): void;
}
interface ReqTable {
  [id: number]: Req;
}

export interface MobileAppBridge {
  available: boolean;
  requestMobileService: RequestFn;
  respondBrowserService: RespondFn;
  respondErrorBrowserService: RespondErrorFn;
}
export interface RequestFn {
  (id: number, method: string, message: string): void;
}
export interface RespondFn {
  (id: number, message: string): void;
}
export interface RespondErrorFn {
  (id: number, errorMessage: string): void;
}
