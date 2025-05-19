const svg = d3.select("#background");
const width = window.innerWidth;
const height = window.innerHeight;
svg.attr("width", width).attr("height", height);

const numParticles = 100;
const particles = d3.range(numParticles).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height,
  r: Math.random() * 3 + 1,
  dx: (Math.random() - 0.5) * 1,
  dy: (Math.random() - 0.5) * 1,
}));

const circles = svg.selectAll("circle")
  .data(particles)
  .enter()
  .append("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", d => d.r)
  .style("fill", "white")
  .style("opacity", 0.8);

d3.timer(() => {
  circles
    .attr("cx", d => {
      d.x += d.dx;
      if (d.x < 0 || d.x > width) d.dx *= -1;
      return d.x;
    })
    .attr("cy", d => {
      d.y += d.dy;
      if (d.y < 0 || d.y > height) d.dy *= -1;
      return d.y;
    });
});
