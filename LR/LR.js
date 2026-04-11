import { x, y } from "./data.js";

class Linear {
  constructor() {
    this.b1 = 0;
    this.b0 = 0;
    this.predicts = [];
  }

  fit(x, y) {
    let x_avg = x.reduce((acc, val) => acc + val, 0) / x.length;
    let y_avg = y.reduce((acc, val) => acc + val, 0) / y.length;
    let a = 0;
    let b = 0;
    for (let i = 0; i < x.length; i++) {
      a += (x[i] - x_avg) * (y[i] - y_avg);
      b += Math.pow(x[i] - x_avg, 2);
    }
    this.b1 = a / b;
    this.b0 = y_avg - this.b1 * x_avg;
    for (let j = 0; j < x.length; j++) {
      let y_pred = this.b0 + this.b1 * x[j];
      this.predicts.push(parseFloat(y_pred.toFixed(2)));
    }
  }
}

class Evaluation {
  constructor(y, y_pred) {
    this.y = y;
    this.y_pred = y_pred;
    this.MAE = 0;
    this.MSE = 0;
    this.RMSE = 0;
    this.matrix();
  }

  matrix() {
    for (let i = 0; i < this.y.length; i++) {
      this.MAE += Math.abs(this.y[i] - this.y_pred[i]);
      this.MSE += Math.pow(this.y[i] - y_pred[i], 2);
    }
    this.RMSE = parseFloat(Math.sqrt(this.MSE / this.y.length).toFixed(2));
    this.MAE = parseFloat((this.MAE / this.y.length).toFixed(2));
    this.MSE = parseFloat((this.MSE / this.y.length).toFixed(2));
  }

  report() {
    console.log(`MAE  : ${this.MAE}\nMSE  : ${this.MSE}\nRMSE : ${this.RMSE}`);
  }
}

const lr = new Linear();
lr.fit(x, y);
const y_pred = lr.predicts;
const evaluation = new Evaluation(y, y_pred);
console.log(y_pred);
evaluation.report();
