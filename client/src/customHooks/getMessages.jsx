import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData, setLoading, setOtherUsers } from "../redux/userSlice";
import { serverURL } from "../main";
import { setMessages } from "../redux/messageSlice";

function getMessages() {
  const dispatch = useDispatch();
  let {userData, selectedUser} = useSelector((state) => state.user);
  if(!selectedUser) return;
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${serverURL}/api/message/get/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        console.log(res);
        dispatch(setMessages(res?.data));
      } catch (error) {
        dispatch(setMessages([]));
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedUser,dispatch]);
}

export default getMessages;
