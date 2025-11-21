import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminDock } from "@/components/AdminDock";
import { AdminMobileNav } from "@/components/AdminMobileNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Area, AreaChart, PieChart, Pie, Label, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("90d");

  const categoryData = [
    { name: "Infrastructure", value: 15 },
    { name: "Technical", value: 12 },
    { name: "Mentorship", value: 8 },
    { name: "Administrative", value: 10 },
    { name: "Other", value: 3 },
  ];

  const statusData = [
    { status: "pending", complaints: 15, fill: "var(--chart-1)" },
    { status: "inProgress", complaints: 8, fill: "var(--chart-2)" },
    { status: "resolved", complaints: 30, fill: "var(--chart-3)" },
    { status: "rejected", complaints: 3, fill: "var(--chart-4)" },
  ];

  const statusConfig = {
    complaints: {
      label: "Complaints",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-1))",
    },
    inProgress: {
      label: "In Progress",
      color: "hsl(var(--chart-2))",
    },
    resolved: {
      label: "Resolved",
      color: "hsl(var(--chart-3))",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  const totalComplaints = useMemo(() => {
    return statusData.reduce((acc, curr) => acc + curr.complaints, 0);
  }, []);

  const timelineData = [
    { date: "2024-04-01", submitted: 222, resolved: 150 },
    { date: "2024-04-02", submitted: 97, resolved: 180 },
    { date: "2024-04-03", submitted: 167, resolved: 120 },
    { date: "2024-04-04", submitted: 242, resolved: 260 },
    { date: "2024-04-05", submitted: 373, resolved: 290 },
    { date: "2024-04-06", submitted: 301, resolved: 340 },
    { date: "2024-04-07", submitted: 245, resolved: 180 },
    { date: "2024-04-08", submitted: 409, resolved: 320 },
    { date: "2024-04-09", submitted: 59, resolved: 110 },
    { date: "2024-04-10", submitted: 261, resolved: 190 },
    { date: "2024-04-11", submitted: 327, resolved: 350 },
    { date: "2024-04-12", submitted: 292, resolved: 210 },
    { date: "2024-04-13", submitted: 342, resolved: 380 },
    { date: "2024-04-14", submitted: 137, resolved: 220 },
    { date: "2024-04-15", submitted: 120, resolved: 170 },
    { date: "2024-04-16", submitted: 138, resolved: 190 },
    { date: "2024-04-17", submitted: 446, resolved: 360 },
    { date: "2024-04-18", submitted: 364, resolved: 410 },
    { date: "2024-04-19", submitted: 243, resolved: 180 },
    { date: "2024-04-20", submitted: 89, resolved: 150 },
    { date: "2024-04-21", submitted: 137, resolved: 200 },
    { date: "2024-04-22", submitted: 224, resolved: 170 },
    { date: "2024-04-23", submitted: 138, resolved: 230 },
    { date: "2024-04-24", submitted: 387, resolved: 290 },
    { date: "2024-04-25", submitted: 215, resolved: 250 },
    { date: "2024-04-26", submitted: 75, resolved: 130 },
    { date: "2024-04-27", submitted: 383, resolved: 420 },
    { date: "2024-04-28", submitted: 122, resolved: 180 },
    { date: "2024-04-29", submitted: 315, resolved: 240 },
    { date: "2024-04-30", submitted: 454, resolved: 380 },
    { date: "2024-05-01", submitted: 165, resolved: 220 },
    { date: "2024-05-02", submitted: 293, resolved: 310 },
    { date: "2024-05-03", submitted: 247, resolved: 190 },
    { date: "2024-05-04", submitted: 385, resolved: 420 },
    { date: "2024-05-05", submitted: 481, resolved: 390 },
    { date: "2024-05-06", submitted: 498, resolved: 520 },
    { date: "2024-05-07", submitted: 388, resolved: 300 },
    { date: "2024-05-08", submitted: 149, resolved: 210 },
    { date: "2024-05-09", submitted: 227, resolved: 180 },
    { date: "2024-05-10", submitted: 293, resolved: 330 },
    { date: "2024-05-11", submitted: 335, resolved: 270 },
    { date: "2024-05-12", submitted: 197, resolved: 240 },
    { date: "2024-05-13", submitted: 197, resolved: 160 },
    { date: "2024-05-14", submitted: 448, resolved: 490 },
    { date: "2024-05-15", submitted: 473, resolved: 380 },
    { date: "2024-05-16", submitted: 338, resolved: 400 },
    { date: "2024-05-17", submitted: 499, resolved: 420 },
    { date: "2024-05-18", submitted: 315, resolved: 350 },
    { date: "2024-05-19", submitted: 235, resolved: 180 },
    { date: "2024-05-20", submitted: 177, resolved: 230 },
    { date: "2024-05-21", submitted: 82, resolved: 140 },
    { date: "2024-05-22", submitted: 81, resolved: 120 },
    { date: "2024-05-23", submitted: 252, resolved: 290 },
    { date: "2024-05-24", submitted: 294, resolved: 220 },
    { date: "2024-05-25", submitted: 201, resolved: 250 },
    { date: "2024-05-26", submitted: 213, resolved: 170 },
    { date: "2024-05-27", submitted: 420, resolved: 460 },
    { date: "2024-05-28", submitted: 233, resolved: 190 },
    { date: "2024-05-29", submitted: 78, resolved: 130 },
    { date: "2024-05-30", submitted: 340, resolved: 280 },
    { date: "2024-05-31", submitted: 178, resolved: 230 },
    { date: "2024-06-01", submitted: 178, resolved: 200 },
    { date: "2024-06-02", submitted: 470, resolved: 410 },
    { date: "2024-06-03", submitted: 103, resolved: 160 },
    { date: "2024-06-04", submitted: 439, resolved: 380 },
    { date: "2024-06-05", submitted: 88, resolved: 140 },
    { date: "2024-06-06", submitted: 294, resolved: 250 },
    { date: "2024-06-07", submitted: 323, resolved: 370 },
    { date: "2024-06-08", submitted: 385, resolved: 320 },
    { date: "2024-06-09", submitted: 438, resolved: 480 },
    { date: "2024-06-10", submitted: 155, resolved: 200 },
    { date: "2024-06-11", submitted: 92, resolved: 150 },
    { date: "2024-06-12", submitted: 492, resolved: 420 },
    { date: "2024-06-13", submitted: 81, resolved: 130 },
    { date: "2024-06-14", submitted: 426, resolved: 380 },
    { date: "2024-06-15", submitted: 307, resolved: 350 },
    { date: "2024-06-16", submitted: 371, resolved: 310 },
    { date: "2024-06-17", submitted: 475, resolved: 520 },
    { date: "2024-06-18", submitted: 107, resolved: 170 },
    { date: "2024-06-19", submitted: 341, resolved: 290 },
    { date: "2024-06-20", submitted: 408, resolved: 450 },
    { date: "2024-06-21", submitted: 169, resolved: 210 },
    { date: "2024-06-22", submitted: 317, resolved: 270 },
    { date: "2024-06-23", submitted: 480, resolved: 530 },
    { date: "2024-06-24", submitted: 132, resolved: 180 },
    { date: "2024-06-25", submitted: 141, resolved: 190 },
    { date: "2024-06-26", submitted: 434, resolved: 380 },
    { date: "2024-06-27", submitted: 448, resolved: 490 },
    { date: "2024-06-28", submitted: 149, resolved: 200 },
    { date: "2024-06-29", submitted: 103, resolved: 160 },
    { date: "2024-06-30", submitted: 446, resolved: 400 },
  ];

  const timelineConfig = {
    complaints: {
      label: "Complaints",
    },
    submitted: {
      label: "Submitted",
      color: "hsl(var(--chart-1))",
    },
    resolved: {
      label: "Resolved",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const filteredData = timelineData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <AdminMobileNav />
      <AdminDock />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Visualize complaint trends and metrics</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Complaints by Category */}
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Complaints by Category</CardTitle>
                <CardDescription>Distribution across different categories</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ChartContainer config={{ value: { label: "Complaints" } }} className="h-[300px]">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Status Distribution - Donut Chart */}
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Current complaint statuses</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={statusConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={statusData}
                      dataKey="complaints"
                      nameKey="status"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalComplaints.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Total
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Resolution rate improving <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none text-center">
                  Showing current status distribution
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Complaints Over Time - Interactive Area Chart */}
          <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle>Complaints Over Time</CardTitle>
                <CardDescription>
                  Tracking submitted vs resolved complaints
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="w-[160px] rounded-lg"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={timelineConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="fillSubmitted" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-submitted)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-submitted)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-resolved)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-resolved)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="resolved"
                    type="natural"
                    fill="url(#fillResolved)"
                    stroke="var(--color-resolved)"
                    stackId="a"
                  />
                  <Area
                    dataKey="submitted"
                    type="natural"
                    fill="url(#fillSubmitted)"
                    stroke="var(--color-submitted)"
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
