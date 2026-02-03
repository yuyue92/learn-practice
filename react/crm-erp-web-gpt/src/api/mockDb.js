import { uid } from '../utils/id.js';

const KEY = 'crm_mock_db_v1';

export function initMockDbIfNeeded() {
  const raw = localStorage.getItem(KEY);
  if (raw) return;

  const now = new Date().toISOString();
  const users = [
    { id: 'u_admin', username: 'admin', name: '管理员', role: 'SUPER_ADMIN', phone: '13800000000', status: 'ACTIVE' },
    { id: 'u_director', username: 'director', name: '销售总监', role: 'SALES_DIRECTOR', phone: '13800000001', status: 'ACTIVE' },
    { id: 'u_sales1', username: 'sales1', name: '销售一', role: 'SALES', phone: '13800000002', status: 'ACTIVE' },
    { id: 'u_warehouse', username: 'warehouse', name: '库管', role: 'WAREHOUSE', phone: '13800000003', status: 'ACTIVE' },
    { id: 'u_purchase', username: 'purchase', name: '采购', role: 'PURCHASE', phone: '13800000004', status: 'ACTIVE' },
    { id: 'u_finance', username: 'finance', name: '财务', role: 'FINANCE', phone: '13800000005', status: 'ACTIVE' }
  ];

  const customers = [
    { id: 'c_1', name: '北辰科技', level: '意向客户', tags: ['SaaS', '重点'], ownerId: 'u_sales1', phone: '13911112222', createdAt: now },
    { id: 'c_2', name: '云启制造', level: '潜在客户', tags: ['制造'], ownerId: 'u_sales1', phone: '13922223333', createdAt: now },
    { id: 'c_3', name: '星河贸易', level: '成交客户', tags: ['渠道'], ownerId: 'u_director', phone: '13933334444', createdAt: now }
  ];

  const products = [
    { id: 'p_1', name: '企业版CRM授权', category: '软件', price: 9800, cost: 3500, stock: 50, warnThreshold: 10, note: '' },
    { id: 'p_2', name: '硬件网关A', category: '硬件', price: 1200, cost: 700, stock: 18, warnThreshold: 20, note: '即将缺货' },
    { id: 'p_3', name: '实施服务包', category: '服务', price: 30000, cost: 12000, stock: 999, warnThreshold: 0, note: '' }
  ];

  const orders = [
    { id: 'o_1', customerId: 'c_1', ownerId: 'u_sales1', status: 'PAID', amount: 9800, createdAt: now },
    { id: 'o_2', customerId: 'c_3', ownerId: 'u_director', status: 'SHIPPED', amount: 2400, createdAt: now }
  ];

  const followups = [
    { id: uid('f'), customerId: 'c_1', ownerId: 'u_sales1', time: now, content: '电话沟通需求，安排演示', result: '推进中', nextTime: '' }
  ];

  const suppliers = [
    { id: 's_1', name: '华东供应链', phone: '021-88886666', level: 'A', address: '上海', tags: ['稳定'] }
  ];

  const purchases = [
    { id: 'po_1', supplierId: 's_1', status: 'ARRIVED', createdAt: now, items: [{ productId: 'p_2', qty: 50, price: 650 }] }
  ];

  const stockMoves = [
    { id: uid('sm'), type: 'IN', productId: 'p_2', qty: 50, refType: 'PURCHASE', refId: 'po_1', time: now }
  ];

  const config = { companyName: '示例企业', systemTitle: 'CRM/ERP Web', defaultStockWarn: 20 };

  const logs = [
    { id: uid('log'), time: now, module: 'system', action: 'init', detail: '初始化演示数据', userId: 'u_admin' }
  ];

  const reportTemplates = [];

  localStorage.setItem(KEY, JSON.stringify({
    users, customers, products, orders, followups, suppliers, purchases, stockMoves, config, logs, reportTemplates
  }));
}

export function dbLoad() {
  return JSON.parse(localStorage.getItem(KEY) || '{}');
}

export function dbSave(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
}
