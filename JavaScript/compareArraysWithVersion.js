// ============================================
// JavaScript 版本
// ============================================

/**
 * 比较两个数组并返回带有版本信息的结果数组
 * @param {Array} list1 - 第一个数组（基准数组）
 * @param {Array} list2 - 第二个数组（比较数组）
 * @param {Array<string>} keyList - 需要比较的属性键列表
 * @returns {Array} 包含版本信息的结果数组
 */
function compareArraysWithVersion(list1, list2, keyList) {
  // 确定结果数组的长度（取两个数组中较长的）
  const maxLength = Math.max(list1.length, list2.length);
  const resultList = [];

  for (let i = 0; i < maxLength; i++) {
    // 获取当前索引的对象
    const obj1 = list1[i];
    const obj2 = list2[i];

    // 创建结果对象
    let resultItem;
    
    // 如果 list1 中存在该索引的对象，使用它；否则创建空值对象
    if (obj1) {
      resultItem = { ...obj1 };
    } else {
      // list1 长度小于 list2，需要补充空值行
      resultItem = {};
      keyList.forEach(key => {
        resultItem[key] = '';
      });
    }

    const versionInfo = {};

    // 只遍历 keyList 中指定的属性进行比较
    keyList.forEach(key => {
      const value1 = obj1 ? obj1[key] : '';
      const value2 = obj2 ? obj2[key] : '';

      // 只有当值不同时才添加到 versionInfo
      if (value1 !== value2) {
        versionInfo[key] = [value1, value2];
      }
    });

    // 只有存在差异时才添加 versionInfo 属性
    if (Object.keys(versionInfo).length > 0) {
      resultItem.versionInfo = versionInfo;
    }

    resultList.push(resultItem);
  }

  return resultList;
}

// ============================================
// TypeScript 版本
// ============================================

/*
// 定义类型接口
interface DataObject {
  [key: string]: any;
}

interface VersionInfo {
  [key: string]: [any, any];
}

interface ResultItem extends DataObject {
  versionInfo?: VersionInfo;
}

function compareArraysWithVersionTS(
  list1: DataObject[],
  list2: DataObject[],
  keyList: string[]
): ResultItem[] {
  // 确定结果数组的长度（取两个数组中较长的）
  const maxLength = Math.max(list1.length, list2.length);
  const resultList: ResultItem[] = [];

  for (let i = 0; i < maxLength; i++) {
    // 获取当前索引的对象
    const obj1 = list1[i];
    const obj2 = list2[i];

    // 创建结果对象
    let resultItem: ResultItem;
    
    // 如果 list1 中存在该索引的对象，使用它；否则创建空值对象
    if (obj1) {
      resultItem = { ...obj1 };
    } else {
      // list1 长度小于 list2，需要补充空值行
      resultItem = {};
      keyList.forEach(key => {
        resultItem[key] = '';
      });
    }

    const versionInfo: VersionInfo = {};

    // 只遍历 keyList 中指定的属性进行比较
    keyList.forEach(key => {
      const value1 = obj1 ? obj1[key] : '';
      const value2 = obj2 ? obj2[key] : '';

      // 只有当值不同时才添加到 versionInfo
      if (value1 !== value2) {
        versionInfo[key] = [value1, value2];
      }
    });

    // 只有存在差异时才添加 versionInfo 属性
    if (Object.keys(versionInfo).length > 0) {
      resultItem.versionInfo = versionInfo;
    }

    resultList.push(resultItem);
  }

  return resultList;
}
*/

// ============================================
// 测试示例
// ============================================

// 定义需要比较的键列表
const keyList = ['attr1', 'attr2', 'attr3'];

// 测试数据 1：list1 长度 = list2 长度
console.log('=== 测试 1：长度相等 ===');
const list1_test1 = [
  { attr1: 'v1', attr2: 'vx', attr3: 'same', extraAttr: 'ignore' },
  { attr1: 'v23', attr2: 'vxx', attr3: 'data', extraAttr: 'ignore2' }
];

const list2_test1 = [
  { attr1: 'v11', attr2: 'vxx', attr3: 'same', otherAttr: 'also-ignore' },
  { attr1: 'v2x3', attr2: 'vxxxxx', attr3: 'data', otherAttr: 'ignore3' }
];

const result1 = compareArraysWithVersion(list1_test1, list2_test1, keyList);
console.log(JSON.stringify(result1, null, 2));

// 测试数据 2：list1 长度 < list2 长度（需要补充空值行）
console.log('\n=== 测试 2：list1 < list2，需要补充空值行 ===');
const list1_test2 = [
  { attr1: 'v1', attr2: 'vx', attr3: 'data1' }
];

const list2_test2 = [
  { attr1: 'v11', attr2: 'vx', attr3: 'data1' },
  { attr1: 'v999', attr2: 'new', attr3: 'extra' },
  { attr1: 'v888', attr2: 'another', attr3: 'more' }
];

const result2 = compareArraysWithVersion(list1_test2, list2_test2, keyList);
console.log(JSON.stringify(result2, null, 2));

// 测试数据 3：list1 长度 > list2 长度
console.log('\n=== 测试 3：list1 > list2 ===');
const list1_test3 = [
  { attr1: 'v1', attr2: 'vx', attr3: 'data1' },
  { attr1: 'v2', attr2: 'vy', attr3: 'data2' },
  { attr1: 'v3', attr2: 'vz', attr3: 'data3' }
];

const list2_test3 = [
  { attr1: 'v11', attr2: 'vx', attr3: 'data1' }
];

const result3 = compareArraysWithVersion(list1_test3, list2_test3, keyList);
console.log(JSON.stringify(result3, null, 2));

// 输出说明
console.log('\n=== 功能说明 ===');
console.log('1. 只比较 keyList 中指定的属性，其他属性保留但不比较');
console.log('2. 当 list1 < list2 时，自动补充空值行 {attr1:"", attr2:"", ...}');
console.log('3. 只有存在差异的属性才会出现在 versionInfo 中');
console.log('4. versionInfo 格式：{属性名: [list1的值, list2的值]}');
