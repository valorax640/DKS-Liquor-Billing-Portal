import { create } from 'zustand';
import apiService from 'services/apiService'
import { SUCCESS_STATUS, ERROR_STATUS, LOADING_STATUS } from 'utils/constant';

const useMemberListStore = create((set) => ({
    gstdata: null,         // User profile data
    gststatus: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,           // Error message if any

    fetchGstData: async () => {
        set({ gststatus: LOADING_STATUS }); // Start loading
        try {
            const res = await apiService.get('billing/gst-list');

            set({
                gstdata: res.response,
                gststatus: SUCCESS_STATUS,
                error: null
            });
        } catch (err) {
            set({
                gststatus: ERROR_STATUS,
                error: err.message
            });
        }
    }
}));

export default useMemberListStore;
