export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0f172a]/90 backdrop-blur-md">
      <div className="flex items-center justify-center gap-2 py-2 px-4 text-center">
        <span className="text-xs text-slate-400">
          Desenvolvido por <span className="text-slate-300 font-medium">Marcelo Desenvolvedor</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-xs text-slate-400">
          Tel: <span className="text-slate-300">(21) 98388-6010</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-xs text-slate-400">
          Email: <a href="mailto:mareclobradrj@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">mareclobradrj@gmail.com</a>
        </span>
      </div>
    </footer>
  );
}
