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
      const prompt = `You are creating a book cover. Follow these instructions EXACTLY:

STEP 1: TEXT TRANSCRIPTION (CRITICAL)
Title to display: "${formData.title}"
Author to display: ${formData.author || '[Author Name]'}

STEP 2: TEXT RULES (MANDATORY)
- Copy the title LETTER BY LETTER exactly as shown: ${formData.title.split('').join(' - ')}
- Copy the author LETTER BY LETTER exactly as shown: ${(formData.author || '[Author Name]').split('').join(' - ')}
- DO NOT modify, add, remove, or change ANY single character
- DO NOT add decorative elements to letters
- DO NOT use stylized fonts that alter letter shapes
- Use ONLY standard, clean typography
- ZERO tolerance for text changes

STEP 3: VISUAL DESIGN
Genre: ${formData.genre}
${formData.mood ? `Mood: ${formData.mood}` : ''}
${formData.colors ? `Colors: ${formData.colors}` : ''}
${formData.style ? `Art Style: ${formData.style}` : ''}
${formData.elements ? `Visual Elements: ${formData.elements}` : ''}

STEP 4: TECHNICAL SPECIFICATIONS
- Format: 6:9 aspect ratio book cover
- Title placement: Top third of cover
- Author placement: Bottom of cover
- Text orientation: Horizontal only
- Font style: Simple, sans-serif, high readability
- Text color: High contrast with background
- NO text effects, shadows, or distortions

STEP 5: QUALITY CONTROL
Before finalizing, verify:
✓ Title matches EXACTLY: "${formData.title}"
✓ Author matches EXACTLY: ${formData.author || '[Author Name]'}
✓ No extra letters, symbols, or characters
✓ No missing letters
✓ Text is perfectly horizontal and readable

Generate the book cover following ALL steps above.`;

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
                <p className="text-xs text-gray-500 mt-1">Keep titles simple for best text accuracy</p>
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
                <p className="text-xs text-gray-500 mt-1">Avoid special characters for best results</p>
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
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Your book cover will appear here</p>
                <p className="text-gray-400">Fill out the form and click &quot;Generate Book Cover&quot;</p>
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
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Pro Tips for Better Book Covers</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Text Accuracy Tips</h4>
              <p className="text-sm text-purple-700">Keep titles under 4 words and avoid special characters. Simple titles like &quot;The Magic Book&quot; work best for accurate text generation.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Typography Matters</h4>
              <p className="text-sm text-blue-700">Your title should be readable even as a small thumbnail. Bold, clear fonts often work better than decorative ones.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Test Different Versions</h4>
              <p className="text-sm text-green-700">Generate multiple variations by tweaking the prompt. A/B test with your target audience to see what resonates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCoverGenerator;