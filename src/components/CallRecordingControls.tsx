import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Circle, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CallRecordingControlsProps {
  callId: string;
}

export const CallRecordingControls = ({ callId }: CallRecordingControlsProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      // Get the display media (screen + audio)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        await saveRecording(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Call is being recorded",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const saveRecording = async (blob: Blob) => {
    try {
      const fileName = `recording-${callId}-${Date.now()}.webm`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("call-recordings")
        .upload(fileName, blob, {
          contentType: "video/webm",
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("call-recordings")
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase.from("call_recordings").insert({
        call_id: callId,
        recording_url: publicUrl,
        duration_seconds: recordingTime,
      });

      if (dbError) throw dbError;

      toast({
        title: "Recording saved",
        description: "Your call recording has been saved",
      });

      setRecordingTime(0);
    } catch (error) {
      console.error("Error saving recording:", error);
      toast({
        title: "Error",
        description: "Failed to save recording",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
          <Circle className="w-3 h-3 fill-white text-white animate-pulse" />
          <span className="text-white text-sm font-medium">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}
      
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        variant="ghost"
        size="lg"
        className={`rounded-full w-12 h-12 p-0 ${
          isRecording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-[#3c4043] hover:bg-[#5f6368]"
        }`}
      >
        {isRecording ? (
          <Square className="w-5 h-5 text-white" />
        ) : (
          <Circle className="w-5 h-5 text-white" />
        )}
      </Button>
    </div>
  );
};
