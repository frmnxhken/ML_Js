import { x, y } from "./data.js";

class Nearest {
  constructor() {
    this.k = 1;
    this.predicts = [];
  }

  distance(x, y) {
    let d = 0;
    for (let i = 0; i < x.length; i++) {
      d += Math.pow(x[i] - y[i], 2);
    }
    return Math.sqrt(d);
  }

  voting(nums) {
    let count = 0;
    let candidate = null;
    for (let num of nums) {
      if (count === 0) {
        candidate = num;
      }
      count += num === candidate ? 1 : -1;
    }
    return candidate;
  }

  predict(distances) {
    let sorted = distances.sort((a, b) => a[1] - b[1]);
    let indexes = [];
    sorted.splice(1, this.k).forEach((s) => indexes.push(s[0]));

    let predicted = this.voting(indexes);

    return predicted;
  }

  fit(x, y) {
    for (let i = 0; i < x.length; i++) {
      let distances = [];
      for (let j = 0; j < x.length; j++) {
        let current = x[i];
        let d = this.distance(current, x[j]);
        distances.push([y[j], d]);
      }
      let y_pred = this.predict(distances);
      console.log(distances);

      this.predicts.push(y_pred);
      distances = [];
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

const nearest = new Nearest();
nearest.fit(x, y);
const y_pred = nearest.predicts;
const evaluation = new Evaluation(y, y_pred);
evaluation.confusion_matrix();
evaluation.report_classification();
