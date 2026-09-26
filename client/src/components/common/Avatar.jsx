
export default function Avatar({
  name = "User",
  image = "",
  size = "h-9 w-9",
}) {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    // Already a complete URL
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:")
    ) {
      return imagePath;
    }

    // Backend server URL
    const backendUrl = "http://localhost:5000";

    // Relative backend upload path
    if (imagePath.startsWith("/")) {
      return `${backendUrl}${imagePath}`;
    }

    return `${backendUrl}/${imagePath}`;
  };

  const imageUrl = getImageUrl(image);

  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className={`${size} relative overflow-hidden rounded-full`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling.style.display = "flex";
          }}
        />
      ) : null}

      <div
        className={`${
          imageUrl ? "hidden" : "flex"
        } h-full w-full items-center justify-center rounded-full bg-[#F33B7D] text-white font-semibold`}
      >
        {initials}
      </div>
    </div>
  );
}
