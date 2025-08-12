function Sidebar() {
  return (
    <aside className="hidden sm:block w-60 bg-gray-100 border-r border-gray-300">
      {/* Top Navigation Section */}
      <div className="space-y-1">
        <SidebarItem label="Home" active />
        <SidebarItem label="Shorts" />
        <SidebarItem label="Subscriptions" />
        <SidebarItem label="Trending" />
      </div>

      <hr className="my-3 border-gray-300" />

      {/* Personal Navigation Section */}
      <div className="space-y-1">
        <SidebarItem label="You" />
        <SidebarItem label="History" />
        <SidebarItem label="Watch Later" />
        <SidebarItem label="Liked videos" />
      </div>

      <hr className="my-3 border-gray-300" />

      {/* Sign-in Prompt */}
      <div className="p-3 text-xs text-gray-600">
        <p className="mb-3">
          Sign in to like videos, comment, and subscribe.
        </p>
        <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 text-sm font-medium">
          Sign in
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ label, active }) {
  return (
    <div
      className={`flex items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
        active ? 'bg-gray-200 font-medium' : ''
      }`}
    >
      <span>{label}</span>
    </div>
  );
}

export default Sidebar;
