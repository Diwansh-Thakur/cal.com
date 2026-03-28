import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { updateProfileSettings } from "../actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function SettingsPage() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-8">
        
        {/* Appearance Section */}
        <div className="space-y-4 pb-8 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground">Customize how the dashboard and your public booking pages look.</p>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
            <div className="font-medium text-sm text-foreground">Interface Theme</div>
            <ThemeToggle />
          </div>
        </div>

        {/* Profile Info Form */}
        <form action={updateProfileSettings} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold block text-foreground">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={user?.name || ""}
              className="w-full md:w-1/2 focus:ring-ring border-border bg-background text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold block text-foreground">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              defaultValue={user?.email || ""}
              className="w-full md:w-1/2 focus:ring-ring border-border bg-muted cursor-not-allowed text-muted-foreground"
              readOnly
            />
            <p className="text-xs text-muted-foreground mt-1">Your email address cannot be changed.</p>
          </div>

          <div className="pt-6 mt-6 border-t border-border flex justify-end">
            <Button type="submit" className="bg-foreground text-background px-6 hover:bg-foreground/90 rounded-md font-semibold transition-colors">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
