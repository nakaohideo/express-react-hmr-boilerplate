import React, { Component } from 'react';
import { connect } from 'react-redux';
import reactCookie from 'react-cookie';
import { IntlProvider } from 'react-intl';
import { updateLocale } from '../actions/intlActions';

class LocaleProvider extends Component {
  componentDidMount() {
    let lang = reactCookie.load('locale') || navigator.language;
    this.props
      .dispatch(updateLocale(lang))
      .then(() => {
        console.log('load locale (automatically) ok');
      }, (err) => {
        alert('load locale (automatically) fail');
      });
  }

  render() {
    const { intl, children } = this.props;
    return (
      <IntlProvider locale={intl.locale} messages={intl.messages}>
        {children}
      </IntlProvider>
    );
  }
};

export default connect((state) => state)(LocaleProvider);
