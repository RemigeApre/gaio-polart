export function Footer() {
  return (
    <footer>
      <div className="bg-noir text-blanc/30 text-xs">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <p>&copy; {new Date().getFullYear()} Gaio Polart</p>
          <p className="tracking-widest uppercase">Depuis 2006</p>
        </div>
      </div>
      <div className="tricolore" />
    </footer>
  );
}
