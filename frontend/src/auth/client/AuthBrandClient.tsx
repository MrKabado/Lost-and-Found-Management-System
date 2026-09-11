export default function AuthBrand() {
  return (
    <div className="flex items-center gap-2.5 pb-[26px]">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C97A28"
        strokeWidth="1.6"
      >
        <path d="M12 2 L21 11 L11 21 L2 12 Z" />
        <circle cx="7.5" cy="7.5" r="1.6" />
      </svg>

      <div className="font-sans text-[17px] leading-[1.1] text-[#1B2430]">
        Lost&Found

        <span className="mt-0.5 block font-sans text-[10.5px] tracking-[0.06em] text-[#83796A]">
          Item Recovery System
        </span>
      </div>
    </div>
  );
}