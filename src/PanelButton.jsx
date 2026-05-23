

export const PanelButton = ({isActive, activeColor, onClick, children}) => {

    return (

        <button
        onClick={onClick}
        style = {{
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            transition: 'all 0.2s',
            color: 'white',
            textAlign: 'left', 
            marginTop: '12px',
            backgroundColor: isActive ? activeColor : 'transparent', 
            borderColor: isActive ? activeColor : '#334155',
        }}
        >

            {children}

        </button>

    );

}