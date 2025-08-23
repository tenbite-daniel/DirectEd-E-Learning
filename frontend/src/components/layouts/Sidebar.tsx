// src/components/layout/Sidebar.tsx
import { useAuth } from "../../context/AuthContext";
import { X } from "lucide-react";
import clsx from "clsx";

const studentLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Browse Courses", path: "/courses" },
  { name: "My Courses", path: "/my-courses" },
  { name: "Notifications", path: "/notifications" },
  { name: "Profile", path: "/profile" },
  { name: "AI Assistant", path: "/assistant" },
];

const instructorLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "My Courses", path: "/my-courses" },
  { name: "Create Course", path: "/create-course" },
  { name: "Notifications", path: "/notifications" },
  { name: "Student Analytics", path: "/analytics" },
  { name: "Quizzes", path: "/quizzes" },
  { name: "Profile", path: "/profile" },
  { name: "AI Assistant", path: "/assistant" },
];

export const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const links = user?.role === "instructor" ? instructorLinks : studentLinks;

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform z-50",
        { "-translate-x-full": !isOpen, "translate-x-0": isOpen }
      )}
      role="navigation"
    >

      {/* Close button (visible only on mobile) */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="p-2 rounded-lg text-gray-800 dark:text-gray-100"
        >
          <X size={24}/>
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.path}
            className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
          >
            {link.name}
          </a>
        ))}
      </nav>
    </aside>
  );
};
