"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Clock, CalendarIcon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/app/dashboard/actions";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function BookingFlow({ event, user, slotsByDate, rescheduledFromId }: any) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dateKey = date ? format(date, "yyyy-MM-dd") : null;
  const availableSlots = dateKey && slotsByDate[dateKey] ? slotsByDate[dateKey] : [];

  async function handleBook(formData: FormData) {
    setIsSubmitting(true);
    formData.append("startTime", selectedSlot!);
    const endDate = new Date(new Date(selectedSlot!).getTime() + event.duration * 60000);
    formData.append("endTime", endDate.toISOString());
    formData.append("eventTypeId", event.id);
    formData.append("userId", user.id);
    if (rescheduledFromId) formData.append("rescheduledFromId", rescheduledFromId);

    const bookingId = await createBooking(formData);
    
    if (bookingId) {
      router.push(`/${event.slug}/success?date=${selectedSlot}`);
    } else {
      setIsSubmitting(false);
      alert("Failed to book slot");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 lg:p-10 font-[Inter,sans-serif] antialiased bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="max-w-[1060px] w-full bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500 border border-border/50 overflow-hidden flex min-h-[460px] flex-col md:flex-row animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
        
        {/* Left Side: Event Info */}
        <div className="w-full md:w-[32%] p-6 sm:p-8 border-r border-border/50 bg-card/50 flex flex-col justify-between relative">
          <div>
            {selectedSlot && (
              <button 
                onClick={() => { setSelectedSlot(null); setShowConfirm(null); }} 
                className="w-8 h-8 flex items-center justify-center border border-border rounded-full mb-6 hover:bg-muted transition-colors text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-muted-foreground font-semibold mb-2 text-sm uppercase tracking-wider">{user.name || "User"}</h2>
            <h1 className="text-[28px] leading-8 font-extrabold text-foreground mb-6 drop-shadow-sm">{event.title}</h1>
            
            <div className="text-gray-500 font-semibold text-sm flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-[18px] h-[18px]" /> {event.duration} min
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Video className="w-[18px] h-[18px]" /> Web conferencing details provided upon confirmation.
              </div>
              {selectedSlot && (
                <div className="flex items-start gap-3 mt-2 text-green-700">
                  <CalendarIcon className="w-[18px] h-[18px] mt-0.5" /> 
                  <span className="leading-5">{format(parseISO(selectedSlot), "h:mm a, EEEE, MMMM d, yyyy")}</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-6 leading-relaxed text-sm whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>

        {/* Right Side: Calendar / Time Slots / Form */}
        <div className="flex-1 flex flex-col sm:flex-row w-full bg-white">
          {!selectedSlot ? (
            <>
              {/* Calendar Grid */}
              <div className="flex-1 p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-gray-200">
                <h3 className="font-bold text-[18px] text-gray-900 mb-6">Select a Date & Time</h3>
                <Calendar 
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setShowConfirm(null); }}
                  disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                  className="rounded-md border-0 w-full p-0"
                  classNames={{
                    day_selected: "bg-[#111827] text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white",
                    day_today: "bg-gray-100 text-gray-900 font-bold",
                  }}
                />
              </div>
              
              {/* Time Slots List */}
              <div className="w-full sm:w-[260px] p-6 sm:p-8 flex flex-col h-full bg-white">
                <h4 className="font-medium text-gray-900 mb-6 mt-1">
                  {date ? format(date, "EEEE, MMMM d") : "Select a date"}
                </h4>
                <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2 pb-4 scrollbar-thin">
                  {availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-2">No available slots.</p>
                  ) : (
                    availableSlots.map((slot: string) => {
                      const isConfirming = showConfirm === slot;
                      return (
                        <div key={slot} className="flex gap-2">
                          <button 
                            onClick={() => isConfirming ? setSelectedSlot(slot) : setShowConfirm(slot)}
                            className={`w-full py-3.5 border rounded-md text-[15px] font-semibold transition-all ${
                              isConfirming 
                                ? "border-foreground text-background bg-muted w-1/2 text-transparent hidden"
                                : "text-foreground border-border hover:border-foreground/50 hover:border-2 hover:py-[13px] bg-card"
                            }`}
                          >
                            {format(parseISO(slot), "h:mm a")}
                          </button>
                          
                          {isConfirming && (
                            <>
                              <button className="w-1/2 py-3.5 border-2 rounded-md text-[15px] font-semibold border-foreground text-foreground bg-card cursor-default">
                                {format(parseISO(slot), "h:mm a")}
                              </button>
                              <button 
                                onClick={() => setSelectedSlot(slot)}
                                className="w-1/2 py-3.5 rounded-md text-[15px] font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors"
                              >
                                Next
                              </button>
                            </>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Booking Form */
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              <h3 className="font-bold text-[18px] text-gray-900 mb-6">Enter Details</h3>
              <form action={handleBook} className="space-y-5 max-w-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-semibold text-[14px] text-gray-700">Name *</Label>
                  <Input id="name" name="name" required className="rounded-md h-11 border-gray-300 focus:border-black focus:ring-1 focus:ring-black" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-semibold text-[14px] text-gray-700">Email *</Label>
                  <Input id="email" name="email" type="email" required className="rounded-md h-11 border-gray-300 focus:border-black focus:ring-1 focus:ring-black" />
                </div>
                
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="notes" className="font-semibold text-[14px] text-gray-700">
                    {event.customQuestions ? event.customQuestions : "Additional notes"}
                  </Label>
                  <textarea 
                    id="notes"
                    name="notes"
                    rows={4} 
                    className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all shadow-sm" 
                    placeholder="We want to make this meeting perfect. Share anything!"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-black text-white hover:bg-gray-800 rounded-md font-semibold text-[15px]">
                    {isSubmitting ? "Confirming..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
