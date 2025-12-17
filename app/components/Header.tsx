export default function Header() {
  return (
    <header className="w-full bg-secondary text-primary">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <nav className="flex items-center ">
          <h1 className="text-2xl font-bold">Zero Lounge</h1>
          <ul className="flex gap-6">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
