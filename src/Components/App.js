import './App.css';
import React, { Component ,useEffect, useState, Fragment } from 'react';
import { Grid, Input, Dropdown, Segment, Button} from 'semantic-ui-react';
import {CanvasJSChart} from 'canvasjs-react-charts'
import CanvasJSReact from '../canvasjs.stock.react';

import Plot from 'react-plotly.js'

import * as XLSX from 'xlsx';
import TopHeader from './TopHeader';
import { max } from 'moment';
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class App extends React.Component {
    constructor(props){
      super(props)

      this.state ={
        arr:{},
        d3:{},
        accl:'',
        a_option:{},
        r_option:{},
        m_option:{},
        t_option:[],
        index:0,
        select:''
      }
    }
    readExcel = (file, fileName) =>{
      const promise = new Promise((resolve,reject)=>{
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) =>{
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, {type:'buffer'});

          const wsname = wb.SheetNames[0];

          const ws = wb.Sheets[wsname]

          const data = XLSX.utils.sheet_to_json(ws);

          resolve(data)
        };

        fileReader.onerror = (error) =>{
          reject(error)
        }
      });

      promise.then((d)=>{
        var ax=[],ay=[],az=[],rx=[],ry=[],rz=[],mx=[],my=[],mz=[]
        var x1=[],x2=[],x3=[],x9=[],x4=[],x5=[],x6=[],x7=[],x8=[]
        for(let i=0;i<d.length;i++){
          ax.push({"y":d[i]["Accl in X-Axis"],"label":""+i})
          ay.push({"y":d[i]["Accl in Y-Axis"],"label":""+i})
          az.push({"y":d[i]["Accl in Z-Axis"],"label":""+i})
          rx.push({"y":d[i]["Rot in X-Axis"],"label":""+i})
          ry.push({"y":d[i]["Rot in Y-Axis"],"label":""+i})
          rz.push({"y":d[i]["Rot in Z-Axis"],"label":""+i})
          mx.push({"y":d[i]["Mag field in X-Axis"],"label":""+i})
          my.push({"y":d[i]["Mag field in Y-Axis"],"label":""+i})
          mz.push({"y":d[i]["Mag filed in Z-Axis"],"label":""+i})
          x1.push(d[i]["Accl in X-Axis"])
          x2.push(d[i]["Accl in Y-Axis"])
          x3.push(d[i]["Accl in Z-Axis"])
          x4.push(d[i]["Rot in X-Axis"])
          x5.push(d[i]["Rot in Y-Axis"])
          x6.push(d[i]["Rot in Z-Axis"])
          x7.push(d[i]["Mag field in X-Axis"])
          x8.push(d[i]["Mag field in Y-Axis"])
          x9.push(d[i]["Mag filed in Z-Axis"])
        }
        var obj = this.state.arr
        var obj1 = this.state.d3
        obj[fileName.substring(0,(fileName.length-4))] = [ax,ay,az,rx,ry,rz,mx,my,mz]
        obj1[fileName.substring(0,(fileName.length-4))] = [x1,x2,x3,x4,x5,x6,x7,x8,x9]
        this.setState({arr:obj,d3:obj1},()=>{
          var options = [];
          var keys = Object.keys(this.state.arr)
          var text = ['Accl in X-Axis',"Accl in Y-Axis","Accl in Z-Axis","Rot in X-Axis","Rot in Y-Axis","Rot in Z-Axis","Mag field in X-Axis","Mag field in Y-Axis","Mag field in Z-Axis"]

          console.log(keys);
          if(keys.length>0){
            for(let i=0;i<9;i++){
              var data = [];
              for(let j=0;j<keys.length;j++){
                console.log(keys[j]);
                data.push({
                    type: "spline",
                    name: keys[j].substring(0,(keys[j].length-1)),
                    showInLegend: true,
                    dataPoints: this.state.arr[keys[j]][i],
                    markerType: "none"
                })
              }
              const options1 = {
                title:{
                  text:text[i]
                },
                animationEnabled: true,
                exportEnabled: true,
                
                charts: [{
                  axisX: {
                    crosshair: {
                      enabled: true, 
                      snapToDataPoint: true
                    }
                  },
                  axisY: {
                    crosshair: {
                      enabled: true,
                      snapToDataPoint: true
                    },
                  },
                  toolTip: {
                    shared: true
                  },
                  data: data
                }],    
                rangeSelector: {
                  inputFields: {
                    startValue: 0,
                    endValue: 50,
                    valueFormatString: "###0"
                  },
                  
                  buttons: [{
                    label: "100",
                    range: 100,
                    rangeType: "number"
                  },{
                    label: "200",
                    range: 200,
                    rangeType: "number"
                  },{
                    label: "500",
                    range: 500,
                    rangeType: "number"
                  },{
                    label: "All",        
                    rangeType: "all"
                  }]
                }
                  
              }
              options.push(options1);
            }
          }
         
          
          this.setState({t_option: [<CanvasJSStockChart key={0} options = {options[0]} />,<CanvasJSStockChart key={1} options = {options[1]} />,<CanvasJSStockChart key={2} options = {options[2]} />,<CanvasJSStockChart key={3} options = {options[3]} />,<CanvasJSStockChart key={4} options = {options[4]} />,<CanvasJSStockChart key={5} options = {options[5]} />,<CanvasJSStockChart key={6} options = {options[6]} />,<CanvasJSStockChart key={7} options = {options[7]} />,<CanvasJSStockChart key={8} options = {options[8]} />]})
         })
      })
    }
    handleChange1 = (e, { name, value }) => {
      var data = [];
      var keys = Object.keys(this.state.arr)
      var text = ['Accl in X-Axis',"Accl in Y-Axis","Accl in Z-Axis","Rot in X-Axis","Rot in Y-Axis","Rot in Z-Axis","Mag field in X-Axis","Mag field in Y-Axis","Mag field in Z-Axis"]
      for(let j=0;j<keys.length;j++){
        data.push({
            type: "spline",
            name: keys[j].substring(0,(keys[j].length-4)),
            showInLegend: true,
            dataPoints: this.state.arr[keys[j]][value]
        })
      }
      const options1 = {
          theme: "light2",
          animationEnabled: true,	
          title:{
            text: text[value]
          },
          legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
          },
          toolTip: {
            shared: true
          },
          data: data
      }
      if(name=="accl"){
        this.setState({a_option:options1},()=>{console.log(this.state.a_option);})
      }else if(name=="rot") {
        this.setState({r_option:options1},()=>{console.log(this.state.a_option);})
      }else{
        this.setState({m_option:options1},()=>{console.log(this.state.a_option);})
      }
    }
    handleChange2 = (e, { name, value }) =>{
      this.setState({index:value})
    }
    render(){
      var data = [];
      var data1 = [];
      var data2 = [];
      var keys = Object.keys(this.state.d3)
      for(let k=0;k<keys.length;k++){
        data.push({
          x: this.state.d3[keys[k]][0], 
          y: this.state.d3[keys[k]][1], 
          z: this.state.d3[keys[k]][2], 
          mode:"markers",
          type:"scatter3d",
          name:keys[k],
          scene:'scene1',
          marker: {color: `#fcba0${[this.state.index+k*20]}`,size:3},
        })
        data1.push({
          x: this.state.d3[keys[k]][3], 
          y: this.state.d3[keys[k]][4], 
          z: this.state.d3[keys[k]][5], 
          mode:"markers",
          type:"scatter3d",
          name:keys[k],
          scene:'scene1',
          marker: {color: `#fcba0${[this.state.index+k*20]}`,size:3},
        })
        data2.push({
          x: this.state.d3[keys[k]][6], 
          y: this.state.d3[keys[k]][7], 
          z: this.state.d3[keys[k]][8], 
          mode:"markers",
          type:"scatter3d",
          name:keys[k],
          scene:'scene1',
          marker: {color: `#fcba0${[this.state.index+k*20]}`,size:3},
        })
      }
      const acclOptions =[{
        key: 'Accl in X-Axis',
        text: 'Accl in X-Axis',
        value: 0,
      },{
        key: 'Accl in Y-Axis',
        text: 'Accl in Y-Axis',
        value: 1,
      },{
        key: 'Accl in Z-Axis',
        text: 'Accl in Z-Axis',
        value: 2,
      },
      {
        key: 'Rot in X-Axis',
        text: 'Rot in X-Axis',
        value: 3,
      },
      {
        key: 'Rot in Y-Axis',
        text: 'Rot in Y-Axis',
        value: 4,
      },
      {
        key: 'Rot in Z-Axis',
        text: 'Rot in Z-Axis',
        value: 5,
      },
      {
        key: 'Mag field in X-Axis',
        text: 'Mag field in X-Axis',
        value: 6,
      },
      {
        key: 'Mag field in Y-Axis',
        text: 'Mag field in Y-Axis',
        value: 7,
      },
      {
        key: 'Mag field in Z-Axis',
        text: 'Mag field in Z-Axis',
        value: 8,
      }]
      const stateOptions = [
        {
          key: 'Accleration',
          text: 'Accleration',
          value: 0,
        },
        {
          key: 'Rotation',
          text: 'Rotation',
          value: 3,
        },
        {
          key: 'Mag field',
          text: 'Mag field',
          value: 6,
        }
      ]
      return(
        <Grid columns={3} divided padded className = "app-home">
          <TopHeader />
          <Grid.Row centered>
            <Input focus placeholder='Search...' type='file' multiple onChange={async (e)=>{
                for(let i=0;i<e.target.files.length;i++){
                  const file = e.target.files[i];
                  await this.readExcel(file,file.name);
                }
              }} />
            {/* <input type="file" id="input" /> */}
          </Grid.Row>
          <Grid.Row centered>
            <Button.Group>
              <Button onClick={()=>{this.setState({select:'chart'})}}>Chart</Button>
              <Button onClick={()=>{this.setState({select:'3d'})}}>3D Graph</Button>
            </Button.Group>
          </Grid.Row>
          {this.state.select=='chart'?
          <>
            <Grid.Row centered>
            <Dropdown 
              placeholder='Accleration' 
              search 
              selection 
              options={stateOptions}
              name="accl"
              onChange={this.handleChange2}  />
          </Grid.Row>
          

          <Grid.Row  >
            {/* <CanvasJSChart options = {this.state.t_option[0]} />
             */}
             {this.state.t_option[this.state.index]}
          </Grid.Row>
          <Grid.Row>
          <Dropdown 
            placeholder='Rotation' 
            search 
            selection 
            options={acclOptions.slice(3,6)}
            name="rot"
            onChange={this.handleChange1}  />
          </Grid.Row>
          <Grid.Row  style={{marginTop:'-5%'}}>
              {this.state.t_option[this.state.index+1]}
          </Grid.Row>
          
          <Grid.Row>
          <Dropdown 
            placeholder='Mag Field' 
            search 
            selection 
            options={acclOptions.slice(6,9)}
            name="mag"
            onChange={this.handleChange1}  />
          </Grid.Row>
          <Grid.Row style={{marginTop:'-5%'}}>
              {this.state.t_option[this.state.index+2]}
          </Grid.Row>
          
          </>:null}
          {data.length>0 && this.state.select=='3d'?<Grid.Row>
              <Plot
                style={{margin:'3%'}}

                data={data}
                layout={{
                  autosize: true,
                  height: 480,
                  scene: {
                      aspectratio: {
                          x: 1,
                          y: 1,
                          z: 1
                      },
                      camera: {
                          center: {
                              x: 0,
                              y: 0,
                              z: 0
                          },
                          eye: {
                              x: 1.25,
                              y: 1.25,
                              z: 1.25
                          },
                          up: {
                              x: 0,
                              y: 0,
                              z: 1
                          }
                      },
                      xaxis: {
                          type: 'linear',
                          zeroline: false
                      },
                      yaxis: {
                          type: 'linear',
                          zeroline: false
                      },
                      zaxis: {
                          type: 'linear',
                          zeroline: false
                      }
                  },
                  title:'3d graph for Accleration',
                  width: 1000
                }}
                
                onRelayout={(figure) => console.log(figure)}
              />
              <Plot
                style={{margin:'3%'}}

                data={data1}
                layout={{
                  autosize: true,
                  height: 480,
                  scene: {
                      aspectratio: {
                          x: 1,
                          y: 1,
                          z: 1
                      },
                      camera: {
                          center: {
                              x: 0,
                              y: 0,
                              z: 0
                          },
                          eye: {
                              x: 1.25,
                              y: 1.25,
                              z: 1.25
                          },
                          up: {
                              x: 0,
                              y: 0,
                              z: 1
                          }
                      },
                      xaxis: {
                          type: 'linear',
                          zeroline: false
                      },
                      yaxis: {
                          type: 'linear',
                          zeroline: false
                      },
                      zaxis: {
                          type: 'linear',
                          zeroline: false
                      }
                  },
                  title:'3d graph for Rotation',
                  width: 1000
                }}
                
                onRelayout={(figure) => console.log(figure)}
              />
              <Plot
                style={{margin:'3%'}}
                data={data2}
                layout={{
                  autosize: true,
                  height: 480,
                  scene: {
                      aspectratio: {
                          x: 1,
                          y: 1,
                          z: 1
                      },
                      camera: {
                          center: {
                              x: 0,
                              y: 0,
                              z: 0
                          },
                          eye: {
                              x: 1.25,
                              y: 1.25,
                              z: 1.25
                          },
                          up: {
                              x: 0,
                              y: 0,
                              z: 1
                          }
                      },
                      xaxis: {
                          type: 'linear',
                          zeroline: false
                      },
                      yaxis: {
                          type: 'linear',
                          zeroline: false
                      },
                      zaxis: {
                          type: 'linear',
                          zeroline: false
                      }
                  },
                  title:'3d graph for Mag Field',
                  width:1000
                }}
                
                onRelayout={(figure) => console.log(figure)}
              />
          </Grid.Row>:null}
          
        </Grid>
      )
    }
  }
export default App;
