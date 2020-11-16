import React from 'react';
import mapboxgl from 'mapbox-gl';
import SideBar from "./SideBarContainer"
import ReactDOM from 'react-dom';
import * as tf from '@tensorflow/tfjs';

let model;
let default_data;
// let scores =[]

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';

const csvUrl =
'https://texas-education.s3-us-west-2.amazonaws.com/default_data.csv';

let u = tf.tensor1d([3.8757244e+01, 2.3383005e+00, 5.2369898e+04, 1.1495037e+01,
  7.4352322e+00, 1.1252988e+01, 5.6235461e+00, 4.7844457e+04,
  4.9755422e+04, 5.3323277e+04, 6.2867398e+00, 3.2471012e+01,
  3.7395945e-01, 2.9658897e+01, 8.5517073e+00, 1.4846865e+01,
  5.9074255e+02, 1.5947319e+02, 7.3754135e+01, 3.1339368e+02,
  3.0423239e+02, 3.6559244e+02, 6.8009603e-01, 5.7097118e-02,
  1.1472786e-02, 3.3084311e-02, 2.1824974e-01])

let s = tf.tensor1d([2.8134167e+02, 1.4098845e+00, 3.1503316e+07, 5.4365643e+01,
  2.1699398e+01, 4.1067871e+01, 1.4653924e+01, 6.9142848e+07,
  9.4045168e+07, 8.1127272e+07, 4.1826641e+01, 1.8542195e+02,
  2.5298369e+00, 1.6023384e+02, 3.5409000e+01, 7.6856813e+00,
  7.8096984e+04, 2.6095008e+04, 1.0486014e+04, 5.6837340e+04,
  3.7762898e+04, 5.2971285e+04, 2.1756542e-01, 5.3837039e-02,
  1.1341161e-02, 3.1989738e-02, 1.7061679e-01])

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
    "new_rate":"Student Performance (Meets Standards,%)"
}


const predict = async () => {
  model = await tf.loadLayersModel('https://texas-education.s3-us-west-2.amazonaws.com/model.json')
}

const getDefaultData = async () =>{
  const csvDataset = tf.data.csv(
    csvUrl, {
      hasHeader:true
    }).prefetch(100).batch(100);

  default_data = csvDataset


    // const tensors = await csvDataset.toArray();
    // let a = csvDataset.take(3)
    // await a.forEachAsync(e => console.log(e));
    // console.log(tensors)

}



let features = ["new_rate","teacher_total_full_time_equiv", 
  "teacher_total_base_salary",
  "teacher_1_5_years_full_time_equiv",
  "teacher_6_10_years_full_time_equiv",
  "teacher_11_20_years_full_time_equiv",
  "teacher_20_years_full_time_equiv",
  "teacher_1_5_years_base_salary",
  "teacher_6_10_years_base_salary",
  "teacher_11_20_years_base_salary",
  "teacher_male_full_time_equiv",
  "teacher_female_full_time_equiv",
  "teacher_ba_degree_full_time_equiv",
  "teacher_ms_degree_full_time_equiv",
  "teacher_student_ratio",
  "white",
  "african_american",
  "hispanic",
  "at_risk",
  "economic_disadvant"]

let prediction_features = [
  "teacher_total_full_time_equiv", 
  "school_admin_total_full_time_equiv",
  "teacher_total_base_salary",
  "teacher_1_5_years_full_time_equiv",
  "teacher_6_10_years_full_time_equiv",
  "teacher_11_20_years_full_time_equiv",
  "teacher_20_years_full_time_equiv",
  "teacher_1_5_years_base_salary",
  "teacher_6_10_years_base_salary",
  "teacher_11_20_years_base_salary",
  "teacher_male_full_time_equiv",
  "teacher_female_full_time_equiv",
  "teacher_no_degree_full_time_equiv",
  "teacher_ba_degree_full_time_equiv",
  "teacher_ms_degree_full_time_equiv",
  "teacher_student_ratio",
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score:[],
      feature: 'new_rate',
      mode: "2019 School Data",
      "teacher_total_full_time_equiv":0, 
      "school_admin_total_full_time_equiv":0,
      "teacher_total_base_salary":0,
      "teacher_1_5_years_full_time_equiv":0,
      "teacher_6_10_years_full_time_equiv":0,
      "teacher_11_20_years_full_time_equiv":0,
      "teacher_20_years_full_time_equiv":0,
      "teacher_1_5_years_base_salary":0,
      "teacher_6_10_years_base_salary":0,
      "teacher_11_20_years_base_salary":0,
      "teacher_male_full_time_equiv":0,
      "teacher_female_full_time_equiv":0,
      "teacher_no_degree_full_time_equiv":0,
      "teacher_ba_degree_full_time_equiv":0,
      "teacher_ms_degree_full_time_equiv":0,
      "teacher_student_ratio":0,
      "all_students":0,
      "white":0,
      "african_american":0,
      "hispanic":0,
      "at_risk":0,
      "economic_disadvant":0,
      "Grade_Leve_Elementary":0,
      "Grade_Leve_Elementary/Secondary":0,
      "Grade_Leve_High School":0,
      "Grade_Leve_Junior High":0,
      "Grade_Leve_Middle":0
    };

    this.handleFeatureChange = this.handleFeatureChange.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleChangePredictor = this.handleChangePredictor.bind(this)
    this.updatePredictions = this.updatePredictions.bind(this)
    this.updatedPredictionGeometry = this.updatedPredictionGeometry.bind(this)

  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-99.027878, 31.319759],
      zoom: 6,
      maxZoom: 12,
      minZoom: 1
    });

    this.map.on('load', () => {

      this.map.addSource('schools', {
        'type': 'vector',
        'url': 'mapbox://saadiqm.bjpfp46f'
      });

      this.map.addSource('districts', {
        'type': 'vector',
        'url': 'mapbox://saadiqm.4nsi58ow'
      });

      this.map.addSource('prediction', {
        'type': 'geojson',
        'data': 'https://texas-education.s3-us-west-2.amazonaws.com/2019_rates.geojson'
      });


      this.map.addLayer({
        'id': '2019 School Data',
        'type': 'circle',
        'source': 'schools',
        'source-layer': 'schools2019v2-5et1pd',
        // 'minzoom':zoomthreshold-1,
        'paint': {
          'circle-opacity': 0.4,
          'circle-color': "purple",
          'circle-radius': [
            'interpolate', ['exponential',2], ['zoom'],
            10,['/',["sqrt", ['get', this.state.feature]],4],
            14,["sqrt", ['get', this.state.feature]],
          ]
        },
        
      })

      this.map.addLayer({
        'id': '2019 District Data',
        'type': 'fill',
        'source': 'districts',
        'source-layer': '2019_districts-0ch1eu',
        // 'maxzoom':zoomthreshold,
        "layout":{
          "visibility":"none"
        },
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'teacher_1_5_years_full_time_equiv'],
            0,
            'red',
            100,
            'blue'
            ],
          'fill-opacity': 0.5,
        }
      })

      this.map.addLayer({
        'id': 'Predict Student Performance',
        'type': 'circle',
        'source': 'prediction',
        "layout":{
          "visibility":"none"
        },
        // 'maxzoom':zoomthreshold,
        'paint': {
          'circle-opacity': 0.5,
          'circle-color': "purple",
          'circle-radius': [
            'interpolate', ['exponential',3], ['zoom'],
            7,['/',["sqrt", ['get', 'new_rate']],4],
            11,['*',["sqrt", ['get', 'new_rate']],2],
          ]
        },
      })

    })

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });


    this.map.on('mouseenter', '2019 School Data', this.popupEnter.bind(this));
    this.map.on('mouseleave', '2019 School Data', this.popupLeave.bind(this));

    getDefaultData()
    predict()

    

  }

  componentDidUpdate(){
    console.log(tf.memory());
  }
  
  async updatePredictions(){

    let myscores = []

    await default_data.forEachAsync(e => {

      const y = tf.tidy(() => {
        let a = []

        for (var key in e) {
  
          const k = tf.scalar(this.state[key]);
          const m = e[key].add(k)
          a.push(m)
  
        }
  
        let b = tf.stack(a,1);
  
        // scale the input 
        let c = b.sub(u)
        let d = c.div(s)
        
        let predictions = model.predict(d).dataSync()
  
        b.dispose()
        c.dispose()
        d.dispose()
  
        myscores = [...myscores, ...predictions]
  
      });
   
    });



    this.setState({score:myscores},()=>{
      // console.log(this.state.score)
    })

  }

  updatedPredictionGeometry(){

    fetch('https://texas-education.s3-us-west-2.amazonaws.com/2019_rates.geojson')
    .then(response => response.json())
    .then(data => {
      data.features.map((feature, index) =>{
        feature.properties.new_rate = this.state.score[index]
      })

      this.map.getSource('prediction').setData(data);
      // console.log(data)
    });

  }


  popupEnter(e){
    this.map.getCanvas().style.cursor = 'pointer';

      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties[this.state.feature];

      let text = <div className="prose">
      <p className="txt-h5 txt-bold">{feature_dict[this.state.feature]}</p>
      <p className="txt-l">{description}</p>
      </div>

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
       }

      const placeholder = document.createElement('div');
      ReactDOM.render(text, placeholder);

      this.popup.setLngLat(coordinates).setDOMContent(placeholder).addTo(this.map);
  }

  popupLeave(e){
    this.map.getCanvas().style.cursor = '';
    this.popup.remove();
  }

  handleFeatureChange(e){
    e.preventDefault();

    this.setState({feature:e.target.value}, () => {

      let paint_property = null

      if(this.state.mode==="2019 School Data" || this.state.mode==="Prediction" ){

        if(this.state.feature.includes("salary")){
          paint_property = [
            'interpolate', ['exponential',2], ['zoom'],
            10,['/',['get', this.state.feature],10000],
            14,['/',['get', this.state.feature],10000],
          ]
        }else if(this.state.feature.includes("equiv")){
          paint_property = [
            'interpolate', ['exponential',2], ['zoom'],
            10,['*',['get', this.state.feature],0.1],
            14,['*',['get', this.state.feature],1],
          ]
        }else if(this.state.feature==="teacher_student_ratio"){
          paint_property = [
            'interpolate', ['exponential',3], ['zoom'],
            7,['/',['get', this.state.feature],7],
            11,['*',['get', this.state.feature],1.5],
          ]
        }else if(this.state.feature==="all_students"){
          paint_property = [
            'interpolate', ['exponential',2], ['zoom'],
            5,['/',["sqrt", ['get', this.state.feature]],7],
            14,['/',["sqrt", ['get', this.state.feature]],2],
          ]
        }else{
          paint_property = [
            'interpolate', ['exponential',3], ['zoom'],
            7,['/',["sqrt", ['get', this.state.feature]],5],
            11,['*',["sqrt", ['get', this.state.feature]],1.5],
          ]
        }

      }else{

      }

      this.map.setPaintProperty(this.state.mode, 'circle-radius', paint_property);

    })
    // this.map.setPaintProperty('districts', 'fill-color', [
    //   'interpolate',
    //   ['linear'],
    //   ['get', e.target.value],
    //   0,
    //   'red',
    //   100,
    //   'blue'
    // ]);

  }

  handleViewChange(e) {
    let previousState = this.state.mode
    this.setState({mode:e.target.value}, () => {

      this.map.setLayoutProperty(this.state.mode, 'visibility', 'visible');
      this.map.setLayoutProperty(previousState, 'visibility', 'none');
      console.log(this.state.mode)
    });
  }

  handleChangePredictor(e){
    let feature = e.target.value

    if (e.target.name === 'minus') {
    
      this.setState({[feature]:this.state[feature]-10},()=>{
        this.updatePredictions()
        this.updatedPredictionGeometry()
        console.log(this.state[feature])
      })


    } else {
      this.setState({[feature]:this.state[feature]+10},()=>{
        this.updatePredictions()
        this.updatedPredictionGeometry()
        console.log(this.state[feature])
      })
    }

  }

  render() {
    return (
      <div>
        <SideBar 
          feature={this.state.feature}
          onFeatureChange={this.handleFeatureChange}
          view={this.state.mode}
          onViewChange={this.handleViewChange}
          features = {features}
          prediction_features = {prediction_features}
          onChangePredictor = {this.handleChangePredictor}
        />
        <div ref={el => this.mapContainer = el} className='mapContainer' />
      </div>
    )
  }
}
export default App;
