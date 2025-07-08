import { create } from 'zustand';
import apiService from 'services/apiService'
import { SUCCESS_STATUS, ERROR_STATUS, LOADING_STATUS } from 'utils/constant';

const useItemListStore = create((set) => ({
    itemdata: null,         // User profile data
    itemstatus: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
    itemerror: null,           // Error message if any

    fetchItemData: async () => {
        set({ itemstatus: LOADING_STATUS }); // Start loading
        try {
            const res = await apiService.get('billing/item-list');

            set({
                itemdata: res.response,
                itemstatus: SUCCESS_STATUS,
                error: null
            });
        } catch (err) {
            set({
                itemstatus: ERROR_STATUS,
                error: err.message
            });
        }
    }
}));

export default useItemListStore;
