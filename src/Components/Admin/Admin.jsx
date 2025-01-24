import { Button, Col, Container, Row } from "react-bootstrap";
import "./Admin.scss";
const Admin = () => {
  return (
    <div className="body">
      <Container className="d-flex align-items-center">
        <Row className="w-100 ">
          <Col md={5} className="section-admin ">
            <Button className="button-admin">Aggiungi Film</Button>
            <Button className="button-admin">Aggiungi Serie TV</Button>
          </Col>
          <Col md={5} className="section-admin">
            <div>2</div>
          </Col>
          <Col md={5} className="section-admin">
            <div>3</div>
          </Col>
          <Col md={5} className="section-admin">
            <div>4</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Admin;
