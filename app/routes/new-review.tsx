import { useState } from "react"
import { Card } from "~/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { TextArea } from "~/components/ui/textarea"
import { Form } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import StarRatingBasic from "~/components/commerce-ui/star-rating-basic"
import { reviewFormSchema } from "~/lib/review"
import type { ReviewFormValues } from "~/lib/review"

export default function NewReviewRoute() {
    const [rating, setRating] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewFormSchema),
    });

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data: any) => {
        return;
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card>
          <div className="py-3 px-6">
            <div className="flex flex-row justify-between mb-4">
                <h1 className="text-2xl font-bold">Submit Review</h1>
            </div>
              <div className="grid grid-cols-1">
                <Form method="post" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col">
                    <Label className="m-2">Review</Label>
                    <TextArea
                      {...register("text")}
                      placeholder="Write your review..."
                      className="bg-white rounded-md m-2 py-1 px-3 placeholder:text-gray-500 text-slate-800"
                    />
                    {/* {errors.originalUrl && (
                      <p className="text-red-500 m-2">{errors.originalUrl.message}</p>
                    )} */}
                  </div>
                  <div className="flex flex-col">
                    <Label className="m-2">Rating</Label>
                    <StarRatingBasic
                        value={rating}
                        onChange={setRating}
                        maxStars={5}
                        className="p-2"
                    ></StarRatingBasic>
                  </div>
                  <div className="flex flex-row justify-between mt-10">
                    <button
                      type="submit"
                      className="bg-sky-400 rounded-full px-3 py-2 m-2 text-black font-medium"
                    >
                        Submit
                    </button>
                    <button
                      type="button"
                      onClick={goBack}
                      className="bg-gray-500 rounded-full px-3 py-2 m-2 text-white font-medium hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </Form>
              </div>
          </div>
        </Card>
      </div>
    </div>
    )
}