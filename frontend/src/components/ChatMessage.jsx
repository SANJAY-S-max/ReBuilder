import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'slide-in-left' : 'slide-in-right justify-end'} mb-4`}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[82%] ${isBot ? '' : 'order-first'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isBot
              ? 'bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 text-slate-800 dark:text-slate-100 rounded-tl-sm'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-500/15'
          }`}
        >
          {isBot ? (
            <div className="chat-bot-content" dangerouslySetInnerHTML={{ __html: formatBotMessage(message.text) }} />
          ) : (
            <span className="whitespace-pre-wrap">{message.text}</span>
          )}
        </div>

        {message.suggestion && (
          <div className="mt-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs">
            {message.suggestion}
          </div>
        )}

        <div className={`mt-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono ${isBot ? '' : 'text-right'}`}>
          {message.timestamp}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700 dark:bg-slate-800 border border-slate-600/50 dark:border-slate-700 flex items-center justify-center shadow-sm">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

function formatBotMessage(text) {
  if (!text) return '';
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-700 dark:text-blue-400 font-semibold">$1</strong>');
  html = html.replace(/\n/g, '<br/>');
  html = html.replace(/💡\s*(Tip:.*)/g, '<span class="inline-block mt-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs font-normal">💡 $1</span>');
  return html;
}

export default ChatMessage;
