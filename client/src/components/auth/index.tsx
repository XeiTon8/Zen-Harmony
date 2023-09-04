import React, { FormEvent } from 'react'
import { useNavigate, useLocation} from 'react-router-dom';
import { MySQLService } from '../../services/MySQLService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {auth} from '../../firebase.config'

import { useAppDispatch } from '../../redux/hooks';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUser } from '../../redux/users/selectors';
import { setIsLoggedIn, setUserData} from '../../redux/users/slice';
import { IUser, userRoles } from '../../redux/users/types';

import './auth.scss'

export const Auth = () => {
    const dispatch = useAppDispatch();
    const currentUser = useSelector(selectUser);
    const service = new MySQLService();
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPass, setConfirmPass] = React.useState("");

    const [isPassValid, setIsPassValid] = React.useState<boolean | null | undefined>(null)
    const [isConfirmPassValid, setIsConfirmPassValid] = React.useState<boolean | null>(null)
    const [isEmailValid, setIsEmailValidd] = React.useState<boolean | null>(null)

    const [isInputTouched, setIsInputTouched] = React.useState<{emailInput?: boolean, passInput?: boolean, confirmPassInput?: boolean}>({
        emailInput: false,
        passInput: false,
        confirmPassInput: false
    });
    
    const [userName, setUserName] = React.useState("");
    const [isSignUp, setIsSignUp] = React.useState(true);
    const [isSignUpConfirmAllowed, setIsSignUpConfirmAllowed] = React.useState(false);
    const [firebaseError, setFirebaseError] = React.useState("");

    React.useEffect(() => {
        isPassValid && isConfirmPassValid && isEmailValid ? setIsSignUpConfirmAllowed(true) : setIsSignUpConfirmAllowed(false);    
        }, [isPassValid, isConfirmPassValid, isEmailValid])

    const signUp = async (email: string, password: string) => {
        try {
            if (userName.length <= 0) {
                alert("Username is required.")
                return;
            } else if (location.pathname.includes('/employee') && currentUser.userName.length >= 0) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userID = user.uid;
                const userToSet: IUser = {
                    userID: userID,
                    userEmail: email,
                    userName: userName,
                    userRole: userRoles.EMPLOYEE,
                }
                console.log(userToSet);
                await service.finishEmployeeAccount(userToSet);
                navigate('/');
            } else {
                if (currentUser.userName.length >= 0) {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    const userID = user.uid;
                    const userToSet = {
                        ...currentUser,
                        userID: userID,
                        userEmail: email,
                        userName: userName,
                        userRole: userRoles.OWNER,
                    }
                    service.finishEmployeeAccount(userToSet);
                    await service.setUser(userToSet);
                    navigate('/');
                }
            }} catch(e: any) {
            throw new Error(e);
        }}

    const signIn = async (email: string, password: string) => {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                setFirebaseError("");
                dispatch(setIsLoggedIn(true));
                navigate('/');
            } catch(e: any) {
                if (e.code === 'auth/wrong-password') {
                    setFirebaseError("Invalid password. Please try again.")
                } else {
                    setFirebaseError("Unexpected error occured during sign-in. Please try again");
                    throw new Error(e);
                }
            }
        }
    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signUp(email, password);
    }

    const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signIn(email, password);
        setIsLoggedIn(!isLoggedIn);
    }

    const handleEmail = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setEmail(target.value);
        let userEmail = document.getElementById("userEmail");

            if (target.value) {
                const isValidEmail = validateEmail(target.value);
                setIsEmailValidd(isValidEmail);
                setIsInputTouched({
                    emailInput: true
                })
            }

            if (!validateEmail(target.value)) {
                userEmail?.classList.add("invalid");
                userEmail?.classList.remove("valid");
            } else {
                userEmail?.classList.add("valid");
                userEmail?.classList.remove("invalid");
            }
        }

    const handlePass = (e: React.ChangeEvent) => {
        const { value } = e.target as HTMLInputElement;
        let pass = document.getElementById("userPass")

        if (value) {
            const isValidPassword = validatePassword(value);
            setIsPassValid(isValidPassword);
            setIsInputTouched({
                passInput: true
            });
        }

        if (!validatePassword(value)) {
            pass?.classList.add("invalid");
            pass?.classList.remove("valid");
        } else {
            pass?.classList.add("valid");
            pass?.classList.remove("invalid");
        }
        setPassword(value);
    }

    const handleConfirmPass = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        if (target.value) {
            setIsInputTouched({confirmPassInput: true})
            const isPassConfirmed =  validateConfirmPassword();
            setIsConfirmPassValid(isPassConfirmed);
        }
        setConfirmPass(target.value);
        }

    const handleUserName = (e: React.ChangeEvent) => {
            const target = e.target as HTMLInputElement;
            setUserName(target.value);
        }

    const changeMode = () => {
        setIsSignUp(!isSignUp);
    }

    const validatePassword = (password: string): boolean => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)
        }
        
    const validateConfirmPassword = (): boolean => {
            let confirm = (document.getElementById("confirmUserPass") as HTMLInputElement);
            if (confirm.value === password) {
                confirm.classList.add("valid");
                confirm.classList.remove("invalid");
                return true
            }
            else {
                confirm.classList.add("invalid");
                confirm.classList.remove("valid");
                return false
            }
        }

        const validateEmail = (email: string) => {
            return /\S+@\S+\.\S+/.test(email)
        }


    return (
        <div className="auth__container">
            {!isLoggedIn && (
                isSignUp ? 
                <form className="auth__form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSignUp(e)}>
                    <input type="text" name="" id="userName" placeholder="username" value={userName} onChange={handleUserName} />
                    <input type="text" name="" id="userEmail" placeholder='Email' value={email} onChange={handleEmail} />
                    {isInputTouched.emailInput && !isEmailValid && (
                        <div style={{color: "red"}}>Please enter valid email.</div>
                    )}
                    <input type="password" name="" id="userPass" placeholder='Password' value={password} onChange={handlePass} />
                    { isInputTouched.passInput && !isPassValid && (
                            <div style={{color: "red"}}>Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one digit.</div>
                    )}
                    <input type="password" name="" id="confirmUserPass" placeholder='Confirm password' value={confirmPass} onChange={handleConfirmPass} />
                    {isInputTouched.confirmPassInput && !isConfirmPassValid && (
                        <div style={{color: "red"}}>Passwords do not match.</div>
                    )}
                    <button  className={`button auth__button ${isSignUpConfirmAllowed ? null : "disabled"}`} type="submit"  disabled = {isSignUpConfirmAllowed ? false : true}>Sign up</button>
                    <span onClick={() => changeMode()}>Already have an account? Sign in</span>
                </form> 
                : 
                <form className="auth__form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSignIn(e)}>
                    <input type="text" name="" id="userEmail" placeholder='Email' value={email} onChange={handleEmail} />
                    <input type="password" name="" id="userPass" placeholder='Password' value={password} onChange={handlePass} />
                    <button className= "button auth__button" type="submit">Sign In</button>
                    {firebaseError && <div style={{ color: 'red' }}>{firebaseError}</div>}
                    <span onClick={() => changeMode()}>Don't have an account? Sign up</span>
                </form>
            )}
        </div>
    )
}

