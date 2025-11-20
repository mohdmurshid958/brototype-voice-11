import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Stats {
  totalComplaints: number;
  activeComplaints: number;
  resolvedComplaints: number;
  totalStudents: number;
}

export function useStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Get total complaints
      const { count: totalComplaints, error: totalError } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true });

      if (totalError) throw totalError;

      // Get active complaints (pending or in-progress)
      const { count: activeComplaints, error: activeError } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "in-progress"]);

      if (activeError) throw activeError;

      // Get resolved complaints
      const { count: resolvedComplaints, error: resolvedError } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved");

      if (resolvedError) throw resolvedError;

      // Get total students
      const { count: totalStudents, error: studentsError } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      if (studentsError) throw studentsError;

      return {
        totalComplaints: totalComplaints || 0,
        activeComplaints: activeComplaints || 0,
        resolvedComplaints: resolvedComplaints || 0,
        totalStudents: totalStudents || 0,
      } as Stats;
    },
  });
}
