import React from 'react';
import PageLayout from '../../layouts/PageLayout';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import './styles.scss';
import './styles.css';

const HomePage = (props) => (
  <PageLayout className="rwd-background">
    <PageHeader>Express-React-HMR-Boilerplate</PageHeader>
    <p className="red-border">
      This is the demo site for project{' '}
      <a href="https://github.com/gocreating/express-react-hmr-boilerplate">
        express-react-hmr-boilerplate
      </a>
    </p>
  </PageLayout>
);

export default HomePage;
