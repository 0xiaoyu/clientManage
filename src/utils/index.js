/**
 * 复制单行内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */
import {Message} from 'element-ui';

let timer = null;

export function copyToClip(content, message) {
    if (timer !== null) {
        clearCopy(timer);
    }
    timer = setTimeout(() => {
        const aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        Message.success(message || "复制成功")
    }, 300);
}

export function clearCopy() {
    clearTimeout(timer);
}
