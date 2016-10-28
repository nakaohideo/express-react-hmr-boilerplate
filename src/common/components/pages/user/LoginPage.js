import React from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Alert from 'react-bootstrap/lib/Alert';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageLayout from '../../layouts/PageLayout';
import Head from '../../widgets/Head';
import LoginForm from '../../forms/user/LoginForm';

let LoginPage = ({ location }) => {
  let { next } = location.query;
  let search = next ? '?next=' + next : '';

  return (
    <PageLayout hasGrid={false}>
      <Head
        links={[
          'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-social/5.0.0/bootstrap-social.min.css',
        ]}
      />
      <Grid>
        <PageHeader>Login</PageHeader>
        <Row>
          <Col md={12}>
            {next && (
              <Alert bsStyle="warning">
                <strong>Authentication Required</strong>
                {' '}Please login first.
              </Alert>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            <LoginForm />
          </Col>
          <Col md={3}>
            <a
              href={`/auth/facebook${search}`}
              className="btn btn-block btn-social btn-facebook"
            >
              <span className="fa fa-facebook"></span>Login with Facebook
            </a>
            <a
              href={`/auth/linkedin${search}`}
              className="btn btn-block btn-social btn-linkedin"
            >
              <span className="fa fa-linkedin"></span>Login with LinkedIn
            </a>
          </Col>
        </Row>
      </Grid>
    </PageLayout>
  );
};

export default LoginPage;
