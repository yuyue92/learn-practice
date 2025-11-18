// tableConfig.js

// 表格列配置
export const tableColumns = [
  {
    key: 'name',
    label: '姓名',
    type: 'text',
    placeholder: '请输入姓名',
    required: true,
    width: '120px'
  },
  {
    key: 'amount',
    label: '金额',
    type: 'amount',
    placeholder: '0',
    required: true,
    width: '150px',
    format: 'thousand'
  },
  {
    key: 'date',
    label: '日期',
    type: 'date',
    required: false,
    width: '150px'
  },
  {
    key: 'phone',
    label: '电话',
    type: 'phone',
    placeholder: '请输入电话号码',
    required: false,
    width: '150px',
    validate: (value) => {
      const re = /^1[3-9]\d{9}$/;
      return re.test(value) || value === '';
    },
    errorMessage: '电话号码格式不正确'
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'email',
    placeholder: '请输入邮箱地址',
    required: false,
    width: '200px',
    validate: (value) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(value) || value === '';
    },
    errorMessage: '邮箱格式不正确'
  }
];

// 表格默认配置
export const tableConfig = {
  fixedActions: true, // 是否固定操作栏
  autoAddRow: true,   // 是否在行尾自动添加新行
  enableKeyboardNav: true, // 是否启用键盘导航
  defaultRowData: {
    name: '',
    amount: 0,
    date: '',
    phone: '',
    email: ''
  }
};

// 初始数据
export const initialData = [
  { id: 1, name: '张三', amount: 1234567, date: '2023-06-15', phone: '13800138000', email: 'zhang@example.com' },
  { id: 2, name: '李四', amount: 987654, date: '2023-07-20', phone: '13900139000', email: 'li@example.com' },
  { id: 3, name: '王五', amount: 500000, date: '2023-08-25', phone: '13700137000', email: 'wang@example.com' }
];
