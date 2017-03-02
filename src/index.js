import ImageBuilder         from '../node_modules/paraviewweb/src/Rendering/Image/DataProberImageBuilder';
import ChartBuilder         from '../node_modules/paraviewweb/src/Rendering/Chart/PlotlyChartBuilder';

import sizeHelper   from '../node_modules/paraviewweb/src/Common/Misc/SizeHelper';
import CSVReader from '../node_modules/paraviewweb/src/IO/Core/CSVReader';

import LookupTableManager   from '../node_modules/paraviewweb/src/Common/Core/LookupTableManager';
import Probe3DViewer        from '../node_modules/paraviewweb/src/React/Viewers/Probe3DViewer';
import QueryDataModel       from '../node_modules/paraviewweb/src/IO/Core/QueryDataModel';
import LineChartViewer      from '../node_modules/paraviewweb/src/React/Viewers/LineChartViewer';
import ChartViewer      from '../node_modules/paraviewweb/src/React/Viewers/ChartViewer';

import React                from 'react';
import ReactDOM             from 'react-dom';
import ReactContainer       from '../node_modules/paraviewweb/src/Component/React/ReactAdapter';

import ParallelCoordinates from '../node_modules/paraviewweb/src/InfoViz/Native/ParallelCoordinates';
import MutualInformationDiagram from '../node_modules/paraviewweb/src/InfoViz/Native/MutualInformationDiagram';
import FieldSelector from '../node_modules/paraviewweb/src/InfoViz/Native/FieldSelector';
import HistogramSelector from '../node_modules/paraviewweb/src/InfoViz/Native/HistogramSelector';

import CompositeClosureHelper from '../node_modules/paraviewweb/src/Common/Core/CompositeClosureHelper';
import FieldProvider from '../node_modules/paraviewweb/src/InfoViz/Core/FieldProvider';
import LegendProvider from '../node_modules/paraviewweb/src/InfoViz/Core/LegendProvider';
import Histogram1DProvider from '../node_modules/paraviewweb/src/InfoViz/Core/Histogram1DProvider';
import Histogram2DProvider from '../node_modules/paraviewweb/src/InfoViz/Core/Histogram2DProvider';
import MutualInformationProvider from '../node_modules/paraviewweb/src/InfoViz/Core/MutualInformationProvider';
import HistogramBinHoverProvider from '../node_modules/paraviewweb/src/InfoViz/Core/HistogramBinHoverProvider';
import SelectionProvider from '../node_modules/paraviewweb/src/InfoViz/Core/SelectionProvider';
import ScoresProvider from '../node_modules/paraviewweb/src/InfoViz/Core/ScoresProvider';
import AnnotationStoreProvider from '../node_modules/paraviewweb/src/InfoViz/Core/AnnotationStoreProvider';


import Workbench from '../node_modules/paraviewweb/src/Component/Native/Workbench';
import Spacer from '../node_modules/paraviewweb/src/Component/Native/Spacer';
import Composite from '../node_modules/paraviewweb/src/Component/Native/Composite';
import WorkbenchController from '../node_modules/paraviewweb/src/Component/React/WorkbenchController';
import { debounce } from '../node_modules/paraviewweb/src/Common/Misc/Debounce';
import BGColor from '../node_modules/paraviewweb/src/Component/Native/BackgroundColor';
import ToggleControl   from '../node_modules/paraviewweb/src/Component/Native/ToggleControl';

// Load CSS
import 'normalize.css';

import MIDataModel from '../data/stateMI.json';
import dataFrameToStateModel from './dataModelUtil';

import tonicJsonData             from '../../../data/tonic-arctic-sample-data-1.2.1/data/probe/info.json';
import chartJsonData              from '../../../data/chart-data/sedans';

const url_base = window.location.protocol + "//" + window.location.host;

const chart_data_base_url = url_base + "/data/chart-data/sedans/";
const chart_csv_data_url = chart_data_base_url + "sedans.csv";
const tonic_map_data_url = url_base + '/data/tonic-arctic-sample-data-1.2.1' 
      + '/data/probe/';

// import tonicJsonData             from '../data/probe/info.json';
// import chartJsonData              from '../data/sedans';

// const url_base = window.location.protocol + "//" + window.location.host + window.location.pathname;

// const chart_data_base_url = url_base + "data/sedans/";
// const chart_csv_data_url = chart_data_base_url + "sedans.csv";
// const tonic_map_data_url = url_base + 'data/probe/';



// function that loads the csv data using CSVReader and passes the result to next function
function loadProcessData() {

  if(this.status == 200 &&
    this.responseText != null &&
    this.responseText != null) {
    // success!

    const csvInput = new CSVReader(this.responseText);
    csvInput.setData(this.responseText);

    // main({dataModel: dataFrameToStateModel(
    //   {csvInput: csvInput, metadata: chartJsonData})
    // });
    main();


  } else {
      console.log('fail');
    };

}

//The AJAX call that will start the process off and load data from CSV
const dataReq = new XMLHttpRequest();
dataReq.onload = loadProcessData;
dataReq.open("GET", chart_csv_data_url, true);
dataReq.send(null);


function main(args) {
    const
      container = document.querySelector('#workspace1'),
      container2 = document.querySelector('#workspace2');

  // Fix dimension
  //jsonData.metadata.dimensions = [50,50,50];

  // container.style.height = '100vh';
  // container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.width = '50vw';
  container2.style.height = '100vh';
  container2.style.width = '50vw';  
  const tonicDataModel = new QueryDataModel(tonicJsonData, tonic_map_data_url);


  const probInit = true;

  const imBuilder = new ImageBuilder(tonicDataModel, new LookupTableManager());
  imBuilder.render();
  const prob3DAdapter = new ReactContainer(Probe3DViewer, {
                  queryDataModel: tonicDataModel,
                  imageBuilder: imBuilder,
                  probe: probInit,
                  });

  const data = { xRange: [ -10, 123 ], fields: [] };
  function createField(name, size, scale) {
      const data = [];
      for(let i = 0; i < size; i++) {
          data.push(Math.random() * scale * 0.1 + Math.sin(i/size*Math.PI*4) * scale);
      }
      return { name, data };
  }

  data.fields.push(createField('Temperature', 500, 30));
  data.fields.push(createField('Pressure', 500, 500));
  data.fields.push(createField('Salinity', 500, 1));

  const lineChartAdapterOld = new ReactContainer(LineChartViewer, {
                  data: data,//imBuilder.getProbeLine(0),
                  cursor:  0,//imBuilder.getProbe()[0],
                  height: 300,
                  width: 300,

                  });

  const chartDataModel = new QueryDataModel(chartJsonData, 
     chart_data_base_url);

  const scatterBuilder = new ChartBuilder(chartDataModel);

  const plotlyChartViewerAdapter = new ReactContainer(ChartViewer, {
                   queryDataModel: chartDataModel,
                   chartBuilder: scatterBuilder

                   });

  // if the probe has changed, then update LineChartViewer state vars
  // imBuilder.onProbeChange((probe, envelope) => {
  //       var newcursor = 'XYZ'.indexOf(imBuilder.getRenderMethod()[0]);
  //       var newdata = imBuilder.getProbeLine(newcursor);


  //       lineChartAdapter.setState({data: newdata, cursor: newcursor});
  // });

  setImmediate( () => {
    chartDataModel.fetchData("_");
    chartDataModel.fetchData();
    tonicDataModel.fetchData("_");
    tonicDataModel.fetchData();
  });




  const green = new BGColor('green');
  const red = new BGColor('red');
  const blue = new BGColor('blue');


  const provider = CompositeClosureHelper.newInstance((publicAPI, model, initialValues = {}) => {
    Object.assign(model, initialValues);
    FieldProvider.extend(publicAPI, model, initialValues);
    Histogram1DProvider.extend(publicAPI, model, initialValues);
    Histogram2DProvider.extend(publicAPI, model, initialValues);
    HistogramBinHoverProvider.extend(publicAPI, model);
    LegendProvider.extend(publicAPI, model, initialValues);
    MutualInformationProvider.extend(publicAPI, model, initialValues);
    ScoresProvider.extend(publicAPI, model, initialValues);
    SelectionProvider.extend(publicAPI, model, initialValues);
    AnnotationStoreProvider.extend(publicAPI, model, initialValues);
  })(MIDataModel);
  //})(args.dataModel);

  // Init Mutual information
  // provider.setMutualInformationParameterNames([]);
  provider.setHistogram2dProvider(provider);

  provider.setFieldsSorted(true);
  provider.getFieldNames().forEach((name) => {
    provider.addLegendEntry(name);
  });
  provider.assignLegend(['colors', 'shapes']);

  // activate scoring gui
  const scores = [
    { name: 'No', color: '#FDAE61', value: -1 },
    { name: 'Maybe', color: '#FFFFBF', value: 0 },
    { name: 'Yes', color: '#A6D96A', value: 1 },
  ];
  provider.setScores(scores);
  provider.setDefaultScore(1);

  // provider.setMutualInformationParameterNames(provider.getFieldNames());
  // Create parallel coordinates
  const diag = MutualInformationDiagram.newInstance({ provider });
  const fieldSelector = FieldSelector.newInstance({ provider});
  const parallelCoordinates = ParallelCoordinates.newInstance({ provider});

  fieldSelector.setFieldShowHistogram(false);
  //fieldSelector.setDisplayUnselected(false);

  fieldSelector.getContainer();
  const histogramSelector = HistogramSelector.newInstance({ provider });



  // Create field selector
  // Listen to window resize
  sizeHelper.onSizeChange(() => {
    diag.resize();
    fieldSelector.resize();
   histogramSelector.resize();  
    parallelCoordinates.resize();

  });
  sizeHelper.startListening();
  sizeHelper.triggerChange();






  const viewports = {
    HistogramSelector: {
     component: histogramSelector,
      // component: lineChartAdapter,
      viewport: 3,
    },
    ChartViewer: {
       component: plotlyChartViewerAdapter,
       viewport: -1,
     },
    MIFieldSelector: {
      component: fieldSelector,
      viewport: 0,
    },
    MIDiagram: {
      component: diag,
      viewport: 1,
    },
    ParallelCoordinates: {
      component: parallelCoordinates,
      viewport: 2,
    },
    Probe3DViewer: {
      component: prob3DAdapter,
      viewport: -1,
    },
  };

  const viewports2 = {
    ChartViewer: {
       component: plotlyChartViewerAdapter,
       viewport: 0,
     },
    Probe3DViewer: {
      component: prob3DAdapter,
      viewport: 1,
    },
  };

    // '2x2': 4,
    // '1x1': 1,
    // '1x2': 2,
    // '2x1': 2,
    // '3xT': 3,
    // '3xL': 3,
    // '3xR': 3,
    // '3xB': 3,


  const workbench = new Workbench();
  workbench.setComponents(viewports);
  workbench.setLayout('2x2');
  const props = {
    onLayoutChange(layout) {
      workbench.setLayout(layout);
    },
    onViewportChange(index, instance) {
      workbench.setViewport(index, instance);
    },
    activeLayout: workbench.getLayout(),
    viewports: workbench.getViewportMapping(),
    count: 4,
  };

  const workbench2 = new Workbench();
  workbench2.setComponents(viewports2);
  workbench2.setLayout('2x1');
  const props2 = {
    onLayoutChange(layout) {
      workbench2.setLayout(layout);
    },
    onViewportChange(index, instance) {
      workbench2.setViewport(index, instance);
    },
    activeLayout: workbench2.getLayout(),
    viewports: workbench2.getViewportMapping(),
    count: 2,
  };

  const controlPanel = new ReactContainer(WorkbenchController, props);
  const shiftedWorkbench = new Composite();

  //adds space on the top of the workbench
  shiftedWorkbench.addViewport(new Spacer('50px'), false);
  shiftedWorkbench.addViewport(workbench);
  //shiftedWorkbench.addViewport(workbench2);  

  const mainComponent = new ToggleControl(shiftedWorkbench, controlPanel, 280);
  mainComponent.setContainer(container);

  workbench2.setContainer(container2);
  workbench.onChange((model) => {
    props.activeLayout = model.layout;
    props.viewports = model.viewports;
    props.count = model.count;
    controlPanel.render();
  });
  workbench.onVisibilityChange((event) => {
    const { component, index, count } = event;
    console.log(component ? component.color : 'none', index, count,
                index === -1 || index >= count ? 'hidden' : 'visible');
  });
  // Create a debounced window resize handler
  const resizeHandler = debounce(() => {
    mainComponent.resize();
  }, 50);
  // Register window resize handler so workbench redraws when browser is resized
  window.onresize = resizeHandler;






  // import ChartViewer  from '../node_modules/paraviewweb/src/React/Viewers/ChartViewer';
  // import React        from 'react';
  // import ReactDOM     from 'react-dom';
  // import QueryDataModel from '../node_modules/paraviewweb/src/IO/Core/QueryDataModel'
  // import PlotlyChartBuilder from '../node_modules/paraviewweb/src/Rendering/Chart/PlotlyChartBuilder';
  // // Load CSS
  // require('normalize.css');
  // // Get react component
  // const
  //     container = document.querySelector('.content'),
  //     data = { xRange: [ -10, 123 ], fields: [] };
  // function createField(name, size, scale) {
  //     const data = [];
  //     for(let i = 0; i < size; i++) {
  //         data.push(Math.random() * scale * 0.1 + Math.sin(i/size*Math.PI*4) * scale);
  //     }
  //     return { name, data };
  // }

  // data.fields.push(createField('Temperature', 500, 30));
  // data.fields.push(createField('Pressure', 500, 500));
  // data.fields.push(createField('Salinity', 500, 1));

  // model = new QueryDataModel(data);

  // new PlotlyChartBuilder(model);

  // container.style.width = '100%';
  // container.style.height = '100%';
  // container.style.position = 'absolute';
  // container.style.padding = '0';
  // // container.style.margin = '10px';
  // // container.style.border = 'solid 1px black';
  // ReactDOM.render(
  //     React.createElement(
  //         ChartViewer,
  //         { queryDataModel: dataModel,
  //           chartBuilder: new PlotlyChartBuilder(dataModel), 
  //           width: 500, height: 300 }),
  //     container);


}