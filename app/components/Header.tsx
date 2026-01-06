export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-transparent text-primary z-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* <nav className="grid grid-cols-3 items-center "> */}
        <nav className="flex justify-between items-center ">
          <h1 className="text-3xl font-bold ml-[4%]">ZERO LOUNGE</h1>
          <ul className="flex gap-10">
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
          <div></div>
        </nav>
      </div>
    </header>
  );
}
