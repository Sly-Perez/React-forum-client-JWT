import './Spinner.css';

const Spinner = ({sizeLevel = 3, marginWillBeAdded = false}) => {

    const sizeLevels = [
        {
            width: '0.938rem'
        },
        {
            width: '1.875rem'
        },
        {
            width: '3.125rem'
        }
    ]
    

    return (
        <div className={`d-flex flex-column align-items-center ${marginWillBeAdded ? "my-20" : ""}`}>
            <div className="spinner" style={sizeLevels[sizeLevel - 1]}></div>
        </div>
    )
}


export default Spinner;