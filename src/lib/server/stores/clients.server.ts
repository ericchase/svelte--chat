const clients = new Map();

export function addClient(id: symbol, controller: ReadableStreamDefaultController): void {
  clients.set(id, controller);
}

export function removeClient(id: symbol): void {
  clients.delete(id);
}

export function getIterator() {
  return clients[Symbol.iterator]();
}
