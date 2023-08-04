export default function GMT(date) {
    return new Date(date.toLocaleString() + ' GMT')
}

export function setTimer(fn, time) {
    let timer = setTimeout(function run() {
        fn()
        timer = setTimeout(run, time)
    }, time)
    return function runClear() {
        clearTimeout(timer)
    }
}
