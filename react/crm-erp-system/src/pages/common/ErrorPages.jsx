/**
 * 403 无权限页面
 */
import { useNavigate } from 'react-router-dom';
import { HiOutlineShieldExclamation } from 'react-icons/hi';

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <HiOutlineShieldExclamation className="w-24 h-24 mx-auto text-danger-500 mb-6" />
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">403</h1>
        <p className="text-xl text-neutral-500 mb-8">抱歉，您没有权限访问此页面</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          返回上一页
        </button>
      </div>
    </div>
  );
};

/**
 * 404 页面不存在
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <div className="text-9xl font-bold text-neutral-200 dark:text-neutral-700 mb-4">404</div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">页面不存在</h1>
        <p className="text-neutral-500 mb-8">您访问的页面可能已被删除或移动</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          返回首页
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
