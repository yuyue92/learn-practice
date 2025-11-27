import { useRef, useState, useCallback } from 'react';

export function NativeSelectWithClose() {
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClick = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        // 认为是“收起”
        handleClose('click');
      }
      return false;
    });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (!isOpen) return;

    if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
      setIsOpen(false);
      handleClose('keydown:' + e.key);
    }
  }, [isOpen]);

  const handleBlur = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        handleClose('blur');
      }
      return false;
    });
  }, []);

  const handleClose = (reason: string) => {
    const value = selectRef.current?.value;
    console.log('select 收起了，原因:', reason, '当前值:', value);
    // TODO: 这里写你的逻辑（比如触发搜索、提交等）
  };

  return (
    <select
      ref={selectRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      defaultValue="a"
    >
      <option value="a">A</option>
      <option value="b">B</option>
      <option value="c">C</option>
    </select>
  );
}
