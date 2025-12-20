export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020617] overflow-hidden">
      {/* Animated Glowing Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px] animate-pulse" />
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.15] [background-image:radial-gradient(#4f46e5_0.5px,transparent_0.5px)] [background-size:24px_24px]" />

      <div className="relative z-10 w-full px-4 flex justify-center">
        {children}
      </div>
    </div>
  );
}