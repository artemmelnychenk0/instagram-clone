
import { useState } from "react";
import { auth } from "../Data/firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const SignIn = () => {

    const [username, setUsername] = useState('')
    const [userinput, setUserInput] = useState('')

    const navigate = useNavigate()

    const changeHandler = (e) => {
        setUserInput(e.target.value)
    }
    const handleSubmit = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
            .then(() => {
                navigate('/profile')

            })
            .catch((err) => {
                console.log(err)
            })
    }

    const singOutUser = () => {
        signOut(auth)
            .then(() => {
            })
    }


    return (
        <div>
            <h3>Sign Up</h3>
            <input type='text' placeholder="username" onChange={changeHandler}></input>
            <button onClick={handleSubmit}>Sign In With Google</button>
            <p> Already signed up?</p>
            <button onClick={singOutUser}>Sign Out</button>
        </div>
    )
}
export default SignIn
