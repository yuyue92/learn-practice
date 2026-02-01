/**
 * 客户表单页面 (新增/编辑)
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Textarea from '@/components/common/Textarea';
import { toast } from '@/components/common/Toast';
import { getCustomerDetail, createCustomer, updateCustomer } from '@/api/modules/customer';
import { CUSTOMER_TYPE_OPTIONS, CUSTOMER_LEVEL_OPTIONS } from '@/config/constants';

function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    industry: '',
    level: '',
    source: '',
    tags: '',
    contact: {
      person: '',
      phone: '',
      email: '',
      wechat: '',
      address: '',
    },
    remark: '',
  });
  const [errors, setErrors] = useState({});

  const industryOptions = [
    { value: '互联网', label: '互联网' },
    { value: '制造业', label: '制造业' },
    { value: '金融', label: '金融' },
    { value: '教育', label: '教育' },
    { value: '医疗', label: '医疗' },
    { value: '房地产', label: '房地产' },
    { value: '零售', label: '零售' },
    { value: '其他', label: '其他' },
  ];

  const sourceOptions = [
    { value: '网络推广', label: '网络推广' },
    { value: '电话营销', label: '电话营销' },
    { value: '客户介绍', label: '客户介绍' },
    { value: '展会', label: '展会' },
    { value: '其他', label: '其他' },
  ];

  useEffect(() => {
    if (isEdit) {
      loadCustomerDetail();
    }
  }, [id]);

  const loadCustomerDetail = async () => {
    try {
      setLoading(true);
      const data = await getCustomerDetail(id);
      setFormData({
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
      });
    } catch (error) {
      toast.error('加载客户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        contact: { ...formData.contact, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = '请输入客户名称';
    if (!formData.type) newErrors.type = '请选择客户类型';
    if (!formData.level) newErrors.level = '请选择客户等级';
    if (!formData.contact.person.trim()) newErrors['contact.person'] = '请输入联系人';
    if (!formData.contact.phone.trim()) {
      newErrors['contact.phone'] = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.contact.phone)) {
      newErrors['contact.phone'] = '请输入正确的手机号码';
    }
    if (formData.contact.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.contact.email)) {
      newErrors['contact.email'] = '请输入正确的邮箱地址';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('请检查表单输入');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        salesPersonId: 'user_1',
        salesPersonName: '张三',
      };

      if (isEdit) {
        await updateCustomer(id, submitData);
        toast.success('客户信息更新成功');
      } else {
        await createCustomer(submitData);
        toast.success('客户创建成功');
      }
      navigate('/app/customer/list');
    } catch (error) {
      toast.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">{isEdit ? '编辑客户' : '新增客户'}</h1>
        <button onClick={() => navigate('/app/customer/list')} className="btn btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="space-y-6">
          <div>
            <h2 className="section-title">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="客户名称" name="name" value={formData.name} onChange={handleChange} placeholder="请输入客户名称" required error={errors.name} />
              <Select label="客户类型" name="type" value={formData.type} onChange={handleChange} options={CUSTOMER_TYPE_OPTIONS} required error={errors.type} />
              <Select label="客户等级" name="level" value={formData.level} onChange={handleChange} options={CUSTOMER_LEVEL_OPTIONS} required error={errors.level} />
              <Select label="所属行业" name="industry" value={formData.industry} onChange={handleChange} options={industryOptions} placeholder="请选择所属行业" />
              <Select label="客户来源" name="source" value={formData.source} onChange={handleChange} options={sourceOptions} placeholder="请选择客户来源" />
              <Input label="客户标签" name="tags" value={formData.tags} onChange={handleChange} placeholder="多个标签用逗号分隔" />
            </div>
          </div>

          <div>
            <h2 className="section-title">联系信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="联系人" name="contact.person" value={formData.contact.person} onChange={handleChange} placeholder="请输入联系人姓名" required error={errors['contact.person']} />
              <Input label="联系电话" name="contact.phone" value={formData.contact.phone} onChange={handleChange} placeholder="请输入手机号码" required error={errors['contact.phone']} />
              <Input label="电子邮箱" name="contact.email" type="email" value={formData.contact.email} onChange={handleChange} placeholder="请输入邮箱地址" error={errors['contact.email']} />
              <Input label="微信号" name="contact.wechat" value={formData.contact.wechat} onChange={handleChange} placeholder="请输入微信号" />
              <div className="md:col-span-2">
                <Input label="联系地址" name="contact.address" value={formData.contact.address} onChange={handleChange} placeholder="请输入联系地址" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="section-title">备注信息</h2>
            <Textarea label="备注" name="remark" value={formData.remark} onChange={handleChange} placeholder="请输入备注信息" rows={4} />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button type="button" onClick={() => navigate('/app/customer/list')} className="btn btn-secondary" disabled={submitting}>取消</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '提交中...' : isEdit ? '保存修改' : '创建客户'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
