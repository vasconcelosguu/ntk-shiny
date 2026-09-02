export default function Footer() {
  return (
    <footer
      className="
        border-t
        border-white/[0.06]
        bg-[#080c08]
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-2
          px-5
          py-8
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
      >
        <div>
          <p className="text-sm font-bold text-white">
            neverTakeBan
          </p>

          <p className="mt-1 text-xs text-gray-600">
            PokeMMO Team
          </p>
        </div>

        <p className="text-xs text-gray-700">
          Guias, estratégias, mapas e informações do time.
        </p>
      </div>
    </footer>
  );
}