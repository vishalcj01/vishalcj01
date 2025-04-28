'use client';

import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {getChatResponse} from '@/ai/flows/ai-mentor-chat';

export default function AIMentorChatPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState<string>('');

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setChatHistory(prevHistory => [...prevHistory, `User: ${message}`]);

    try {
      const chatResponse = await getChatResponse({
        message: message,
        userClass: 'Warrior',
      });

      setAiResponse(chatResponse.response);
      setChatHistory(prevHistory => [...prevHistory, `AI: ${chatResponse.response}`]);
    } catch (error: any) {
      console.error('Error getting chat response:', error);
      setChatHistory(prevHistory => [...prevHistory, `AI: Error getting response.`]);
      setAiResponse('Error getting response. Please try again.');
    }

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
