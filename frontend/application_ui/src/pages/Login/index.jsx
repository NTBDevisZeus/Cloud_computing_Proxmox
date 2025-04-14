import './styles.css'
import { useContext, useState } from 'react';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import {callLogin, fetchUserInfo} from '../../apis/callers'
import UserContext from '../../context/user';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isRemember, setIsRemember] = useState(false)
    const {setUser} = useContext(UserContext)
    const location = useLocation()
    const navigator = useNavigate()
    const {from} = location['state'] ||  {from: '/'}
    const onLogin = async () => {
      const payload = {
        username: username,
        password: password
      }
      const result = await callLogin(payload)
      if (result['data']) {
        const accessToken = result['data']['access_token']
        if (isRemember) {
          localStorage.setItem("accessToken", accessToken)
        }
        const userInfo = await fetchUserInfo()
        if (userInfo) {
          setUser(userInfo)
          navigator(from)
        }
      }
      else {
        console.log(result['message'])
      }
    }
    return (
        <MDBContainer  className="p-3 my-5 h-custom mt-5 ">

        <MDBRow>
  
          <MDBCol col='10' md='6'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
          </MDBCol>
  
          <MDBCol col='4' md='6'>
  
            <div className="d-flex flex-row align-items-center justify-content-center">
  
              <p className="lead fw-normal mb-0 me-3">Đăng nhập với</p>
  
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='facebook-f' />
              </MDBBtn>
  
              <MDBBtn floating size='md' tag='a'  className='me-2'>
                <MDBIcon fab icon='google' />
              </MDBBtn>
  
              <MDBBtn floating size='md' tag='a'  className='me-2'>
                <MDBIcon fab icon='github' />
              </MDBBtn>
  
            </div>
  
            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">Sử dụng tài khoản</p>
            </div>
  
            <MDBInput wrapperClass='mb-4' value={username} name='username' onChange={(e) => setUsername(e.target.value)} label='Tên tài khoản' id='username' type='text' size="lg"/>
            <MDBInput wrapperClass='mb-4' value={password} name='password' onChange={(e) => setPassword(e.target.value)} label='Mật khẩu' id='password' type='password' size="lg"/>
  
            <div className="d-flex justify-content-between mb-4">
              <MDBCheckbox checked={isRemember} onChange={e => setIsRemember(e.target.checked)} name='flexCheck' value='' id='flexCheckDefault' label='Giữ đăng nhập' />
              <a href="!#">Quên mật khẩu?</a>
            </div>
  
            <div className='text-center text-md-start mt-4 pt-2'>
              <MDBBtn onClick={onLogin} className="mb-0 px-5" size='lg'>Đăng Nhập</MDBBtn>
              <p className="small fw-bold mt-2 pt-1 mb-2">Bạn chưa có tài khoản? <Link to='/register' className="link-danger">Đăng ký</Link></p>
            </div>
  
          </MDBCol>
  
        </MDBRow>
      </MDBContainer>
    );
}

export default Login