import { useMCreatePost } from "@/hooks/query/post-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { ModalButtons } from "../ui/modal-buttons";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWrapper from "../ui/input-wrapper";
import { ImageIcon, X } from "lucide-react";

const validatePostPayload = yup.object().shape({
  text: yup.string().required("Text is required."),
  image: yup
    .mixed()
    .required("Image is required.")
    .test("fileSize", "Image is too large", (file) => {
      return file && file.size <= 5 * 1024 * 1024;
    }),
});

export default function CreatePostForm({ onClose }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validatePostPayload),
    defaultValues: { text: "", image: null },
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

  const postMutate = useMCreatePost({
    onSuccess: () => {
      onClose();
      toast.success("Post created successfully");
    },
    onError: (error) => {
      setError(error?.response?.data?.message || "Something went wrong");
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  const isLoading = postMutate.isPending;

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          const formData = new FormData();

          formData.append("media", data.image);
          formData.append("text", data.text);

          postMutate.mutate(formData);
        })}
        className="grid gap-4"
      >
        <InputWrapper id="text" label="Caption" error={errors.text?.message}>
          <textarea
            {...register("text")}
            placeholder="What's on your mind?"
            className="border rounded p-2 resize-none w-full"
            rows={3}
          />
        </InputWrapper>

        <InputWrapper id="image" label="Image" error={errors.image?.message}>
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
          nextText={"Create Post"}
          isLoading={isLoading}
          onBackClick={onClose}
        />
      </form>
    </>
  );
}
