import { usePosts } from "../hooks/postHook";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { jwtDecode, JwtPayload } from "jwt-decode";
import { Navigation } from "../components/NavBar";
import { PostActions } from "../components/PostActionsButtons";

export interface CustomJwtPayload extends JwtPayload {
  user_id: number;
}

export const Posts = () => {
  const { posts, loading, error } = usePosts();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      setCurrentUserId(decoded.user_id);
    } else {
      setCurrentUserId(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div
                className="cursor-pointer flex-grow"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.content}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 mt-auto pt-4 border-t">
                <div className="text-sm text-gray-500 w-full sm:w-auto">
                  <span className="font-medium text-gray-700 block sm:inline">
                    {post.username || "Anonymous"}
                  </span>
                  <time 
                    className="ml-0 sm:ml-4 block sm:inline" 
                    dateTime={post.created_at}
                  >
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                </div>
                <div className="w-full sm:w-auto">
                  <PostActions
                    postId={post.id}
                    postUserId={post.user_id}
                    currentUserId={currentUserId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
