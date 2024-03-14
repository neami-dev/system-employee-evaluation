 
import { Input } from "@/components/ui/input"
import { CardTitle, CardDescription, CardHeader, Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveLine } from "@nivo/line"
import { ResponsiveBar } from "@nivo/bar"

export default function Components() {
  return (
    (<div className=" min-h-screen">
       
      <div className="px-6 py-4">
        <div className="grid grid-cols-4 gap-6">
          <nav className="flex flex-col space-y-4">
            <LayoutDashboardIcon className="text-[#9CA3AF]" />
            <CalendarIcon className="text-[#9CA3AF]" />
            <SettingsIcon className="text-[#9CA3AF]" />
          </nav>
          <div className="col-span-3 grid grid-cols-3 gap-6">
            <Card className="col-span-1 bg-[#EFF6FF] p-4 rounded-lg">
              <CardHeader>
                <ClockIcon className="text-[#60A5FA]" />
                <CardTitle>8:02:09 AM</CardTitle>
                <CardDescription>Realtime Insight</CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 bg-[#EFF6FF] p-4 rounded-lg">
              <CardHeader>
                <CheckCircleIcon className="text-[#60A5FA]" />
                <CardTitle>04/07</CardTitle>
                <CardDescription>Tasks Completed</CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 bg-[#EFF6FF] p-4 rounded-lg">
              <CardHeader>
                <WorkflowIcon className="text-[#60A5FA]" />
                <CardTitle>04/07</CardTitle>
                <CardDescription>Tasks in Progress</CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 bg-[#EFF6FF] p-4 rounded-lg">
              <CardHeader>
                <PauseCircleIcon className="text-[#60A5FA]" />
                <CardTitle>04/07</CardTitle>
                <CardDescription>Tasks On Hold</CardDescription>
              </CardHeader>
            </Card>
            <Card className="col-span-1 bg-[#EFF6FF] p-4 rounded-lg">
              <CardHeader>
                <ActivityIcon className="text-[#60A5FA]" />
                <CardTitle>Today:</CardTitle>
                <CardDescription>18th November 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="mt-2" variant="outline">
                  View Attendance
                </Button>
              </CardContent>
            </Card>
            <Card className="col-span-1 bg-[#EFF6FF] p-4 rounded-lg">
              <CardHeader>
                <TimerIcon className="text-[#60A5FA]" />
                <CardTitle>7/35</CardTitle>
                <CardDescription>Work Time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">From Office: 8h</p>
                <p className="text-sm">From Home: 1h</p>
              </CardContent>
            </Card>
            <Card className="col-span-1 bg-[#EFF6FF] p-4 rounded-lg">
              <CardHeader>
                <CodeIcon className="text-[#60A5FA]" />
                <CardTitle>5h/10</CardTitle>
                <CardDescription>Commits Github</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="col-span-2">
            <Card className="bg-white p-4 rounded-lg">
              <CardHeader>
                <CardTitle>General performance</CardTitle>
                <div className="flex space-x-2">
                  <Button className="text-sm" variant="ghost">
                    Daily
                  </Button>
                  <Button className="text-sm" variant="ghost">
                    Weekly
                  </Button>
                  <Button className="text-sm" variant="ghost">
                    Monthly
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CurvedlineChart className="w-full h-[300px]" />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2">
            <Card className="bg-white p-4 rounded-lg">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart className="w-full h-[300px]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>)
  );
}


function LayoutDashboardIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>)
  );
}


function CalendarIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>)
  );
}


function SettingsIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>)
  );
}


function ClockIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>)
  );
}


function CheckCircleIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>)
  );
}


function WorkflowIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>)
  );
}


function PauseCircleIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="10" x2="10" y1="15" y2="9" />
      <line x1="14" x2="14" y1="15" y2="9" />
    </svg>)
  );
}


function ActivityIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>)
  );
}


function TimerIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </svg>)
  );
}


function CodeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>)
  );
}


function CurvedlineChart(props) {
  return (
    (<div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application" />
    </div>)
  );
}


function BarChart(props) {
  return (
    (<div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data" />
    </div>)
  );
}
