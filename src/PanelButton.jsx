

export const PanelButton = ({isActive, activeColor, onClick, children}) => {

    return (

        <button
        onClick={onClick}
        style = {{
            width: '75%',
            padding: '7px 5px', 
            
            display: 'flex', 
            borderRadius: '50px', 
            border: '1px solid', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            transition: 'all 0.2s',
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            
            marginTop: '16px',
            fontSize: '16px', 
            backgroundColor: isActive ? activeColor : 'transparent', 
            borderColor: isActive ? activeColor : '#334155',
        }}
        >

            {children}

        </button>

    );

}