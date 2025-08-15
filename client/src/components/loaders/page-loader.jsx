import { Suspense } from "react";

import { LoaderIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function Loader({ isFullSize }) {
  return (
    <div className={twMerge([isFullSize ? " w-[100vw] h-[100vh] " : "h-[30vh] w-full" , "flex items-center justify-center"])}>
      <LoaderIcon className=" animate-spin" />
    </div>
  );
}

export default function WithLoader({ component, isFullSize }) {
  return <Suspense fallback={<Loader />}>{component}</Suspense>;
}
