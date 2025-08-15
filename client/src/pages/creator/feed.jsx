import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/container/page-container";
import CreatePostForm from "@/components/creator/create-post-form";
import { useGetPostsQuery } from "@/hooks/query/post-query";
import PostList from "@/components/creator/post-list";
import { useSnapshot } from "valtio";
import { PostState } from "@/state/posts";

export default function FeedPage() {
  const [create, setCreate] = useState();
  const { docs, meta } = useSnapshot(PostState);
  const [hasNextPage, setHasNextPage] = useState(true);

  const { ref, inView, entry } = useInView();

  const query = useMemo(() => {
    const url = new URLSearchParams();
    url.set("page", meta.page);
    url.set("size", meta.size);

    return url.toString();
  }, [meta]);

  const { data, isLoading } = useGetPostsQuery(query);

  const posts = useMemo(() => {
    let p = [];

    console.log(docs);

    Object.keys(docs).forEach((key) => {
      const postInfo = docs[key];
      p = p.concat(postInfo);
    });

    return p;
  }, [docs]);

  console.log(posts);

  useEffect(() => {
    if (data && query) {
      PostState.docs[query] = data?.docs;
      console.log(data?.nextPage);
      setHasNextPage(data?.nextPage);
    }
  }, [query, data]);

  useEffect(() => {
    if (inView) {
      PostState.meta = {
        page: meta.page + 1,
        size: meta.size,
      };
    }
  }, [inView]);

  console.log(docs);

  return (
    <PageContainer
      title={"Feed"}
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
        <PostList isLoading={isLoading} posts={posts} />

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
    </PageContainer>
  );
}
