import { x, y } from "./data.js";

class KMeans {
  constructor(k) {
    this.k = k;
    this.predicts = [];
    this.clusters;
  }

  distance(x, y) {
    return Math.sqrt(Math.pow(x - y, 2));
  }

  randomInit(limit, totalValues) {
    const uniqueValues = new Set();
    do {
      uniqueValues.add(Number((Math.random() * limit).toFixed()));
    } while (uniqueValues.size < totalValues);

    return Array.from(uniqueValues);
  }

  mean(x, y, target) {
    let sum = 0;
    let count = 0;

    for (let i = 0; i < y.length; i++) {
      if (y[i] === target) {
        sum += x[i];
        count++;
      }
    }

    return count === 0 ? 0 : sum / count;
  }

  updateCentroid(x, distances) {
    let centroids = [];
    let newCentroid = [];
    distances.forEach((d) => {
      centroids.push(d.indexOf(Math.min(...d)));
    });

    for (let i = 0; i < 2; i++) {
      newCentroid.push(this.mean(x, centroids, i));
    }
    this.clusters = centroids;
    return newCentroid;
  }

  fit(x, y) {
    let initCentroid = [];
    const randomNumber = this.randomInit(x.length, this.k);
    for (let c = 0; c < randomNumber.length; c++) {
      initCentroid.push(x[c]);
    }

    let convergen = true;
    let count = 0;
    while (convergen) {
      let distances = [];
      for (let i = 0; i < x.length; i++) {
        let dx = [];
        for (let j = 0; j < this.k; j++) {
          let d = this.distance(initCentroid[j], x[i]);
          dx.push(d);
        }

        distances.push(dx);
        dx = [];
      }
      let newCentroid = this.updateCentroid(x, distances);
      if (JSON.stringify(initCentroid) == JSON.stringify(newCentroid)) {
        convergen = false;
      }
      initCentroid = newCentroid;
      count += 1;
      distances = [];
    }
    console.log("Convergen iteration - i " + count);
  }
}

const k = 2;
const kmeans = new KMeans(k);
kmeans.fit(x, y);
const clusters = kmeans.clusters;
clusters.forEach((cluster, index) => {
  for (let i = 0; i < k; i++) {
    if (cluster === i) {
      console.log(`Cluster ${i}: ${y[index]}`);
    }
  }
});
