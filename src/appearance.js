
const colorPattern = (value) => `\x1b[${value}m`;
const color = ([ x, y ]) => ({ open: colorPattern(x), close: colorPattern(y) });
const colorize = (color) => (message) => `${color.open}${message}${color.close}${colorPattern(0)}`;
const yellow = color([33, 89]);
const magentaBright = color([95, 39]);
const blueBright =	color([94, 39]);
const redBright = color([91, 39]);

export {
  colorize,
  yellow,
  magentaBright,
  blueBright,
  redBright
};
