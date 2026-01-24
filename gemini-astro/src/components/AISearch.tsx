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
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline text-sm">Buscar con IA</span>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl z-50 px-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Busca proyectos... ej: 'e-commerce con Shopify', 'sitio inmobiliario', 'CRM'"
                      autoFocus
                      className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Búsqueda impulsada por IA</span>
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-12 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-gray-500">Buscando proyectos...</p>
                    </div>
                  ) : query.length < 3 ? (
                    <div className="p-12 text-center">
                      <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-gray-500">Escribe al menos 3 caracteres para buscar</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <span className="text-xs text-gray-400">Sugerencias:</span>
                        {['e-commerce', 'inmobiliario', 'CRM', 'React'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : results.length === 0 && !message ? (
                    <div className="p-12 text-center">
                      <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 mb-2">No se encontraron resultados</p>
                      <p className="text-sm text-gray-400">Intenta con otros términos</p>
                    </div>
                  ) : (
                    <div className="p-4">
                      {message && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {message}
                          </p>
                        </div>
                      )}
                      <div className="space-y-3">
                        {results.map((project, idx) => (
                          <motion.a
                            key={project.id}
                            href={`/portfolio/${project.slug}`}
                            onClick={() => setIsOpen(false)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="block p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 group"
                          >
                            <div className="flex items-start gap-4">
                              {project.thumbnail && (
                                <img
                                  src={project.thumbnail}
                                  alt={project.title}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                                    {project.title}
                                  </h3>
                                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                                <p className="text-xs text-primary font-medium mb-2">{project.category}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ESC para cerrar</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" />
                      </svg>
                      Búsqueda inteligente con IA
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut listener */}
      {typeof window !== 'undefined' && (
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', (e) => {
              if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                // Trigger search modal
              }
              if (e.key === 'Escape') {
                // Close modals
              }
            });
          `
        }} />
      )}
    </>
  );
}
