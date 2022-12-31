export function oninput(node: Node, fn: (event?: Event) => void) {
  function handleInput(event: Event) {
    fn(event);
  }
  node.addEventListener('input', handleInput);
  return {
    destroy() {
      node.removeEventListener('input', handleInput);
    },
  };
}
