import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import InputWrapper from "../../ui/input-wrapper";
import { ModalButtons } from "../../ui/modal-buttons";
import { Input } from "@/components/ui/input";
import { useMCreateRate } from "@/hooks/query/rates-query";

const validateRatesPayload = yup.object().shape({
  viewsRate: yup
    .number()
    .typeError("Views rate must be a number")
    .min(0, "Must be >= 0")
    .required("Views rate is required"),
  likesRate: yup
    .number()
    .typeError("Likes rate must be a number")
    .min(0, "Must be >= 0")
    .required("Likes rate is required"),
  effectiveFrom: yup
    .date()
    .typeError("Invalid date")
    .required("Effective From is required"),
  effectiveTo: yup.date().optional(),
});

export default function RatesForm({ onClose, defaultValues }) {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateRatesPayload),
    defaultValues: {
      viewsRate: defaultValues?.viewsRate ?? 0,
      likesRate: defaultValues?.likesRate ?? 0,
      effectiveFrom: defaultValues?.effectiveFrom ?? "",
      effectiveTo: defaultValues?.effectiveTo ?? "",
    },
  });

  const ratesMutate = useMCreateRate({
    onSuccess: () => {
      onClose();
      toast.success("Rates saved successfully");
    },
    onError: (error) => {
      setError(error?.response?.data?.message || "Something went wrong");
      console.error(error);
      toast.error("Something went wrong");
    },
  });

  const isLoading = ratesMutate.isPending;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        ratesMutate.mutate({
          viewsRate: Number(data.viewsRate),
          likesRate: Number(data.likesRate),
          effectiveFrom: data.effectiveFrom,
          effectiveTo: data.effectiveTo,
        });
      })}
      className="grid gap-4"
    >
      <InputWrapper
        id="viewsRate"
        label="Views Rate"
        error={errors.viewsRate?.message}
      >
        <Input
          type="number"
          step="0.01"
          {...register("viewsRate")}
          className="border rounded p-2 w-full"
        />
      </InputWrapper>

      <InputWrapper
        id="likesRate"
        label="Likes Rate"
        error={errors.likesRate?.message}
      >
        <Input
          type="number"
          step="0.01"
          {...register("likesRate")}
          className="border rounded p-2 w-full"
        />
      </InputWrapper>

      <InputWrapper
        id="effectiveFrom"
        label="Effective From"
        error={errors.effectiveFrom?.message}
      >
        <Input
          type="date"
          {...register("effectiveFrom")}
          className="border rounded p-2 w-full"
        />
      </InputWrapper>

      <InputWrapper
        id="effectiveTo"
        label="Effective To"
        error={errors.effectiveTo?.message}
      >
        <Input
          type="date"
          {...register("effectiveTo")}
          className="border rounded p-2 w-full"
        />
      </InputWrapper>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <ModalButtons
        backText="Back"
        nextText="Save Rates"
        isLoading={isLoading}
        onBackClick={onClose}
      />
    </form>
  );
}
