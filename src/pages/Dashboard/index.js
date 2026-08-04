import PropTypes from 'prop-types'
import MetaTags from 'react-meta-tags';
import React, { useEffect } from "react"
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Button,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Spinner
} from "reactstrap"


// Redux
import { connect } from "react-redux"
// import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

import {  } from "../../store/actions"

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// toast.configure()
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const Dashboard = props => {
  
  const init = async () => {
  }


  useEffect(() => {
    init()
  }, [])

  
  useEffect(() => {
    if(props.error) {
      toast.error(props.error.message)
      props.updateError()
    }
    
  }, [props.error])


  
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="BrainGroom" breadcrumbItem="Dashboard" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Dashboard</CardTitle>
                    <div>
                      
                      Welcome
                      
                    </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
  
}

Dashboard.propTypes = {
  editProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any
}

const mapStatetoProps = state => {
  console.log(state)
  console.log(state.dashboard)
  const { error, choiceCount } = state.dashboard
  return { error, choiceCount }
}

const mapDispatchToProps = dispatch => ({
  
})


export default 
  connect(mapStatetoProps, mapDispatchToProps)(Dashboard)

