import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};
const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setClients: (state, action) => {
            state.items = action.payload;
        },
        updateStatus: (state, action) => {
            state.items = state.items.map(item =>{
                if(item._id === action.payload.id){
                    item.isActive = action.payload.status === 'block' ? false : true;
                }
                return item;
            })
        }
    }
});

const { actions, reducer } = clientSlice;
export const { setClients, updateStatus } = actions;
export default reducer;