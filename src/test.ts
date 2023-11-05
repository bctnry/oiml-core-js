
import { parse } from "./parser";

function test(name: string, expr: any, msg: string) {
    if (!!!expr) { console.error(`case ${name} failed: ${msg}`); }
    else { console.error(`case ${name} succeeded`); }
}

let empty1 = "";
let res_empty1 = parse(empty1);
test('empty1', res_empty1.length <= 0, "empty string should output empty list of block");

let empty2 = "    ";
let res_empty2 = parse(empty2);
test('empty2', res_empty2.length <= 0, "empty string should output empty list of block");

let empty3 = "// comment comment";
let res_empty3 = parse(empty3);
test('empty3', res_empty3.length <= 0, "empty string should output empty list of block");

let empty4 = "   \n    \t  \n   // comment comment\n\n";
let res_empty4 = parse(empty4);
test('empty4', res_empty4.length <= 0, "empty string should output empty list of block");

let cmd1 = "a";
let res_cmd1 = parse(cmd1);
test('cmd1', res_cmd1.length === 1, "should output 1 block");
test('cmd1', res_cmd1[0].B === undefined, "should have no B part.");
test('cmd1', res_cmd1[0].C === undefined, "should have no C part.");
test('cmd1', res_cmd1[0].A, "should have an A part.");
test('cmd1', res_cmd1[0].A!.length === 1, "should have an A part of length 1.");
test('cmd1', typeof res_cmd1[0].A![0] === 'string', "first element of A part should be string.");
test('cmd1', res_cmd1[0].A![0] === 'a', "first element of A part should be 'a'. ");

let cmd2 = "a b c #true #false 0x3 4.5";
let res_cmd2 = parse(cmd2);
test('cmd2', res_cmd2.length === 1, "should output 1 block");
test('cmd2', res_cmd2[0].B === undefined, "should have no B part.");
test('cmd2', res_cmd2[0].C === undefined, "should have no C part.");
test('cmd2', res_cmd2[0].A, "should have an A part.");
test('cmd2', res_cmd2[0].A!.length === 5, "should have an A part of length 5.");
test('cmd2', typeof res_cmd2[0].A![0] === 'string', "first element of A part should be string.");
test('cmd2', typeof res_cmd2[0].A![1] === 'string', "second element of A part should be string.");
test('cmd2', typeof res_cmd2[0].A![2] === 'string', "third element of A part should be string.");
test('cmd2', typeof res_cmd2[0].A![3] === 'boolean', "fourth element of A part should be boolean.");
test('cmd2', typeof res_cmd2[0].A![4] === 'boolean', "fifth element of A part should be boolean.");
test('cmd2', typeof res_cmd2[0].A![5] === 'number', "sixth element of A part should be number.");
test('cmd2', typeof res_cmd2[0].A![6] === 'number', "seven element of A part should be number.");
test('cmd2', res_cmd2[0].A![0] === 'a', "first element of A part should be 'a'. ");
test('cmd2', res_cmd2[0].A![1] === 'b', "second element of A part should be 'b'. ");
test('cmd2', res_cmd2[0].A![2] === 'c', "third element of A part should be 'c'. ");
test('cmd2', res_cmd2[0].A![3] === true, "fourth element of A part should be true. ");
test('cmd2', res_cmd2[0].A![4] === false, "fifth element of A part should be false. ");
test('cmd2', res_cmd2[0].A![5] === 0x3, "sixth element of A part should be 0x3. ");
test('cmd2', res_cmd2[0].A![6] === 4.5, "seven element of A part should be 4.5. ");

let cmd3 = "0x3 0o4 0b1001 3 4.5 -0.67 8.69e10 4.56E2 -9.10e-3 ";
let res_cmd3 = parse(cmd3);
test('cmd3', res_cmd3.length === 1, "should output 1 block");
test('cmd3', res_cmd3[0].B === undefined, "should have no B part.");
test('cmd3', res_cmd3[0].C === undefined, "should have no C part.");
test('cmd3', res_cmd3[0].A, "should have an A part.");
test('cmd3', res_cmd3[0].A!.length === 9, "should have an A part of length 9.");
test('cmd3', typeof res_cmd3[0].A![0] === 'number', "first element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![1] === 'number', "second element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![2] === 'number', "third element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![3] === 'number', "fourth element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![4] === 'number', "fifth element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![5] === 'number', "6th element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![6] === 'number', "7th element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![7] === 'number', "8th element of A part should be number.");
test('cmd3', typeof res_cmd3[0].A![8] === 'number', "9th element of A part should be number.");
test('cmd3', res_cmd3[0].A![0] === 0x3, "first element of A part incorrect.");
test('cmd3', res_cmd3[0].A![1] === 4, "second element of A part incorrect.");
test('cmd3', res_cmd3[0].A![2] === 9, "third element of A part incorrect.");
test('cmd3', res_cmd3[0].A![3] === 3, "fourth element of A part incorrect.");
test('cmd3', res_cmd3[0].A![4] === 4.5, "fifth element of A part incorrect.");
test('cmd3', res_cmd3[0].A![5] === -0.67, "6th element of A part incorrect.");
test('cmd3', res_cmd3[0].A![6] === 8.69e10, "7th element of A part incorrect.");
test('cmd3', res_cmd3[0].A![7] === 4.56E2, "8th element of A part incorrect.");
test('cmd3', res_cmd3[0].A![8] === -9.10e-3, "9th element of A part incorrect.");

let cmd4 = "0xvz 0b9 0oaf";
let res_cmd4 = parse(cmd4);
test('cmd4', res_cmd4.length === 1, "should output 1 block");
test('cmd4', res_cmd4[0].B === undefined, "should have no B part.");
test('cmd4', res_cmd4[0].C === undefined, "should have no C part.");
test('cmd4', res_cmd4[0].A, "should have an A part.");
test('cmd4', res_cmd4[0].A!.length === 3, "should have an A part of length 3.");
test('cmd4', typeof res_cmd4[0].A![0] === 'string', "first element of A part should be string.");
test('cmd4', typeof res_cmd4[0].A![1] === 'string', "second element of A part should be string.");
test('cmd4', typeof res_cmd4[0].A![2] === 'string', "third element of A part should be string.");
test('cmd4', res_cmd4[0].A![0] === "0xvz", "first element of A part incorrect.");
test('cmd4', res_cmd4[0].A![1] === "0b9", "second element of A part incorrect.");
test('cmd4', res_cmd4[0].A![2] === "0oaf", "third element of A part incorrect.");

let cmd5 = "a \"b\" \\c blah\\ \\:d";
let res_cmd5 = parse(cmd5);
test('cmd5', res_cmd5.length === 1, "should output 1 block");
test('cmd5', res_cmd5[0].B === undefined, "should have no B part.");
test('cmd5', res_cmd5[0].C === undefined, "should have no C part.");
test('cmd5', res_cmd5[0].A, "should have an A part.");
test('cmd5', res_cmd5[0].A!.length === 4, "should have an A part of length 4.");
test('cmd5', typeof res_cmd5[0].A![0] === 'string', "first element of A part should be string.");
test('cmd5', typeof res_cmd5[0].A![1] === 'string', "second element of A part should be string.");
test('cmd5', typeof res_cmd5[0].A![2] === 'string', "third element of A part should be string.");
test('cmd5', typeof res_cmd5[0].A![3] === 'string', "fourth element of A part should be string.");
test('cmd5', res_cmd5[0].A![0] === "a", "first element of A part incorrect.");
test('cmd5', res_cmd5[0].A![1] === "b", "second element of A part incorrect.");
test('cmd5', res_cmd5[0].A![2] === "c", "third element of A part incorrect.");
test('cmd5', res_cmd5[0].A![3] === "blah :d", "third element of A part incorrect.");

let cmd6 = "a b c:";
let res_cmd6 = parse(cmd6);
test('cmd6', res_cmd6.length === 1, "should output 1 block");
test('cmd6', res_cmd6[0].B === "", "should have a B part.");
test('cmd6', res_cmd6[0].C === undefined, "should have no C part.");
test('cmd6', res_cmd6[0].A, "should have an A part.");
test('cmd6', res_cmd6[0].A!.length === 3, "should have an A part of length 4.");

let cmd7 = "a b c: blahblah\\ dsfsf";
let res_cmd7 = parse(cmd7);
test('cmd7', res_cmd7.length === 1, "should output 1 block");
test('cmd7', res_cmd7[0].B === "blahblah\\ dsfsf", "should have a B part.");
test('cmd7', res_cmd7[0].C === undefined, "should have no C part.");
test('cmd7', res_cmd7[0].A, "should have an A part.");

let cmd8 = "a b=3 c: blahblah\\ dsfsf";
let res_cmd8 = parse(cmd8);
test('cmd8', res_cmd8.length === 1, "should output 1 block");
test('cmd8', res_cmd8[0].B === "blahblah\\ dsfsf", "should have a B part.");
test('cmd8', res_cmd8[0].C === undefined, "should have no C part.");
test('cmd8', res_cmd8[0].A, "should have an A part.");
test('cmd8', Array.isArray(res_cmd8[0].A![1]), "the second element of A should be a kvpair.");
test('cmd8', (res_cmd8[0].A![1] as any)[0] === "b", "the key of the second element of A should be \"b\"");
test('cmd8', (res_cmd8[0].A![1] as any)[1] === 3, "the value of the second element of A should be 3");

let block1 = `
a b c: blahblah
    blah1 blah2 blah3
`;
let res_block1 = parse(block1);
test('block1', res_block1.length === 1, "should output 1 block.");
test('block1', res_block1[0].A, "should have an A part.");
test('block1', res_block1[0].B, "should have an B part.");
test('block1', res_block1[0].C, "should have an C part.");
test('block1', res_block1[0].C!.length === 1, "C part should be of length 1");

let block2 = `
a b c: 
    blah1 blah2 blah3:
       blah1 blah2 blah3
    blah1 blah2 blah3
`;
let res_block2 = parse(block2);
test('block2', res_block2.length === 1, "should output 1 block.");
test('block2', res_block2[0].A, "should have an A part.");
test('block2', res_block2[0].B === '', "should have a B part which is empty.");
test('block2', res_block2[0].C, "should have an C part.");
test('block2', res_block2[0].C!.length === 2, "should have an C part of length 2.");
test('block2', res_block2[0].C![1].B === undefined, "the B part of the second children block should be undefined");

let block3 = `
a b c: 
    blah1 blah2 blah3:
       blah1 blah2 blah3
      blah1 blah2 blah3
  blahxblahx z
`;
try {
    let res_block3 = parse(block3);
    test('block3', false, "should raise exception for invalid indent.");
} catch (e) {
    console.log("case block3 succeeded");
}
