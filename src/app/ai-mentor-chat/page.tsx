
'use client';

import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {getChatResponse} from '@/ai/flows/ai-mentor-chat';
import {useToast} from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

export default function AIMentorChatPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<
    {sender: 'user' | 'ai'; message: string}[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const {toast} = useToast();

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setIsSubmitting(true); // Disable button while submitting
    setChatHistory(prevHistory => [...prevHistory, {sender: 'user', message: message}]);

    try {
      const chatResponse = await getChatResponse({
        message: message,
        userClass: 'Warrior', // Default user class - can be made dynamic later
      });

      // Ensure that response is properly formatted before displaying
      const formattedResponse = chatResponse.response.trim();

      setChatHistory(prevHistory => [
        ...prevHistory,
        {sender: 'ai', message: formattedResponse},
      ]);
    } catch (error: any) {
      console.error('Error getting chat response:', error);
      setChatHistory(prevHistory => [
        ...prevHistory,
        {sender: 'ai', message: 'Error getting response.'},
      ]);
      toast({
        title: 'AI Chat Error',
        description: error.message || 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false); // Re-enable button
      setMessage(''); // Clear input field
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline insertion
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 p-4 overflow-y-auto">
        {chatHistory.map((chatItem, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg ${
              chatItem.sender === 'user'
                ? 'bg-secondary text-secondary-foreground self-start'
                : 'bg-primary text-primary-foreground self-end'
            }`}
          >
            {chatItem.sender === 'user' ? (
              <div>{chatItem.message}</div>
            ) : (
              <ReactMarkdown>{chatItem.message}</ReactMarkdown>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-2">
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
