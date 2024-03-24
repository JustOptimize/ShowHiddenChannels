const React = BdApi.React;

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
