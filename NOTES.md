# XSS Injection

If using the [`@html` expression](https://svelte.dev/docs#template-syntax-html), cross-site scripting attacks become easily possible. Below is an example of how someone might run JavaScript in a victim's browser.

```
<img width="0" height="0" src="https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png" onload="const div = document.createElement('div'); div.innerText = 'Use at own risk! Cross-site scripting hacks are enabled!'; document.querySelector('main').appendChild(div)">
```
