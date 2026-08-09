import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'slide-in-left' : 'slide-in-right justify-end'} mb-5`}>
      {isBot && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot size={18} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isBot ? '' : 'order-first'}`}>
        <div
          className={`px-5 py-3.5 rounded-2xl text-[14.5px] leading-relaxed ${
            isBot
              ? 'bg-[#1a1a2e]/80 border border-white/[0.06] text-slate-200'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
          }`}
        >
          {isBot ? (
            <div
              className="chat-bot-content"
              dangerouslySetInnerHTML={{
                __html: formatBotMessage(message.text),
              }}
            />
          ) : (
            <span className="whitespace-pre-wrap">{message.text}</span>
          )}
        </div>

        {message.suggestion && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            {message.suggestion}
          </div>
        )}

        <div className={`mt-1.5 text-[11px] text-slate-500 ${isBot ? '' : 'text-right'}`}>
          {message.timestamp}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
};

function formatBotMessage(text) {
  if (!text) return '';
  // Convert markdown-like **bold** to <strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300 font-semibold">$1</strong>');
  // Convert newlines to <br>
  html = html.replace(/\n/g, '<br/>');
  // Convert 💡 tips
  html = html.replace(
    /💡\s*(Tip:.*)/g,
    '<span class="inline-block mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-300 text-[12px]">💡 $1</span>'
  );
  return html;
}

export default ChatMessage;
