import {getServiceMethod} from './ServiceMethod';
import {RequestFn} from './types';

export function startMobileServiceServer() {
  window.removeEventListener('message', messageEventHandler);
  window.addEventListener('message', messageEventHandler);
}

function messageEventHandler(e: MessageEvent<[keyof typeof requestHandlers, Parameters<RequestFn>]>) {
  if (!Array.isArray(e.data)) return;
  const [name, params] = e.data;
  if (!(name in requestHandlers)) return;
  if (!Array.isArray(params)) throw new Error('Parameters must be an array');
  requestHandlers[name](e.source as Window, ...params);
}

const handleMobileServiceRequest: (sourceWindow: Window, ...args: Parameters<RequestFn>) => void = async (
  sourceWindow,
  id,
  method,
  message
) => {
  const methodImpl = getServiceMethod(method);
  if (!methodImpl) throw new Error(`unknown app bridge method: ${method}`);
  try {
    const response = await methodImpl(message);
    sourceWindow.postMessage(['respondRiiidMobileService', [id, response]], '*');
  } catch (error) {
    sourceWindow.postMessage(['respondErrorRiiidMobileService', [id, error]], '*');
  }
};

const requestHandlers = {
  requestRiiidMobileService: handleMobileServiceRequest,
};
