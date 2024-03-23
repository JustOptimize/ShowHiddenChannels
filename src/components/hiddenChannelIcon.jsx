const React = require('react');
const PropTypes = require('prop-types');

export default function MyComponent({ disabled = false }) {
    const [isDisabled] = BdApi.React.useState(disabled);
    return (
        <button className="my-component" disabled={isDisabled}>
            Hello World!
        </button>
    );
}

MyComponent.propTypes = {
    disabled: PropTypes.bool,
};
