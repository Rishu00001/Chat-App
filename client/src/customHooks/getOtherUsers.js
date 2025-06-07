import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData, setLoading, setOtherUsers } from "../redux/userSlice";
import { serverURL } from "../main";

function useSetOtherUsers() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(res?.data));
      } catch (error) {
        console.log("User not logged in or error fetching user");
        dispatch(setOtherUsers(null));
      } 
    };

    fetchUser();
  }, [dispatch]);
}

export default useSetOtherUsers;
