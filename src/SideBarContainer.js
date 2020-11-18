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
                    <div className='flex-child flex-child--grow pl6 txt-bold txt-s color-green-light'>
 
                    {(props.FeatureChange[feature]<0?"-":"+")} {Math.abs(props.FeatureChange[feature])}

                    </div>
                </div>
                
                )
    });

    if(props.SelectedMode==="2019 School Data" ||props.SelectedMode==="2019 District Data"  ){
        return(
     
            <div className="inline-block">
                 <p className="txt-s txt-bold">Select a variable to change the data displayed on the map.</p>
               
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
                <p className="txt-s txt-bold"> Manipulate a <span className="txt-kbd">variable</span> to to see how it impacts Student Performance.</p>

                {predict_options}

                <div className='round shadow-darken10 px12 py12 mt24 txt-s'>
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
                    <div class='txt-h3 mb12 z5'>About This Project</div>
                    <div class='txt-s z5'>

                    <p>
                    In August 2020 a non-profit organization, Teaching Trust, released detailed educational achievement data from the 
                    Texas Education Agency (TEA) with the hope of encouraging academics, researchers and data scientists to analyze the 
                    data in a meaningful way. The data release consists of annual STAAR (State of Texas Assessment of Academic Readiness) 
                    and TAPR (Texas Academic Performance Reports) data including assessment results, demographic breakdowns, information 
                    on school and district staff and programs. The data is unique as it allows for longitudinal analysis of student and school 
                    performance data between 2012 and 2019 covering about 10% of the total student population in the United States. Student achievement
                    plays an important role in assessing the performance of school districts and is a main driver of educational funding and policy decisions.
                    </p>
                    <br/>
                    <p>
                    There has been much research on how student demographics, socioeconomic status and student teacher ratio impact overall school 
                    performance. However, the impacts of teacher and faculty details have been limited. The project team created a <span className="txt-bold">linear regression model</span> on detailed staffing and student 
                    information, using a combination of variables to predict student performance.
                    </p>

                    <br/>

                    <p className="txt-xs">Andrew Oglesby, Saadiq Mohiuddin, Andrew Flint, Greer Homer, Arunkumar Raja, Youssouf Ouedraogo </p>




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

                    <h3>Visualizing the Impact of School Staffing Decisions on Student Achievement in Texas</h3>
                    <p className="txt-xs">Each circle on the map represents one school.</p>
                    {/* <p className="txt-h5">Visualizing and Predicting student performance using historical achievement data from Texas Education Agency</p> */}


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




