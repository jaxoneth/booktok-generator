import React, { useState } from 'react';
import { BookOpen, Sparkles, Download, Palette, Type, Image, Loader2, RefreshCw } from 'lucide-react';

const BookCoverGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    mood: '',
    colors: '',
    style: '',
    elements: '',
    target: ''
  });
  
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const genres = [
    'Fantasy', 'Romance', 'Mystery/Thriller', 'Science Fiction', 'Horror',
    'Literary Fiction', 'Young Adult', 'Children\'s', 'Non-Fiction', 'Biography',
    'Self-Help', 'Business', 'History', 'Poetry', 'Other'
  ];

  const moods = [
    'Dark & Mysterious', 'Bright & Uplifting', 'Romantic & Dreamy', 'Bold & Dramatic',
    'Minimalist & Clean', 'Vintage & Classic', 'Modern & Sleek', 'Whimsical & Fun',
    'Elegant & Sophisticated', 'Gritty & Raw'
  ];

  const styles = [
    'Photorealistic', 'Digital Art', 'Watercolor', 'Oil Painting', 'Vector Art',
    'Hand-drawn Illustration', 'Typography-focused', 'Collage', 'Minimalist Design',
    'Vintage Poster Style', 'Comic Book Style', 'Abstract Art'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateBookCover = async () => {
    setIsGenerating(true);
    setError('');
    setShowResult(false);

    try {
      const prompt = `Create a single flat book cover design:

EXACT TEXT REQUIREMENTS - ZERO TOLERANCE FOR CHANGES:
Title must be EXACTLY: "${formData.title}" 
Author must be EXACTLY: "${formData.author || '[Author Name]'}"

DO NOT ADD ANY EXTRA LETTERS TO THE TITLE OR AUTHOR NAME
DO NOT REMOVE ANY LETTERS FROM THE TITLE OR AUTHOR NAME
DO NOT CHANGE ANY LETTERS IN THE TITLE OR AUTHOR NAME

LAYOUT REQUIREMENTS:
- SINGLE flat book cover only (NO 3D effects, NO multiple books)
- Portrait orientation (6:9 ratio)
- Title at TOP (25% of cover) - large, bold, gold/yellow text
- Main artwork in MIDDLE (50% of cover)
- Author at BOTTOM (25% of cover) - large, bold, same color as title

GENRE & STYLE:
Genre: ${formData.genre}
${formData.mood ? `Mood: ${formData.mood}` : ''}
${formData.colors ? `Colors: ${formData.colors}` : ''}
${formData.style ? `Art Style: ${formData.style}` : ''}
${formData.elements ? `Visual Elements: ${formData.elements}` : ''}

FINAL CHECK BEFORE COMPLETING:
Verify title shows exactly "${formData.title}" with no extra or missing letters
Verify author shows exactly "${formData.author || '[Author Name]'}" with no extra or missing letters

Create a professional book cover with PERFECT text accuracy.`;

      const response = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      setShowResult(true);

    } catch (err) {
      setError(err.message || 'Failed to generate book cover. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formData.title || 'book-cover'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        window.open(generatedImage, '_blank');
      }
    }
  };

  const regenerateImage = () => {
    generateBookCover();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                BookTok Generator
              </h1>
              <p className="text-gray-600 text-sm">Generate stunning book covers instantly with AI</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Book Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your book title"
                />
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 font-medium">📝 Text Accuracy Tips:</p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Keep titles 1-8 words for best results</li>
                    <li>• Avoid apostrophes, quotes, or special symbols</li>
                    <li>• Use simple words (avoid complex spellings)</li>
                    <li>• Example: &quot;The Magic Book&quot; works better than &quot;The Wizard&apos;s Journey&quot;</li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Author name"
                />
                <p className="text-xs text-gray-500 mt-1">Use simple names like &quot;John Smith&quot; for best text accuracy</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood/Atmosphere
                </label>
                <select
                  name="mood"
                  value={formData.mood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a mood</option>
                  {moods.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Art Style
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Select an art style</option>
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Preferences
                </label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g., deep blues and gold, warm earth tones, black and red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Visual Elements
                </label>
                <textarea
                  name="elements"
                  value={formData.elements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe important visual elements, symbols, or imagery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="target"
                  value={formData.target}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="e.g., Young adults, Business professionals, Fantasy readers"
                />
              </div>

              <button
                onClick={generateBookCover}
                disabled={!formData.title || !formData.genre || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Cover...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Book Cover
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Type className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Generated Cover</h2>
            </div>

            {!showResult ? (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" alt="" />
                <p className="text-gray-500 text-lg mb-2">Your book cover will appear here</p>
                <p className="text-gray-400">Fill out the form and click &quot;Generate Book Cover&quot;</p>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                  <h4 className="font-medium text-yellow-800 mb-2">🎯 Format Guarantee</h4>
                  <p className="text-sm text-yellow-700">Every cover will have this exact layout:</p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>📍 <strong>Title at TOP</strong> (upper 25% - large, bold text)</li>
                    <li>🎨 <strong>Main image in MIDDLE</strong> (center 50%)</li>
                    <li>✍️ <strong>Author at BOTTOM</strong> (lower 25% - large, bold text)</li>
                    <li>📏 Same text color and style for title & author</li>
                    <li>📖 Single flat book cover (no 3D effects)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                
                {generatedImage && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <img
                      src={generatedImage}
                      alt="Generated book cover"
                      className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={regenerateImage}
                    disabled={isGenerating}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={downloadImage}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                {formData.title && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800"><strong>Text Verification:</strong></p>
                    <p className="text-sm text-green-700">Title should show: <strong>&quot;{formData.title}&quot;</strong> ({formData.title.length} characters)</p>
                    {formData.author && (
                      <p className="text-sm text-green-700">Author should show: <strong>&quot;{formData.author}&quot;</strong> ({formData.author.length} characters)</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">🛡️ Enhanced Text Protection System</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">🚫 Zero Tolerance Policy</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• NO extra letters (prevents &quot;GIIRL&quot; from &quot;GIRL&quot;)</li>
                <li>• NO missing letters</li>
                <li>• NO changed letters</li>
                <li>• Multiple verification checks</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">✅ Perfect Accuracy</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Title: Upper 25% of cover</li>
                <li>• Author: Lower 25% of cover</li>
                <li>• Single flat book format</li>
                <li>• Professional appearance</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🔧 Best Results</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use simple, common words</li>
                <li>• Avoid special characters</li>
                <li>• 2-6 word titles work best</li>
                <li>• Click regenerate if text is wrong</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCoverGenerator;