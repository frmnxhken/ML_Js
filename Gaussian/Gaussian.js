import { x_train, y_train, x_test, y_test } from "./data.js";

class Gaussian {
  constructor() {
    this.variances = [];
    this.means = [];
    this.totalClass = 0;
    this.prior = [];
    this.predicts = [];
  }

  variance(x) {
    const m = [];
    const v = [];
    for (let j = 0; j < x[0].length; j++) {
      let sum = 0;

      for (let i = 0; i < x.length; i++) {
        sum += x[i][j];
      }
      m.push(sum / x.length);
    }

    for (let j = 0; j < x[0].length; j++) {
      let sum = 0;

      for (let i = 0; i < x.length; i++) {
        sum += Math.pow(x[i][j] - m[j], 2);
      }

      v.push(sum / x.length);
    }
    return { m, v };
  }

  probability(x) {
    let result = Array.from({ length: this.totalClass }, () => []);
    for (let i = 0; i < x.length; i++) {
      this.variances.forEach((v, index) => {
        let b = Math.sqrt(2 * 3.14 * v[i]);
        let s = Math.pow(x[i] - this.means[index][i], 2);
        let e = Math.exp(-(s / (2 * v[i])));
        let p = (1 / b) * e;
        result[index].push(p);
      });
    }
    return result;
  }

  likelihood(probs) {
    return probs.map((classProbs) =>
      classProbs.reduce((acc, val) => acc * val, 1),
    );
  }

  posterior(likelihoods) {
    return likelihoods.map((l, i) => l * this.prior[i]);
  }

  predict(x_test) {
    let results = [];

    for (let i = 0; i < x_test.length; i++) {
      let probs = this.probability(x_test[i]);

      let likelihoods = this.likelihood(probs);
      let posteriors = this.posterior(likelihoods);

      let pred = posteriors.indexOf(Math.max(...posteriors));
      results.push(pred);
    }

    return results;
  }

  fit(x, y) {
    let features = [];
    this.totalClass = y.filter(
      (value, index, self) => self.indexOf(value) === index,
    ).length;
    for (let x = 0; x < this.totalClass; x++) {
      features.push([]);
    }

    for (let k = 0; k < this.totalClass; k++) {
      for (let l = 0; l < x.length; l++) {
        if (y[l] === k) {
          features[k].push(x[l]);
        }
      }
    }

    this.prior = features.map((f) => f.length / x.length);
    for (let i = 0; i < features.length; i++) {
      let va = [];
      let me = [];
      for (let j = 0; j < features[i].length; j++) {
        let { m, v } = this.variance(features[i]);
        va = v;
        me = m;
      }
      this.variances.push(va);
      this.means.push(me);
      va = [];
      me = [];
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
    this.tp = this.y_pred.filter(
      (yp, i) => yp === this.y[i] && yp === 1,
    ).length;
    this.tn = this.y_pred.filter(
      (yp, i) => yp === this.y[i] && yp === 0,
    ).length;
    this.fp = this.y_pred.filter(
      (yp, i) => yp !== this.y[i] && this.y[i] === 1,
    ).length;
    this.fn = this.y_pred.filter(
      (yp, i) => yp !== this.y[i] && this.y[i] === 0,
    ).length;
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

const gaussian = new Gaussian();
gaussian.fit(x_train, y_train);
const y_pred = gaussian.predict(x_test);
const evaluation = new Evaluation(y_test, y_pred);
evaluation.confusion_matrix();
evaluation.report_classification();
