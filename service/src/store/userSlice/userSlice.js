import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    phoneNumber: '',
    accessToken: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName(state, action) {
            state.name = action.payload;
        },
        setEmail(state, action) {
            state.email = action.payload;
        },
        setPhoneNumber(state, action) {
            state.phoneNumber = action.payload;
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload;
        }
    }
});

export const { setName, setEmail, setPhoneNumber, setAccessToken } = userSlice.actions;
export default userSlice.reducer;