import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Area, AreaChart, PieChart, Pie, Label, XAxis, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useComplaintsByCategory, useComplaintsByStatus, useComplaintsTimeline } from "@/hooks/useAnalytics";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("90d");
  
  const { data: categoryData = [], isLoading: categoryLoading } = useComplaintsByCategory();
  const { data: statusData = [], isLoading: statusLoading } = useComplaintsByStatus();
  const { data: timelineData = [], isLoading: timelineLoading } = useComplaintsTimeline();

  // Transform category data for chart
  const chartCategoryData = categoryData.map((item) => ({
    month: item.category.slice(0, 3),
    desktop: item.count,
  }));

  // Transform status data for pie chart
  const chartStatusData = statusData.map((item, index) => ({
    status: item.status,
    complaints: item.count,
    fill: `hsl(var(--chart-${index + 1}))`,
  }));

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
    return chartStatusData.reduce((acc, curr) => acc + curr.complaints, 0);
  }, [chartStatusData]);

  const chartConfig = {
    desktop: {
      label: "Complaints",
      color: "hsl(217, 91%, 60%)",
    },
  } satisfies ChartConfig;

  const timelineConfig = {
    complaints: {
      label: "Complaints",
    },
    submitted: {
      label: "Submitted",
      color: "hsl(217, 91%, 60%)",
    },
    resolved: {
      label: "Resolved",
      color: "hsl(217, 91%, 75%)",
    },
  } satisfies ChartConfig;

  const filteredData = useMemo(() => {
    return timelineData.filter((item) => {
      const date = new Date(item.date);
      const now = new Date();
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [timelineData, timeRange]);

  if (categoryLoading || statusLoading || timelineLoading) {
    return (
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-24 bg-background">
        <p className="text-muted-foreground">Loading analytics...</p>
      </main>
    );
  }

  return (

    <main className="flex-1 p-4 md:p-8 pb-24 md:pb-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Visualize complaint trends and metrics</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Complaints by Category - Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={chartCategoryData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                  Showing total complaints for the last 6 months
                </div>
              </CardFooter>
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
                      data={chartStatusData}
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
  );
}
