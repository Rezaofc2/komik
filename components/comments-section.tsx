'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  name: string;
  text: string;
  timestamp: string;
}

export default function CommentsSection({ chapterId }: { chapterId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments from localStorage
  useEffect(() => {
    const storageKey = `comments_${chapterId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [chapterId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);

    const newComment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      text: text.trim(),
      timestamp: new Date().toLocaleString('id-ID'),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);

    const storageKey = `comments_${chapterId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));

    setName('');
    setText('');
    setIsSubmitting(false);
  };

  const deleteComment = (id: string) => {
    const updated = comments.filter(c => c.id !== id);
    setComments(updated);
    const storageKey = `comments_${chapterId}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 mt-8">
      <h3 className="text-2xl font-bold text-white mb-6">Komentar</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Nama Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 placeholder-neutral-500 rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500"
          required
        />
        <textarea
          placeholder="Tulis komentar Anda..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 placeholder-neutral-500 rounded-lg border border-neutral-600 focus:outline-none focus:border-blue-500 resize-none"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-neutral-400 text-center py-8">Belum ada komentar. Jadilah yang pertama!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-neutral-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-neutral-100">{comment.name}</p>
                  <p className="text-xs text-neutral-400">{comment.timestamp}</p>
                </div>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Hapus
                </button>
              </div>
              <p className="text-neutral-200">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
