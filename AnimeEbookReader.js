import React, { useState } from 'react';
import { Book, Settings, Moon, Sun } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AnimeEbookReader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      if (['pdf', 'epub'].includes(fileType)) {
        setCurrentFile(file);
        setError('');
      } else {
        setError('Formato de arquivo não suportado. Por favor, use PDF ou EPUB.');
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-50'}`}>
      {/* Header com estilo anime */}
      <header className="bg-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Book className="w-8 h-8" />
            <h1 className="text-2xl font-bold" style={{fontFamily: "'Segoe UI', sans-serif"}}>
              Anime Book Reader
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Área de upload */}
        <Card className={`mb-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-xl">
                <label
                  className={`border-2 border-dashed ${
                    darkMode ? 'border-purple-400' : 'border-purple-600'
                  } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors`}
                >
                  <Book className="w-12 h-12 mb-4 text-purple-600" />
                  <span className="text-lg mb-2">Arraste seu arquivo ou clique para selecionar</span>
                  <span className="text-sm text-gray-500">Suporta PDF e EPUB</span>
                  <input
                    type="file"
                    accept=".pdf,.epub"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {currentFile && (
                <div className="text-center">
                  <p className="text-lg">
                    Arquivo selecionado: <span className="font-bold">{currentFile.name}</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Área de visualização */}
        <Card className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <CardContent className="p-6">
            {currentFile ? (
              <div className="text-center p-8">
                <p className="text-lg mb-4">
                  Visualizador em desenvolvimento. Em breve você poderá ler {currentFile.name} aqui!
                </p>
              </div>
            ) : (
              <div className="text-center p-8">
                <Settings className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin-slow" />
                <p className="text-lg">Selecione um arquivo para começar a leitura</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AnimeEbookReader;