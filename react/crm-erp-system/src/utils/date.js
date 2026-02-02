/**
 * 日期处理工具
 * 基于date-fns封装，提供常用日期操作
 */
import {
  format,
  parse,
  parseISO,
  isValid,
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isBefore,
  isAfter,
  isSameDay,
  formatDistanceToNow,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 默认日期格式
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const TIME_FORMAT = 'HH:mm:ss';
export const MONTH_FORMAT = 'yyyy-MM';

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {string} formatStr - 格式字符串
 * @returns {string}
 */
export const formatDate = (date, formatStr = DATE_FORMAT) => {
  if (!date) return '';
  
  let dateObj = date;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  }
  
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, formatStr, { locale: zhCN });
};

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATETIME_FORMAT);
};

/**
 * 格式化时间
 * @param {Date|string|number} date - 日期
 * @returns {string}
 */
export const formatTime = (date) => {
  return formatDate(date, TIME_FORMAT);
};

/**
 * 解析日期字符串
 * @param {string} dateStr - 日期字符串
 * @param {string} formatStr - 格式字符串
 * @returns {Date|null}
 */
export const parseDate = (dateStr, formatStr = DATE_FORMAT) => {
  if (!dateStr) return null;
  
  const date = parse(dateStr, formatStr, new Date(), { locale: zhCN });
  return isValid(date) ? date : null;
};

/**
 * 获取相对时间描述
 * @param {Date|string|number} date - 日期
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  let dateObj = date;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  }
  
  if (!isValid(dateObj)) return '';
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: zhCN });
};

/**
 * 获取日期范围
 * @param {string} type - 范围类型：today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth, thisYear
 * @returns {{ start: Date, end: Date }}
 */
export const getDateRange = (type) => {
  const today = new Date();
  
  switch (type) {
    case 'today':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
    case 'yesterday':
      const yesterday = subDays(today, 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      };
    case 'thisWeek':
      return {
        start: startOfWeek(today, { locale: zhCN }),
        end: endOfWeek(today, { locale: zhCN }),
      };
    case 'lastWeek':
      const lastWeek = subDays(today, 7);
      return {
        start: startOfWeek(lastWeek, { locale: zhCN }),
        end: endOfWeek(lastWeek, { locale: zhCN }),
      };
    case 'thisMonth':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
    case 'lastMonth':
      const lastMonth = subMonths(today, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      };
    case 'thisYear':
      return {
        start: startOfYear(today),
        end: endOfYear(today),
      };
    case 'last7Days':
      return {
        start: startOfDay(subDays(today, 6)),
        end: endOfDay(today),
      };
    case 'last30Days':
      return {
        start: startOfDay(subDays(today, 29)),
        end: endOfDay(today),
      };
    default:
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
  }
};

/**
 * 计算日期差
 * @param {Date} date1 - 日期1
 * @param {Date} date2 - 日期2
 * @param {string} unit - 单位：days, months, years
 * @returns {number}
 */
export const dateDiff = (date1, date2, unit = 'days') => {
  switch (unit) {
    case 'days':
      return differenceInDays(date1, date2);
    case 'months':
      return differenceInMonths(date1, date2);
    case 'years':
      return differenceInYears(date1, date2);
    default:
      return differenceInDays(date1, date2);
  }
};

/**
 * 日期操作
 */
export const dateOps = {
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
};

/**
 * 日期比较
 */
export const dateCompare = {
  isBefore,
  isAfter,
  isSameDay,
  isValid,
};

/**
 * 判断日期是否过期
 * @param {Date|string} date - 日期
 * @returns {boolean}
 */
export const isExpired = (date) => {
  if (!date) return true;
  
  let dateObj = date;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  }
  
  return isBefore(dateObj, new Date());
};

/**
 * 获取日期选项（用于下拉选择）
 * @returns {Array}
 */
export const getDateRangeOptions = () => [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'last7Days', label: '最近7天' },
  { value: 'last30Days', label: '最近30天' },
  { value: 'thisWeek', label: '本周' },
  { value: 'lastWeek', label: '上周' },
  { value: 'thisMonth', label: '本月' },
  { value: 'lastMonth', label: '上月' },
  { value: 'thisYear', label: '今年' },
];

export default {
  formatDate,
  formatDateTime,
  formatTime,
  parseDate,
  getRelativeTime,
  getDateRange,
  dateDiff,
  dateOps,
  dateCompare,
  isExpired,
  getDateRangeOptions,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  MONTH_FORMAT,
};
