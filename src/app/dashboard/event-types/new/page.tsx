import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEventType } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewEventTypePage() {
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard" className="text-gray-500 hover:text-black inline-flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add a new event type</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new event type for people to book times with.</p>
      </div>

      <form action={createEventType} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-semibold">Title</Label>
          <Input id="title" name="title" required placeholder="e.g. 30 Min Meeting" className="border-gray-300 focus:ring-black" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug" className="font-semibold">URL Slug</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              cal.com/
            </span>
            <Input id="slug" name="slug" required placeholder="30-min-meeting" className="rounded-l-none border-gray-300 focus:ring-black" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duration" className="font-semibold text-gray-700">Duration (minutes)</Label>
            <Input id="duration" name="duration" type="number" required defaultValue="30" className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bufferTime" className="font-semibold text-gray-700">Buffer Time (minutes)</Label>
            <Input id="bufferTime" name="bufferTime" type="number" required defaultValue="0" className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black h-11" />
            <p className="text-xs text-gray-500">Breathing room between meetings.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold text-gray-700">Description</Label>
          <textarea 
            id="description" 
            name="description" 
            rows={3}
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
