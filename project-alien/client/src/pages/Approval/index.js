import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../apis/index.js";
import * as actions from "../../Redux/actions";
import SantoryuImage from "../../image/santoryu.jpeg";

export default function Approval(props) {
  // TODO: login 상태일 때만 접근할 수 있음
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  const [authRequests, setAuthRequests] = useState([]);

  useEffect(() => {
    const loadAuthRequests = async () => {
      const res = await api.get("/user/approval/list");
      if (!res.data.data.length) {
        console.log("res", res);
        console.log("현재 수락을 기다리는 인증 요청이 없습니다.");
      } else {
        console.log("res", res);
        setAuthRequests(res.data.data);
        return;
      }
    };
    loadAuthRequests();
  }, []);

  console.log("authRequests", authRequests);

  return (
    <div className="authRequests">
      {authRequests.map((authRequest) => (
        <AuthRequest key={authRequest.id} authRequest={authRequest}>
          {" "}
        </AuthRequest>
      ))}
    </div>
  );
}

const AuthRequest = ({ authRequest }) => {
  const authYear = authRequest.request_date.slice(0, 4);
  const authMonth = authRequest.request_date.slice(5, 7);
  const authDate = authRequest.request_date.slice(8, 10);
  const authHour = authRequest.request_date.slice(11, 13);
  const authMinute = authRequest.request_date.slice(14, 16);

  const postApproval = async () => {
    const req = await api.post("/challenge/approve", {
      auth_id: authRequest.authentification_id,
      Alien_id: authRequest.alien_id,
    });
    console.log("req", req);
  };

  const handleSubmit = () => {
    postApproval();
  };

  return (
    <div className="min-h-0 p-12  bg-gray-100 flex items-center justify-center">
      <div className="w-1/3 bg-white rounded-lg py-2 shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105 cursor-pointer">
        <div className="flex items-center mb-2 space-x-4">
          <img
            className="w-10 rounded-full ml-2"
            src={SantoryuImage}
            alt="산토류"
          />
          <div>
            <h1 className="mb-1 text-xl font-bold text-gray-700">
              {authRequest.request_user_nickname} 쿤
            </h1>
            <p className="text-sm font-normal text-gray-600 mr-14 hover:underline">
              {authYear}년 {authMonth}월 {authDate}일 {authHour}시 {authMinute}
              분에 인증
            </p>
          </div>
          <span>
            <svg
              className="h-6 w-6 hover:text-blue-400 transition duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </span>
        </div>
        <img src={authRequest.image_url} alt="authImage" />
        <div className="flex justify-between px-10 py-6">
          <span>
            <svg
              className="h-6 w-6 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={handleSubmit}
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </span>
          <span>
            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <div>
          <img src="" alt="" />
          <div className="px-8 py-2">
            <input
              className="text-md font-thin px-44 py-2 mb-3 bg-gray-50 outline-none rounded-full border-1"
              type="text"
              placeholder="코멘트 추가"
              // onClick={handleComment}
            />
            <span className="text-md  text-gray-500 bg-gray-50 rounded-full px-4 py-3 transition duration-100 hover:text-blue-400 cursor-pointer">
              전송
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
