import { useDispatch } from "react-redux";
import { app } from "../firebase";
import Button from "./Button";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { userAction } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOAuth = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const authData = {username: result.user.displayName, email: result.user.email, photo: result.user.photoURL};
            const response = await fetch("/jd/auth/OAuth", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json" 
                },
                body: JSON.stringify(authData)
            });
            const data = await response.json();
            dispatch(userAction.login(data));
            navigate("/");
        } catch (error) {
            console.log("Unable to authenticate using Google", error);
        }
    }

    return (
        <Button type="button" onClick={handleOAuth} secondaryColor={true}>Authenticate with Google</Button>
    )
}