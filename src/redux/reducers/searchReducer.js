import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search',
    initialState: { user: null, loading: false, status: false, has: false },
    reducers: {
        setSearchState: (state, action) => {
            state.user = action.payload.user;
            state.loading = action.payload.loading;
            state.status = action.payload.status;
            state.has = action.payload.has;
        },
        clearSearchState: (state) => {
            state = { user: null, loading: false, status: false, has: false }
            return state;
        }
    },
});

export const { setSearchState, clearSearchState } = searchSlice.actions;
export default searchSlice.reducer;