import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { animeServices } from "@/app/lib/services/animes";

interface ReviewProps {
  mal_id: string;
}

const Review = forwardRef(({ mal_id }: ReviewProps, ref) => {
  const [reviewData, setReviewData] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (!mal_id || Array.isArray(mal_id)) return;

    const fetchData = async () => {
      try {
        const reviewRes = await animeServices.getReviews(String(mal_id));
        setReviewData(reviewRes.data.data);
      } catch (error) {
        console.error("Error fetching reviews details:", error);
      }
    };

    fetchData();
  }, [mal_id]);

  useImperativeHandle(ref, () => ({
    scrollLeft: () => {
      scrollRef.current?.scrollBy({ left: -450, behavior: "smooth" });
    },
    scrollRight: () => {
      scrollRef.current?.scrollBy({ left: 450, behavior: "smooth" });
    },
  }));

  if (!reviewData || reviewData.length === 0) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div
      ref={scrollRef}
      className="reviews-component-container flex overflow-x-auto scroll-smooth no-scrollbar"
    >
      {reviewData.slice(0, 12).map((review: any, index: number) => {
        const { review: text, user, score } = review;

        return (
          <div
            key={index}
            className="review-card bg-[#1c1c1c] text-white rounded-xl p-4 flex flex-col justify-between mr-4"
            style={{ width: "450px", height: "250px" }}
          >
            <div className="text-gray-400 text-3xl mb-2">“</div>
            <p className="text-sm text-white leading-snug mb-4 line-clamp-4">
              {text}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <img
                  src={user?.images?.jpg?.image_url || "/img/default-avatar.png"}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs text-gray-400">MAL ID: {user?.url?.split('/').pop()}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                <img src="/img/star.svg" alt="star" className="w-4 h-4" />
                {score}
              </div>
            </div>

            <div className="reviews-blur-cover">
              <img src="/img/book.svg" alt="" />
              <h1>Read More</h1>
            </div>
          </div>
        );
      })}
    </div>
  );
});

Review.displayName = "Review";

export default Review;