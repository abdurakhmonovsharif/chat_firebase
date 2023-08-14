import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: { setting: false, musics: false, videos: false, pictures: false },
    reducers: {
        setSideBarStates: (state, action) => {
            state.setting = action.payload.setting;
            state.musics = action.payload.musics;
            state.videos = action.payload.videos;
            state.pictures = action.payload.pictures;
        },
        clearSideBarStates: (state) => {
            state = { setting: false, musics: false, videos: false, pictures: false }
            return state;
        }
    },
});

export const { setSideBarStates, clearSideBarStates } = sidebarSlice.actions;
export default sidebarSlice.reducer;