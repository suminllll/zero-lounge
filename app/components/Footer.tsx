export default function Footer() {
  return (
    <footer className="w-full bg-secondary text-primary">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Zero Lounge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
