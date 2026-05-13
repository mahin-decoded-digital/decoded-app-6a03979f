import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EmailSubscriber } from '@/types';

interface SubscriberStoreState {
  subscribers: EmailSubscriber[];
  submitStatus: 'success' | 'duplicate' | null;
  submitError: string;
  subscribe: (email: string, interests: ('acoustic' | 'electric' | 'bass' | 'classical')[]) => void;
  resetStatus: () => void;
}

export const useSubscriberStore = create<SubscriberStoreState>()(
  persist(
    (set, get) => ({
      subscribers: [],
      submitStatus: null,
      submitError: '',

      subscribe: (email: string, interests: ('acoustic' | 'electric' | 'bass' | 'classical')[]) => {
        const subscribers = get().subscribers;
        const exists = subscribers.some(
          (s) => s.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
          set({ submitStatus: 'duplicate' });
          return;
        }
        const newSubscriber: EmailSubscriber = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          email,
          interests,
          confirmedAt: null,
        };
        set({
          subscribers: [...subscribers, newSubscriber],
          submitStatus: 'success',
        });
      },

      resetStatus: () => set({ submitStatus: null, submitError: '' }),
    }),
    { name: 'strum-subscribers' }
  )
);
