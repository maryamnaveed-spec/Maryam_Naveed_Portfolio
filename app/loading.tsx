export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-xl shadow-lg animate-pulse">
          MN
        </div>
        <div className="w-8 h-8 border-[3px] border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
