import type { Profile } from "./types";

const ada: Profile = {
  id: "pro-1",
  displayName: "Ada Lovelace",
  contact: {
    email: "ada@example.test",
    phone: "+44 20 0000 0000",
    address: {
      city: "London",
      country: "GB",
    },
  },
  preferences: {
    theme: "dark",
    marketingEmail: true,
  },
  tags: ["mathematician", "engineer"],
};

export class ProfileStore {
  #profiles = new Map<string, Profile>();

  constructor(profiles: readonly Profile[] = [ada]) {
    for (const profile of profiles) {
      this.#profiles.set(profile.id, structuredClone(profile));
    }
  }

  get(id: string): Profile | undefined {
    const profile = this.#profiles.get(id);

    return profile ? structuredClone(profile) : undefined;
  }

  replace(profile: Profile): void {
    this.#profiles.set(profile.id, structuredClone(profile));
  }
}

export function createProfileStore(): ProfileStore {
  return new ProfileStore();
}
