import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/container/page-container";
import CreatePostForm from "@/components/creator/create-post-form";
import { useGetPostByUserQuery } from "@/hooks/query/post-query";
import PostList from "@/components/creator/post-list";
import { useSnapshot } from "valtio";
import { PostState } from "@/state/posts";
import { useGetMeQuery } from "@/hooks/query/me-query";
import ClaimCreateForm from "@/components/claims/claim-create-form";

export default function FeedPage() {
  const [create, setCreate] = useState();
  const { userPosts, userMeta } = useSnapshot(PostState);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [claiming, setClaiming] = useState();

  const { data: user } = useGetMeQuery();

  const { ref, inView, entry } = useInView();

  const query = useMemo(() => {
    const url = new URLSearchParams();
    url.set("page", userMeta.page);
    url.set("size", userMeta.size);

    return url.toString();
  }, [userMeta]);

  const { data, isLoading } = useGetPostByUserQuery(user?._id, query);

  const posts = useMemo(() => {
    let p = [];

    Object.keys(userPosts).forEach((key) => {
      const postInfo = userPosts[key];
      p = p.concat(postInfo);
    });

    return p;
  }, [userPosts]);

  useEffect(() => {
    if (data && query) {
      PostState.userPosts[query] = data?.docs;
      setHasNextPage(data?.nextPage);
    }
  }, [query, data]);

  useEffect(() => {
    if (inView) {
      PostState.userMeta = {
        page: userMeta.page + 1,
        size: userMeta.size,
      };
    }
  }, [inView]);

  return (
    <PageContainer
      title={"My Posts"}
      action={
        <Button
          onClick={() => {
            setCreate(true);
          }}
        >
          Create Post
        </Button>
      }
    >
      <div>
        <PostList
          isLoading={isLoading}
          posts={posts}
          showClaim={true}
          onClaimClick={(post) => {
            console.log(post);
            setClaiming(post);
          }}
        />

        {!isLoading && (
          <div>
            {hasNextPage ? (
              <div ref={ref} className=" h-2" />
            ) : (
              <div className=" text-center">You've completely caught up</div>
            )}
          </div>
        )}
      </div>

      <Modal title={"Create a post"} isOpen={create} onOpenChange={setCreate}>
        <CreatePostForm onClose={() => setCreate(false)} />
      </Modal>

      <Modal title={"Claim Post"} isOpen={claiming}>
        <ClaimCreateForm post={claiming} onClose={() => setClaiming(false)} />
      </Modal>
    </PageContainer>
  );
}
