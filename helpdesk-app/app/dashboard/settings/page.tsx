import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Account Settings</h1>
      
      <Card className="bg-zinc-900/40 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-lg font-bold">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
            <Input defaultValue={session?.user?.name || ""} className="bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Email Address</label>
            <Input disabled value={session?.user?.email || ""} className="bg-zinc-950 border-zinc-800 text-zinc-500 cursor-not-allowed" />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto">Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}