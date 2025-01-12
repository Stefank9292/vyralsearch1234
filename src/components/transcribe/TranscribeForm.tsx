import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, Upload } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { TranscriptionProgress, TranscriptionStage } from "./TranscriptionProgress";

const instagramUrlPattern = /^https:\/\/(?:www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?$/;

const formSchema = z.object({
  url: z.string()
    .url("Please enter a valid URL")
    .regex(instagramUrlPattern, "Please enter a valid Instagram post URL (e.g., https://www.instagram.com/p/ABC123)")
});

type FormData = z.infer<typeof formSchema>;

interface TranscribeFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  stage?: TranscriptionStage;
}

export function TranscribeForm({ onSubmit, isLoading, stage }: TranscribeFormProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ""
    }
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.url);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transcribe video"
      });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file first"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const { data, error } = await supabase.functions.invoke('transcribe-file', {
        body: formData
      });

      if (error) throw error;

      // Call onSubmit with the transcribed text
      await onSubmit(data.text);
      setSelectedFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transcribe file"
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size must be less than 25MB"
      });
      return;
    }

    setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Video URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://www.instagram.com/p/..." 
                      className="h-10"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Transcribe Video
              </Button>

              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFileUpload}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Transcribe File
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </Card>

      {isLoading && stage && (
        <TranscriptionProgress stage={stage} />
      )}
    </div>
  );
}