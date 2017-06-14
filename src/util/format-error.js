/* eslint-disable */
export default (e) => {
  var text = '';
	if(typeof e === 'string') {
		e = {
			message: e
		};
  }
	if(e.chunk) {
		text += 'chunk ' + (e.chunk.name || e.chunk.id);
    if (e.chunk.hasRuntime()) {
      text += ' [entry]';
    } else {
      text += e.chunk.isInitial() ? ' [initial]' : '';
    }
    text += '\n';
	}
	if(e.file) {
		text += e.file + '\n';
	}
	if(e.module && e.module.readableIdentifier && typeof e.module.readableIdentifier === 'function') {
		text += e.module.readableIdentifier(requestShortener) + '\n';
	}
	text += e.message;
	if(e.details) text += '\n' + e.details;
	if(e.missing) text += e.missing.map(function(item) {
    return '\n[' + item + ']';
  }).join('');
	if(e.dependencies && e.origin) {
		text += '\n @ ' + e.origin.readableIdentifier(requestShortener);
		e.dependencies.forEach(function(dep) {
			if(!dep.loc) return;
			if(typeof dep.loc === 'string') return;
			var locInfo = formatLocation(dep.loc);
			if(!locInfo) return;
			text += ' ' + locInfo;
		});
		var current = e.origin;
		while(current.issuer) {
			current = current.issuer;
			text += '\n @ ' + current.readableIdentifier(requestShortener);
		}
	}
  return text;
};
