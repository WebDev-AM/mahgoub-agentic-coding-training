import EmojiIcon from "../../ui/EmojiIcon";

export default function AmenityCard({
  emoji,
  label,
}: {
  emoji: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-slate-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-100 bg-sky-50">
        <EmojiIcon emoji={emoji} className="text-2xl" />
      </div>

      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
}
