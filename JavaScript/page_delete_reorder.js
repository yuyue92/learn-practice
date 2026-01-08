// ============ JavaScript 版本 ============

// 方法1: 使用 Object.keys 遍历重排
function deleteAndReorderPages_v1(obj, pageNoToDelete) {
  // 删除指定页
  delete obj[pageNoToDelete];
  
  // 获取所有页码并排序
  const pageNos = Object.keys(obj).map(Number).sort((a, b) => a - b);
  
  // 创建新对象
  const newObj = {};
  
  pageNos.forEach((oldPageNo, index) => {
    const newPageNo = index + 1;
    // 更新每个项目的 pageNo 属性
    newObj[newPageNo] = obj[oldPageNo].map(item => ({
      ...item,
      pageNo: newPageNo
    }));
  });
  
  return newObj;
}

// 方法2: 原地修改（直接修改原对象）
function deleteAndReorderPages_v2(obj, pageNoToDelete) {
  const maxPage = Math.max(...Object.keys(obj).map(Number));
  
  // 删除指定页
  delete obj[pageNoToDelete];
  
  // 从删除位置开始，后面的页往前移
  for (let i = pageNoToDelete + 1; i <= maxPage; i++) {
    if (obj[i]) {
      // 更新页码
      obj[i - 1] = obj[i].map(item => ({
        ...item,
        pageNo: i - 1
      }));
      delete obj[i];
    }
  }
  
  return obj;
}

// 方法3: 函数式编程风格
function deleteAndReorderPages_v3(obj, pageNoToDelete) {
  return Object.entries(obj)
    .filter(([pageNo]) => Number(pageNo) !== pageNoToDelete)
    .sort(([a], [b]) => Number(a) - Number(b))
    .reduce((acc, [_, items], index) => {
      const newPageNo = index + 1;
      acc[newPageNo] = items.map(item => ({ ...item, pageNo: newPageNo }));
      return acc;
    }, {});
}

// ============ TypeScript 版本 ============

// 定义类型
interface PageItem {
  pageNo: number;
  attr1: string;
  [key: string]: any; // 其他属性
}

type PagedData = {
  [pageNo: number]: PageItem[];
};

// 方法1: TypeScript 版本
function deleteAndReorderPagesTS_v1(obj: PagedData, pageNoToDelete: number): PagedData {
  delete obj[pageNoToDelete];
  
  const pageNos = Object.keys(obj).map(Number).sort((a, b) => a - b);
  const newObj: PagedData = {};
  
  pageNos.forEach((oldPageNo, index) => {
    const newPageNo = index + 1;
    newObj[newPageNo] = obj[oldPageNo].map(item => ({
      ...item,
      pageNo: newPageNo
    }));
  });
  
  return newObj;
}

// 方法2: TypeScript 原地修改版本
function deleteAndReorderPagesTS_v2(obj: PagedData, pageNoToDelete: number): PagedData {
  const maxPage = Math.max(...Object.keys(obj).map(Number));
  
  delete obj[pageNoToDelete];
  
  for (let i = pageNoToDelete + 1; i <= maxPage; i++) {
    if (obj[i]) {
      obj[i - 1] = obj[i].map(item => ({
        ...item,
        pageNo: i - 1
      }));
      delete obj[i];
    }
  }
  
  return obj;
}

// 方法3: TypeScript 函数式编程版本
function deleteAndReorderPagesTS_v3(obj: PagedData, pageNoToDelete: number): PagedData {
  return Object.entries(obj)
    .filter(([pageNo]) => Number(pageNo) !== pageNoToDelete)
    .sort(([a], [b]) => Number(a) - Number(b))
    .reduce((acc, [_, items], index) => {
      const newPageNo = index + 1;
      acc[newPageNo] = items.map(item => ({ ...item, pageNo: newPageNo }));
      return acc;
    }, {} as PagedData);
}

// ============ 使用示例 ============

// 测试数据
const obj1 = {
  1: [
    { pageNo: 1, attr1: 'a1', attr2: 'b1' },
    { pageNo: 1, attr1: 'a2', attr2: 'b2' }
  ],
  2: [
    { pageNo: 2, attr1: 'c1', attr2: 'd1' },
    { pageNo: 2, attr1: 'c2', attr2: 'd2' }
  ],
  3: [
    { pageNo: 3, attr1: 'e1', attr2: 'f1' }
  ],
  4: [
    { pageNo: 4, attr1: 'g1', attr2: 'h1' }
  ]
};

// 使用方法1（返回新对象）
const result1 = deleteAndReorderPages_v1({ ...obj1 }, 2);
console.log('方法1结果:', JSON.stringify(result1, null, 2));

// 使用方法2（原地修改）
const obj1Copy = JSON.parse(JSON.stringify(obj1));
const result2 = deleteAndReorderPages_v2(obj1Copy, 2);
console.log('方法2结果:', JSON.stringify(result2, null, 2));

// 使用方法3（函数式）
const result3 = deleteAndReorderPages_v3({ ...obj1 }, 2);
console.log('方法3结果:', JSON.stringify(result3, null, 2));