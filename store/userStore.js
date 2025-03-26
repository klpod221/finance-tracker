import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const createUserProfile = (authUser, userProfile) => {
  if (!userProfile) {
    return {
      balance: 0,
      total_income: 0,
      total_expense: 0,
      email: authUser.email,
    };
  }

  const { user_balances } = userProfile;
  delete userProfile.user_balances;

  return {
    ...userProfile,
    balance: user_balances?.balance || 0,
    total_income: user_balances?.total_income || 0,
    total_expense: user_balances?.total_expense || 0,
    email: authUser.email,
  };
}

export const useUserStore = create((set) => ({
  user: null,
  loading: true,
  fetchUserInfo: async () => {
    set({ loading: true });
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("*, user_balances(balance, total_income, total_expense)")
        .eq("id", data.user.id)
        .single();

      const user = createUserProfile(data.user, userProfile);

      set({ user, loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },
  refreshUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("*, user_balances(balance, total_income, total_expense)")
        .eq("id", data.user.id)
        .single();

      const user = createUserProfile(data.user, userProfile);

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
