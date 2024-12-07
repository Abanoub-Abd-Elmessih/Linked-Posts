import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/10 z-50">
      <CircularProgress size="3rem" />
    </div>
  );
}
