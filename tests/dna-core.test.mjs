import test from 'node:test';
import assert from 'node:assert/strict';
import { BASES, complementSequence, isValidDNASequence, linkBlocks, readyNucleotides, checkDuplex, helixGeometry } from '../dna-core.mjs';

test('four canonical DNA bases have chemically correct complements', () => {
  assert.equal(complementSequence('ATGC'), 'TACG');
  assert.equal(BASES.A.bonds, 2);
  assert.equal(BASES.T.bonds, 2);
  assert.equal(BASES.C.bonds, 3);
  assert.equal(BASES.G.bonds, 3);
});
test('DNA sequence excludes ribonucleotide uracil', () => {
  assert.equal(isValidDNASequence('ATGC'), true);
  assert.equal(isValidDNASequence('AUGC'), false);
  assert.equal(isValidDNASequence(''), false);
});
test('a nucleotide requires exactly one deoxyribose, phosphate and DNA base', () => {
  const blocks = [{id:'d',type:'deoxyribose'}, {id:'p',type:'phosphate'}, {id:'a',type:'A'}];
  const p=linkBlocks(blocks,[],'d','p');
  assert.equal(p.ok,true);
  assert.equal(p.bond.kind,'phosphate-5prime');
  const a=linkBlocks(blocks,[p.bond],'d','a');
  assert.equal(a.ok,true);
  assert.equal(a.bond.kind,'base-1prime');
  assert.deepEqual(readyNucleotides(blocks,[p.bond,a.bond]).map(n=>n.base),['A']);
  assert.deepEqual(readyNucleotides(blocks,[p.bond]),[]);
  assert.equal(linkBlocks(blocks,[p.bond,a.bond],'d','a').ok,false);
});
test('RNA sugar and uracil rejected in DNA molecular assembly', () => {
  assert.equal(linkBlocks([{id:'r',type:'ribose'},{id:'a',type:'A'}],[],'r','a').ok,false);
  assert.equal(linkBlocks([{id:'d',type:'deoxyribose'},{id:'u',type:'U'}],[],'d','u').ok,false);
});
test('valid antiparallel DNA duplex and hydrogen bond totals', () => {
  const d=checkDuplex([...'ATGCCA'],[...'TACGGT']);
  assert.equal(d.valid,true);
  assert.equal(d.pairs.reduce((sum,p)=>sum+p.hydrogenBonds,0),15);
  assert.equal(d.expected,'TACGGT');
});
test('mismatches and gaps invalidate the duplex', () => {
  assert.equal(checkDuplex([...'ATGC'],[...'TAGG']).valid,false);
  assert.equal(checkDuplex([...'ATGC'],[...'TAC']).valid,false);
  assert.equal(checkDuplex([],[]).valid,false);
});
test('right-handed B helix has approximately 10.5 base pairs per turn', () => {
  const pts=helixGeometry([...'ATGCATGCATG']);
  assert.ok(Math.abs(pts[1].theta-pts[0].theta-2*Math.PI/10.5)<1e-12);
  assert.ok(Math.abs(pts[1].z-pts[0].z-.34)<1e-12);
});