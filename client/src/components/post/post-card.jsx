import React, { memo, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@uidotdev/usehooks";
import { useMPostLikeToggle, useMPostView } from "@/hooks/query/post-query";
import { toast } from "sonner";

function PurePostCard({ post, showClaim, onClaimClick }) {
  const {
    _id,
    creator,
    text,
    media,
    likes,
    views,
    isViewed,
    createdAt,
    claimed,
    isLiked,
  } = post;

  const [liked, setLiked] = useState(isLiked);
  const [view, setView] = useState(isViewed);
  const [likeCount, setLikeCount] = useState(likes);

  const debouncedLiked = useDebounce(liked, 1000);

  const likeMutation = useMPostLikeToggle({
    onError: () => {
      toast.error("Something went wrong");
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    },
  });

  const viewMutation = useMPostView({
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  useEffect(() => {
    if (debouncedLiked !== isLiked) {
      likeMutation.mutate({ postId: _id });
    }
  }, [debouncedLiked]);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
  };

  const handleView = () => {
    if (!view) {
      setView(true);
      viewMutation.mutate({ postIds: [_id] });
    }
  };

  return (
    <div className="flex justify-center my-4" onMouseEnter={() => handleView()}>
      <Card className="max-w-[500px] w-full">
        <CardHeader className="flex flex-row gap-4 items-center">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${creator.name}`}
            />
            <AvatarFallback>{creator.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{creator.name}</CardTitle>
            <CardDescription>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full">
            <p className="mb-3 text-left">{text}</p>
          </div>
          {media &&
            media.length > 0 &&
            media.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Post media"
                loading="lazy"
                className="rounded-lg mb-3 max-w-full aspect-square"
              />
            ))}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {views}
            </span>
            <Button
              variant={liked ? "default" : "ghost"}
              size="sm"
              className="flex items-center gap-1"
              onClick={handleLike}
            >
              <Heart
                className={`w-4 h-4 ${
                  liked ? "fill-current text-red-500" : ""
                }`}
              />
              {likeCount}
            </Button>

            {showClaim && (
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                disabled={claimed}
                onClick={() => {
                  onClaimClick(post);
                }}
              >
                Create Claim
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const PostCard = memo(PurePostCard);

export default PostCard;
