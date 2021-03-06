import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SignUpModal.css";
import api from "../../../apis/index.js";
import * as actions from "../../../Redux/actions";

const SignUpModal = () => {
  const dispatch = useDispatch();
  const showSignUpModal = useSelector(
    (state) => state.modalOnOff.showSignUpModal
  );

  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirm, setUserConfirm] = useState("");
  const [signUpMessage, setSignUpMessage] = useState(null);
  const [signUpClicked, setSignUpClicked] = useState(false);

  const postSignUp = async () => {
    let signUpData = { userEmail, userNickname, userPassword, userConfirm };
    const res = await api.post("/user/register", signUpData);
    // console.log("signup", res.data);
    if (res.data.result === "success") {
      dispatch(
        actions.setPopupModal(
          "USER_REGISTER",
          "회원가입에 성공하였습니다 !",
          "SUCC",
          () => {}
        )
      );
      setUserEmail("");
      setUserNickname("");
      setUserPassword("");
      setUserConfirm("");
      setSignUpMessage(null);
      setSignUpClicked(false);
      // dispatch(actions.checkUser(res.data.user));
      dispatch(actions.showSignUpModal(!showSignUpModal));
    } else {
      setSignUpMessage("이미 존재하는 이메일 주소입니다.");
      setSignUpClicked(false);
    }
  };

  function validateSignUp(userEmail, userNickname, userPassword, userConfirm) {
    var pw = userPassword;
    var num = pw.search(/[0-9]/g);
    var eng = pw.search(/[a-z]/gi);

    if (
      (userEmail !== "") &
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    ) {
      setSignUpMessage("이메일 주소가 유효하지 않습니다.");
      return false;
    }

    if (
      userNickname !== "" &&
      (userNickname.length < 2 || userNickname.length > 16)
    ) {
      setSignUpMessage("닉네임은 2자 이상 16자 이하여야 합니다.");
      return false;
    }

    if (userPassword !== "" && (pw.length < 8 || pw.length > 20)) {
      setSignUpMessage("패스워드는 8자 이상 20자 이하여야 합니다.");
      return false;
    } else if (userPassword !== "" && pw.search(/\s/) !== -1) {
      setSignUpMessage("패스워드는 공백 없이 입력해야 합니다.");
      return false;
    } else if (userPassword !== "" && (num < 0 || eng < 0)) {
      setSignUpMessage("패스워드는 영문과 숫자를 모두 포함해야 합니다.");
      return false;
    }

    if (userPassword !== userConfirm) {
      setSignUpMessage("패스워드가 일치하지 않습니다.");
      return false;
    }

    if (
      userEmail === "" ||
      userNickname === "" ||
      userPassword === "" ||
      userConfirm === ""
    ) {
      setSignUpMessage("입력하지 않은 회원정보가 있습니다.");
      return false;
    }

    setSignUpMessage(null);
    return true;
  }

  const handleCancel = () => {
    setUserEmail("");
    setUserNickname("");
    setUserPassword("");
    setUserConfirm("");
    setSignUpMessage(null);
    setSignUpClicked(false);
    dispatch(actions.showSignUpModal(!showSignUpModal));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signUpClicked) return;
    if (!validateSignUp(userEmail, userNickname, userPassword, userConfirm))
      return;
    setSignUpMessage(null);
    setSignUpClicked(true);
    postSignUp();
  };

  return (
    <div className={showSignUpModal ? "SignUpContainer" : "hidden"}>
      <div className="Overlay" />
      <div className="flex flex-col min-h-0 min-w-max max-h-full m-auto px-10 py-10 pt-12 justify-center bg-white rounded-xl shadow dark:bg-gray-800 z-10">
        <div className="flex justify-center items-center self-end text-gray-400 hover:text-gray-500">
          <svg
            className="fixed w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onClick={handleCancel}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <div className="self-center mb-2 text-2xl font-bold text-gray-800 sm:text-2xl dark:text-white">
          신나는 회원가입
        </div>
        <div className="p-6 mt-2">
          <form action="#">
            <div className="flex flex-col mb-2">
              <div className="flex relative">
                <span className="rounded-l-md inline-flex items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
                  </svg>
                </span>
                <input
                  type="email"
                  className="flex-1 w-full py-2 px-4 rounded-r-lg appearance-none border border-gray-300 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="이메일을 입력해주세요"
                  value={userEmail}
                  autoComplete="nope"
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex relative">
                <span className="rounded-l-md inline-flex items-center px-3 border-t bg-white border-l border-b border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="닉네임을 입력해주세요."
                  autoComplete="nope"
                  value={userNickname}
                  onChange={(e) => {
                    setUserNickname(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex relative">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="********"
                  autoComplete="new-password"
                  value={userPassword}
                  onChange={(e) => {
                    setUserPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="********"
                  autoComplete="new-password"
                  value={userConfirm}
                  onChange={(e) => {
                    setUserConfirm(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="text-red-600 animate-pulse py-2 pb-1">
              {signUpMessage}
            </div>
            <div className="flex w-full mt-4">
              <button
                type="submit"
                className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                onClick={handleSubmit}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
