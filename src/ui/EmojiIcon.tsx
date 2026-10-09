type EmojiIconProps = {
  emoji: string;
  className?: string;
};

export default function EmojiIcon({ emoji, className = "" }: EmojiIconProps) {
  return (
    <span role="img" aria-hidden="true" className={className}>
      {emoji}
    </span>
  );
}
