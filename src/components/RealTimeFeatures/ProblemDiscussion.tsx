import React, { useEffect, useState, useRef } from 'react';
import { socketService } from '../../services/socketService';
import { useAuth } from '../../contexts/AuthContext';
import { ThumbsUp, MessageCircle } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  upvotes: number;
  replies: Comment[];
}

const getLocalComments = (problemId: string) => {
  const data = localStorage.getItem(`problem_comments_${problemId}`);
  return data ? JSON.parse(data) : [];
};

const setLocalComments = (problemId: string, comments: Comment[]) => {
  localStorage.setItem(`problem_comments_${problemId}` , JSON.stringify(comments));
};

const ProblemDiscussion = ({ problemId }: { problemId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(() => getLocalComments(problemId));
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Listen for real-time comment updates
    socketService.socket?.on('problem_comment_update', (data: { problemId: string, comments: Comment[] }) => {
      if (data.problemId === problemId) {
        setComments(data.comments);
        setLocalComments(problemId, data.comments);
      }
    });
    return () => {
      socketService.socket?.off('problem_comment_update');
    };
  }, [problemId]);

  const handlePost = () => {
    if (!input.trim() || !user) return;
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      userId: user.id,
      username: user.username,
      content: input,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      replies: []
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    setLocalComments(problemId, updated);
    setInput('');
    socketService.socket?.emit('problem_comment_update', { problemId, comments: updated });
    inputRef.current?.focus();
  };

  const handleUpvote = (id: string) => {
    const updated = comments.map(c => c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c);
    setComments(updated);
    setLocalComments(problemId, updated);
    socketService.socket?.emit('problem_comment_update', { problemId, comments: updated });
  };

  return (
    <section className="mt-8">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Discussion</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Ask a question or share a solution..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePost()}
            disabled={!user}
          />
          <button
            className="px-4 py-2 bg-primary-500 text-white rounded font-semibold hover:bg-primary-600 transition"
            onClick={handlePost}
            disabled={!user || !input.trim()}
          >Post</button>
        </div>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-gray-500">No comments yet. Be the first to discuss!</div>
          ) : comments.map(comment => (
            <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{comment.username}</span>
                  <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-gray-900 dark:text-white mb-2">{comment.content}</div>
                <button className="flex items-center gap-1 text-xs text-blue-500 hover:underline" onClick={() => handleUpvote(comment.id)}>
                  <ThumbsUp className="h-4 w-4" /> {comment.upvotes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemDiscussion; 