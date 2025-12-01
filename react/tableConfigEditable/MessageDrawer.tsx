import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  Button,
  Drawer,
  Box,
  Typography,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Alert,
  Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

// ========================================
// Types
// ========================================
interface Message {
  id: string;
  awdWorkId: string;
  inputDate: string;
  inputUser: string;
  remarkType: string;
  fupRemark: string;
  schemeCode: string;
}

interface MessageDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd: (message: string) => Promise<void> | void; // 支持异步操作
  existingMessages: Message[];
  maxLength?: number; // 消息最大长度
  placeholder?: string; // 输入框占位符
  title?: string; // 抽屉标题
  disableAutoScroll?: boolean; // 是否禁用自动滚动
}

// ========================================
// Constants
// ========================================
const DEFAULT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  PLACEHOLDER: 'Enter your message...',
  TITLE: 'Message Details',
  INPUT_ROWS: 3,
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
  DEBOUNCE_DELAY: 100
} as const;

// ========================================
// 子组件 - 消息列表项 (优化渲染性能)
// ========================================
interface MessageItemProps {
  message: Message;
}

const MessageItem = memo<MessageItemProps>(({ message }) => {
  return (
    <ListItem
      disablePadding
      sx={{
        mb: 1,
        alignItems: 'flex-start',
        '&:hover': {
          backgroundColor: 'action.hover',
          borderRadius: 1
        }
      }}
    >
      <ListItemText
        primary={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 1
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              {message.inputUser}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ flexShrink: 0 }}
            >
              {message.inputDate}
            </Typography>
          </Box>
        }
        secondary={
          <Tooltip
            title={message.fupRemark.length > 50 ? message.fupRemark : ''}
            arrow
            placement="top-start"
            enterDelay={500}
          >
            <Typography
              variant="body2"
              component="span"
              color="text.primary"
              sx={{
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3, // 最多显示3行
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}
            >
              {message.fupRemark}
            </Typography>
          </Tooltip>
        }
      />
    </ListItem>
  );
});

MessageItem.displayName = 'MessageItem';

// ========================================
// 子组件 - 空状态
// ========================================
const EmptyState = memo(() => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 1,
      py: 4
    }}
  >
    <Typography variant="body2" color="text.secondary">
      No messages yet
    </Typography>
    <Typography variant="caption" color="text.disabled">
      Start a conversation by sending a message below
    </Typography>
  </Box>
));

EmptyState.displayName = 'EmptyState';

// ========================================
// 主组件
// ========================================
const MessageDrawer: React.FC<MessageDrawerProps> = ({
  open,
  onClose,
  onAdd,
  existingMessages,
  maxLength = DEFAULT_CONFIG.MAX_MESSAGE_LENGTH,
  placeholder = DEFAULT_CONFIG.PLACEHOLDER,
  title = DEFAULT_CONFIG.TITLE,
  disableAutoScroll = false
}) => {
  // ========================================
  // State
  // ========================================
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // ========================================
  // Refs
  // ========================================
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // ========================================
  // 自动滚动到底部 (带防抖)
  // ========================================
  const scrollToBottom = useCallback((behavior: ScrollBehavior = DEFAULT_CONFIG.SCROLL_BEHAVIOR) => {
    if (disableAutoScroll || !open) return;

    // 清除之前的滚动定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 防抖处理
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current && isMountedRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      }
    }, DEFAULT_CONFIG.DEBOUNCE_DELAY);
  }, [disableAutoScroll, open]);

  // ========================================
  // 消息列表变化时滚动
  // ========================================
  useEffect(() => {
    if (open && existingMessages.length > 0) {
      scrollToBottom();
    }
  }, [existingMessages.length, open, scrollToBottom]);

  // ========================================
  // 抽屉打开时聚焦输入框
  // ========================================
  useEffect(() => {
    if (open) {
      // 延迟聚焦，等待抽屉动画完成
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ========================================
  // 组件卸载清理
  // ========================================
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // ========================================
  // 验证消息
  // ========================================
  const validateMessage = useCallback((message: string): string => {
    const trimmed = message.trim();

    if (trimmed === '') {
      return 'Message cannot be empty';
    }

    if (trimmed.length > maxLength) {
      return `Message cannot exceed ${maxLength} characters`;
    }

    return '';
  }, [maxLength]);

  // ========================================
  // 处理添加消息
  // ========================================
  const handleAdd = useCallback(async () => {
    const validationError = validateMessage(messageInput);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAdd(messageInput.trim());

      if (isMountedRef.current) {
        setMessageInput('');
        setSuccessMessage('Message sent successfully');
        scrollToBottom('smooth');

        // 3秒后清除成功消息
        setTimeout(() => {
          if (isMountedRef.current) {
            setSuccessMessage('');
          }
        }, 3000);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [messageInput, validateMessage, onAdd, scrollToBottom]);

  // ========================================
  // 处理关闭
  // ========================================
  const handleClose = useCallback(() => {
    setMessageInput('');
    setError('');
    setSuccessMessage('');
    onClose();
  }, [onClose]);

  // ========================================
  // 处理输入变化
  // ========================================
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    // 清除错误（如果有内容）
    if (value.trim() !== '' && error) {
      setError('');
    }
  }, [error]);

  // ========================================
  // 处理键盘事件
  // ========================================
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }

    // Escape 关闭抽屉
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleAdd, handleClose]);

  // ========================================
  // 计算剩余字符数
  // ========================================
  const remainingChars = maxLength - messageInput.length;
  const isNearLimit = remainingChars < 50;
  const isOverLimit = remainingChars < 0;

  // ========================================
  // 渲染
  // ========================================
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      aria-labelledby="message-drawer-title"
      aria-describedby="message-drawer-description"
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400, md: 500 },
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ========================================
          Header
          ======================================== */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography
          id="message-drawer-title"
          variant="h6"
          component="h2"
        >
          {title}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Close drawer"
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ========================================
          Success Alert
          ======================================== */}
      {successMessage && (
        <Fade in={!!successMessage}>
          <Box sx={{ p: 2, pb: 0 }}>
            <Alert
              severity="success"
              onClose={() => setSuccessMessage('')}
              sx={{ mb: 0 }}
            >
              {successMessage}
            </Alert>
          </Box>
        </Fade>
      )}

      {/* ========================================
          Messages List
          ======================================== */}
      <Box
        id="message-drawer-description"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          backgroundColor: 'background.default'
        }}
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {existingMessages.length === 0 ? (
          <EmptyState />
        ) : (
          <List dense>
            {existingMessages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} aria-hidden="true" />
          </List>
        )}
      </Box>

      <Divider />

      {/* ========================================
          Input Area
          ======================================== */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          backgroundColor: 'background.paper'
        }}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <TextField
          inputRef={inputRef}
          id="new-message-input"
          label="New Message"
          multiline
          rows={DEFAULT_CONFIG.INPUT_ROWS}
          maxRows={6}
          fullWidth
          variant="outlined"
          value={messageInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          error={!!error || isOverLimit}
          helperText={
            error ||
            (isNearLimit &&
              `${remainingChars} character${remainingChars !== 1 ? 's' : ''} remaining`)
          }
          disabled={isSubmitting}
          placeholder={placeholder}
          inputProps={{
            'aria-label': 'Message input',
            'aria-describedby': 'message-input-helper-text',
            maxLength: maxLength + 100 // 允许稍微超出以显示错误
          }}
          FormHelperTextProps={{
            id: 'message-input-helper-text',
            sx: {
              color: isOverLimit ? 'error.main' : isNearLimit ? 'warning.main' : 'text.secondary'
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: isOverLimit ? 'error.main' : 'primary.main'
              }
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Press Enter to send, Shift+Enter for new line
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleAdd}
            disabled={messageInput.trim() === '' || isSubmitting || isOverLimit}
            startIcon={<SendIcon />}
            sx={{
              minWidth: 100,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 2
              },
              transition: 'all 0.2s'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

// ========================================
// 导出
// ========================================
export default memo(MessageDrawer);

// 导出类型供外部使用
export type { Message, MessageDrawerProps };
