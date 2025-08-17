
// 存储用户权限
let currentPermissions = [];

/**
 * 设置当前用户权限
 * @param {Array} permissions 权限数组
 */
export function setPermissions(permissions) {
    currentPermissions = Array.isArray(permissions) ? permissions : [];
    // 可以同时存储到本地，避免刷新丢失
    localStorage.setItem('user_permissions', JSON.stringify(currentPermissions))
}

/**
 * 获取当前用户权限
 * @returns {Array} 权限数组
 */
export function getPermissions() {
    if(currentPermissions.length === 0) {
        // 从本地存储恢复
        const stored = localStorage.getItem('user_permissions')
        currentPermissions = stored ? JSON.parse(stored) : []
    }
    return currentPermissions;
}

/**
 * 检查是否有权限
 * @param {String|Array} value 需要的权限
 * @returns {Boolean} 是否有权限
 */

export function hasPermission(value) {
    if(!value) return true;
    const permissions = getPermissions();
    if(Array.isArray(value)) {
        // 需要满足所有权限
        return value.every(perm => permissions.includes(perm))
    }
    // 字符串权限
    return permissions.includes(value)
}

/**
 * 权限指令
 */
export const permissionDirective = {
    mounted(el, binding) {
        const {value} = binding;
        if (!hasPermission(value)) {
            // 没有权限则移除元素
            el.parentNode?.removeChild(el)
        }
    }
}

/**
 * 权限混入
 */
export const permissionMixin = {
    methods: {
        $hasPermission(permission) {
            return hasPermission(permission)
        }
    }
}