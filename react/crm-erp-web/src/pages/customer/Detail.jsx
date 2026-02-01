/**
 * 客户详情页面
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/common/Toast';
import Modal from '@/components/common/Modal';
import { getCustomerDetail, deleteCustomer, getFollowUpList, createFollowUp } from '@/api/modules/customer';
import { CUSTOMER_TYPE, CUSTOMER_LEVEL, FOLLOW_UP_TYPE, FOLLOW_UP_RESULT } from '@/config/constants';

function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [followUps, setFollowUps] = useState([]);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    type: 'phone',
    content: '',
    result: 'pending',
    nextFollowUpAt: '',
    reminder: false,
  });

  useEffect(() => {
    loadCustomer();
    loadFollowUps();
  }, [id]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const data = await getCustomerDetail(id);
      setCustomer(data);
    } catch (error) {
      toast.error('加载客户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const loadFollowUps = async () => {
    try {
      setFollowUpLoading(true);
      const result = await getFollowUpList({ customerId: id });
      setFollowUps(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除该客户吗？')) return;
    try {
      await deleteCustomer(id);
      toast.success('删除成功');
      navigate('/app/customer/list');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleAddFollowUp = async () => {
    if (!followUpForm.content.trim()) {
      toast.error('请填写跟进内容');
      return;
    }
    try {
      await createFollowUp({
        customerId: id,
        customerName: customer?.name,
        salesPersonId: 'user_1',
        salesPersonName: '张三',
        ...followUpForm,
      });
      toast.success('添加跟进记录成功');
      setFollowUpModalVisible(false);
      setFollowUpForm({ type: 'phone', content: '', result: 'pending', nextFollowUpAt: '', reminder: false });
      loadFollowUps();
      loadCustomer();
    } catch (error) {
      toast.error('添加失败');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="page-container">
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">客户不存在</h2>
          <button onClick={() => navigate('/app/customer/list')} className="btn btn-primary mt-4">返回列表</button>
        </div>
      </div>
    );
  }

  const customerType = CUSTOMER_TYPE[customer.type?.toUpperCase()];
  const customerLevel = CUSTOMER_LEVEL[customer.level];

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/app/customer/list')} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-sm text-neutral-500">客户编号: {customer.code}</p>
          </div>
          <span className={`badge badge-${customerType?.color}`}>{customerType?.label}</span>
          <span className={`badge badge-${customerLevel?.color}`}>{customerLevel?.label}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setFollowUpModalVisible(true)} className="btn btn-primary">+ 添加跟进</button>
          <button onClick={() => navigate(`/app/customer/edit/${id}`)} className="btn btn-secondary">编辑</button>
          <button onClick={handleDelete} className="btn btn-danger">删除</button>
        </div>
      </div>

      <div className="mb-6 border-b border-neutral-200 dark:border-neutral-700">
        <nav className="flex space-x-8">
          {[
            { key: 'basic', label: '基本信息' },
            { key: 'followup', label: '跟进记录' },
            { key: 'orders', label: '订单记录' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="section-title">客户信息</h3>
            <div className="space-y-3">
              <InfoItem label="客户名称" value={customer.name} />
              <InfoItem label="客户编号" value={customer.code} />
              <InfoItem label="所属行业" value={customer.industry} />
              <InfoItem label="客户来源" value={customer.source} />
              <InfoItem label="客户标签" value={customer.tags?.join(', ') || '无'} />
            </div>
          </div>
          <div className="card p-6">
            <h3 className="section-title">联系信息</h3>
            <div className="space-y-3">
              <InfoItem label="联系人" value={customer.contact?.person} />
              <InfoItem label="联系电话" value={customer.contact?.phone} />
              <InfoItem label="电子邮箱" value={customer.contact?.email} />
              <InfoItem label="微信号" value={customer.contact?.wechat} />
              <InfoItem label="联系地址" value={customer.contact?.address} />
            </div>
          </div>
          <div className="card p-6">
            <h3 className="section-title">业务信息</h3>
            <div className="space-y-3">
              <InfoItem label="负责销售" value={customer.salesPersonName} />
              <InfoItem label="跟进次数" value={`${customer.followUpCount} 次`} />
              <InfoItem label="订单总数" value={`${customer.totalOrderCount} 单`} />
              <InfoItem label="累计金额" value={`¥ ${customer.totalOrderAmount?.toLocaleString()}`} />
            </div>
          </div>
          {customer.remark && (
            <div className="card p-6">
              <h3 className="section-title">备注信息</h3>
              <p className="text-neutral-700 dark:text-neutral-300">{customer.remark}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'followup' && (
        <div className="card p-6">
          {followUpLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : followUps.length === 0 ? (
            <div className="empty-state py-12">
              <div className="text-6xl mb-2">📝</div>
              <p>暂无跟进记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {followUps.map((item) => {
                const followUpType = FOLLOW_UP_TYPE[item.type?.toUpperCase()];
                const followUpResult = FOLLOW_UP_RESULT[item.result?.toUpperCase()];
                return (
                  <div key={item.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="badge badge-primary">{followUpType?.label}</span>
                        <span className={`badge badge-${followUpResult?.color}`}>{followUpResult?.label}</span>
                      </div>
                      <span className="text-sm text-neutral-500">{item.salesPersonName}</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-2">{item.content}</p>
                    <div className="text-sm text-neutral-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card p-6">
          <div className="empty-state py-12">
            <div className="text-6xl mb-2">📋</div>
            <p>订单功能开发中...</p>
          </div>
        </div>
      )}

      <Modal
        visible={followUpModalVisible}
        title="添加跟进记录"
        onClose={() => setFollowUpModalVisible(false)}
        onOk={handleAddFollowUp}
        width="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="form-label">跟进方式</label>
            <select value={followUpForm.type} onChange={(e) => setFollowUpForm({ ...followUpForm, type: e.target.value })} className="input">
              {Object.values(FOLLOW_UP_TYPE).map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">跟进内容</label>
            <textarea value={followUpForm.content} onChange={(e) => setFollowUpForm({ ...followUpForm, content: e.target.value })} rows={4} className="input" />
          </div>
          <div>
            <label className="form-label">跟进结果</label>
            <select value={followUpForm.result} onChange={(e) => setFollowUpForm({ ...followUpForm, result: e.target.value })} className="input">
              {Object.values(FOLLOW_UP_RESULT).map((result) => (
                <option key={result.value} value={result.value}>{result.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">下次跟进时间</label>
            <input type="datetime-local" value={followUpForm.nextFollowUpAt} onChange={(e) => setFollowUpForm({ ...followUpForm, nextFollowUpAt: e.target.value })} className="input" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="text-sm text-neutral-500 w-24">{label}:</span>
      <span className="text-sm text-neutral-900 dark:text-neutral-100">{value || '-'}</span>
    </div>
  );
}

export default CustomerDetail;
