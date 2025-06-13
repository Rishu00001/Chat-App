import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers: null,
    selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null,
    loading: true,
    socket: null,
    onlineUsers: null,
    searchData: null,
    typingStatusMap: {},
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateSelectedUserLastSeen: (state, action) => {
      if (
        state.selectedUser &&
        state.selectedUser._id === action.payload.userId
      ) {
        state.selectedUser.lastseen = action.payload.lastseen;
      }
    },
    setTypingStatus: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.typingStatusMap = {
        ...state.typingStatusMap,
        [userId]: isTyping,
      };
    },
  },
});

export const {
  setUserData,
  setLoading,
  setOtherUsers,
  setSelectedUser,
  setSocket,
  setOnlineUsers,
  setSearchData,
  updateSelectedUserLastSeen,
  setTypingStatus,
} = userSlice.actions;

export default userSlice.reducer;
