import React from 'react';
import Head from '../widgets/Head';
import Navigation from '../utils/Navigation';
import ErrorList from '../utils/ErrorList';

const AppLayout = ({ children }) => (
  <div>
    <Head
      title="Express-React-HMR-Boilerplate"
      metas={[
        {charset: 'utf-8'},
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
      ]}
      links={[
        // jscs:disable
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
        'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',
        '/css/main.css',
        // jscs:enable
      ]}
      scripts={[
        // jscs:disable
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js',
        // jscs:enable
      ]}
    />
    <Navigation />
    <ErrorList />
    {children}
  </div>
);

export default AppLayout;
