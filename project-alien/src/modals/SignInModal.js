import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import HorizonLine from "../components/HorizonLine";
import * as api from "../apis/index.js";

const SignInModal = ({ show, onHide, setSignInModalOn, setLoginStatus }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [signInClicked, setSignInClicked] = useState(false);
  const [signInError, setSignInError] = useState(null);

  let signInData = { userEmail, userPassword };
  console.log("signInData", signInData);

  const postSignIn = async () => {
    const response = await api.post("/login_process", signInData);
    console.log("response", response);
    // const data = await response.json();
    // console.log("data", data);
  };

  console.log(signInClicked);

  // 로그인 버튼을 처음 눌렀을 때만 포스트 요청이 보내지도록 설정 (useEffect, signInClicked 이용)
  useEffect(() => {
    try {
      setSignInError(null);
      postSignIn();
    } catch (err) {
      setSignInError(err);
      console.log("SIGN-IN ERROR", signInError);
    }
  }, [signInClicked]);

  // 회원정보 DB에서 관리하는 데이터가 signInData와 일치하면 signInSuccess() 그렇지 않으면 signInFailure() 실행

  function signInSuccess() {
    return () => {
      // signInClicked 초기화되도록 설정 (성공했을 때도 초기화되어야 하는지?)
      setSignInClicked((current) => !current);
      // 로그인 성공 메세지 띄우기

      setSignInModalOn(false);
      setLoginStatus(true);
    };
  }

  function signInFailure() {
    return () => {
      // 로그인에 실패하면 signInClicked 초기화
      setSignInClicked((current) => !current);

      // 로그인 실패 에러 메세지 띄우기: "입력하신 이메일과 패스워드가 일치하지 않습니다."
    };
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                placeholder="helloalien@jungle.com"
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>패스워드</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                onChange={(e) => {
                  setUserPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Button
              className="my-3"
              type="button"
              variant="success"
              style={{
                width: "100%",
              }}
              onClick={() => {
                setSignInClicked(true);
                postSignIn();
              }}
            >
              로그인
            </Button>
          </Form>
        </Modal.Body>
      </Container>
    </Modal>
  );
};

export default SignInModal;
