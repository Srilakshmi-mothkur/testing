import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';

const MentorChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me anything about your students or mentoring activities.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(
        '/api/mentor/chat',
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '350px',
        height: '450px',
        backgroundColor: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        zIndex: 1000,
      }}
    >
      <header
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#3b82f6',
          color: '#fff',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          cursor: 'grab'
        }}
      >
        Mentor Chatbot
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '1.25rem',
            cursor: 'pointer',
            lineHeight: '1'
          }}
          aria-label="Close chatbot"
        >
          &times;
        </button>
      </header>

      <div
        style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          backgroundColor: '#f9fafb',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.75rem',
              textAlign: msg.sender === 'user' ? 'right' : 'left',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 0.75rem',
                borderRadius: '16px',
                backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#e5e7eb',
                color: msg.sender === 'user' ? '#fff' : '#111',
                maxWidth: '80%',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        style={{
          padding: '0.75rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '0.5rem'
        }}
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          style={{
            flex: 1,
            resize: 'none',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            fontFamily: 'inherit',
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '0 1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MentorChatbot;
