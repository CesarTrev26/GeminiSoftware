import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  thumbnail: string | null;
}

export default function AISearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setMessage('');
      return;
    }

    const timeoutId = setTimeout(() => {
      searchProjects();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://gemini-backend.fly.dev/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setResults(data.data.projects || []);
      setMessage(data.data.message || '');
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Error al buscar proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white/90 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-lg transition-all duration-200 border border-white/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Buscar proyectos"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden md:inline text-sm font-medium">Buscar Proyectos</span>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-4 sm:top-16 left-4 right-4 sm:left-0 sm:right-0 sm:mx-auto sm:w-[90%] sm:max-w-3xl z-[70] max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-8rem)] flex flex-col"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                {/* Search Input */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Busca proyectos... 'e-commerce', 'inmobiliario', 'CRM'"
                      autoFocus
                      className="flex-1 text-base sm:text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                      aria-label="Cerrar búsqueda"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-3 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Búsqueda semántica con IA</span>
                  </div>
                </div>

                {/* Results */}
                <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100dvh - 16rem)' }}>
                  {isLoading ? (
                    <div className="p-8 sm:p-12 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-sm sm:text-base text-gray-500">Buscando proyectos...</p>
                    </div>
                  ) : query.length < 3 ? (
                    <div className="p-8 sm:p-12 text-center">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm sm:text-base text-gray-500 mb-4">Escribe al menos 3 caracteres para buscar</p>
                      <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2">
                        <span className="text-xs text-gray-400 w-full mb-1">Sugerencias:</span>
                        {['e-commerce', 'inmobiliario', 'Next.js', 'CRM', 'React', 'Shopify'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-3 py-1.5 text-xs bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary dark:text-cyan-400 rounded-full transition-all duration-200 border border-primary/20"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : results.length === 0 && !isLoading ? (
                    <div className="p-8 sm:p-12 text-center">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm sm:text-base text-gray-500 mb-2">No se encontraron resultados</p>
                      <p className="text-xs sm:text-sm text-gray-400">Intenta con otros términos o tecnologías</p>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4">
                      {message && (
                        <div className="mb-3 sm:mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{message}</span>
                          </p>
                        </div>
                      )}
                      <div className="space-y-2 sm:space-y-3">
                        {results.map((project, idx) => (
                          <motion.a
                            key={project.id}
                            href={`/portfolio/${project.slug}`}
                            onClick={() => setIsOpen(false)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="block p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 hover:from-primary/5 hover:to-secondary/5 dark:hover:from-primary/10 dark:hover:to-secondary/10 rounded-lg sm:rounded-xl transition-all duration-200 group border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:shadow-md"
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              {project.thumbnail && (
                                <img
                                  src={project.thumbnail}
                                  alt={project.title}
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-primary/30 transition-all"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                    {project.title}
                                  </h3>
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-primary dark:text-cyan-400 mb-1.5">{project.category}</p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono text-[10px]">ESC</kbd>
                      <span className="hidden sm:inline">para cerrar</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" />
                      </svg>
                      <span className="hidden sm:inline">Búsqueda inteligente</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
