import React from "react"
import {feature_dict} from "./variableDict";

let options = ["2019 School Data","Predict Student Performance"]

function SelectMode(props){

    const renderOptions = (option) => {
        return (
          <label key={option} className="toggle-container pt12 pb24">
            <input onChange={props.handleViewChange} checked={props.checkedValue===option} key={option} value={option} name="toggle" type="radio" />
            <div className="toggle toggle--s ">{option}</div>
          </label>
        );
      }
  
    return(
        <div className='flex-parent flex-parent--center-main'>
            <div className='toggle-group'>
                {options.map(renderOptions)}
            </div>
        </div>
    )

}

function UserInput(props){

    let optionItems = props.features.map((feature) => <option key={feature} value={feature}>{feature_dict[feature]}</option>);

    let predict_options = props.prediction_features.map((feature) => {
        return (


                <div className='flex-parent'>
                    <div className='flex-child flex-child--no-shrink w300'>
                        <div className='flex-parent flex-parent--space-between-main'>
                        <div className='flex-child'><button className='btn btn--stroke btn--s' name = "minus" key={feature} value={feature} onClick={props.ChangePredictor}>-</button> </div>
                        
                            <span className="txt-s">{feature_dict[feature]} </span>
                        
                        <div className='flex-child'><button name = "plus" className='btn btn--stroke btn--s' key={feature} value={feature} onClick={props.ChangePredictor}>+</button></div>
                        </div>
                    </div>
                    <div className='flex-child flex-child--grow pl24 txt-bold color-green-light'>
 
                    {(props.FeatureChange[feature]<0?"-":"+")} {Math.abs(props.FeatureChange[feature])}

                    </div>
                </div>
                
                )
    });

    if(props.SelectedMode==="2019 School Data" ||props.SelectedMode==="2019 District Data"  ){
        return(
     
            <div className="inline-block">
                 <p className="txt-s txt-em">Select a variable to change the data displayed on the map.</p>
               
                <div className="select-container">
                    <select onChange={props.handleFeatureChange} value={props.featureValue} className="select mb24 mt12 txt-m">
                        {optionItems}
                    </select>
                    <div className="select-arrow"></div>
                </div>

                <div className='round shadow-darken10 px12 py12 txt-s'>
                    <div className='grid mb6'>
                        <div className='col h12' style={{backgroundColor: "#000004"}}></div>
                        <div className='col h12' style={{backgroundColor: "#280b53"}}></div>
                        <div className='col h12' style={{backgroundColor: "#65156e"}}></div>
                        <div className='col h12' style={{backgroundColor: "#9f2a63"}}></div>
                        <div className='col h12' style={{backgroundColor: "#d44842"}}></div>
                        <div className='col h12' style={{backgroundColor: "#f57d15"}}></div>
                        <div className='col h12' style={{backgroundColor: "#fac228"}}></div>
                        <div className='col h12' style={{backgroundColor: "#fcffa4"}}></div>
                    </div>
                    <div className='grid txt-xs'>
                        <div className='col flex-child--grow'>Low</div>
                        <div className='col flex-child--grow align-r'>High</div>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div>
                <p className="txt-m txt-em"> Manipulate a variable to to see how it impacts Student Performance.</p>

                {predict_options}
            </div>
      
        )
    }

    
}

function Modal({ handleClose, show, children }){

    const showHideClassName = show ? "block" : "none";

    return(
        <div class='flex-parent flex-parent--center-main pt36 z5'>
                <div class={`shadow-darken50 flex-child bg-white round relative w600 z5 ${showHideClassName}`}>
                <button class='absolute top right px12 py12 z5' onClick={handleClose}>
                    X
                </button>
                <div class='px24 py24 z5'>
                    <div class='txt-h2 mb12 z5'>Texas Education Agency Student Performance Prediction</div>
                    <div class='txt-m z5'>
                    I am some modal body content.
                    </div>
                </div>
                </div>
            </div>
    )

}


function SideBar(props) {
    return (

        <>
            <div>
                
                <Modal show={props.status} handleClose={props.handleClose}></Modal>
                <div className='sidebarStyle prose px12 py12'>

                    <button onClick={props.handleOpen} className='btn btn--s bg-green-faint color-green'>About This Project</button>

                    <h3>Texas Education Data Map</h3>
                    <p className="txt-h5">Visualizing and Predicting student performance using historical achievement data from Texas Education Agency</p>


                    <SelectMode checkedValue={props.view} handleViewChange={props.onViewChange}/>
                    {/* <SelectFeature featureValue={props.feature} handleFeatureChange={props.onFeatureChange}/> */}

                    <UserInput 
                        SelectedMode = {props.view} 
                        featureValue={props.feature} 
                        handleFeatureChange={props.onFeatureChange}
                        features = {props.features}
                        prediction_features = {props.prediction_features}
                        ChangePredictor = {props.onChangePredictor}
                        FeatureChange = {props.FeatureChange}

                    />


            
                </div>

            </div>

            </>
     


    )
}

export default SideBar




