import React from "react";

const WebReview = () => {
  const reviews = [
    {
      text: "Aniverse is a sleek, modern hub for anime fans. It brings all your favorite titles, reviews, and community insights into one intuitive space.",
      username: "KawaiiSensei",
      malId: "0001",
      score: 9,
      avatar: "/img/defaultuser.png",
    },
    {
      text: "From top-rated anime lists to curated reviews, Aniverse delivers a premium browsing experience. It’s my go-to platform now!",
      username: "OtakuMaster",
      malId: "0002",
      score: 10,
      avatar: "/img/defaultuser.png",
    },
    {
      text: "I love the simplicity and responsiveness of Aniverse. Everything loads quickly and looks fantastic!",
      username: "ShonenQueen",
      malId: "0003",
      score: 8,
      avatar: "/img/defaultuser.png",
    },
    {
      text: "This is the cleanest anime UI I've used. It's fast, dark-mode native, and fun to explore.",
      username: "VisualWeeb",
      malId: "0004",
      score: 9,
      avatar: "/img/defaultuser.png",
    },
    {
      text: "I love the seasonal highlights and character sections — everything feels alive here.",
      username: "AnimeGhost",
      malId: "0005",
      score: 9,
      avatar: "/img/defaultuser.png",
    },
  ];

  return (
    <div className="relative z-20 bg-[#1a1a1a] py-12 px-6 text-white">
      <h2 className="text-3xl font-bold text-center mb-10">
        What People Think About Us
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="relative group bg-[#2a2a2a] rounded-xl p-6 w-[360px] flex flex-col justify-between shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <div className="text-4xl text-gray-500 mb-3">“</div>

            <p className="text-sm text-gray-300 line-clamp-4 mb-4 z-10">
              {review.text}
            </p>

            <div className="flex justify-between items-center mt-auto z-10">
              <div className="flex items-center gap-2">
                <img
                  src={review.avatar}
                  alt={review.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">{review.username}</p>
                  <p className="text-xs text-gray-400">MAL ID: {review.malId}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                <img src="/img/star.svg" alt="star" className="w-4 h-4" />
                {review.score}
              </div>
            </div>

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center flex-col gap-2 text-white z-20">
              <img src="/img/book.svg" alt="read" className="w-6 h-6" />
              <p className="text-sm font-semibold">Read More</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebReview;