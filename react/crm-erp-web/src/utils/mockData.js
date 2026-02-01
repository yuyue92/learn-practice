/**
 * Mock 数据服务
 * 用于开发环境模拟后端接口
 */

// 生成随机 ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// 模拟客户数据
let mockCustomers = Array.from({ length: 50 }, (_, i) => ({
  id: `customer_${i + 1}`,
  name: `客户${i + 1}`,
  code: `CUS${String(i + 1).padStart(5, '0')}`,
  type: ['potential', 'intent', 'deal', 'lost'][Math.floor(Math.random() * 4)],
  industry: ['互联网', '制造业', '金融', '教育', '医疗'][Math.floor(Math.random() * 5)],
  level: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
  source: ['网络推广', '电话营销', '客户介绍', '展会', '其他'][Math.floor(Math.random() * 5)],
  tags: ['重点客户', 'VIP', '优质客户'].slice(0, Math.floor(Math.random() * 3)),
  contact: {
    person: `联系人${i + 1}`,
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    email: `contact${i + 1}@example.com`,
    wechat: `wx${i + 1}`,
    address: `北京市朝阳区xxx街道${i + 1}号`,
  },
  salesPersonId: 'user_1',
  salesPersonName: '张三',
  followUpCount: Math.floor(Math.random() * 20),
  lastFollowUpAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  nextFollowUpAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  totalOrderAmount: Math.floor(Math.random() * 1000000),
  totalOrderCount: Math.floor(Math.random() * 20),
  remark: `这是客户${i + 1}的备注信息`,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

// 模拟跟进记录数据
let mockFollowUps = Array.from({ length: 100 }, (_, i) => ({
  id: `followup_${i + 1}`,
  customerId: `customer_${Math.floor(Math.random() * 50) + 1}`,
  customerName: `客户${Math.floor(Math.random() * 50) + 1}`,
  salesPersonId: 'user_1',
  salesPersonName: '张三',
  type: ['phone', 'visit', 'email', 'wechat', 'other'][Math.floor(Math.random() * 5)],
  content: `这是第${i + 1}次跟进的详细内容，讨论了产品需求和报价方案。`,
  result: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)],
  nextFollowUpAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  reminder: Math.random() > 0.5,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

// Mock API 方法
export const mockApi = {
  // 获取客户列表
  getCustomers: async (params = {}) => {
    await delay(500); // 模拟网络延迟
    
    let result = [...mockCustomers];
    
    // 筛选
    if (params.keyword) {
      result = result.filter(
        (c) =>
          c.name.includes(params.keyword) ||
          c.code.includes(params.keyword) ||
          c.contact.person.includes(params.keyword)
      );
    }
    
    if (params.type) {
      result = result.filter((c) => c.type === params.type);
    }
    
    if (params.level) {
      result = result.filter((c) => c.level === params.level);
    }
    
    // 排序
    if (params.sortField) {
      result.sort((a, b) => {
        const aVal = a[params.sortField];
        const bVal = b[params.sortField];
        return params.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }
    
    // 分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const total = result.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: result.slice(start, end),
      total,
      page,
      pageSize,
    };
  },

  // 获取客户详情
  getCustomerDetail: async (id) => {
    await delay(300);
    const customer = mockCustomers.find((c) => c.id === id);
    if (!customer) {
      throw new Error('客户不存在');
    }
    return customer;
  },

  // 创建客户
  createCustomer: async (data) => {
    await delay(500);
    const newCustomer = {
      id: generateId(),
      ...data,
      code: `CUS${String(mockCustomers.length + 1).padStart(5, '0')}`,
      followUpCount: 0,
      totalOrderAmount: 0,
      totalOrderCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCustomers.unshift(newCustomer);
    return newCustomer;
  },

  // 更新客户
  updateCustomer: async (id, data) => {
    await delay(500);
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('客户不存在');
    }
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...data,
      id, // 保持 ID 不变
      code: mockCustomers[index].code, // 保持编号不变
      updatedAt: new Date().toISOString(),
    };
    return mockCustomers[index];
  },

  // 删除客户
  deleteCustomer: async (id) => {
    await delay(500);
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('客户不存在');
    }
    mockCustomers.splice(index, 1);
    return { success: true };
  },

  // 获取跟进记录
  getFollowUps: async (params = {}) => {
    await delay(300);
    let result = [...mockFollowUps];
    
    if (params.customerId) {
      result = result.filter((f) => f.customerId === params.customerId);
    }
    
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const total = result.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: result.slice(start, end),
      total,
      page,
      pageSize,
    };
  },

  // 创建跟进记录
  createFollowUp: async (data) => {
    await delay(500);
    const newFollowUp = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    mockFollowUps.unshift(newFollowUp);
    
    // 更新客户的跟进次数和最后跟进时间
    const customer = mockCustomers.find((c) => c.id === data.customerId);
    if (customer) {
      customer.followUpCount += 1;
      customer.lastFollowUpAt = new Date().toISOString();
      if (data.nextFollowUpAt) {
        customer.nextFollowUpAt = data.nextFollowUpAt;
      }
    }
    
    return newFollowUp;
  },
};

// 模拟网络延迟
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
