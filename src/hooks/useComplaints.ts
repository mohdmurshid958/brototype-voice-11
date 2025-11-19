import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface ComplaintResponse {
  id: string;
  complaint_id: string;
  user_id: string;
  message: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export function useComplaints(userId?: string) {
  return useQuery({
    queryKey: ["complaints", userId],
    queryFn: async () => {
      let query = supabase
        .from("complaints")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Complaint[];
    },
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ["complaint", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Complaint;
    },
    enabled: !!id,
  });
}

export function useComplaintResponses(complaintId: string) {
  return useQuery({
    queryKey: ["complaint-responses", complaintId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaint_responses")
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .eq("complaint_id", complaintId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ComplaintResponse[];
    },
    enabled: !!complaintId,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (complaint: {
      title: string;
      description: string;
      category: string;
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from("complaints")
        .insert([complaint])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast({
        title: "Success",
        description: "Complaint submitted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("complaints")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["complaint"] });
      toast({
        title: "Success",
        description: "Complaint updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreateComplaintResponse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (response: {
      complaint_id: string;
      user_id: string;
      message: string;
      status: string;
    }) => {
      // Create the response
      const { data: responseData, error: responseError } = await supabase
        .from("complaint_responses")
        .insert([response])
        .select()
        .single();

      if (responseError) throw responseError;

      // Update complaint status
      const { error: updateError } = await supabase
        .from("complaints")
        .update({ status: response.status })
        .eq("id", response.complaint_id);

      if (updateError) throw updateError;

      return responseData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["complaint-responses", variables.complaint_id] });
      queryClient.invalidateQueries({ queryKey: ["complaint", variables.complaint_id] });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast({
        title: "Success",
        description: "Response added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
