import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const useUserStore = create((set) => ({
  user: null,
  loading: true,
  fetchUserInfo: async () => {
    set({ loading: true });
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      // get user profile and user balances using join
      const { data: userProfile } = await supabase
        .from("users")
        .select("*, user_balances(balance, total_income, total_expense)")
        .eq("id", data.user.id)
        .single();

      const { user_balances } = userProfile;
      delete userProfile.user_balances;

      const user = {
        ...userProfile,
        ...user_balances,
        email: data.user.email,
      };

      set({ user, loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },
  refreshUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      // get user profile and user balances using join
      const { data: userProfile } = await supabase
        .from("users")
        .select("*, user_balances(balance, total_income, total_expense)")
        .eq("id", data.user.id)
        .single();

      const { user_balances } = userProfile;
      delete userProfile.user_balances;

      const user = {
        ...userProfile,
        ...user_balances,
        email: data.user.email,
      };

      set({ user });
    }
  },
  setUser: (user) => {
    set({ user });
  },
  deleteUser: () => {
    set({ user: null });
  },
}));
