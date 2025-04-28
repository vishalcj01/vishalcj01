'use client';

import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {getMotivationalQuote} from '@/ai/flows/motivational-anime-quotes';

export default function AIMentorChatPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [quote, setQuote] = useState<string>('');

  const sendMessage = async () => {
    if (message.trim() === '') return;

    //Basic history
    setChatHistory(prevHistory => [...prevHistory, `User: ${message}`]);

    const motivationalQuote = await getMotivationalQuote({
      userClass: 'Warrior',
      missionType: 'Fitness',
      missionDescription: message,
    });

    setQuote(motivationalQuote.quote);

    setChatHistory(prevHistory => [...prevHistory, `AI: ${motivationalQuote.quote}`]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 p-4 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${msg.startsWith('User:') ? 'bg-secondary text-secondary-foreground self-start' : 'bg-primary text-primary-foreground self-end'}`}
          >
            {msg}
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-2">
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
