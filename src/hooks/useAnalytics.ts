import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface CategoryCount {
  category: string;
  count: number;
}

interface StatusCount {
  status: string;
  count: number;
}

export function useComplaintsByCategory() {
  return useQuery({
    queryKey: ["complaints-by-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("category");

      if (error) throw error;

      // Count complaints by category
      const categoryMap = new Map<string, number>();
      data.forEach((complaint) => {
        const count = categoryMap.get(complaint.category) || 0;
        categoryMap.set(complaint.category, count + 1);
      });

      return Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      })) as CategoryCount[];
    },
  });
}

export function useComplaintsByStatus() {
  return useQuery({
    queryKey: ["complaints-by-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("status");

      if (error) throw error;

      // Count complaints by status
      const statusMap = new Map<string, number>();
      data.forEach((complaint) => {
        const status = complaint.status || "pending";
        const count = statusMap.get(status) || 0;
        statusMap.set(status, count + 1);
      });

      return Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
      })) as StatusCount[];
    },
  });
}

export function useComplaintsTimeline() {
  return useQuery({
    queryKey: ["complaints-timeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("created_at, status, updated_at")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const dateMap = new Map<string, { submitted: number; resolved: number }>();
      
      data.forEach((complaint) => {
        const createdDate = new Date(complaint.created_at!).toISOString().split("T")[0];
        const entry = dateMap.get(createdDate) || { submitted: 0, resolved: 0 };
        entry.submitted += 1;
        dateMap.set(createdDate, entry);

        if (complaint.status === "resolved" && complaint.updated_at) {
          const resolvedDate = new Date(complaint.updated_at).toISOString().split("T")[0];
          const resolvedEntry = dateMap.get(resolvedDate) || { submitted: 0, resolved: 0 };
          resolvedEntry.resolved += 1;
          dateMap.set(resolvedDate, resolvedEntry);
        }
      });

      return Array.from(dateMap.entries())
        .map(([date, counts]) => ({
          date,
          submitted: counts.submitted,
          resolved: counts.resolved,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
  });
}
