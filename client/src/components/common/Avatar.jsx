export default function Avatar({
  name = "User",
  image = "",
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
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-[#F33B7D] text-white font-semibold`}
    >
      {initials}
    </div>
  );
}