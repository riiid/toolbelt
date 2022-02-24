import {getAppBridge} from '../app-bridge';
import {getServiceMethod} from './ServiceMethod';
import {RequestFn} from './types';

export function startBrowserServiceServer() {
  Object.assign(window, requestHandlers);
  window.removeEventListener('message', messageEventHandler);
  window.addEventListener('message', messageEventHandler);
}

function messageEventHandler(e: MessageEvent<[keyof typeof requestHandlers, Parameters<RequestFn>]>) {
  if (!Array.isArray(e.data)) return;
  const [name, params] = e.data;
  if (!(name in requestHandlers)) return;
  if (!Array.isArray(params)) throw new Error('Parameters must be an array');
  requestHandlers[name](...params);
}

const handleBrowserServiceRequest: RequestFn = async (id, method, message) => {
  const appBridge = getAppBridge();
  const methodImpl = getServiceMethod(method);
  if (!methodImpl) throw new Error(`unknown app bridge method: ${method}`);
  try {
    const response = await methodImpl(message);
    appBridge.respondBrowserService(id, response);
  } catch (error) {
    appBridge.respondErrorBrowserService(id, error?.message ?? 'error');
  }
};

const requestHandlers = {
  requestRiiidBrowserService: handleBrowserServiceRequest,
};