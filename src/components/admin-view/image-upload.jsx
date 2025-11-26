import { FileIcon, UploadCloudIcon, XIcon, ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";
import imageCompression from "browser-image-compression";
import API_URLS from "@/services/apiUrl";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;

    setImageLoadingState(true);

    try {
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1400,
        useWebWorker: true,
      });

      const data = new FormData();
      data.append("my_file", compressedFile);

      const response = await axios.post(API_URLS.COMMON.UPLOAD_IMAGE, data);

      if (response.data.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        variant: "destructive",
      });
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div
      className={`mt-4 ${
        isCustomStyling ? "w-full" : "max-w-md mx-auto w-full"
      }`}
    >
      <Label className="text-lg font-semibold mb-2 block">Product Image</Label>

      <div
        className={`
          group relative border border-muted rounded-xl p-5 bg-white shadow-sm 
          transition-all duration-200 
          ${isEditMode ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
        `}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {/* Empty State */}
        {!imageFile && !uploadedImageUrl && !imageLoadingState && (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-40 cursor-pointer"
          >
            <UploadCloudIcon className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground font-medium">
              Click to upload or drag & drop
            </p>
          </Label>
        )}

        {/* Uploading State */}
        {imageLoadingState && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Skeleton className="h-28 w-28 rounded-xl bg-gray-200" />
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
        )}

        {/* Preview State */}
        {!imageLoadingState && (uploadedImageUrl || imageFile) && (
          <div className="flex flex-col items-center gap-4">
            {/* Image Preview Card */}
            <div className="w-40 h-40 rounded-xl overflow-hidden border bg-white shadow-inner flex items-center justify-center">
              {uploadedImageUrl ? (
                <img
                  src={uploadedImageUrl}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              )}
            </div>

            {/* File Info Row */}
            <div className="w-full flex items-center justify-between bg-muted/30 border rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium truncate max-w-[160px]">
                  {imageFile?.name}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveImage}
                className="text-muted-foreground hover:text-red-600"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
