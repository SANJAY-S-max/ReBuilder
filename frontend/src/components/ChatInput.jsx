import { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

const ChatInput = ({ onSend, disabled, placeholder, multiline }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled, placeholder]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (multiline && e.shiftKey) return; // allow newline in multiline mode
      if (!multiline || !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder || 'Type your answer...'}
        rows={1}
        className="chat-input-field"
        id="chat-input"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          value.trim() && !disabled
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105'
            : 'bg-white/5 text-slate-500 cursor-not-allowed'
        }`}
        id="send-button"
      >
        <Send size={16} />
      </button>
      {multiline && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 flex items-center gap-1 opacity-60">
          <CornerDownLeft size={10} /> Shift+Enter for newline
        </div>
      )}
    </div>
  );
};

export default ChatInput;
