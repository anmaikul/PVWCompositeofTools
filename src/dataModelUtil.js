import 'normalize.css';
import 'babel-polyfill';
import histogram from './histogram';


// function that takes in the CSVReader object and metadata, and uses the info to generate
// the JavaScript state histogram/MI model, and then calls the main function
export default function dataFrameToStateModel(csvInputObj) {
  const dataModel = {};
  const numberOfBins = "32";
  const csvInput = csvInputObj.csvInput;
  const metaData = csvInputObj.metadata;

  // set some basic viz properties
  dataModel.legendShapes = {
    Circle: "#Circle",
    Square: "#Square",
    Triangle: "#Triangle",
    Diamond: "#Diamond",
    X: "#X",
    Pentagon: "#Pentagon",
    InvertedTriangle: "#InvertedTriangle",
    Star: "#Star",
    Plus: "#Plus"
  };

  dataModel.legendColors = ["rgb(166, 206, 227)", "rgb(31, 120, 180)", "rgb(178, 223, 138)", "rgb(51, 160, 44)", "rgb(251, 154, 153)", "rgb(227, 26, 28)", "rgb(253, 191, 111)", "rgb(255, 127, 0)", "rgb(202, 178, 214)", "rgb(166, 61, 154)", "rgb(255, 255, 153)", "rgb(177, 89, 40)"];
  dataModel.legendEntries = csvInput.data.colNames;
  dataModel.legendPriorities = ["colors", "shapes"];
  dataModel.legendDirty = true;

  dataModel.selectionData = {};


  // get rid of missing elements, take out the numBins parameter       
  //csvInput.data.columns = csvInput.data.columns.map((e) => 
  //  e.slice(1).filter((i) => (i !== "")));
  csvInput.data.columns = csvInput.data.columns.map(e => 
    e.filter((i) => (i !== "")));

  // only use numeric columns
  const numericCols = csvInput.data.colNames.filter((e,i) => 
    (metaData.Chart.arrays[ csvInput.data.colNames[i] ] === "numeric"));
//    ["free throw percent", "minutes", "percentage of team assists", 
//    "percentage of team minutes", "steals per game"].indexOf(
//      csvInput.data.colNames[i]) != -1);

  csvInput.data.columns = csvInput.data.columns.filter((e,i) => 
    (metaData.Chart.arrays[ csvInput.data.colNames[i] ] === "numeric"));

//    ["free throw percent", "minutes", "percentage of team assists", 
//    "percentage of team minutes", "steals per game"].indexOf(
//      csvInput.data.colNames[i]) != -1);    
  
  csvInput.data.colNames = numericCols;

  //const numBins = csvInput.data.columns.map((e) => Number(e[0]));
  const numBins = Array.apply(null, Array(csvInput.data.colNames.length)).map(e => Number(numberOfBins)); 

  dataModel.dirty = true;
  dataModel.fields = {};
  dataModel.histogram1D_storage = {};
  dataModel.histogram1D_storage[numberOfBins] = {};

  let histObj; 
  const histStats = Array.apply(null, Array(csvInput.data.columns.length)).map(
    e => { 
      return {
        minVal: -1,
        maxVal: -1,
        leftEdges: [],
        rightEdges: []
      };
    }
  );

  // populate data model for 1D histogram portion
  // also get histogram stats that you can use later for 2D histogram
  // generation
  csvInput.data.colNames.forEach((name, i) => {    

    // generate histogram
    const histReturn = generateHistFromData(csvInput.data.columns[i], numBins[i]);
    histObj = histReturn.hist;
    histStats[i].minVal = histReturn.minVal;
    histStats[i].maxVal = histReturn.maxVal;
    histStats[i].delta = histObj[0].dx;
    histStats[i].leftEdges = histObj.map(e => e.x);
    histStats[i].rightEdges = histObj.map(e => (e.x + e.dx));

    dataModel.isA = ["AnnotationStoreProvider", "FieldProvider", "Histogram1DProvider", "Histogram2DProvider", "HistogramBinHoverProvider", "LegendProvider", "MutualInformationProvider"];
    dataModel.defaultEmptyAnnotationName = "Empty";
    dataModel.numberOfBins = numberOfBins;

    dataModel.fields[`${name}`] = {};
    dataModel.fields[`${name}`].id = i;
    dataModel.fields[`${name}`].name = name;
    //only activate the first few columns in viz, o/w diagram is too cluttered
    dataModel.fields[`${name}`].active = i < 5 ? true: false; 
    dataModel.fields[`${name}`].range = [histStats[i].minVal,histStats[i].maxVal];

    dataModel.histogram1D_storage[numberOfBins][`${name}`] = {};
    dataModel.histogram1D_storage[numberOfBins][`${name}`].max = histStats[i].maxVal;
    dataModel.histogram1D_storage[numberOfBins][`${name}`].min = histStats[i].minVal;
    dataModel.histogram1D_storage[numberOfBins][`${name}`].counts = 
      histObj.map( (e) => {return e.length} );
    dataModel.histogram1D_storage[numberOfBins][`${name}`].name = name;
  });

  // generate joint histogram 
  dataModel.histogram2D_storage = {};
  dataModel.histogram2D_storage[numberOfBins] = {};

  // populate data model for 2D histogram portion
  // for every variable, need to add an entry for it, and the other variables
  csvInput.data.colNames.forEach((var1Name, i) => {

    dataModel.histogram2D_storage[numberOfBins][`${var1Name}`] = {};
    const var1_2DhistObj = dataModel.histogram2D_storage[numberOfBins][`${var1Name}`];

    dataModel.selectionData[`${var1Name}`] = {};

    // for each data columns's object entry, need to add histogram info for 
    // every other column (i.e. pair) 
    // - this corresponds to one column in the joint histogram
    csvInput.data.colNames.forEach((var2Name, j) => {

      var1_2DhistObj[`${var2Name}`] = {};

      var1_2DhistObj[`${var2Name}`]['annotationInfo'] = [];

      var1_2DhistObj[`${var2Name}`]['x'] = {};   
      var1_2DhistObj[`${var2Name}`]['x']['delta'] = histStats[i].delta;
      var1_2DhistObj[`${var2Name}`]['x']['extent'] = [histStats[i].minVal,histStats[i].maxVal];
      var1_2DhistObj[`${var2Name}`]['x']['name'] = var1Name;

      var1_2DhistObj[`${var2Name}`]['y'] = {};   
      var1_2DhistObj[`${var2Name}`]['y']['delta'] = histStats[j].delta;
      var1_2DhistObj[`${var2Name}`]['y']['extent'] = [histStats[j].minVal,histStats[j].maxVal];
      var1_2DhistObj[`${var2Name}`]['y']['name'] = var2Name;

      dataModel.selectionData[`${var1Name}`][`${var2Name}`] = [];

      const jointHistogram = generateJointHist(
      { 
          data: csvInput.data.columns[i], 
          histStats: histStats[i], 
          numBins: numBins[i] 
      }, {
          data: csvInput.data.columns[j], 
          histStats: histStats[j], 
          numBins: numBins[j]           
      });


      let maxCount = -1;
      var1_2DhistObj[`${var2Name}`]['bins'] = [];
      for (let ind1=0; ind1 < numBins[i]; ind1++) {
        for (let ind2=0; ind2 < numBins[j]; ind2++) {
          if (jointHistogram[ind1][ind2] > 0) {
            var1_2DhistObj[`${var2Name}`]['bins'].push({

              y: histStats[j].leftEdges[ind2],
              x: histStats[i].leftEdges[ind1],                
              count: jointHistogram[ind1][ind2]
            });
            if (jointHistogram[ind1][ind2] > maxCount) {
              maxCount = jointHistogram[ind1][ind2];
            }
          }
        }
      }      

      var1_2DhistObj[`${var2Name}`]['role'] = {score: 0};
      var1_2DhistObj[`${var2Name}`]['maxCount'] = maxCount;
      var1_2DhistObj[`${var2Name}`]['numberOfBins'] = numberOfBins;


      dataModel.selectionData[`${var1Name}`][`${var2Name}`] = [var1_2DhistObj[`${var2Name}`]];
    });
  
  });

  dataModel.mutualInformationParameterNames = [];

  return dataModel;
}


// generate histogram bins; returns the "edges" of the bins
function generateBins(minVal, maxVal, numBins) {

  const delta = (maxVal-minVal)/numBins;

  const linspace = (a,b,n) => {
    if(n<2) { return n===1?[a]:[];}
    const ret = Array(n);
    n--;
    for(let i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
  };
  return linspace(minVal, maxVal, numBins+1);

}

// function that converts one column data into corresponding histogram.
function generateHistFromData(data, numBins) {
  const minVal = Math.min.apply(null,data);
  const maxVal = Math.max.apply(null,data);

  numBins = (typeof numBins === "undefined") ? 
    (Math.max(Math.round(maxVal-minVal)+1,1)) : numBins;


  const hist = histogram({
      data : data,
      bins : generateBins(minVal, maxVal, numBins)
  });

  return {hist, minVal, maxVal};
}

// generate the actual 2D histogram over var1, var2
// do it directly in state model form
function generateJointHist(var1, var2) {

  const jointHist = Array.apply(null, Array(var1.numBins)).map(e => 
    Array.apply(null, Array(var2.numBins)).map(f=>0));

  const iBinLoc = getDataBinLocations(var1);
  const jBinLoc = getDataBinLocations(var2);

  iBinLoc.forEach( (loc, datInd) => {
    jointHist[iBinLoc[datInd]][jBinLoc[datInd]]++;
      } 
  );

  return jointHist;
}

// generate array across data, which contains the location of the histogram 
// bin that each datum belongs to
function getDataBinLocations(oneVar) {
  return oneVar.data.map(
    datum => {
      // determine if the datum is contained in the current bin, i.e. between the left
      // and right bin values, left inclusive
      const left =  oneVar.histStats.leftEdges.map( leftVal => (datum >= leftVal) );
      const lastElem = oneVar.histStats.rightEdges[ oneVar.histStats.rightEdges.length-1 ];
      const right = oneVar.histStats.rightEdges.map( rightVal => 
          //second condition takes care of case where data is at the right edge of range
          (datum < rightVal) || ((datum == lastElem) && (datum == rightVal))
      );
      return (left && right).indexOf(true);
    }
  );
}