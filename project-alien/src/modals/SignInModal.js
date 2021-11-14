import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styles from "./SignInModal.module.css";
import HorizonLine from "../components/HorizonLine";
import * as api from "../apis/index.js";

const SignInModal = ({ show, onHide, setSignInModalOn, setLoginStatus }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [signInClicked, setSignInClicked] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const [signInMessage, setSignInMessage] = useState(null);

  function validateEmail(userEmail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test({ userEmail })) {
      return true;
    } else {
      setSignInMessage("입력하신 이메일 주소가 유효하지 않습니다.");
      return false;
    }
  }

  const postSignIn = async () => {
    let signInData = { userEmail, userPassword };
    const response = await api.post("/login_process", signInData);
    console.log("response", response);
    // const data = await response.json();
    // console.log("data", data);
  };

  console.log(signInClicked);

  // 로그인 버튼을 처음 눌렀을 때만 포스트 요청이 보내지도록 설정 (useEffect, signInClicked 이용)
  useEffect(() => {
    try {
      setSignInMessage(null);
      setSignInError(null);
      postSignIn();
      // {서버로부터 받은 로그인 성공/실패 여부(ex. response.success) ? signInSuccess() : signInFailure()}
    } catch (err) {
      setSignInError(err);
      console.log("SIGN-IN ERROR", signInError);
    }
  }, [signInClicked]);

  // 회원정보 DB에서 관리하는 데이터가 signInData와 일치하면 signInSuccess() 그렇지 않으면 signInFailure() 실행
  // ex) {signInResponse == "success" ? signInSuccess() : signInFailure()}

  function signInSuccess() {
    return () => {
      // signInClicked 초기화
      setSignInClicked((current) => !current);
      // 로그인 팝업창 닫기
      setSignInModalOn(false);
      // 로그인 상태 변경
      setLoginStatus(true);
    };
  }

  function signInFailure() {
    return () => {
      // signInClicked 초기화
      setSignInClicked((current) => !current);
      // 로그인 실패 메세지 띄우기
      setSignInMessage("입력하신 이메일과 패스워드가 일치하지 않습니다.");
      // showSignInMessage();
    };
  }

  const onClick = (event) => {
    event.preventDefault();
    // {
    //   validateEmail(userEmail) ? null : showSignInMessage();
    // }
    validateEmail(userEmail);
    setSignInClicked(true);
  };

  // function showSignInMessage() {
  //   return () => {
  //     {
  //       signIn성공/실패 여부
  //         ? null
  //         : {signInMessage}
  //     }
  //   };
  // }

  return (
    <Modal
      className={styles.modal__form}
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container className={styles.container}>
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            onClick={() => setSignInMessage(null)}
          >
            로그인
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className={styles.form__signin}>
            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control
                className={styles.form__input}
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

            <Form.Group className={styles.form__signin__message}>
              {signInMessage}
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
              로그인
            </Button>
          </Form>
        </Modal.Body>
      </Container>
    </Modal>
  );
};

export default SignInModal;
