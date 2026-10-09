import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Rating,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { MdStar, MdStarBorder, MdDeleteOutline } from "react-icons/md";

import {
  BaseRatingDataSchema,
  CreateRatingType,
  Rating as RatingType,
  UpdateRatingType,
} from "../../types/reservation/RatingSchema";

import { useCreateReservationRating } from "./useCreateReservationRating";
import { useUpdateReservationRating } from "./useUpdateReservationRating";
import { useDeleteReservationRating } from "./useDeleteReservationRating";

type RatingFormType = {
  overallRating: number;
  title: string;
  review: string;
  anonymous: boolean;
};
type CreateUpdateRatingFormProps = {
  rating?: RatingType;
  resourceType: string;
  resourceId: string;
  reservationId: string;
  onCloseModal?: () => void;
};

export default function CreateUpdateRatingForm({
  rating,
  resourceType,
  resourceId,
  reservationId,
  onCloseModal,
}: CreateUpdateRatingFormProps) {
  const isEditMode = Boolean(rating);

  const { createReservationRating, isCreating } = useCreateReservationRating();

  const { updateReservationRating, isUpdating } = useUpdateReservationRating();

  const { deleteReservationRating, isDeleting } = useDeleteReservationRating();

  const { control, handleSubmit, reset } = useForm<RatingFormType>({
    resolver: zodResolver(BaseRatingDataSchema),
    defaultValues: {
      overallRating: rating?.overallRating ?? 1,
      title: rating?.title ?? "",
      review: rating?.review ?? "",
      anonymous: rating?.anonymous ?? false,
    },
  });

  useEffect(() => {
    reset({
      overallRating: rating?.overallRating ?? 1,
      title: rating?.title ?? "",
      review: rating?.review ?? "",
      anonymous: rating?.anonymous ?? false,
    });
  }, [rating, reset]);

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = (data: RatingFormType) => {
    if (isEditMode && rating) {
      const updateData: UpdateRatingType = {
        id: rating.id,
        ...data,
      };

      updateReservationRating(updateData, {
        onSuccess: () => {
          onCloseModal?.();
        },
      });

      return;
    }

    const createData: CreateRatingType = {
      ...data,
      resourceType,
      resourceId,
      reservationId,
    };

    createReservationRating(createData, {
      onSuccess: () => {
        onCloseModal?.();
      },
    });
  };

  const handleDelete = () => {
    if (!rating?.id) return;

    deleteReservationRating(rating.id, {
      onSuccess: () => {
        onCloseModal?.();
      },
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        minWidth: 400,
        mx: "auto",
        px: { xs: 1.5, sm: 2 },
        py: 1,
      }}
    >
      {/* Header */}
      <Stack alignItems="center" spacing={0.5} sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: { xs: "1.35rem", sm: "1.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          {isEditMode ? t("Edit your feedback") : t("Your feedback matters!")}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 390,
            lineHeight: 1.5,
          }}
        >
          {isEditMode
            ? t("Update your rating and tell us about your experience.")
            : t(
                "Please take a moment to rate the service and help us improve our services."
              )}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {/* Rating */}
        <Controller
          control={control}
          name="overallRating"
          render={({ field, fieldState }) => (
            <Stack alignItems="center" spacing={0.5}>
              <Rating
                value={field.value}
                onChange={(_, value) => {
                  field.onChange(value ?? 1);
                }}
                precision={1}
                icon={
                  <MdStar
                    style={{
                      fontSize: "2rem",
                    }}
                  />
                }
                emptyIcon={
                  <MdStarBorder
                    style={{
                      fontSize: "2rem",
                    }}
                  />
                }
              />

              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                }}
              >
                {field.value}/5
              </Typography>

              {fieldState.error && (
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "error.main",
                  }}
                >
                  {t(fieldState.error.message || "")}
                </Typography>
              )}
            </Stack>
          )}
        />

        {/* Anonymous */}
        <Controller
          control={control}
          name="anonymous"
          render={({ field }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {t("Submit anonymously")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "text.secondary",
                    mt: 0.15,
                  }}
                >
                  {t("Your name will not be shown with this review.")}
                </Typography>
              </Box>

              <Switch
                size="small"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            </Box>
          )}
        />

        {/* Title */}
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              label={t("Review title")}
              placeholder={t("Give your review a title")}
              error={Boolean(fieldState.error)}
              helperText={
                fieldState.error?.message
                  ? t(fieldState.error.message)
                  : undefined
              }
            />
          )}
        />

        {/* Review */}
        <Controller
          control={control}
          name="review"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              multiline
              minRows={3}
              maxRows={5}
              label={t("Write your comment")}
              placeholder={t("Tell us about your experience...")}
              error={Boolean(fieldState.error)}
              helperText={
                fieldState.error?.message
                  ? t(fieldState.error.message)
                  : undefined
              }
            />
          )}
        />

        {/* Actions */}
        <Stack spacing={1.25} sx={{ pt: 0.5 }}>
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isDeleting}
            sx={{
              minHeight: 44,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            {isSubmitting
              ? isEditMode
                ? t("Updating...")
                : t("Submitting...")
              : isEditMode
                ? t("Update the Rating")
                : t("Submit the Rating")}
          </Button>

          {/* Delete */}
          {isEditMode && (
            <>
              <Divider sx={{ my: 0.25 }} />

              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<MdDeleteOutline />}
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                sx={{
                  alignSelf: "center",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                {isDeleting ? t("Deleting...") : t("Delete Rating")}
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
