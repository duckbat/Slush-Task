import { useNavigate } from "react-router-dom";
import { useSinglePost } from "../hooks/singleHook";

export const SinglePost = () => {
  const navigate = useNavigate();
  const { post, loading, error } = useSinglePost();

  if (loading) return <div className="flex justify-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!post) return <div className="text-center p-4">Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← Back to posts
        </button>
        <article className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap mb-6 break-words overflow-wrap-anywhere">
              {post.content}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 mt-8 pt-4 border-t">
            <span className="font-medium text-gray-700">
              {post.username || "Anonymous"}
            </span>
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString()}
            </time>
          </div>
        </article>
      </div>
    </div>
  );
};
