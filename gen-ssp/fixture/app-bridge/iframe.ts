import {MobileAppBridge, browserServiceMethodTable} from '.';

declare const window: any;

const ping = (iframe: HTMLIFrameElement) => iframe.contentWindow?.postMessage(['riiid:app-bridge:ping'], '*');
const pong = () => window.parent.postMessage(['riiid:app-bridge:pong', window.location.href], '*');

// 부모 window에서 자식 iframe window의 appBridge가 준비되었는지 확인할 수단
const readyFrames = new WeakSet<HTMLIFrameElement>();
export function ready(iframe: HTMLIFrameElement): Promise<void> {
  if (readyFrames.has(iframe)) return Promise.resolve();
  return new Promise((resolve) => {
    const intervalId = setInterval(() => ping(iframe), 10);
    const onmessage = (e: MessageEvent) => {
      if (!isPong(e.data, iframe)) return;
      resolve();
      readyFrames.add(iframe);
      clearInterval(intervalId);
      window.removeEventListener('message', onmessage);
    };
    window.addEventListener('message', onmessage);
  });
}
function isPing(message: unknown) {
  if (!Array.isArray(message)) return false;
  if (message[0] !== 'riiid:app-bridge:ping') return false;
  return true;
}
function isPong(message: unknown, iframe: HTMLIFrameElement) {
  if (!Array.isArray(message)) return false;
  if (message[0] !== 'riiid:app-bridge:pong') return false;

  // FIXME: replace with checking new iframe identifier
  // if (message[1] !== iframe.src) return false;

  return true;
}
if (typeof window !== 'undefined' && window.parent !== window.self) {
  window.addEventListener('message', (e: MessageEvent) => {
    if (!isPing(e.data)) return;
    pong();
  });
}

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

interface RequestFn {
  (sourceWindow: Window, id: number, method: string, message: string): void;
}
const requestRiiidMobileService: RequestFn = async (sourceWindow, id, method, message) => {
  const browserServiceMethod = browserServiceMethodTable[method];
  if (!browserServiceMethod) throw new Error('unknown app bridge method: ' + method);
  const response = await browserServiceMethodTable[method](message);
  sourceWindow.postMessage(['respondRiiidMobileService', [id, response]], '*');
};

interface RespondFn {
  (sourceWindow: Window, id: number, message: string): void;
}
interface RespondErrorFn {
  (sourceWindow: Window, id: number, errorMessage: string): void;
}
const respondRiiidBrowserService: RespondFn = (_, id, message) => {
  const req = requestRiiidBrowserService.reqTable[id];
  if (!req) throw new Error('unknown app bridge request id: ' + id);
  const res = req.responseType.decode(Buffer.from(message, 'base64'));
  req.resolve(res.toJSON());
  delete requestRiiidBrowserService.reqTable[id];
};
const respondErrorRiiidBrowserService: RespondErrorFn = (_, id, errorMessage) => {
  const req = requestRiiidBrowserService.reqTable[id];
  if (!req) throw new Error('unknown app bridge request id: ' + id);
  req.reject(new Error(errorMessage));
  delete requestRiiidBrowserService.reqTable[id];
};

const appBridgeFunctions = {
  requestRiiidMobileService,
  respondRiiidBrowserService,
  respondErrorRiiidBrowserService,
};

if (typeof window !== 'undefined') {
  window.addEventListener('message', (e: MessageEvent) => {
    if (!Array.isArray(e.data)) return;
    const [name, params] = e.data;
    if (!(name in appBridgeFunctions)) return;
    if (!Array.isArray(params)) throw new Error('올바른 인자 형식이 아닙니다.');
    ((appBridgeFunctions as any)[name] as (...args: any[]) => any)(e.source, ...params);
  });
}

export function requestRiiidBrowserService<T, Req = any, Res = any>(
  iframe: HTMLIFrameElement,
  method: string,
  message: string,
  requestType: Req,
  responseType: Res
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const id = requestRiiidBrowserService.reqId++;
      requestRiiidBrowserService.reqTable[id] = {
        iframe,
        method,
        requestType,
        responseType,
        resolve,
        reject,
      };
      iframe.contentWindow?.postMessage(['requestRiiidBrowserService', [id, method, message]], '*');
    } catch (err) {
      reject(err);
    }
  });
}
requestRiiidBrowserService.reqTable = {} as ReqTable;
requestRiiidBrowserService.reqId = 0;

interface Req {
  iframe: HTMLIFrameElement;
  method: string;
  requestType: any;
  responseType: any;
  resolve(value: any): void;
  reject(error: any): void;
}
interface ReqTable {
  [id: number]: Req;
}
