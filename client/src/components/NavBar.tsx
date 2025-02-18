import { useNavigate } from "react-router-dom";

interface NavigationProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export const Navigation = ({
  isAuthenticated,
  handleLogout,
}: NavigationProps) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer"
        >
          Posts App
        </h1>
        <div className="space-x-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/upload")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Post
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
