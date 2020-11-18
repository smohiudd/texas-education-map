import React from 'react';
import mapboxgl from 'mapbox-gl';
import SideBar from "./SideBarContainer"
import ReactDOM from 'react-dom';
import * as tf from '@tensorflow/tfjs';
import {min,max,range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';
import {interpolateInferno} from 'd3-scale-chromatic';


let style = (attr) => fetch('https://texas-education.s3-us-west-2.amazonaws.com/2019_rates_v2.min.geojson')
    .then(response => response.json())
    .then(data => {

      var maxValue = max(data.features, function (d) { return +d.properties[attr] })
      var minValue = min(data.features, function (d) { return +d.properties[attr] })

      let stops = range(minValue, maxValue, (maxValue-minValue)/30)
      
      let my_data = data.features.map(x => x.properties[attr])
      
      let quantile = scaleQuantile()
        .domain(my_data)
        .range(range(0.1, 0.98, 0.1))

      let paint = ["interpolate", ["linear"], ["get", attr]]

      for (let stop of stops) {
        paint = paint.concat(stop, interpolateInferno(quantile(stop))) 
      };

      return paint
      
    });



let model;
let default_data;
// let scores =[]


mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';

const csvUrl =
'https://texas-education.s3-us-west-2.amazonaws.com/default_data_v2.csv';

let u = tf.tensor1d([6.5460815e+02, 3.2479367e+02, 8.0763390e+01, 5.0810824e+04,
  1.1113247e+01, 1.8683820e+02, 5.4065762e+00, 6.8529254e-01,
  5.8481526e-01, 5.9748985e-02, 1.3731660e-01, 2.9945200e-02,
  1.8817395e-01])

let s = tf.tensor1d([2.2707634e+05, 7.4294406e+04, 1.7059588e+04, 3.1223866e+07,
  1.0382882e+01, 5.1530789e+04, 5.6826550e+01, 1.3408921e+00,
  2.4280638e-01, 5.6179043e-02, 1.1846075e-01, 2.9048486e-02,
  1.5276451e-01])

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


const predict = async () => {
  model = await tf.loadLayersModel('https://texas-education.s3-us-west-2.amazonaws.com/model2/model.json')
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



let features = ["new_rate",
"all_students",
"at_risk",
"african_american",
"teacher_total_base_salary",
"teacher_experience",
"white",
"principal_experience",
"assistant_principal_count"]

let prediction_features = [
  "all_students",
  "at_risk",
  "african_american",
  "teacher_total_base_salary",
  "teacher_experience",
  "white",
  "principal_experience",
  "assistant_principal_count"
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal:false,
      score:[],
      feature: 'new_rate',
      mode: "2019 School Data",
      "all_students":0,
      "at_risk":0,
      "african_american":0,
      "teacher_total_base_salary":0,
      "teacher_experience":0,
      "white":0,
      "principal_experience":0,
      "assistant_principal_count":0,
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
    this.modalClose = this.modalClose.bind(this)
    this.modalOpen = this.modalOpen.bind(this)

  }

  async componentDidMount() {

    let paint_style = await style(this.state.feature)

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/saadiqm/cjbjougmt08z72rsa7me1duoi',
      center: [-99.027878, 31.319759],
      zoom: 6,
      maxZoom: 12,
      minZoom: 1
    });

    this.map.on('load', () => {

      this.map.addSource('schools', {
        'type': 'geojson',
        'data': 'https://texas-education.s3-us-west-2.amazonaws.com/2019_rates_v2.min.geojson'
      });

      // this.map.addSource('districts', {
      //   'type': 'vector',
      //   'url': 'mapbox://saadiqm.4nsi58ow'
      // });

      this.map.addSource('prediction', {
        'type': 'geojson',
        'data': 'https://texas-education.s3-us-west-2.amazonaws.com/2019_rates_v2.min.geojson'
      });


      

      this.map.addLayer({
        'id': '2019 School Data',
        'type': 'circle',
        'source': 'schools',
        // 'source-layer': 'schools2019v2-5et1pd',
        // 'minzoom':zoomthreshold-1,
        'paint': {
          'circle-opacity': 1,
          'circle-color': paint_style,
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            7,2,
            14,10,
          ],
        },
        
      })

      // this.map.addLayer({
      //   'id': '2019 District Data',
      //   'type': 'fill',
      //   'source': 'districts',
      //   'source-layer': '2019_districts-0ch1eu',
      //   // 'maxzoom':zoomthreshold,
      //   "layout":{
      //     "visibility":"none"
      //   },
      //   'paint': {
      //     'fill-color': [
      //       'interpolate',
      //       ['linear'],
      //       ['get', 'teacher_1_5_years_full_time_equiv'],
      //       0,
      //       'red',
      //       100,
      //       'blue'
      //       ],
      //     'fill-opacity': 0.5,
      //   }
      // })

      this.map.addLayer({
        'id': 'Predict Student Performance',
        'type': 'circle',
        'source': 'prediction',
        "layout":{
          "visibility":"none"
        },
        // 'maxzoom':zoomthreshold,
        'paint': {
          'circle-opacity': 0.9,
          'circle-color': paint_style,
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            7,2,
            14,10,
          ],
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


  modalOpen() {
    this.setState({ modal: true });
  }

  modalClose() {
    this.setState({modal: false});
  }

  popupEnter(e){
    this.map.getCanvas().style.cursor = 'pointer';

      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties[this.state.feature];
      var name = e.features[0].properties["School_Nam"];

      let text = <div className="prose">
      <p className="txt-h5 txt-bold">{name}</p>
      <p className="txt-h6 txt-bold">{feature_dict[this.state.feature]}</p>
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
      console.log(this.state.feature)

      style(this.state.feature)
        .then(paint_property => {
          this.map.setPaintProperty(this.state.mode, 'circle-color', paint_property);
        })



      // let paint_property = null

      // if(this.state.mode==="2019 School Data" || this.state.mode==="Prediction" ){

      //   if(this.state.feature.includes("salary")){
      //     paint_property = [
      //       'interpolate', ['exponential',2], ['zoom'],
      //       10,['/',['get', this.state.feature],10000],
      //       14,['/',['get', this.state.feature],10000],
      //     ]
      //   }else if(this.state.feature.includes("equiv")){
      //     paint_property = [
      //       'interpolate', ['exponential',2], ['zoom'],
      //       10,['*',['get', this.state.feature],0.1],
      //       14,['*',['get', this.state.feature],1],
      //     ]
      //   }else if(this.state.feature==="teacher_student_ratio"){
      //     paint_property = [
      //       'interpolate', ['exponential',3], ['zoom'],
      //       7,['/',['get', this.state.feature],7],
      //       11,['*',['get', this.state.feature],1.5],
      //     ]
      //   }else if(this.state.feature==="all_students"){
      //     paint_property = [
      //       'interpolate', ['exponential',2], ['zoom'],
      //       5,['/',["sqrt", ['get', this.state.feature]],7],
      //       14,['/',["sqrt", ['get', this.state.feature]],2],
      //     ]
      //   }else{
      //     paint_property = [
      //       'interpolate', ['exponential',3], ['zoom'],
      //       7,['/',["sqrt", ['get', this.state.feature]],5],
      //       11,['*',["sqrt", ['get', this.state.feature]],1.5],
      //     ]
      //   }

      // }else{

      // }

      // this.map.setPaintProperty(this.state.mode, 'circle-radius', paint_property);

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
          status = {this.state.modal}
          handleClose = {this.modalClose}
          handleOpen = {this.modalOpen}
        />
        <div ref={el => this.mapContainer = el} className='mapContainer' />
      </div>
    )
  }
}
export default App;
