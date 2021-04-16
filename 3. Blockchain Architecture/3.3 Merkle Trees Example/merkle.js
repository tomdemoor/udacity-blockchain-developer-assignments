// npm install js-sha256
// Run with command: node Merkle.js

const sha256 = require('js-sha256'); 


function MerkleTree(vals) {
    // hash values and add to leaves of tree
    const hashes = [];
    hashes.push(vals.map(v => sha256(''+v)));
    // add hash parents as until they converge to a single root
    for (let last = hashes[hashes.length - 1]; last.length > 1; last = hashes[hashes.length - 1]) {
        // calc next level of hashes and add to tree
        hashes.push(parents(last));
    }
    this.__hashes = hashes;
}

// parents is a helper function for the MerkleTree constructor. It combines
// child values and hashes them to create parent values for one generation of
// children
function parents(children) {
    const parents = [];
    // step through children 2 by 2. Designate the first child the "left" child
    // and the (optional) second child the "right" child
    for (let i = 0; i < children.length; i += 2) {
        const left = children[i];
        // is children array has odd length, double the last child
        const right = children.length > i+1 ? children[i+1] : children[i];
        parents.push(sha256(left+right));
    }
    return parents;
}

// root returns the root of the Merkle tree
MerkleTree.prototype.root = function() {
    return this.__hashes[this.__hashes.length - 1][0];
}

// proof returns the hashes along a single branch of the Merkle tree, aka the
// Merkle "proof"
MerkleTree.prototype.proof = function(val) {
    const hash = sha256(''+val);
    // find a leaf with matching hash
    let idx = this.__hashes[0].indexOf(hash);
    if (idx < 0) { return; } // value not present in tree
    // construct proof
    const proof = [];
    for (let i = 0; i < this.__hashes.length - 1; i++) {
        // choose hash to the left or right of element, depending on position
        let offset = idx % 2 === 0 ? 1 : -1;
        // if right pair is beyond the number of elements in array, pair with self
        if (idx+offset >= this.__hashes[i].length) { offset = 0; }
        if (offset >= 0) { proof.push('_'); } // empty slot before hash
        proof.push(this.__hashes[i][idx+offset]);
        if (offset < 0) { proof.push('_'); } // empty slot after hash
        idx >>= 1; // integer division by 2
    }
    return proof;
};

// checkProof checks the validity of the supplied proof. It hashes the supplied
// value and recursively substitutes merkle hashes in slots provided in the
// proof. Returns the final value (for comparison with root)
function checkProof(val, proof) {
    let hash = sha256(''+val);
    if (!proof) { return hash; }
    for (let i = 0; i < proof.length; i += 2) {
        // read off two elements
        const left = proof[i] === '_' ? hash : proof[i];
        const right = proof[i+1] === '_' ? hash : proof[i+1];
        hash = sha256(left + right);
    }
    return hash;
}

// To Student: Try changing values
const vals = ['S', 'N', 3, 1, 9, '🐶'];
console.log(`Hashing values ${vals} into Merkle tree...\n`);
const tree = new MerkleTree(vals);
console.log(`Merkle root for all values is: ${tree.root()}\n`);

['🐶', '😼'].forEach(val => {
    const proof = tree.proof(val);
    console.log(`Does Merkle tree contain '${val}'? Proof: ${proof}`);
    console.log(`Verifying proof... Should produce same root with '${val}'...`);
    if (checkProof(val, proof) == tree.root()) {
        console.log(`... And it matches!`);
    } else {
        console.log(`... But there's no match`);
    }
    console.log();
});