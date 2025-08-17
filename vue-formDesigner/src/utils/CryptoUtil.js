/**
 * 生成 AES-GCM 对称密钥（用于加密/解密）
 * @returns {Promise<CryptoKey>} 加密密钥
 */
export const generateEncryptionKey = async () => {
    return await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256, // 密钥长度
        },
        true, // 是否可导出密钥（此处设为 true 以便安全存储）
        ["encrypt", "decrypt"] // 密钥用途
    );
};

/**
 * 将 CryptoKey 对象导出为 Base64 字符串
 * @param {CryptoKey} key 
 * @returns {Promise<string>} Base64 格式的密钥字符串
 */
export const exportKeyToString = async (key) => {
    const exported = await crypto.subtle.exportKey("raw", key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

/**
 * 从 Base64 字符串恢复 CryptoKey 对象
 * @param {string} keyStr 
 * @returns {Promise<CryptoKey>}
 */
export const importKeyFromString = async (keyStr) => {
    const binaryStr = atob(keyStr);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return await crypto.subtle.importKey(
        "raw",
        bytes,
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
    );
};

/**
 * 使用 AES-GCM 加密数据
 * @param {CryptoKey} key 
 * @param {Object} data 要加密的对象
 * @returns {Promise<string>} Base64 格式的加密结果（含 IV）
 */
export const encryptData = async (key, data) => {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 初始化向量（IV）
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
  
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedData
    );
  
    // 将 IV 和加密数据合并为单个字符串（IV + ciphertext）
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
  
    return btoa(String.fromCharCode(...combined));
};

/**
 * 解密数据
 * @param {CryptoKey} key 
 * @param {string} encryptedStr Base64 格式的加密数据
 * @returns {Promise<Object>} 解密后的原始对象
 */
export const decryptData = async (key, encryptedStr) => {
    const binaryStr = atob(encryptedStr);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
  
    // 分离 IV 和密文（前 12 字节是 IV）
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);
  
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
    );
  
    return JSON.parse(new TextDecoder().decode(decrypted));
};