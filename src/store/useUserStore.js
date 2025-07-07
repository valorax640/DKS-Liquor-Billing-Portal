import { create } from 'zustand';
import axios from 'axios';
import apiService from 'services/apiService'
import { SUCCESS_STATUS, ERROR_STATUS, LOADING_STATUS } from 'utils/constant';

const useUserStore = create((set) => ({
    profile: null,         // User profile data
    status: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,           // Error message if any

    fetchUser: async () => {
        set({ status: LOADING_STATUS }); // Start loading

        try {
            const res = await apiService.get('users/user');

            set({
                profile: res.response.name,
                status: SUCCESS_STATUS,
                error: null
            });
        } catch (err) {
            set({
                status: ERROR_STATUS,
                error: err.message
            });
        }
    }
}));

export default useUserStore;
