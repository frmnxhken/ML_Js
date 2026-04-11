import { x, y } from "./data.js";

class Neural {
  constructor() {
    this.lr = 0.1;
    this.epoch = 10;
    this.weights = [0.1, 0.1, 0.1];
    this.predicts = [];
  }

  activation(z) {
    if (z <= 0) {
      return 0;
    }
    return 1;
  }

  updateWeight(error, x) {
    for (let w = 0; w < this.weights.length; w++) {
      this.weights[w] += this.lr * error * x[w];
    }
  }

  fit(x, y) {
    for (let e = 0; e < this.epoch; e++) {
      for (let i = 0; i < x.length; i++) {
        let z = 0;
        for (let j = 0; j < x[0].length; j++) {
          let current = x[i][j];
          let net = this.weights[j] * current;
          z += net;
        }
        let y_pred = this.activation(z);
        let error = y[i] - y_pred;
        this.predicts.push(y_pred);
        this.updateWeight(error, x[i]);
        z = 0;
      }
    }
  }
}

class Evaluation {
  constructor(y, y_pred) {
    this.y = y;
    this.y_pred = y_pred;
    this.tp = 0;
    this.tn = 0;
    this.fp = 0;
    this.fn = 0;
    this.accuracy = 0;
    this.precission = 0;
    this.accuracy = 0;
    this.recall = 0;
    this.matrix();
  }

  matrix() {
    this.tp = this.y_pred.filter((yp, i) => yp === y[i] && yp === 1).length;
    this.tn = this.y_pred.filter((yp, i) => yp === y[i] && yp === 0).length;
    this.fp = this.y_pred.filter((yp, i) => yp !== y[i] && y === 1).length;
    this.fn = this.y_pred.filter((yp, i) => yp !== y[i] && y === 0).length;
  }

  confusion_matrix() {
    console.log(`[${this.tp} | ${this.fp}]`);
    console.log(`[${this.fn} | ${this.tn}]`);
  }

  report_classification() {
    this.accuracy =
      (this.tn + this.tp) / (this.tn + this.fp + this.tp + this.fn);
    this.precission = this.tp / (this.tp + this.fp);
    this.recall = this.tp / (this.tp + this.fn);
    console.log(
      `Accuracy  : ${this.accuracy}\nPrecission: ${this.precission}\nRecall    : ${this.recall}`,
    );
  }
}
const nn = new Neural();
nn.fit(x, y);
const y_pred = nn.predicts;
const evaluation = new Evaluation(y, y_pred.slice(-y.length));
evaluation.confusion_matrix();
evaluation.report_classification();
