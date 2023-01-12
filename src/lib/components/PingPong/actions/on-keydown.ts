export function onKeydown(node: Node, callback: (event?: KeyboardEvent) => void) {
	function handleKeydown(event: KeyboardEvent) {
		callback(event);
	}
	document.addEventListener('keydown', handleKeydown, true);
	return {
		destroy() {
			document.removeEventListener('keydown', handleKeydown, true);
		},
	};
}
