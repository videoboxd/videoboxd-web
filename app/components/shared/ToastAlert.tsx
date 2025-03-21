import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

interface Props {
  title: string;
  description: string;
  handleClose: () => void;
}
export default function ToastAlert({ title, description, handleClose }: Props) {
  return (
    <Alert className="flex justify-between absolute top-[17%] left-[50%] w-[50%] -translate-x-1/2">
      <div>
        {/* <AlertCircle className="h-4 w-4" /> */}
        <AlertTitle className="">{title}</AlertTitle>
        <AlertDescription className="">{description}</AlertDescription>
      </div>
      <Button
        variant="link"
        size="icon"
        className="cursor-pointer"
        onClick={handleClose}
      >
        <X />
      </Button>
    </Alert>
  );
}
