const Logo = () => {
    return (
      <div onClick={()=>window.location.href="/"} className="cursor-pointer flex-shrink-0">
        <span className="text-[#2F318B] text-2xl font-bold">Ruang<span className="text-primary" >In</span></span>
      </div>
    );
  };
  
  export default Logo;