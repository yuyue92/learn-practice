/**
 * 比较两个数组并返回带有版本信息的结果数组
 * @param {Array} list1 - 第一个数组（基准数组）
 * @param {Array} list2 - 第二个数组（比较数组）
 * @returns {Array} 包含版本信息的结果数组
 */
function compareArraysWithVersion(list1, list2) {
  // 确定结果数组的长度（取两个数组中较长的）
  const maxLength = Math.max(list1.length, list2.length);
  const resultList = [];

  for (let i = 0; i < maxLength; i++) {
    // 获取当前索引的对象，如果不存在则为空对象
    const obj1 = list1[i] || {};
    const obj2 = list2[i] || {};

    // 创建结果对象，基于list1的数据
    const resultItem = { ...obj1 };
    const versionInfo = {};

    // 获取所有需要比较的属性（合并两个对象的所有键）
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    // 遍历所有属性进行比较
    allKeys.forEach(key => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      // 只有当值不同时才添加到versionInfo
      if (value1 !== value2) {
        versionInfo[key] = [value1, value2];
      }
    });

    // 只有存在差异时才添加versionInfo属性
    if (Object.keys(versionInfo).length > 0) {
      resultItem.versionInfo = versionInfo;
    }

    resultList.push(resultItem);
  }

  return resultList;
}

// 示例用法
const list1 = [
  { attr1: 'v1', attr2: 'vx', attr3: 'same' },
  { attr1: 'v23', attr2: 'vxx', attr3: 'data' }
];

const list2 = [
  { attr1: 'v11', attr2: 'vxx', attr3: 'same' },
  { attr1: 'v2x3', attr2: 'vxxxxx', attr3: 'data' },
  { attr1: 'v999', attr2: 'new', attr3: 'extra' }
];

const result = compareArraysWithVersion(list1, list2);

console.log('比较结果：');
console.log(JSON.stringify(result, null, 2));

// 输出说明
console.log('\n说明：');
console.log('- 第1条：attr1和attr2有差异，被记录到versionInfo；attr3相同，不记录');
console.log('- 第2条：attr1和attr2有差异，被记录到versionInfo；attr3相同，不记录');
console.log('- 第3条：list2比list1多出的数据，所有属性都有差异（因为list1中为undefined）');
