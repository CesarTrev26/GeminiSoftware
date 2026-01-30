import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChat3DBackground from './AIChat3DBackground';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  projects?: Array<{ title: string; slug: string; category: string }>;
}

const SUGGESTED_QUESTIONS = [
  "¿Qué servicios ofrecen?",
  "Muéstrame proyectos de desarrollo web",
  "¿Tienen experiencia con React?",
  "Necesito una app móvil",
  "Quiero ver proyectos de e-commerce"
];

// API URL - cambiar a localhost para desarrollo
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api' 
  : 'https://gemini-backend.fly.dev/api';

// Generar o recuperar sessionId único (solo en el navegador)
const getSessionId = (): string => {
  // Check if we're in the browser
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  
  const stored = localStorage.getItem('gemini_chat_session');
  if (stored) return stored;
  
  const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  localStorage.setItem('gemini_chat_session', newId);
  return newId;
};

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy el asistente virtual de Gemini Software. Puedo ayudarte a encontrar el servicio perfecto para tu proyecto o mostrarte ejemplos de nuestro trabajo. ¿En qué puedo ayudarte?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particleBurst, setParticleBurst] = useState(false);
  const [sessionId] = useState(getSessionId);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (isOpen) {
      // Save scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll on mobile
      if (window.innerWidth < 640) {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      }
      
      return () => {
        // Restore body scroll
        if (window.innerWidth < 640) {
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
          window.scrollTo(0, scrollY);
        }
      };
    }
  }, [isOpen]);

  // Cargar historial cuando se abre el chat
  useEffect(() => {
    if (isOpen && !historyLoaded) {
      loadHistory();
    }
  }, [isOpen, historyLoaded]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/ai/history/${sessionId}`);
      const data = await response.json();
      
      if (data.success && data.data.messages?.length > 0) {
        const loadedMessages: Message[] = data.data.messages.map((m: { role: string; content: string; timestamp: string; projects?: string[] }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.timestamp),
          projects: m.projects
        }));
        setMessages([messages[0], ...loadedMessages]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setHistoryLoaded(true);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Trigger particle burst animation
    setParticleBurst(true);
    setTimeout(() => setParticleBurst(false), 1000);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          sessionId 
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(),
        projects: data.data.projects
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-[0_8px_40px_rgba(1,24,61,0.6)] transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #01183D 0%, #0066CC 100%)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
        aria-label={isOpen ? "Cerrar chat de ayuda" : "Abrir chat de ayuda"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {/* Pulsing indicator */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-[10000] sm:z-[60] w-full sm:w-[400px] h-full sm:h-[calc(100vh-8rem)] sm:max-h-[600px] bg-gray-50 dark:bg-gray-900 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border-0 sm:border border-gray-200 dark:border-gray-700"
          >
            {/* 3D Background */}
            <AIChat3DBackground burst={particleBurst} />
            
            {/* Header */}
            <div className="p-4 text-white relative z-10" style={{ background: 'linear-gradient(90deg, #01183D 0%, #0066CC 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Asistente Gemini AI</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    En línea
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Cerrar chat"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 relative z-10"
              style={{ 
                WebkitOverflowScrolling: 'touch', 
                overscrollBehavior: 'contain',
                touchAction: 'pan-y' // Allow only vertical scrolling
              }}
              onWheel={(e) => {
                const target = e.currentTarget;
                const isAtTop = target.scrollTop === 0;
                const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;
                
                // Prevent parent scroll when scrolling inside chat
                if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
                  e.stopPropagation();
                }
              }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        msg.role === 'user'
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600'
                      }`}
                      style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #0066CC 0%, #004C99 100%)' } : undefined}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    
                    {/* Projects recommendations */}
                    {msg.projects && msg.projects.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 space-y-2"
                      >
                        {msg.projects.map((project, pIdx) => (
                          <a
                            key={pIdx}
                            href={`/portfolio/${project.slug}`}
                            className="block bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{project.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{project.category}</p>
                              </div>
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </a>
                        ))}
                      </motion.div>
                    )}
                    
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 px-1">
                      {msg.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex gap-1.5">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-white/20 relative z-10" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sugerencias:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.slice(0, 3).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full transition-colors duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 relative z-10" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500 disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Enviar mensaje"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                Impulsado por IA • Respuestas en tiempo real
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChat;
