// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Bokeh = require("bokehjs");

const plt = Bokeh.Plotting;
const {range, zip} = Bokeh.LinAlg;

Bokeh.set_log_level("info");
Bokeh.logger.info(`Bokeh ${Bokeh.version}`);

const M = 100
const xx = []
const yy = []

for (let y = 0; y <= M; y += 4) {
  for (let x = 0; x <= M; x += 4) {
    xx.push(x)
    yy.push(y)
  }
}

const N = xx.length
const indices = range(N).map((i) => i.toString())
const radii = range(N).map((i) => Math.random()*0.4 + 1.7)

const colors = []
for (const [r, g] of zip(xx.map((x) => 50 + 2*x), yy.map((y) => 30 + 2*y))) {
  colors.push(plt.color(r, g, 150))
}

const source = new Bokeh.ColumnDataSource({
  data: {x: xx, y: yy, radius: radii, colors: colors }
})

const tools = "pan,crosshair,wheel_zoom,box_zoom,reset,hover,save"

const p = plt.figure({title: "Hoverful Scatter", tools: tools})

p.text({field: "x"}, {field: "y"}, indices, {source: source, alpha: 0.5,
       text_font_size: "7px", text_baseline: "middle", text_align: "center"})

const hover = p.toolbar.select_one(Bokeh.HoverTool)
hover.tooltips = (source, info) => {
  const div = document.createElement("div")
  div.style.width = "200px"
  div.style.height = "75px"
  div.style.backgroundColor = source.data["colors"][info.index]
  return div
}

plt.show(p)
