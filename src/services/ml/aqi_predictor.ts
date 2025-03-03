import * as tf from '@tensorflow/tfjs';

interface AQIPrediction {
  predictedAQI: number;
  confidence: number;
  timestamp: string;
}

class AQIPredictor {
  private model: tf.LayersModel | null = null;
  private readonly lookback = 24; // Hours of historical data to use
  private readonly predictionHorizon = 1; // Hours to predict ahead

  async initModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add layers
    model.add(tf.layers.lstm({
      units: 50,
      inputShape: [this.lookback, 1],
      returnSequences: false
    }));

    model.add(tf.layers.dense({
      units: 25,
      activation: 'relu'
    }));

    model.add(tf.layers.dense({
      units: 1
    }));

    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    this.model = model;
  }

  // Normalize data between 0 and 1
  private normalize(data: number[]): number[] {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data.map(x => (x - min) / (max - min));
  }

  // Denormalize predictions
  private denormalize(normalized: number, originalData: number[]): number {
    const max = Math.max(...originalData);
    const min = Math.min(...originalData);
    return normalized * (max - min) + min;
  }

  // Prepare data for LSTM input
  private prepareData(data: number[]): [tf.Tensor3D, tf.Tensor2D] {
    const X: number[][][] = [];
    const y: number[] = [];

    for (let i = 0; i < data.length - this.lookback - this.predictionHorizon; i++) {
      const sequence = data.slice(i, i + this.lookback).map(value => [value]);
      X.push(sequence);
      y.push(data[i + this.lookback + this.predictionHorizon - 1]);
    }

    // Convert to tensors with proper shapes
    return [
      tf.tensor3d(X),
      tf.tensor2d(y, [y.length, 1])
    ];
  }

  async trainModel(historicalData: number[]) {
    if (!this.model) {
      await this.initModel();
    }

    // Normalize data
    const normalizedData = this.normalize(historicalData);

    // Prepare data for training
    const [X, y] = this.prepareData(normalizedData);

    // Train the model
    await this.model!.fit(X, y, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true
    });

    // Clean up tensors
    X.dispose();
    y.dispose();
  }

  async predict(recentData: number[]): Promise<AQIPrediction> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    // Ensure we have enough data
    if (recentData.length < this.lookback) {
      throw new Error(`Need at least ${this.lookback} data points for prediction`);
    }

    // Normalize data
    const normalizedData = this.normalize(recentData);

    // Prepare input data - reshape to [samples, timesteps, features]
    const sequence = normalizedData.slice(-this.lookback).map(value => [value]);
    const input = tf.tensor3d([sequence]);

    // Make prediction
    const normalizedPrediction = this.model.predict(input) as tf.Tensor;
    const predictionValue = await normalizedPrediction.data();

    // Denormalize prediction
    const predictedAQI = Math.round(this.denormalize(predictionValue[0], recentData));

    // Clean up tensors
    input.dispose();
    normalizedPrediction.dispose();

    // Calculate confidence based on recent data stability
    const recentVariability = this.calculateVariability(recentData.slice(-6));
    const confidence = Math.max(0.5, 1 - recentVariability);

    return {
      predictedAQI,
      confidence,
      timestamp: new Date().toISOString()
    };
  }

  // Calculate data variability for confidence estimation
  private calculateVariability(data: number[]): number {
    if (data.length < 2) return 0;
    
    const mean = data.reduce((a, b) => a + b) / data.length;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalize variability to 0-1 range
    return Math.min(stdDev / mean, 1);
  }

  // Save the trained model
  async saveModel(path: string) {
    if (!this.model) {
      throw new Error('No model to save');
    }
    await this.model.save(`localstorage://${path}`);
  }

  // Load a previously trained model
  async loadModel(path: string) {
    this.model = await tf.loadLayersModel(`localstorage://${path}`);
  }
}

// Singleton instance
const predictor = new AQIPredictor();

export const initializeAQIPredictor = async (historicalData: number[]) => {
  await predictor.initModel();
  await predictor.trainModel(historicalData);
};

export const predictAQI = async (recentData: number[]): Promise<AQIPrediction> => {
  return predictor.predict(recentData);
};

export const saveAQIModel = async (path: string) => {
  await predictor.saveModel(path);
};

export const loadAQIModel = async (path: string) => {
  await predictor.loadModel(path);
};

export type { AQIPrediction };