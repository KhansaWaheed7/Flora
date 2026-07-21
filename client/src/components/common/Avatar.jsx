export default function Avatar({
  name = "User",
  image,
  size = "h-9 w-9",
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${size} rounded-full object-cover`}
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-[#F33B7D] text-xs font-semibold text-white`}
    >
      {initials}
    </div>
  );
}