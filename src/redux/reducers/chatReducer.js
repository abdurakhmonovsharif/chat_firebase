import { createSlice } from '@reduxjs/toolkit';
import chatImage from '../../img/chat_image.webp';

// Custom serializer for Date objects
const dateSerializer = (value) => value.toISOString();

// Custom deserializer for Date objects
const dateDeserializer = (value) => new Date(value);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        bg_image: chatImage,
        music: null,
        chat_id: null,
        user: null,
        send_hi: false,
        profile_info: { show: false, user: null },
        mobileProfile_info: { show: false, user: null },
        photo_id: null,
        isEdit: { item: null, messages: null },
    },
    reducers: {
        setChatState: (state, action) => {
            const { bg_image, music, chat_id, user, send_hi, profile_info, photo_id, mobileProfile_info, isEdit } = action.payload;
            state.bg_image = bg_image;
            state.music = music;
            state.chat_id = chat_id;
            state.user = user;
            state.send_hi = send_hi;
            state.profile_info = profile_info;
            state.photo_id = photo_id;
            state.mobileProfile_info = mobileProfile_info;
            state.isEdit = isEdit;
        },
        clearChatState: (state) => {
            return {
                ...state,
                bg_image: chatImage,
                music: null,
                chat_id: null,
                user: null,
                send_hi: false,
                profile_info: { show: false, user: null },
                mobileProfile_info: { show: false, user: null },
                photo_id: null,
                isEdit: { item: null, messages: null },
            };
        },
    },
    serialize: {
        date: dateSerializer,
    },
    deserialize: {
        date: dateDeserializer,
    },
});

export const { setChatState, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
