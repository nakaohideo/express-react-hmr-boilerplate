import React, { PropTypes, Component } from 'react';
import Form from 'react-bootstrap/lib/Form';
import BsFormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Recaptcha from 'react-google-recaptcha';
import configs from '../../../../configs/project/client';

class BsForm extends Component {
  getChildContext() {
    let {
      labelDimensions,
      fieldDimensions,
      horizontal,
    } = this.props;

    return {
      labelDimensions,
      fieldDimensions,
      horizontal,
    };
  }

  render() {
    let {
      /* eslint-disable */
      // consume props owned by BsForm
      labelDimensions, fieldDimensions,
      /* eslint-enable */
      children,
      ...rest
    } = this.props;

    return (
      <Form {...rest}>
        {children}
      </Form>
    );
  }
};

BsForm.defaultProps = {
  labelDimensions: {
    sm: 2,
  },
  fieldDimensions: {
    sm: 10,
  },
};

BsForm.propTypes = {
  labelDimensions: PropTypes.object,
  fieldDimensions: PropTypes.object,
  horizontal: PropTypes.bool,
};

BsForm.childContextTypes = {
  labelDimensions: PropTypes.object,
  fieldDimensions: PropTypes.object,
  horizontal: PropTypes.bool,
};

let BsFormField = ({
  label, input, type, meta, options, text, ...rest
}, {
  labelDimensions, fieldDimensions, horizontal,
}) => {
  let isShowError = meta && meta.touched && meta.error;

  let formControl = null;
  if (type === 'recaptcha') {
    // ref:
    //   - <https://github.com/erikras/redux-form/issues/1880>
    /* eslint-disable */
    formControl = configs.recaptcha ? (
      <Recaptcha
        sitekey={configs.recaptcha[process.env.NODE_ENV].siteKey}
        onChange={input.onChange}
      />
    ) : (
      <pre>Recaptcha is disabled</pre>
    );
    /* eslint-enable */
  } else if (type === 'radiobutton') {
    // ref: <https://github.com/erikras/redux-form/issues/1857#issuecomment-249890206>
    formControl = (
      options.map((option) => (
        <div className="radio" key={option.value}>
          <label>
            <input
              type="radio"
              {...input}
              value={option.value}
              checked={option.value === input.value}
              disabled={option.disabled}
            />
            {option.label}
          </label>
        </div>
      ))
    );
  } else if (type === 'plaintext') {
    formControl = (
      <p>
        {text}
      </p>
    );
  } else if (type === 'textarea') {
    formControl = (
      <textarea
        className="form-control"
        {...input}
        {...rest}
      />
    );
  } else {
    formControl = (
      <input
        className="form-control"
        {...input}
        type={type}
        {...rest}
      />
    );
  }

  return horizontal ? (
    <BsFormGroup validationState={isShowError ? 'error' : undefined}>
      {label && (
        <Col componentClass={ControlLabel} {...labelDimensions}>
          {label}
        </Col>
      )}
      <Col {...fieldDimensions}>
        {formControl}
        {isShowError && (
          <HelpBlock>{meta.error}</HelpBlock>
        )}
      </Col>
    </BsFormGroup>
  ) : (
    <BsFormGroup validationState={isShowError ? 'error' : undefined}>
      <ControlLabel>{label}</ControlLabel>
      {formControl}
      {isShowError && (
        <HelpBlock>{meta.error}</HelpBlock>
      )}
    </BsFormGroup>
  );
};

BsFormField.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
};

BsFormField.contextTypes = {
  labelDimensions: PropTypes.object,
  fieldDimensions: PropTypes.object,
  horizontal: PropTypes.bool,
};

let BsFormFooter = ({
  children,
}, {
  labelDimensions, fieldDimensions, horizontal,
}) => {
  return horizontal ? (
    <BsFormGroup>
      <Col componentClass={ControlLabel} {...labelDimensions} />
      <Col {...fieldDimensions}>
        {children}
      </Col>
    </BsFormGroup>
  ) : (
    <BsFormGroup>
      {children}
    </BsFormGroup>
  );
};

BsFormFooter.contextTypes = {
  labelDimensions: PropTypes.object,
  fieldDimensions: PropTypes.object,
  horizontal: PropTypes.bool,
};

export {
  BsForm as Form,
  BsFormField as FormField,
  BsFormFooter as FormFooter,
  BsFormGroup as FormGroup,
};
