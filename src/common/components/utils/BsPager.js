import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Text from '../widgets/Text';

let style = {
  cursor: 'pointer',
  margin: 2,
};

let handlePagerButtonClick = (props) => {
  let { disabled, onClick } = props;

  if (disabled) {
    return undefined;
  } else {
    return onClick;
  }
};

let PagerButton = (props) => {
  /* eslint-disable */
  // consume prop `onClick`
  let { disabled, onClick, children, ...rest } = props;
  /* eslint-enable */

  return (
    <li
      className={cx({ 'disabled': disabled })}
      style={style}
      {...rest}
    >
      <a onClick={handlePagerButtonClick(props)}>
        {children}
      </a>
    </li>
  );
};

class Pager extends Component {
  _handlePageChange(pageId) {
    let { onPageChange } = this.props;

    if (onPageChange) {
      onPageChange(pageId);
    }
  }

  render() {
    let { simple, page } = this.props;
    let pageStatus = {
      isFirst: page.current === page.first,
      isLast: page.current === page.last,
    };

    return (
      <nav>
        <ul className="pager">
          {!simple && (
            <PagerButton
              disabled={pageStatus.isFirst}
              onClick={this._handlePageChange.bind(this, page.first)}
            >
              <i className="fa fa-angle-double-left" aria-hidden="true" />
              {' '}<Text id="page.first" />
            </PagerButton>
          )}

          <PagerButton
            disabled={pageStatus.isFirst}
            onClick={this._handlePageChange.bind(this, page.current - 1)}
          >
            <i className="fa fa-chevron-left" aria-hidden="true" />
            {' '}<Text id="page.prev" />
          </PagerButton>

          <PagerButton
            disabled={pageStatus.isLast}
            onClick={this._handlePageChange.bind(this, page.current + 1)}
          >
            <Text id="page.next" />{' '}
            <i className="fa fa-chevron-right" aria-hidden="true" />
          </PagerButton>

          {!simple && (
            <PagerButton
              disabled={pageStatus.isLast}
              onClick={this._handlePageChange.bind(this, page.last)}
            >
              <Text id="page.last" />{' '}
              <i className="fa fa-angle-double-right" aria-hidden="true" />
            </PagerButton>
          )}
        </ul>
      </nav>
    );
  }
}

Pager.propTypes = {
  simple: PropTypes.bool,
  page: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func,
};

export default connect()(Pager);
