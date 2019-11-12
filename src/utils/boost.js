/*eslint-disable no-extend-native*/
//书架选中的加入数组
Array.prototype.pushWithoutDuplicate = function () {
    for (let i = 0; i < arguments.length; i++) {
        const arg = arguments[i]
        if (this.indexOf(arg) == -1) {
            this.push(arg)
        }
    }
}