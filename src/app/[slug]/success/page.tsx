import Link from "next/link";
import { CheckCircle2, CalendarIcon, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

export default async function SuccessPage({ searchParams }: { searchParams: { date?: string } }) {
  const { date } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">This meeting is scheduled</h1>
        <p className="text-sm text-gray-500 mb-8">
          We sent an email with a calendar invitation with the details to you and the host.
        </p>

        {date && (
          <div className="w-full border rounded-xl p-4 mb-8 bg-gray-50 text-left">
            <div className="font-semibold text-gray-900 mb-3 border-b pb-2">Booking Details</div>
            <div className="space-y-2 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                {format(parseISO(date as string), "EEEE, MMMM d, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                {format(parseISO(date as string), "h:mm a")}
              </div>
            </div>
          </div>
        )}

        <Link href="/">
          <button className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Return to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
