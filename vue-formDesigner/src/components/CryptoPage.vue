<template>
    <div class="p-5">
        <h1>前端对用户信息加密与解密</h1>
        <div class="border">
            <p class="p-5">
                <span class="inline w-100">username</span>
                <input type="text" v-model="username" class="border p-5 m-5" />
            </p>
            <p class="p-5">
                <span class="inline w-100">email</span>
                <input type="text" v-model="email" class="border p-5 m-5" />
            </p>
            <p class="p-5">
                <span class="inline w-100">token</span>
                <input type="text" v-model="token" class="border p-5 m-5" />
            </p>
            <p class="p-5">
                完整流程说明:
                1. 生成密钥 → 2. 导出密钥为字符串 → 3. 存储密钥到安全位置 → 4. 加密用户数据 → 5. 解密时恢复密钥
            </p>
            <p>加密/解密时：必须使用 CryptoKey 对象; 存储时：才转换为字符串（Base64/JWK 格式）</p>

            <p class="p-5">
                <button v-track.click="'setcryptoBtn'" v-permission="'admin'" class="btn" @click="setEncrypto">加密</button>
                <button v-track.click="'getcryptoBtn'" v-permission="'admin'" class="btn" @click="getDecryptData">解密</button>
            </p>
            <div class="p-5">
                <p class="m-5">Base64 格式的密钥字符串: {{ keyStr }}</p>
                <p class="m-5">加密结果: {{ encryptedData }}</p>
                <p class="m-5">解密结果: {{ decryptedData }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { decryptData, encryptData, exportKeyToString, generateEncryptionKey, importKeyFromString } from '../utils/CryptoUtil';

const username = ref('Alice');
const email = ref('alice@example.com');
const token = ref('sensitive-auth-token');
const keyStr = ref(null);
const encryptedData = ref(null);
const decryptedData = ref(null);

const setEncrypto = async()=>{
    // 示例：加密用户信息并存储到 localStorage
    try {
        // 1. 生成密钥（实际应用中应从安全来源获取）【加密密钥】
        const CryptoKey = await generateEncryptionKey();
        // 2. 导出密钥为字符串
        keyStr.value = await exportKeyToString(CryptoKey);
        const userInfo = { 
            name: username.value, 
            email: email.value, 
            token: token.value
        };
        
        // 3. 密钥 + 要加密的用户数据---》【加密时直接使用 CryptoKey 对象，而非字符串密钥。】
        encryptedData.value = await encryptData(CryptoKey, userInfo);
        
        // 4. 存储到 localStorage（密钥需单独安全保存！）
        localStorage.setItem("encryptedUserData", encryptedData.value);
    } catch (error) {
        console.error("加密失败:", error);
    }

}

const getDecryptData = async()=>{
    try {
        // 5. 解密演示（从 localStorage 读取）
        const storedData = localStorage.getItem("encryptedUserData");
        if (storedData) {
            // 解密时恢复密钥【从存储的字符串中通过 importKey 恢复 CryptoKey 对象】
            const ckeyval = await importKeyFromString(keyStr.value);
            // 结合恢复的密钥和 localStorage 中的加密数据 + IV 进行解密
            decryptedData.value = await decryptData(ckeyval, storedData);
        }
    } catch (error) {
        console.error("解密失败:", error);
    }
}
</script>