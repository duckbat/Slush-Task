import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostActions } from "../hooks/postActionHook";

interface PostActionsProps {
  postId: number;
  postUserId: number;
  currentUserId: number | null;
}

export const PostActions = ({
  postId,
  postUserId,
  currentUserId,
}: PostActionsProps) => {
  const navigate = useNavigate();
  const { deletePost, isLoading } = usePostActions();
  const [showConfirm, setShowConfirm] = useState(false);

  if (postUserId !== currentUserId) return null;

  const handleDelete = async () => {
    if (await deletePost(postId)) {
      window.location.reload();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/post/edit/${postId}`)}
        className="text-blue-600 hover:text-blue-700 text-sm"
      >
        Edit
      </button>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-gray-600 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
