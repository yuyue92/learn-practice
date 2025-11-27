import React, {
  useRef,
  useState,
  useCallback,
  KeyboardEvent,
  FocusEvent,
  MouseEvent,
} from 'react';

export function NativeSelectWithClose() {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  // 认为“下拉是否处于打开状态”的内存状态（我们自己维护）
  const [isOpen, setIsOpen] = useState(false);
  // 用来区分：本次 click 是否紧接着当前元素上的 mousedown（即“点自己打开”的那一下）
  const mouseDownOnSelect = useRef(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      // console.log('select 打开了');
    }
  };

  const handleClose = (reason: string) => {
    if (!isOpen) return;
    setIsOpen(false);
    const value = selectRef.current?.value;
    console.log('select 收起了，reason:', reason, 'value:', value);
    // TODO: 在这里写你的业务逻辑，例如：
    // onClose?.(value)
  };

  // 用户按下鼠标，可能是为了打开下拉
  const handleMouseDown = useCallback((e: MouseEvent<HTMLSelectElement>) => {
    mouseDownOnSelect.current = true;
  }, []);

  // 点击事件会经历两类情况：
  // 1）第一次点击：关闭状态 -> 打开下拉（不触发 close）
  // 2）已打开状态下，用户点击选项后，浏览器会在 select 上再触发一次 click（当成 close）
  const handleClick = useCallback((e: MouseEvent<HTMLSelectElement>) => {
    // 如果是我们刚才在这个 select 上触发的 mousedown，对应“打开”这一击
    if (mouseDownOnSelect.current) {
      mouseDownOnSelect.current = false;

      if (!isOpen) {
        // 第一次点击：从关闭 -> 打开，下拉弹出，此时不触发 close
        handleOpen();
        return;
      }
      // 已经是 open 状态又点自己（少见场景），可以视作 close
      handleClose('click-self-while-open');
      return;
    }

    // 如果不是由本元素的 mousedown 引起的 click（例如点击选项完后冒泡到 select）
    // 且当前我们认为是“打开状态”，则当成 close
    if (isOpen) {
      handleClose('click-option-or-outside');
    }
  }, [isOpen]);

  // 键盘交互：简单兼容 Enter / Escape 收起
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSelectElement>) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        // 这里不去强行区分 open / close 的切换，只在 isOpen 时认为是 close
        if (isOpen) {
          handleClose('keydown:' + e.key);
        } else {
          handleOpen();
        }
      }
    },
    [isOpen]
  );

  // 焦点离开：认为是 close
  const handleBlur = useCallback((e: FocusEvent<HTMLSelectElement>) => {
    if (isOpen) {
      handleClose('blur');
    }
  }, [isOpen]);

  return (
    <select
      ref={selectRef}
      defaultValue="a"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <option value="a">A</option>
      <option value="b">B</option>
      <option value="c">C</option>
    </select>
  );
}
