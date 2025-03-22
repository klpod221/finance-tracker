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
      const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      const user = {
        ...userProfile,
        email: data.user.email,
      };

      set({ user, loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },
  setUser: (user) => {
    set({ user });
  },
  deleteUser: () => {
    set({ user: null });
  },
}));
