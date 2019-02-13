const referencePoint = [0, 0];
let trianglePoints = [];
let incidencePoint = [];

const refractionIndex = 0.5;

function drawTriangle() {
  stroke(255, 255, 255);
  strokeWeight(1);
  noFill();
  triangle(...trianglePoints.flat());
  drawGradientTriangle();
}

function drawGradientTriangle() {
  const step = 1.5;
  const nTriangles = 10;
  const sqrt3_2 = Math.sqrt(3) / 2;
  for (let i = 0; i < nTriangles; i++) {
    const innerTrianglePoints = [
      [trianglePoints[0][0], trianglePoints[0][1] + i * step],
      [trianglePoints[1][0] + i * step * sqrt3_2, trianglePoints[1][1] - i * step * 0.5],
      [trianglePoints[2][0] - i * step * sqrt3_2, trianglePoints[2][1] - i * step * 0.5],
    ];
    const greyColor = (nTriangles - i) / nTriangles * 255;
    stroke(greyColor, greyColor, greyColor);
    triangle(...innerTrianglePoints.flat());
  }
}

function drawRay() {
  stroke(255, 255, 255);
  strokeWeight(3);
  line(mouseX, mouseY, ...incidencePoint);
}

function drawRefractedRays() {
  stroke(255, 255, 255);
  strokeWeight(2);
  const cosTheta0 = (
    (mouseX - incidencePoint[0]) * (referencePoint[0] - incidencePoint[0]) +
    (mouseY - incidencePoint[1]) * (referencePoint[1] - incidencePoint[1])
  ) / Math.sqrt(
    (mouseX - incidencePoint[0]) * (mouseX - incidencePoint[0]) +
    (mouseY - incidencePoint[1]) * (mouseY - incidencePoint[1])
  ) / Math.sqrt(
    (referencePoint[0] - incidencePoint[0]) * (referencePoint[0] - incidencePoint[0]) +
    (referencePoint[1] - incidencePoint[1]) * (referencePoint[1] - incidencePoint[1])
  );

  const sinTheta0 = Math.sqrt(1 - Math.pow(cosTheta0, 2));
  const direction = (
    (mouseX - incidencePoint[0]) * (referencePoint[1] - incidencePoint[1]) -
    (mouseY - incidencePoint[1]) * (referencePoint[0] - incidencePoint[0])
  );
  const theta1 = (-1) * Math.sign(direction) * Math.asin(sinTheta0 * refractionIndex) + Math.PI / 6;
  const deltaY = trianglePoints[1][1] - incidencePoint[1];
  const apperture = Math.PI / 20;
  const margin = 20;
  for (let gamma = 0; gamma < 2 * apperture; gamma += apperture / 30 ) {
    const deltaThetaA = theta1 - apperture + gamma;
    const alphaA = Math.PI/2 - deltaThetaA;
    const rA = -margin + Math.min(...[
      Math.abs(100 / Math.cos(alphaA)) - 1,
      Math.abs(75 / Math.cos(alphaA + Math.PI / 3)) + 2,
    ]);
    for (let deltarA = 0; deltarA < rA; deltarA += rA / 40) {
      const greyColor = (rA - deltarA) / rA * 255;
      stroke(greyColor, greyColor, greyColor);
      point(
        incidencePoint[0] + deltarA * Math.cos(deltaThetaA),
        incidencePoint[1] + deltarA * Math.sin(deltaThetaA),
      );
    }
    setColorRainbowRay(gamma / (2 * apperture));
    drawRainbowRay(
      incidencePoint[0] + (rA + margin + 3) * Math.cos(deltaThetaA),
      incidencePoint[1] + (rA + margin + 3) * Math.sin(deltaThetaA),
    );
  }
}

function setColorRainbowRay(percentage) {
  const colors = [
    [255, 0, 0],
    [255, 127, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255],
    [139, 0, 255],
  ];
  stroke(...colors[parseInt(percentage * colors.length)]);
}

function drawRainbowRay(x0, y0) {
  strokeWeight(3);
  const cosTheta0 = (
    (incidencePoint[0] - x0) * (referencePoint[0] - x0) +
    (incidencePoint[1] - y0) * (referencePoint[1] - y0)
  ) / Math.sqrt(
    (incidencePoint[0] - x0) * (incidencePoint[0] - x0) +
    (incidencePoint[1] - y0) * (incidencePoint[1] - y0)
  ) / Math.sqrt(
    (referencePoint[0] - x0) * (referencePoint[0] - x0) +
    (referencePoint[1] - y0) * (referencePoint[1] - y0)
  );

  const sinTheta0 = Math.sqrt(1 - Math.pow(cosTheta0, 2));
  const direction = (
    (incidencePoint[0] - x0) * (referencePoint[1] - y0) -
    (incidencePoint[1] - y0) * (referencePoint[0] - x0)
  );
  const theta1 = (-1) * Math.sign(direction) * Math.asin(sinTheta0 * refractionIndex) + Math.PI / 6;
  const x1 = x0 + 2000 * Math.cos(theta1);
  const y1 = y0 + 2000 * Math.sin(theta1);
  line(x0, y0, x1, y1);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  trianglePoints = [
    [windowWidth / 2, (windowHeight - 180) / 2],
    [(windowWidth - 200) / 2, (windowHeight - 180) / 2 + 180],
    [(windowWidth + 200) / 2, (windowHeight - 180) / 2 + 180],
  ];
  incidencePoint = [trianglePoints[1][0] + 55, trianglePoints[1][1] - 100];
}

function draw() {
  background(0, 0, 0);
  drawTriangle();
  drawRay();
  drawRefractedRays();
}
