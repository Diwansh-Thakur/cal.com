import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { updateAvailabilitySettings, addDateOverride, deleteDateOverride } from "../actions";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"];

export default async function AvailabilityPage({ searchParams }: { searchParams: { schedule?: string } }) {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    include: { schedules: { include: { availabilities: true, dateOverrides: true } } }
  });

  const schedules = user?.schedules || [];
  const activeScheduleId = searchParams.schedule || schedules[0]?.id;
  const schedule = schedules.find(s => s.id === activeScheduleId) || schedules[0];

  const availabilities = schedule?.availabilities || [];
  const sortedAvailabilities = [...availabilities].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const overrides = schedule?.dateOverrides || [];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Availability</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your weekly working hours and timezone.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 items-center">
        {schedules.map(s => (
          <a 
            key={s.id} 
            href={`?schedule=${s.id}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              s.id === schedule.id ? "bg-black text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            {s.name}
          </a>
        ))}
        
        <form action={async (formData) => { "use server"; const { createSchedule } = await import("../actions"); await createSchedule(formData); }} className="flex gap-2 items-center ml-4 border-l pl-4">
          <Input name="name" placeholder="New schedule..." className="w-32 h-9 text-sm" required />
          <Button type="submit" variant="outline" size="sm" className="h-9"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </form>
      </div>

      <form action={updateAvailabilitySettings} className="space-y-6 bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm transition-all hover:shadow-md animate-in slide-in-from-bottom-2">
        
        <input type="hidden" name="scheduleId" value={schedule?.id || ""} />

        <div className="space-y-2 mb-8 pb-8 border-b border-border">
          <Label htmlFor="timezone" className="font-semibold block text-foreground">Timezone</Label>
          <select 
            id="timezone" 
            name="timezone" 
            defaultValue={user?.timezone || "UTC"}
            className="w-full md:w-1/2 rounded-md border border-border p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring bg-card text-foreground"
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">Your availability will be mapped to this timezone.</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold px-1 text-foreground">Weekly hours</h3>
          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
            {sortedAvailabilities.map((av) => (
              <div key={av.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="w-32 font-medium text-sm text-foreground">
                  {DAYS[av.dayOfWeek]}
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    name={`start-${av.id}`}
                    type="time" 
                    defaultValue={av.startTime || ""} 
                    className="w-28 text-sm focus:ring-black border-gray-300 h-9" 
                  />
                  <span className="text-gray-400 text-sm">-</span>
                  <Input 
                    name={`end-${av.id}`}
                    type="time" 
                    defaultValue={av.endTime || ""} 
                    className="w-28 text-sm focus:ring-black border-gray-300 h-9" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
          <Button type="submit" className="bg-black text-white px-6 hover:bg-gray-800 rounded-md shadow-sm">
            Save Weekly Hours
          </Button>
        </div>
      </form>

      {/* Date Overrides Section */}
      {schedule && (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md mt-8">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-lg">Date Overrides</h3>
            <p className="text-sm text-gray-500">Block out specific dates or adjust your hours for a specific day.</p>
          </div>
          
          <div className="p-6 sm:p-8 space-y-4">
            {overrides.length > 0 ? overrides.map(o => (
              <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50 gap-4">
                <div className="font-medium text-sm">
                  {format(new Date(o.date), "MMMM d, yyyy")}
                  <span className="ml-3 text-gray-500 text-xs px-2 py-0.5 bg-white border rounded-full">
                    {o.startTime && o.endTime ? `${o.startTime} - ${o.endTime}` : "Blocked (No Hours)"}
                  </span>
                </div>
                <form action={async () => { "use server"; await deleteDateOverride(o.id); }}>
                  <button type="submit" className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )) : <p className="text-sm text-gray-500 italic pb-4">No date overrides set.</p>}

            <form action={addDateOverride} className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-end">
              <input type="hidden" name="scheduleId" value={schedule.id} />
              
              <div className="space-y-1.5 w-full md:w-auto flex-1">
                <Label htmlFor="overrideDate" className="text-xs font-semibold text-gray-500 uppercase">Select Date</Label>
                <Input type="date" id="overrideDate" name="date" required className="h-10 focus:ring-black border-gray-300" />
              </div>

              <div className="space-y-1.5 w-full md:w-auto">
                <Label htmlFor="overrideStart" className="text-xs font-semibold text-gray-500 uppercase">Start Time (Optional)</Label>
                <Input type="time" id="overrideStart" name="startTime" className="h-10 w-28 focus:ring-black border-gray-300" />
              </div>

              <div className="space-y-1.5 w-full md:w-auto">
                <Label htmlFor="overrideEnd" className="text-xs font-semibold text-gray-500 uppercase">End Time (Optional)</Label>
                <Input type="time" id="overrideEnd" name="endTime" className="h-10 w-28 focus:ring-black border-gray-300" />
              </div>

              <Button type="submit" variant="outline" className="h-10 whitespace-nowrap gap-2 font-medium hover:bg-gray-50">
                <Plus className="w-4 h-4" /> Add Override
              </Button>
            </form>
            <p className="text-xs text-gray-500 pt-1">If start/end times are left blank, the entire day will be blocked for bookings.</p>
          </div>
        </div>
      )}
    </div>
  );
}
