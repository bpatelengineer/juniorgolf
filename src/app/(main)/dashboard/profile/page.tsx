"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";

export default function ProfilePage() {
  const { data: profile, isLoading } = trpc.users.getProfile.useQuery();
  const updateProfile = trpc.users.updateProfile.useMutation();
  const updateCoach = trpc.users.updateCoachProfile.useMutation();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [pgaNumber, setPgaNumber] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setCity(profile.city ?? "");
      setState(profile.state ?? "");
      setBio(profile.coachProfile?.bio ?? "");
      setPriceMin(String(profile.coachProfile?.priceRangeMin ?? ""));
      setPriceMax(String(profile.coachProfile?.priceRangeMax ?? ""));
      setPgaNumber(profile.coachProfile?.pgaMemberNumber ?? "");
    }
  }, [profile]);

  if (isLoading) return <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-400">Loading…</div>;
  if (!profile) return null;

  async function save() {
    await updateProfile.mutateAsync({ name, city, state });
    if (profile?.role === "COACH") {
      await updateCoach.mutateAsync({
        bio: bio || undefined,
        priceRangeMin: priceMin ? parseInt(priceMin) : undefined,
        priceRangeMax: priceMax ? parseInt(priceMax) : undefined,
        pgaMemberNumber: pgaNumber || undefined,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-xl font-bold text-gray-900">Edit Profile</h1>

      <div className="mb-6 flex items-center gap-4">
        <Avatar src={profile.image} name={profile.name} size="lg" />
        <div>
          <p className="font-semibold text-gray-900">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-xs text-gray-400 capitalize mt-0.5">{profile.role.toLowerCase()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="State" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
        </div>

        {profile.role === "COACH" && (
          <>
            <hr className="border-gray-100" />
            <p className="font-medium text-gray-900 text-sm">Coach Profile</p>
            <Textarea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell families about your background…" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Rate Min ($/hr)" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
              <Input label="Rate Max ($/hr)" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </div>
            <Input label="PGA Member Number" value={pgaNumber} onChange={(e) => setPgaNumber(e.target.value)} placeholder="e.g. 1234567" />
          </>
        )}

        {saved && <p className="text-sm text-green-600 font-medium">Saved!</p>}

        <button
          onClick={save}
          disabled={updateProfile.isPending || updateCoach.isPending}
          className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {updateProfile.isPending || updateCoach.isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
