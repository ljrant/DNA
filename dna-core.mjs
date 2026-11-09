export const BASES = Object.freeze({
  A: { name: 'Adenine', pair: 'T', bonds: 2, class: 'Purine', color: '#f4b860' },
  T: { name: 'Thymine', pair: 'A', bonds: 2, class: 'Pyrimidine', color: '#fa8792' },
  C: { name: 'Cytosine', pair: 'G', bonds: 3, class: 'Pyrimidine', color: '#72d4cf' },
  G: { name: 'Guanine', pair: 'C', bonds: 3, class: 'Purine', color: '#a5a4f4' }
});

export const BLOCKS = Object.freeze({
  phosphate: { name: 'Phosphate', short: 'P', role: 'Part of the sugar–phosphate backbone; attaches at the sugar 5′ position.' },
  deoxyribose: { name: 'Deoxyribose', short: 'D', role: 'DNA pentose sugar. The base attaches at 1′; its 3′ and 5′ sites participate in the backbone.' },
  ribose: { name: 'Ribose', short: 'R', role: 'RNA sugar with a 2′-OH group. Not valid in ordinary DNA nucleotides.' },
  A: { name: 'Adenine', short: 'A', role: 'Purine. Complements thymine with two hydrogen bonds.' },
  T: { name: 'Thymine', short: 'T', role: 'Pyrimidine. Complements adenine with two hydrogen bonds.' },
  C: { name: 'Cytosine', short: 'C', role: 'Pyrimidine. Complements guanine with three hydrogen bonds.' },
  G: { name: 'Guanine', short: 'G', role: 'Purine. Complements cytosine with three hydrogen bonds.' },
  U: { name: 'Uracil', short: 'U', role: 'RNA pyrimidine. Not used in ordinary DNA strands.' }
});

export function isDNABase(base) { return Object.hasOwn(BASES, base); }
export function complement(base) { return BASES[base]?.pair ?? null; }
export function complementSequence(sequence) {
  return [...sequence].map(complement).join('');
}
export function sequenceOf(strand) {
  return strand.map(item => typeof item === 'string' ? item : item.base).join('');
}
export function isValidDNASequence(sequence) {
  return typeof sequence === 'string' && sequence.length > 0 && [...sequence].every(isDNABase);
}

/**
 * Connections are semantic chemical bonds, not simply two overlapping shapes.
 * A nucleotide in this educational model has one base linked to the sugar 1′
 * position and one phosphate attached at the sugar 5′ position.
 */
export function linkBlocks(blocks, bonds, firstId, secondId) {
  if (firstId === secondId) return { ok: false, reason: 'Choose two different building blocks.' };
  const first = blocks.find(block => block.id === firstId);
  const second = blocks.find(block => block.id === secondId);
  if (!first || !second) return { ok: false, reason: 'One of those building blocks is missing.' };

  const sugar = [first, second].find(block => ['deoxyribose', 'ribose'].includes(block.type));
  const part = sugar?.id === first.id ? second : first;
  if (!sugar || ['deoxyribose', 'ribose'].includes(part.type)) {
    return { ok: false, reason: 'A DNA nucleotide needs a sugar connected separately to a base and a phosphate.' };
  }
  if (sugar.type !== 'deoxyribose') {
    return { ok: false, reason: 'DNA uses deoxyribose, not ribose. Ribose belongs in RNA.' };
  }
  if (part.type === 'U') {
    return { ok: false, reason: 'Uracil is an RNA base. Standard DNA uses thymine instead.' };
  }
  const kind = part.type === 'phosphate' ? 'phosphate-5prime' : (isDNABase(part.type) ? 'base-1prime' : null);
  if (!kind) return { ok: false, reason: 'That connection is not part of a standard DNA nucleotide.' };
  if (bonds.some(bond => bond.sugarId === sugar.id && bond.kind === kind)) {
    return { ok: false, reason: kind === 'base-1prime' ? 'This sugar already has a base attached at 1′.' : 'This sugar already has a phosphate attached at 5′.' };
  }
  if (bonds.some(bond => bond.partId === part.id)) {
    return { ok: false, reason: 'That component is already connected to another nucleotide.' };
  }
  return {
    ok: true,
    bond: { id: 'bond-' + sugar.id + '-' + part.id, sugarId: sugar.id, partId: part.id, kind }
  };
}

export function readyNucleotides(blocks, bonds) {
  return blocks.filter(block => block.type === 'deoxyribose').flatMap(sugar => {
    const baseBond = bonds.find(bond => bond.sugarId === sugar.id && bond.kind === 'base-1prime');
    const phosphateBond = bonds.find(bond => bond.sugarId === sugar.id && bond.kind === 'phosphate-5prime');
    if (!baseBond || !phosphateBond) return [];
    const base = blocks.find(block => block.id === baseBond.partId);
    const phosphate = blocks.find(block => block.id === phosphateBond.partId);
    if (!base || !phosphate || !isDNABase(base.type) || phosphate.type !== 'phosphate') return [];
    return [{ sugarId: sugar.id, baseId: base.id, phosphateId: phosphate.id, base: base.type }];
  });
}

export function checkDuplex(primary, secondary) {
  const top = sequenceOf(primary);
  const bottom = sequenceOf(secondary);
  const pairs = Array.from({ length: Math.max(top.length, bottom.length) }, (_, index) => ({
    top: top[index] ?? null,
    bottom: bottom[index] ?? null,
    correct: !!top[index] && !!bottom[index] && complement(top[index]) === bottom[index],
    hydrogenBonds: complement(top[index]) === bottom[index] ? BASES[top[index]]?.bonds ?? 0 : 0
  }));
  const errors = [];
  if (!top.length || !bottom.length) errors.push('Both DNA strands must contain nucleotides.');
  if (!isValidDNASequence(top) || !isValidDNASequence(bottom)) errors.push('Standard DNA strands require A, T, C, or G.');
  if (top.length !== bottom.length) errors.push('The two strands must be the same length to form this complete duplex.');
  if (pairs.some(pair => !pair.correct)) errors.push('At least one base pair is incorrect or missing.');
  return { valid: errors.length === 0, errors, pairs, top, bottom, expected: complementSequence(top) };
}

/**
 * Geometric representation of canonical right-handed B-DNA:
 * 10.5 base pairs per complete revolution, with two external backbones.
 * Returned in left-to-right sequence order, not atomic coordinates.
 */
export function helixGeometry(primary) {
  const length = primary.length;
  const radius = 1;
  const rise = 0.34; // nanometres per base pair (idealized B-DNA)
  return primary.map((item, index) => {
    const theta = index * (2 * Math.PI / 10.5);
    const z = (index - (length - 1) / 2) * rise;
    return {
      base: typeof item === 'string' ? item : item.base,
      complement: complement(typeof item === 'string' ? item : item.base),
      z, theta,
      first: { x: radius * Math.cos(theta), y: radius * Math.sin(theta), z },
      second: { x: -radius * Math.cos(theta), y: -radius * Math.sin(theta), z }
    };
  });
}
