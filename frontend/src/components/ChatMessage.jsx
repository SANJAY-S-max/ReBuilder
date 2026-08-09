import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'slide-in-left' : 'slide-in-right justify-end'} mb-4`}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isBot ? '' : 'order-first'}`}>
        <div
          className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
            isBot
              ? 'bg-slate-100 border border-slate-200 text-slate-800'
              : 'bg-blue-700 text-white'
          }`}
        >
          {isBot ? (
            <div className="chat-bot-content" dangerouslySetInnerHTML={{ __html: formatBotMessage(message.text) }} />
          ) : (
            <span className="whitespace-pre-wrap">{message.text}</span>
          )}
        </div>

        {message.suggestion && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            {message.suggestion}
          </div>
        )}

        <div className={`mt-1 text-[11px] text-slate-400 ${isBot ? '' : 'text-right'}`}>
          {message.timestamp}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

function formatBotMessage(text) {
  if (!text) return '';
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-800 font-semibold">$1</strong>');
  html = html.replace(/\n/g, '<br/>');
  html = html.replace(/💡\s*(Tip:.*)/g, '<span class="inline-block mt-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">💡 $1</span>');
  return html;
}

export default ChatMessage;
