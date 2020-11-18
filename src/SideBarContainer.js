import React from "react"

let options = ["2019 School Data","Predict Student Performance"]

let feature_dict = {
    "teacher_total_full_time_equiv":"Full Time Teachers (Count)", 
      "school_admin_total_full_time_equiv":"Full Time Admin Staff (Count)",
      "teacher_total_base_salary":"Teacher Average Base Salary ($)",
      "teacher_1_5_years_full_time_equiv":"Teacher 1-5 Years Experience (Count)",
      "teacher_6_10_years_full_time_equiv":"Teacher 6-10 Years Experience (Count)",
      "teacher_11_20_years_full_time_equiv":"Teacher 11-20 Years Experience (Count)",
      "teacher_20_years_full_time_equiv":"Teacher 20 Years+ Experience (Count)",
      "teacher_1_5_years_base_salary":"Teacher Average Salary 1-5 Years Experience ($)",
      "teacher_6_10_years_base_salary":"Teacher Average Salary 6-10 Years Experience ($)",
      "teacher_11_20_years_base_salary":"Teacher Average Salary 11-20 Years Experience ($)",
      "teacher_male_full_time_equiv":"Full Time Male Teachers (Count)",
      "teacher_female_full_time_equiv":"Full Time Female Teachers (Count)",
      "teacher_no_degree_full_time_equiv":"Teachers with no Degree (Count)",
      "teacher_ba_degree_full_time_equiv":"Teachers with Bachelors Degree (Count)",
      "teacher_ms_degree_full_time_equiv":"Teachers with Masters Degree (Count)",
      "teacher_student_ratio":"Teacher Student Ratio (Ratio)",
      "all_students":"Number of Students (Count)",
      "white":"Number of White Students",
      "african_american":"Number of African Amercian Students",
      "hispanic":"Number of Hispanic Students",
      "at_risk":"Number of At Risk Students",
      "economic_disadvant":"Number of Economic Disadvantaged Students",
      "Grade_Leve_Elementary":0,
      "Grade_Leve_Elementary/Secondary":0,
      "Grade_Leve_High School":0,
      "Grade_Leve_Junior High":0,
      "Grade_Leve_Middle":0,
      "new_rate":"Student Performance (Meets Standards,%)",
      "teacher_experience":"Teacher Experience",
    "principal_experience": "Principal Experience",
    "assistant_principal_count": "Assistant Principal Count"
}

// function SelectFeature(props){


//     let optionItems = features.map((feature) => <option key={feature} value={feature}>{feature}</option>);

//     return(
//       <div className="inline-block mr6">
//         <div className="select-container">
//           <select onChange={props.handleFeatureChange} value={props.featureValue} className="select select--border-yellow mb6 txt-s">
//                 {optionItems}
//           </select>
//           <div className="select-arrow"></div>
//         </div>
//       </div>
//     )
// }

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
        return (<div className='flex-parent flex-parent--space-between-main'>
                    <div className='flex-child'><button className='btn btn--stroke btn--s' name = "minus" key={feature} value={feature} onClick={props.ChangePredictor}>-</button> </div>
                    
                        <span className="txt-s">{feature_dict[feature]}</span>
                    
                    <div className='flex-child'><button name = "plus" className='btn btn--stroke btn--s' key={feature} value={feature} onClick={props.ChangePredictor}>+</button></div>
                </div>)
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
                        <div className='col bg-blue-faint h12'></div>
                        <div className='col bg-blue-light h12'></div>
                        <div className='col bg-blue h12'></div>
                        <div className='col bg-blue-dark h12'></div>
                        <div className='col bg-red-faint h12'></div>
                        <div className='col bg-red-light h12'></div>
                        <div className='col bg-red h12'></div>
                        <div className='col bg-red-dark h12'></div>
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
                    />


            
                </div>

            </div>

            </>
     


    )
}

export default SideBar




