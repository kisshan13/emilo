import { useMCreatePost } from "@/hooks/query/post-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { ModalButtons } from "../ui/modal-buttons";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWrapper from "../ui/input-wrapper";
import { ImageIcon, X } from "lucide-react";
import { useMCreateClaim } from "@/hooks/query/claim-query";
import { useGetActiveRateQuery } from "@/hooks/query/rates-query";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const validatePostPayload = yup.object().shape({
  image: yup
    .mixed()
    .required("Image is required.")
    .test("fileSize", "Image is too large", (file) => {
      return file && file.size <= 5 * 1024 * 1024;
    }),
});

export default function ClaimCreateForm({ onClose, post }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const { data: activeRates, isLoading: isGettingActiveRate } =
    useGetActiveRateQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validatePostPayload),
    defaultValues: { image: null },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setPreview(null);
  };

  const claimMutate = useMCreateClaim({
    onSuccess: () => {
      onClose();
      toast.success("Claim created successfully");
    },
    onError: (error) => {
      setError(error?.response?.data?.message || "Something went wrong");
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  const isLoading = claimMutate.isPending;

  console.log(post)

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          const formData = new FormData();

          formData.append("media", data.image);
          formData.append("postId", post?._id);

          claimMutate.mutate(formData);
        })}
        className="grid gap-4"
      >
        {isGettingActiveRate ? (
          <Skeleton className={"h-[100px]"} />
        ) : (
          <div>
            <Label>Estimated Settlement Calculation</Label>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>Likes</TableCell>
                    <TableCell>{post?.likes}</TableCell>
                    <TableCell>$ {activeRates?.likesRate}</TableCell>
                    <TableCell>
                      $ {(post?.likes * activeRates?.likesRate).toFixed(2)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Views</TableCell>
                    <TableCell>{post?.views}</TableCell>
                    <TableCell>$ {activeRates?.viewsRate}</TableCell>
                    <TableCell>
                      $ {(post?.views * activeRates?.viewsRate).toFixed(2)}
                    </TableCell>
                  </TableRow>

                  <TableRow className="font-bold">
                    <TableCell colSpan={3} className="text-right">
                      Total
                    </TableCell>
                    <TableCell>
                      ${" "}
                      {(
                        post?.likes * activeRates?.likesRate +
                        post?.views * activeRates?.viewsRate
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <InputWrapper
          id="image"
          label="Add a media proof"
          error={errors.image?.message}
        >
          {!preview ? (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center border border-dashed rounded p-6 cursor-pointer hover:bg-gray-50 transition"
            >
              <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Click to upload an image
              </span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg max-h-60 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </InputWrapper>

        {error && <p className=" text-xs text-red-400">{error}</p>}

        <ModalButtons
          backText={"Back"}
          nextText={"Create Claim"}
          isLoading={isLoading}
          disableAll={isGettingActiveRate || isLoading}
          onBackClick={onClose}
        />
      </form>
    </>
  );
}
