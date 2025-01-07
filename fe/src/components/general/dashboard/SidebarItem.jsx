export function SidebarItem({ icon: Icon, text, active, onClick }) {
    return (
      <div 
        className={`
          flex items-center p-3 mb-2 rounded-lg cursor-pointer
          transition-colors duration-200
          ${active ? 'bg-blue-500 text-white' : 'hover:bg-blue-50 text-gray-700'}
        `}
        onClick={onClick}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    );
  }