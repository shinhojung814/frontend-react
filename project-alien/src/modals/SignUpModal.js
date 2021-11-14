import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styles from "./SignUpModal.module.css";
import HorizonLine from "../components/HorizonLine.js";
import * as api from "../apis/index.js";

const SignUpModal = ({ show, onHide, setSignUpModalOn, setLoginStatus }) => {
  // const [showSignUp, setShowSignUp] = useState(true);
  const [userNickname, setUserNickname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirm, setUserConfirm] = useState("");

  const [signUpClicked, setSignUpClicked] = useState(false);
  const [signUpError, setSignUpError] = useState(null);
  const [signUpMessage, setSignUpMessage] = useState(null);

  function validateEmail(userEmail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test({ userEmail })) {
      return true;
    } else {
      setSignUpMessage("입력하신 이메일 주소가 유효하지 않습니다.");
      return false;
    }
  }

  const postSignUp = async () => {
    let signUpData = { userNickname, userEmail, userPassword, userConfirm };
    const response = await api.post("/login_process", signUpData);
    console.log("response", response);
    // const data = await response.json();
    // console.log("data", data);
  };

  console.log(signUpClicked);

  useEffect(() => {
    try {
      setSignUpMessage(null);
      setSignUpError(null);
      postSignUp();
    } catch (err) {
      setSignUpError(err);
      console.log("SIGN-UP ERROR", signUpError);
    }
  }, [signUpClicked]);

  // 회원가입 버튼을 처음 눌렀을 때만 포스트 요청이 보내지도록 설정 (useEffect, signUpClicked 이용)
  // 회원가입이 성공적으로 이루어지면 signUpSuccess() 그렇지 않으면 signUpFailure() 실행

  function signUpSuccess() {
    return () => {
      // signUpClicked가 초기화되도록 설정 (성공했을 때도 초기화되어야 하는지?)
      setSignUpClicked((current) => !current);
      // 회원가입 성공 메세지 띄우기
      setSignUpModalOn(false);
    };
  }

  function signUpFailure() {
    return () => {
      // 회원가입에 실패하면 signUpClicked 초기화
      setSignUpClicked((current) => !current);

      // 회원가입 실패 에러 메세지 띄우기
      // 입력한 닉네임이 이미 존재하는 경우 "이미 존재하는 닉네임입니다."
      // 이미 존재하는 이메일인 경우 "이미 존재하는 이메일입니다."
      // 입력한 패스워드와 패스워드 확인이 다른 경우 "입력하신 패스워드가 일치하지 않습니다."
    };
  }

  const onClick = (event) => {
    event.preventDefault();
    setSignUpClicked(true);
  };

  // function showSignUpMessage() {
  //   return () => {
  //     {
  //       signUp성공/실패 여부
  //         ? null
  //         : {signUpMessage}
  //     }
  //   };
  // }

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">회원가입</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="이재열"
                onChange={(e) => {
                  setUserNickname(e.target.value);
                }}
              />
              <br />
            </Form.Group>

            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                placeholder="helloalien@jungle.com"
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
              />
              <br />
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
              <br />
            </Form.Group>

            <Form.Group>
              <Form.Label>패스워드 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                onChange={(e) => {
                  setUserConfirm(e.target.value);
                }}
              />
              <br />
            </Form.Group>

            <Form.Group className={styles.form__signup__message}>
              {signUpMessage}
              <br />
            </Form.Group>

            <Button
              className="my-3"
              type="button"
              variant="success"
              style={{
                width: "100%",
              }}
              onClick={onClick}
            >
              회원가입
            </Button>
          </Form>
        </Modal.Body>
      </Container>
    </Modal>
  );
};

export default SignUpModal;
