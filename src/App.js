import React from 'react';
import mapboxgl from 'mapbox-gl';
import SideBar from "./SideBarContainer"
import ReactDOM from 'react-dom';
import * as tf from '@tensorflow/tfjs';

import {feature_dict} from "./variableDict";
import {u,s} from "./scaleFactors"
import {style} from "./colorScale"

let model;
let default_data;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';

const csvUrl = 'https://texas-education.s3-us-west-2.amazonaws.com/default_data_v2.csv';
const url_data = 'https://texas-education.s3-us-west-2.amazonaws.com/2019_rates_v2.min.geojson'


const predict = async () => {
  model = await tf.loadLayersModel('https://texas-education.s3-us-west-2.amazonaws.com/model2/model.json')
}

const getDefaultData = async () =>{
  const csvDataset = tf.data.csv(
    csvUrl, {
      hasHeader:true
    }).prefetch(100).batch(100);

  default_data = csvDataset
}

let features = [
  "new_rate",
  "all_students",
  "at_risk",
  "african_american",
  "teacher_total_base_salary",
  "teacher_experience",
  "white",
  "principal_experience",
  "assistant_principal_count"
]

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

let featureChangeValues ={
    "all_students":50,
    "at_risk":5,
    "african_american":5,
    "teacher_total_base_salary":10000,
    "teacher_experience":5,
    "white":5,
    "principal_experience":5,
    "assistant_principal_count":1,
}

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

    let paint_style = await style(this.state.feature,url_data)

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
        'data': url_data
      });

      this.map.addSource('prediction', {
        'type': 'geojson',
        'data': url_data
      });

      this.map.addLayer({
        'id': '2019 School Data',
        'type': 'circle',
        'source': 'schools',
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

      this.map.addLayer({
        'id': 'Predict Student Performance',
        'type': 'circle',
        'source': 'prediction',
        "layout":{
          "visibility":"none"
        },
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
    // console.log(tf.memory());
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

    this.setState({score:myscores})

  }

  updatedPredictionGeometry(){

    fetch(url_data)
    .then(response => response.json())
    .then(data => {
      data.features.map((feature, index) =>{
        feature.properties.new_rate = this.state.score[index]
      })

      this.map.getSource('prediction').setData(data);
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

      style(this.state.feature,url_data)
        .then(paint_property => {
          this.map.setPaintProperty(this.state.mode, 'circle-color', paint_property);
        })
    })

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
    
      this.setState({[feature]:this.state[feature]-featureChangeValues[feature]},()=>{
        this.updatePredictions()
        this.updatedPredictionGeometry()
        console.log(this.state[feature])
      })


    } else {
      this.setState({[feature]:this.state[feature]+featureChangeValues[feature]},()=>{
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
          FeatureChange = {this.state}
        />
        <div ref={el => this.mapContainer = el} className='mapContainer' />
      </div>
    )
  }
}
export default App;
