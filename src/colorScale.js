import {min,max,range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';
import {interpolateInferno} from 'd3-scale-chromatic';

let style = (attr,url) => fetch(url)
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

export {style}