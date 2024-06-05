import '@marcellejs/core/dist/marcelle.css';

import {
  datasetBrowser,
  batchPrediction,
  confusionMatrix,
  mobileNet,
  dataset,
  dataStore,
  dashboard,
  textInput,
  button,
  imageUpload,
  mlpClassifier,
  modelParameters,
  trainingProgress,
  trainingPlot,
} from '@marcellejs/core';
import { umap } from './components';
import { testcoverage } from './components';
import { Testcoverage } from './components/testcoverage/testcoverage.component';

// -----------------------------------------------------------
// INPUT PIPELINE & DATA CAPTURE
// -----------------------------------------------------------

const input = imageUpload();
const featureExtractor = mobileNet();

const label = textInput('cat');
label.title = 'Label (to record in the dataset)';

const store = dataStore('localStorage');
const trainingSet = dataset('TrainingSet-Umap', store);
const trainingSetUmap = umap(trainingSet);
const trainingSetCov = testcoverage(trainingSet);
const trainingSetBrowser = datasetBrowser(trainingSet);

/*
const $instances = input.$images
  .zip(
    async (thumbnail, img) => ({
      type: 'image',
      x: await featureExtractor.process(img),
      y: label.$value.get(),
      thumbnail,
    }),
    input.$thumbnails,
  )
  .awaitPromises()
  .subscribe(trainingSet.create);
  */

  input.$images
  .zip(
    async (thumbnail, img) => ({
      type: 'image',
      x: await featureExtractor.process(img),
      y: label.$value.get(),
      thumbnail,
    }),
    input.$thumbnails,
  )
  .awaitPromises()
  .subscribe(trainingSet.create);


// -----------------------------------------------------------
// BUTTONS
// -----------------------------------------------------------

const b = button('Train');
b.title = 'Training Launcher';

const cov = button('Show');
cov.title = 'Test Coverage';

const predictButton = button('Update predictions');
predictButton.title = 'Predictions';

// -----------------------------------------------------------
// TRAINING
// -----------------------------------------------------------
const classifier = mlpClassifier({ layers: [64, 32], epochs: 20 }).sync(store, 'mlp-dashboard');

b.$click.subscribe(async () => {
  console.log("Classifier data", classifier);
  await classifier.train(trainingSet);
  
  //wait for a few seconds (training takes some time)
  setTimeout(function(){
    if (classifier.$training && classifier.$training.value && classifier.$training.value.data) {
      const accuracyValue = classifier.$training.value.data.acc;
      console.log(accuracyValue);
      const finalAccuracy = accuracyValue* 100;
      console.log(finalAccuracy);
    }
}, 2000);
    
});

// probably to remove
const params = modelParameters(classifier);
const prog = trainingProgress(classifier);
const plotTraining = trainingPlot(classifier);

// -----------------------------------------------------------
// BATCH PREDICTION
// -----------------------------------------------------------

const batchMLP = batchPrediction('mlp', store);
const confMat = confusionMatrix(batchMLP);

// -----------------------------------------------------------
// BUTTON EVENTS
// -----------------------------------------------------------

//Update predictions 
predictButton.$click.subscribe(async () => {
  if (!classifier.ready) {
    throwError(new Error('No classifier has been trained'));
  }
  await batchMLP.clear();
  await batchMLP.predict(classifier, trainingSet);
});

//update test coverage chart
const testCoverage = new Testcoverage();
cov.$click.subscribe(() => testcoverage.showChart());

//update scatter plot
const updateUmap = button('Update Visualization');
updateUmap.$click.subscribe(() => {
	trainingSetUmap.update();
});

cov.$click.subscribe(()=> {
  trainingSetCov.update();
})

trainingSetUmap.$embedding.subscribe(console.log);




// -----------------------------------------------------------
// DASHBOARDS
// -----------------------------------------------------------

const dash = dashboard({
  title: 'Marcelle Example - Dashboard',
  author: 'Marcelle Pirates Crew',
});

dash
.page('Data Management')
.sidebar(input, label, featureExtractor)
.use(trainingSetBrowser, updateUmap, trainingSetUmap);
dash.page('Training').use(params, b, prog, plotTraining);
dash.page('Batch Prediction').use(predictButton, confMat);
dash.page('Test Coverage').use(cov, testCoverage);
dash.settings.datasets(trainingSet);

dash.show();