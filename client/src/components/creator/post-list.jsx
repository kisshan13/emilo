import PostCard from "../post/post-card";
import PostCardSkeleton from "../post/post-skeleton";

export default function PostList({ posts, isLoading, showClaim, onClaimClick }) {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map(() => (
          <PostCardSkeleton />
        ))}
      </>
    );
  }

  return (
    <>
      {posts?.map((post) => (
        <PostCard post={post} key={post?._id} showClaim={showClaim} onClaimClick={onClaimClick} />
      ))}
    </>
  );
}
