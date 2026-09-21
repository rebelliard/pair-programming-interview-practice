export type DayHours = {
  closesAt: string;
  opensAt: string;
};

export type Hours = Record<string, DayHours>;

export type HoursStore = {
  read: () => Promise<Hours>;
  write: (hours: Hours) => Promise<void>;
};

const initialHours: Hours = {
  friday: { opensAt: '09:00', closesAt: '17:00' },
  monday: { opensAt: '09:00', closesAt: '17:00' },
  tuesday: { opensAt: '09:00', closesAt: '17:00' },
};

export function createHoursStore(initial = initialHours): HoursStore {
  let hours = structuredClone(initial);

  return {
    async read() {
      return structuredClone(hours);
    },
    async write(nextHours) {
      hours = structuredClone(nextHours);
    },
  };
}
