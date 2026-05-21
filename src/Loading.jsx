

export const Loading = ({ 
    isVisible, 
    title = "Loading", 
    message = "Please waite" 
}) => {

    if (!isVisible) return null;

    return (

        <div style = {{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(2, 3, 5, 0.85)', 
            backdropFilter: 'blur(8px)',
            zIndex: 99999, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981', 
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                width: '60px',
                height: '60px',
                border: '4px solid #10b981',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite', 
                marginBottom: '20px'
            }}>

            </div>

            <h2 style = {{ margin: '0 0 10px 0', letterSpacing: '2px' }}>{title}</h2>
            <p style = {{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>{message}</p>

        </div>

    );

};