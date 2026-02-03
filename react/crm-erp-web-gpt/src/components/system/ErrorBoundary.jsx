import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || '页面发生异常' };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <div className="ui-card p-4">
            <div className="text-sm font-semibold">发生错误</div>
            <div className="mt-2 text-xs text-slate-500">{this.state.message}</div>
            <button className="ui-btn ui-btn-ghost mt-3" onClick={() => window.location.reload()} type="button">刷新</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
