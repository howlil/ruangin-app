export function Header({ title }) {
    return (
      <header className="h-16 bg-white shadow-sm px-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          {title}
        </h1>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            H
          </div>
        </div>
      </header>
    );
  }