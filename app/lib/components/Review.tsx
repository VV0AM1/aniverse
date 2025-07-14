import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { animeServices } from "@/app/lib/services/animes";

export interface ReviewProps {
  mal_id: string;
}

export interface ReviewHandle {
  scrollLeft: () => void;
  scrollRight: () => void;
}

const Review = forwardRef<ReviewHandle, ReviewProps>(({ mal_id }, ref) => {
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mal_id || Array.isArray(mal_id)) return;

    const fetchData = async () => {
      try {
        const reviewRes = await animeServices.getReviews(String(mal_id));
        setReviewData(reviewRes.data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mal_id]);

  useImperativeHandle(ref, () => ({
    scrollLeft: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
      }
    },
    scrollRight: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
      }
    },
  }));

  if (loading) {
    return (
      <div className="text-white text-center py-10 text-base font-medium w-full">
        Loading reviews...
      </div>
    );
  }

  if (!reviewData || reviewData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-10">
        <h2 className="text-2xl font-semibold mb-2 text-white">Reviews</h2>
        <p className="text-gray-400">No Reviews Available 😢</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1 sm:px-0">
        <h2 className="text-2xl font-semibold text-white">Reviews</h2>
        <div className="flex gap-2">
          <button
            onClick={() => ref?.current?.scrollLeft?.()}
            className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            {"<"}
          </button>
          <button
            onClick={() => ref?.current?.scrollRight?.()}
            className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            {">"}
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth gap-4 w-full"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {reviewData.slice(0, 12).map((review, index) => {
          const { review: text, user, score } = review;

          return (
            <div
              key={index}
              className="relative bg-[#1c1c1c] text-white rounded-xl p-4 flex flex-col justify-between w-[90vw] max-w-[450px] min-w-[300px] h-[250px] hover:brightness-90 transition"
            >
              <div className="text-5xl text-gray-400 mb-2">“</div>
              <p className="text-sm text-gray-300 leading-snug mb-4 line-clamp-4">
                {text}
              </p>

              <div className="flex items-center justify-between mt-auto z-10">
                <div className="flex items-center gap-2">
                  <img
                    src={user?.images?.jpg?.image_url || "/img/default-avatar.png"}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-xs text-gray-400">
                      MAL ID: {user?.url?.split("/").pop()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                  <img src="/img/star.svg" alt="star" className="w-4 h-4" />
                  {score}
                </div>
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm opacity-0 hover:opacity-100 flex flex-col items-center justify-center rounded-xl transition-opacity z-20">
                <img src="/img/book.svg" alt="Read more" className="w-8 h-8 mb-2" />
                <h1 className="text-sm font-semibold text-white">Read More</h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

Review.displayName = "Review";

export default Review;