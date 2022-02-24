import {MethodDescriptor, RpcClientImpl} from 'pbkit/core/runtime/rpc';
import {createEventBuffer} from 'pbkit/core/runtime/async/event-buffer';
import {first} from 'pbkit/core/runtime/async/async-generator';

import {DeserializeFn, ReqTable, RespondErrorFn, RespondFn} from './types';

const BROWSER_SERVICE_TIMEOUT = 5000;

export function createBrowserServiceClient({
  iframe,
}: {
  iframe: HTMLIFrameElement;
}): RpcClientImpl<unknown, unknown, unknown> {
  return function browserServiceClient<TReq, TRes>(methodDescriptor: MethodDescriptor<TReq, TRes>) {
    return function methodImpl(req: AsyncGenerator<TReq>) {
      const {service, methodName, requestStream, responseStream, requestType, responseType} = methodDescriptor;
      if (requestStream || responseStream) throw new Error('Stream request/response is not supported');
      const eventBuffer = createEventBuffer<TRes>();
      first(req).then(req => {
        const message = Buffer.from(requestType.serializeBinary(req)).toString('base64');
        Promise.race([
          new Promise<TRes>((_, rej) => setTimeout(rej, BROWSER_SERVICE_TIMEOUT, 'timeout')),
          requestRiiidBrowserService<TRes>(
            iframe,
            `${service.serviceName}.${methodName}`,
            message,
            responseType.deserializeBinary
          ),
        ])
          .then(res => {
            eventBuffer.push(res);
            eventBuffer.finish();
          })
          .catch(err => {
            eventBuffer.error(err);
            eventBuffer.finish();
          });
      });
      return [eventBuffer.drain(), Promise.resolve(), Promise.resolve()];
    };
  };
}

function requestRiiidBrowserService<T, Fn extends DeserializeFn<any> = DeserializeFn<any>>(
  iframe: HTMLIFrameElement,
  method: string,
  message: string,
  deserialize: Fn
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const id = requestRiiidBrowserService.reqId++;
      requestRiiidBrowserService.reqTable[id] = {
        method,
        deserialize,
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

const handleRiiidBrowserServiceResponse: RespondFn = (id, message) => {
  const req = requestRiiidBrowserService.reqTable[id];
  if (!req) throw new Error('unknown app bridge request id: ' + id);
  const res = req.deserialize(Buffer.from(message, 'base64'));
  req.resolve(res);
  delete requestRiiidBrowserService.reqTable[id];
};
const handleRiiidBrowserServiceErrorResponse: RespondErrorFn = (id, errorMessage) => {
  const req = requestRiiidBrowserService.reqTable[id];
  if (!req) throw new Error('unknown app bridge request id: ' + id);
  req.reject(new Error(errorMessage));
  delete requestRiiidBrowserService.reqTable[id];
};
/**
 * @description 부모 환경(안드로이드, iOS, parent window 등)에서 부를 수 있도록 노출된 함수들입니다.
 * @example
 *  window.respondRiiidBrowserService(0, '');
 *  // 또는
 *  window.postMessage(['respondRiiidBrowserService', [0, '']], '*');
 */
const responseHandlers = {
  respondRiiidBrowserService: handleRiiidBrowserServiceResponse,
  respondErrorRiiidBrowserService: handleRiiidBrowserServiceErrorResponse,
};
if (typeof window !== 'undefined') {
  Object.assign(window, responseHandlers);
  window.addEventListener('message', (e: MessageEvent) => {
    if (!Array.isArray(e.data)) return;
    const [name, params] = e.data;
    if (!(name in responseHandlers)) return;
    if (!Array.isArray(params)) throw new Error('올바른 인자 형식이 아닙니다.');
    ((responseHandlers as any)[name] as (...args: any[]) => any)(...params);
  });
}
