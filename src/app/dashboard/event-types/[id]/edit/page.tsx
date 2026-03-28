import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEventType } from "../../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditEventTypePage({ params }: { params: { id: string } }) {
  const event = await prisma.eventType.findUnique({
    where: { id: params.id },
  });

  if (!event) redirect("/dashboard");

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link href="/dashboard" className="text-gray-500 hover:text-black inline-flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit {event.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Update your event settings globally.</p>
      </div>

      <form action={updateEventType} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
        <input type="hidden" name="id" value={event.id} />
        
        <div className="space-y-2">
          <Label htmlFor="title" className="font-semibold text-gray-700">Title</Label>
          <Input id="title" name="title" required defaultValue={event.title} className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black h-11" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug" className="font-semibold text-gray-700">URL Slug</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              cal.com/
            </span>
            <Input id="slug" name="slug" required defaultValue={event.slug} className="rounded-l-none border-gray-300 focus:border-black focus:ring-1 focus:ring-black h-11" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duration" className="font-semibold text-gray-700">Duration (minutes)</Label>
            <Input id="duration" name="duration" type="number" required defaultValue={event.duration} className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bufferTime" className="font-semibold text-gray-700">Buffer Time (minutes)</Label>
            <Input id="bufferTime" name="bufferTime" type="number" required defaultValue={event.bufferTime} className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black h-11" />
            <p className="text-xs text-gray-500">Breathing room between meetings.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold text-gray-700">Description</Label>
          <textarea 
            id="description" 
            name="description" 
            rows={3}
            defaultValue={event.description || ""}
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-shadow" 
            placeholder="A quick 30 minute sync."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customQuestions" className="font-semibold text-gray-700">Custom Questions Context</Label>
          <textarea 
            id="customQuestions" 
            name="customQuestions" 
            rows={2}
            defaultValue={event.customQuestions || ""}
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-shadow" 
            placeholder="e.g. Please specify your diet, What is your twitter handle?"
          />
          <p className="text-xs text-gray-500">Provide labels for any custom info you want to collect during booking.</p>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t">
          <Link href="/dashboard">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">Save</Button>
        </div>
      </form>
    </div>
  );
}
