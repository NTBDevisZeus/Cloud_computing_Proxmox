import './styles.css'
import { useContext, useState } from 'react'
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { callRegistUser, fetchUserInfo } from '../../apis/callers';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRePassword] = useState('')
    const navigator = useNavigate()
    const onRegist = async () => {
        const payload = {
            username: username,
            password: password
        }
        const result = await callRegistUser(payload)
        if (result['data']) {
            navigator('/login')
        }
        else {
            console.log(result['message'])
        }
    }
    return (  <MDBContainer  className="p-3 my-5 h-custom mt-5 ">

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
              <p className="text-center fw-bold mx-3 mb-0">Đăng ký</p>
            </div>
    
            <MDBInput wrapperClass='mb-4' value={username} name='username' onChange={(e) => setUsername(e.target.value)} label='Tên tài khoản' id='username' type='text' size="lg"/>
            <MDBInput wrapperClass='mb-4' value={password} name='password' onChange={(e) => setPassword(e.target.value)} label='Mật khẩu' id='password' type='password' size="lg"/>
            <MDBInput wrapperClass='mb-4' value={repassword} name='repassword' onChange={(e) => setRePassword(e.target.value)} label='Nhập lại mật' id='repassword' type='password' size="lg"/>
            <div className='text-center text-md-start mt-4 pt-2'>
              <MDBBtn onClick={onRegist} className="mb-0 px-5" size='lg'>Đăng Ký</MDBBtn>
            </div>
          </MDBCol>
    
        </MDBRow>
      </MDBContainer>)       

}
export default Register