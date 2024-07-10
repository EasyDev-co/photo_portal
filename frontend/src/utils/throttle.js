export function throttle(func, delay) {
    let lastCall = 0;
    let lastResult;
    return async function(...args) {
        const now = new Date().getTime();
        if (now - lastCall >= delay) {
            lastCall = now;
            lastResult = await func(...args)
                .then(response => response.clone().json().then(data => ({response, data})));
        }
        return lastResult;
    };
}
