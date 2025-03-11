/**
 * File di configurazione per Jest
 */

// Mock per i file statici
import '@testing-library/jest-dom';

// Aumentiamo il timeout predefinito per i test asincroni
jest.setTimeout(10000);

// Sopprimiamo i warning di React in fase di test
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};

// Mock del localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Assegna il mock al global object
global.localStorage = new LocalStorageMock();

// Mock per IntersectionObserver, richiesto da alcuni componenti MUI
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};
