const NavLink = ({ href, children }) => {
    return (
      <a
        href={href}
        className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
      >
        {children}
      </a>
    );
  };
  
  export default NavLink;