import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData, setLoading } from "../redux/userSlice";
import { serverURL } from "../main";

function useSetCurrentUser() {
  const dispatch = useDispatch();
  let userData  = useSelector((state)=>state.user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(res?.data));
      } catch (error) {
        console.log("User not logged in or error fetching user");
        dispatch(setUserData(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

   fetchUser();
  }, [dispatch]); // ✅ Correct
}

export default useSetCurrentUser;
