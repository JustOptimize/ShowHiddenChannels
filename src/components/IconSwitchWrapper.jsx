const React = BdApi.React;

// class IconSwitchWrapper extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			enabled: this.props.value,
// 		};
// 	}
// 	render() {
// 		return React.createElement(
// 			'div',
// 			{},
// 			React.createElement(
// 				'div',
// 				{
// 					style: {
// 						display: 'flex',
// 						flexDirection: 'row',
// 						alignItems: 'center',
// 						marginBottom: '16px',
// 						marginTop: '16px',
// 					},
// 				},
// 				React.createElement('img', {
// 					src: this.props.icon,
// 					width: 48,
// 					height: 48,
// 					title: 'Click to toggle',
// 					style: {
// 						borderRadius: '360px',
// 						cursor: 'pointer',
// 						border: this.state.enabled ? '3px solid green' : '3px solid grey',
// 						marginRight: '8px',
// 					},
// 					onClick: () => {
// 						this.props.onChange(!this.state.enabled);
// 						this.setState({
// 							enabled: !this.state.enabled,
// 						});
// 					},
// 				}),
// 				React.createElement(
// 					'div',
// 					{
// 						style: {
// 							maxWidth: '89%',
// 						},
// 					},
// 					React.createElement(
// 						'div',
// 						{
// 							style: {
// 								fontSize: '20px',
// 								color: 'var(--header-primary)',
// 								fontWeight: '600',
// 							},
// 						},
// 						this.props.children
// 					),
// 					React.createElement(
// 						'div',
// 						{
// 							style: {
// 								color: 'var(--header-secondary)',
// 								fontSize: '16px',
// 							},
// 						},
// 						this.props.note
// 					)
// 				)
// 			)
// 		);
// 	}
// }

export default function IconSwitchWrapper({ icon, value, onChange, children, note }) {
    const [enabled, setEnabled] = React.useState(value);
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: '16px',
                    marginTop: '16px',
                }}
            >
                <img
                    src={icon}
                    width={48}
                    height={48}
                    title="Click to toggle"
                    style={{
                        borderRadius: '360px',
                        cursor: 'pointer',
                        border: enabled ? '3px solid green' : '3px solid grey',
                        marginRight: '8px',
                    }}
                    onClick={() => {
                        onChange(!enabled);
                        setEnabled(!enabled);
                    }}
                />
                <div
                    style={{
                        maxWidth: '89%',
                    }}
                >
                    <div
                        style={{
                            fontSize: '20px',
                            color: 'var(--header-primary)',
                            fontWeight: '600',
                        }}
                    >
                        {children}
                    </div>
                    <div
                        style={{
                            color: 'var(--header-secondary)',
                            fontSize: '16px',
                        }}
                    >
                        {note}
                    </div>
                </div>
            </div>
        </div>
    );
}
