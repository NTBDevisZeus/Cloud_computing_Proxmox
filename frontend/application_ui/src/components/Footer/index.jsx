import { MDBContainer, MDBBtn, MDBIcon } from "mdb-react-ui-kit"
import "./styles.css"
const Footer = () => {
    return (<MDBContainer className="p-3 my-5 h-custom mt-5 ">
              <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
  
  <div className="text-white mb-3 mb-md-0">
    Copyright © 2025. Bản quyền thuộc Cloud Commputing.
  </div>

  <div>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
      <MDBIcon fab icon='facebook-f' size="md"/>
    </MDBBtn>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
      <MDBIcon fab icon='twitter' size="md"/>
    </MDBBtn>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
      <MDBIcon fab icon='google' size="md"/>
    </MDBBtn>

    <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
      <MDBIcon fab icon='linkedin-in' size="md"/>
    </MDBBtn>

  </div>

</div>
    </MDBContainer>)
}
export default Footer